export const runtime = "nodejs";

const MAX_OCR_CHARS = 18000;
const MAX_OCR_HINT_CHARS = 12000;
const GEMINI_MODELS = ["gemini-2.5-flash", "gemini-1.5-flash"];

const roundMoney = (value) => Math.round((Number(value) + Number.EPSILON) * 100) / 100;

const extractFallbackData = (text) => {
  const compact = text.replace(/\s+/g, " ").trim();

  const invoiceNumber =
    compact.match(/invoice\s*(?:number|no\.?|#)?\s*[:\-]?\s*([a-z0-9\-\/]+)/i)?.[1] ?? "";

  const invoiceDate =
    compact.match(/invoice\s*date\s*[:\-]?\s*([0-9]{1,2}[\/-][0-9]{1,2}[\/-][0-9]{2,4})/i)?.[1] ?? "";

  const dueDate =
    compact.match(/due\s*date\s*[:\-]?\s*([0-9]{1,2}[\/-][0-9]{1,2}[\/-][0-9]{2,4})/i)?.[1] ?? "";

  const vendorName =
    compact.match(/(?:bill\s*from|vendor|supplier)\s*[:\-]?\s*([a-z0-9 ,.&()'-]{4,60})/i)?.[1]?.trim() ?? "";

  const candidateAmounts = [...compact.matchAll(/(?:rm|myr|usd|sgd|eur|\$)\s*([0-9][0-9,]*(?:\.[0-9]{1,2})?)/gi)]
    .map((match) => Number.parseFloat(match[1].replaceAll(",", "")))
    .filter((amount) => Number.isFinite(amount));

  const totalAmount = candidateAmounts.length > 0 ? Math.max(...candidateAmounts) : 0;

  const currency = compact.match(/\b(MYR|RM|USD|SGD|EUR)\b/i)?.[1]?.toUpperCase() ?? "MYR";

  return {
    vendorName,
    invoiceNumber,
    invoiceDate,
    dueDate,
    totalAmount,
    currency: currency === "RM" ? "MYR" : currency,
  };
};

const parseGeminiJson = (value) => {
  const raw = String(value || "").trim();

  if (!raw) {
    throw new Error("Gemini response was empty.");
  }

  try {
    return JSON.parse(raw);
  } catch {
    const cleaned = raw.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/, "").trim();
    return JSON.parse(cleaned);
  }
};

const callGemini = async (apiKey, model, invoiceText, invoicePdfBase64) => {
  const prompt = [
    "Extract invoice fields from this invoice.",
    "The invoice may be a scanned image PDF.",
    "Use the attached invoice PDF as the primary source of truth.",
    "Use OCR hint text only as a secondary hint.",
    "Return strict JSON with keys:",
    "vendorName, invoiceNumber, invoiceDate, dueDate, currency, totalAmount, summary.",
    "Rules:",
    "- totalAmount must be a number",
    "- currency should be a 3-letter currency code like MYR",
    "- If field is missing, return empty string",
  ].join("\n");

  const parts = [{ text: prompt }];

  if (invoiceText?.trim()) {
    parts.push({ text: `OCR_TEXT_HINT:\n${invoiceText.slice(0, MAX_OCR_HINT_CHARS)}` });
  }

  if (invoicePdfBase64) {
    parts.push({
      inlineData: {
        mimeType: "application/pdf",
        data: invoicePdfBase64,
      },
    });
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts,
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
        },
      }),
    }
  );

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Gemini API request failed (${model}): ${message}`);
  }

  const result = await response.json();
  const jsonText = result?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!jsonText) {
    throw new Error("Gemini did not return a structured payload.");
  }

  const payload = parseGeminiJson(jsonText);

  return {
    vendorName: payload.vendorName || "",
    invoiceNumber: payload.invoiceNumber || "",
    invoiceDate: payload.invoiceDate || "",
    dueDate: payload.dueDate || "",
    summary: payload.summary || "",
    currency: (payload.currency || "MYR").toUpperCase(),
    totalAmount: Number(payload.totalAmount) || 0,
  };
};

const mergeInvoiceData = (base, override) => ({
  vendorName: override.vendorName || base.vendorName,
  invoiceNumber: override.invoiceNumber || base.invoiceNumber,
  invoiceDate: override.invoiceDate || base.invoiceDate,
  dueDate: override.dueDate || base.dueDate,
  summary: override.summary || "",
  currency: override.currency || base.currency,
  totalAmount: override.totalAmount || base.totalAmount,
});

const extractLocalPdfText = async (buffer) => {
  try {
    const { PDFParse } = await import("pdf-parse");
    const parser = new PDFParse({ data: buffer });

    try {
      const parsedPdf = await parser.getText();
      return parsedPdf?.text?.slice(0, MAX_OCR_CHARS) || "";
    } finally {
      await parser.destroy();
    }
  } catch (parseError) {
    console.warn("[invoice-analyze] Local PDF text extraction failed; using Gemini PDF input", parseError);
    return "";
  }
};

const analyzeWithGemini = async (apiKey, invoiceText, invoicePdfBase64) => {
  let lastModelError = null;

  for (const model of GEMINI_MODELS) {
    try {
      const candidate = await callGemini(apiKey, model, invoiceText, invoicePdfBase64);

      if (hasMeaningfulInvoiceData(candidate)) {
        return candidate;
      }

      lastModelError = new Error(`Gemini returned empty fields for model ${model}.`);
    } catch (modelError) {
      lastModelError = modelError;
    }
  }

  throw lastModelError || new Error("Gemini did not return meaningful invoice data.");
};

const hasMeaningfulInvoiceData = (invoice) => {
  if (!invoice) {
    return false;
  }

  return Boolean(
    (invoice.vendorName && invoice.vendorName.trim()) ||
    (invoice.invoiceNumber && invoice.invoiceNumber.trim()) ||
    (invoice.invoiceDate && invoice.invoiceDate.trim()) ||
    (invoice.dueDate && invoice.dueDate.trim()) ||
    Number(invoice.totalAmount) > 0
  );
};

export async function POST(request) {
  try {
    const formData = await request.formData();
    const invoice = formData.get("invoice");

    if (!invoice || typeof invoice === "string") {
      return Response.json({ error: "Invoice PDF is required." }, { status: 400 });
    }

    const isPdfMime = invoice.type === "application/pdf";
    const isPdfByName = typeof invoice.name === "string" && invoice.name.toLowerCase().endsWith(".pdf");

    if (!isPdfMime && !isPdfByName) {
      return Response.json({ error: "Only PDF invoices are supported." }, { status: 400 });
    }

    const arrayBuffer = await invoice.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const invoicePdfBase64 = buffer.toString("base64");
    const invoiceText = await extractLocalPdfText(buffer);

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey && !invoiceText.trim()) {
      return Response.json(
        { error: "Unable to analyze invoice. Configure GEMINI_API_KEY to process scanned/image PDFs." },
        { status: 422 }
      );
    }

    const fallback = extractFallbackData(invoiceText);

    let analysis = {
      ...fallback,
      summary: "",
    };
    let source = "fallback";

    let geminiFailureReason = "";

    if (apiKey) {
      try {
        const geminiResult = await analyzeWithGemini(apiKey, invoiceText, invoicePdfBase64);
        analysis = mergeInvoiceData(fallback, geminiResult);
        source = "gemini-pdf";
      } catch (geminiError) {
        console.warn("[invoice-analyze] Gemini analysis failed, falling back", geminiError);
        geminiFailureReason = geminiError instanceof Error ? geminiError.message : "Unknown Gemini error";
        source = "fallback";
      }
    }

    if (source === "fallback" && !hasMeaningfulInvoiceData(analysis)) {
      return Response.json(
        {
          error: "Unable to extract invoice data from uploaded PDF.",
          details:
            geminiFailureReason ||
            "No readable text found and Gemini did not return structured invoice fields.",
        },
        { status: 422 }
      );
    }

    const payNowAmount = roundMoney(analysis.totalAmount);
    const payIn30DaysAmount = roundMoney(payNowAmount * 1.025);
    const financingCost = roundMoney(payIn30DaysAmount - payNowAmount);

    return Response.json({
      source,
      invoice: {
        vendorName: analysis.vendorName,
        invoiceNumber: analysis.invoiceNumber,
        invoiceDate: analysis.invoiceDate,
        dueDate: analysis.dueDate,
        currency: analysis.currency || "MYR",
        totalAmount: payNowAmount,
        summary: analysis.summary,
      },
      paymentOptions: {
        payNowAmount,
        payIn30DaysAmount,
        financingCost,
      },
    });
  } catch (error) {
    console.error("[invoice-analyze] Route failed", error);
    return Response.json(
      {
        error: "Unable to process invoice at the moment.",
        details: error instanceof Error ? error.message : "Unexpected error",
      },
      { status: 500 }
    );
  }
}
