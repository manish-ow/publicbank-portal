"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const navItems = [
  { label: "Home", href: "/", icon: "🏠" },
  { label: "Payments", href: "/payments", icon: "💳", active: true },
  { label: "Business Overview", href: "/business-overview", icon: "📈" },
  { label: "Trade Finance", href: "#", icon: "🌐" },
];

const quickActions = [
  { label: "Pay Invoice", icon: "📄", description: "Upload & pay an invoice" },
  { label: "Transfer Funds", icon: "🔄", description: "Between accounts" },
  { label: "Payroll", icon: "👥", description: "Process staff payroll" },
  { label: "FX Conversion", icon: "💱", description: "Convert currencies" },
];

const recentPayments = [
  { vendor: "Meat & Vege Pte Ltd", date: "8 Mar", amount: 3100.0, status: "Completed" },
  { vendor: "AWS Cloud Services", date: "5 Mar", amount: 2340.0, status: "Completed" },
  { vendor: "Office Supplies KL", date: "1 Mar", amount: 860.0, status: "Pending" },
];

const formatCurrency = (amount, currency = "MYR") => {
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  return `${currency} ${safeAmount.toLocaleString("en-MY", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export default function PaymentsPage() {
  const [invoiceFile, setInvoiceFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [selectedOption, setSelectedOption] = useState("payNow");
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [paymentSubmitted, setPaymentSubmitted] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  const handleConfirmPayment = async () => {
    if (!analysis) return;
    setIsPaying(true);
    try {
      const amount = selectedOption === "payNow" ? optionSummary.payNow : optionSummary.payLater;
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          currency: optionSummary.currency,
          invoiceNumber: analysis.invoice.invoiceNumber,
          vendorName: analysis.invoice.vendorName
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Payment failed");
      setPaymentSubmitted(true);
    } catch (err) {
      setErrorText(err.message);
    } finally {
      setIsPaying(false);
    }
  };

  const optionSummary = useMemo(() => {
    if (!analysis?.paymentOptions) {
      return null;
    }

    return {
      payNow: analysis.paymentOptions.payNowAmount,
      payLater: analysis.paymentOptions.payIn30DaysAmount,
      financingCost: analysis.paymentOptions.financingCost,
      currency: analysis.invoice.currency || "MYR",
    };
  }, [analysis]);

  const handleAnalyzeInvoice = async (event) => {
    event.preventDefault();

    if (!invoiceFile) {
      setErrorText("Please upload an invoice PDF.");
      return;
    }

    setIsLoading(true);
    setErrorText("");

    try {
      const formData = new FormData();
      formData.append("invoice", invoiceFile);

      const response = await fetch("/api/invoice/analyze", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to analyze invoice.");
      }

      setAnalysis(result);
      setSelectedOption("payNow");
    } catch (error) {
      setAnalysis(null);
      setErrorText(error.message || "Something went wrong while analyzing the invoice.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="portal-shell">
      {/* ── Top bar ── */}
      <section className="pb-topbar">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/brand/pb-logo-mark-white.svg"
              alt="Public Bank"
              width={44}
              height={44}
              style={{ height: "auto" }}
              priority
            />
            <div>
              <span className="pb-heading text-base font-bold tracking-wide sm:text-lg">PUBLIC BANK</span>
              <p className="text-xs text-white/70">eSolution delta pte ltd</p>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <div className="text-right">
              <p className="text-[11px] uppercase tracking-wider text-white/60">Preferred Account · 312345678902</p>
              <p className="pb-heading text-xl font-bold tracking-tight sm:text-2xl">MYR 375,691.50</p>
            </div>
            <div className="pb-pill-tabs" style={{ width: "160px" }}>
              <div className="pb-pill text-xs">Personal</div>
              <div className="pb-pill pb-pill-active text-xs">Business</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Navigation strip ── */}
      <nav className="pb-nav-strip">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`pb-nav-item ${item.active ? "pb-nav-item-active" : ""}`}
          >
            <span className="text-base">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* ── Quick Actions ── */}
      <section className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {quickActions.map((action) => (
          <button
            key={action.label}
            type="button"
            className="pb-card flex flex-col items-center gap-1.5 p-4 text-center transition-shadow hover:shadow-md"
          >
            <span className="text-2xl">{action.icon}</span>
            <p className="text-xs font-semibold">{action.label}</p>
            <p className="text-[10px] text-[color:var(--pb-soft)]">{action.description}</p>
          </button>
        ))}
      </section>

      {/* ── Main grid: Invoice Upload + Payment Options ── */}
      <section className="mt-5 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <article className="pb-card p-5">
          <h2 className="pb-heading text-sm font-bold">Smart Invoice Payment</h2>
          <p className="mt-1 text-xs text-[color:var(--pb-soft)]">
            Upload a PDF invoice. AI extracts key fields and proposes pay-now vs 30-day financing.
          </p>

          <form onSubmit={handleAnalyzeInvoice} className="mt-4 space-y-3">
            <div>
              <label htmlFor="invoice" className="mb-1.5 block text-xs font-semibold">
                Upload PDF Invoice
              </label>
              <input
                id="invoice"
                type="file"
                accept="application/pdf"
                className="pb-input text-sm"
                onChange={(event) => setInvoiceFile(event.target.files?.[0] ?? null)}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="pb-action pb-action-primary w-full text-sm disabled:opacity-60"
            >
              {isLoading ? "Analyzing with AI..." : "Analyze Invoice"}
            </button>
          </form>

          {errorText ? (
            <p className="mt-3 rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs text-red-700">{errorText}</p>
          ) : null}

          {analysis ? (
            <div className="mt-4 rounded-xl border border-[color:var(--pb-border)] bg-[color:var(--pb-surface)] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="pb-heading text-sm font-bold">Invoice Details</h3>
                <span className="rounded-full bg-white px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[color:var(--pb-soft)]">
                  Source: {analysis.source}
                </span>
              </div>
              <dl className="mt-3 grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
                <div>
                  <dt className="text-[color:var(--pb-soft)]">Vendor</dt>
                  <dd className="font-semibold">{analysis.invoice.vendorName || "N/A"}</dd>
                </div>
                <div>
                  <dt className="text-[color:var(--pb-soft)]">Invoice Number</dt>
                  <dd className="font-semibold">{analysis.invoice.invoiceNumber || "N/A"}</dd>
                </div>
                <div>
                  <dt className="text-[color:var(--pb-soft)]">Invoice Date</dt>
                  <dd className="font-semibold">{analysis.invoice.invoiceDate || "N/A"}</dd>
                </div>
                <div>
                  <dt className="text-[color:var(--pb-soft)]">Due Date</dt>
                  <dd className="font-semibold">{analysis.invoice.dueDate || "N/A"}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-[color:var(--pb-soft)]">Invoice Total</dt>
                  <dd className="pb-heading text-xl font-bold">
                    {formatCurrency(analysis.invoice.totalAmount, analysis.invoice.currency)}
                  </dd>
                </div>
              </dl>
            </div>
          ) : null}
        </article>

        <article className="pb-card pb-card-flag p-5">
          <h2 className="pb-heading text-sm font-bold">Payment Options</h2>
          <p className="mt-1 text-xs text-[color:var(--pb-soft)]">
            Choose immediate settlement or pay in 30 days with 5% financing.
          </p>

          {!optionSummary ? (
            <div className="mt-4 rounded-xl border border-dashed border-[color:var(--pb-border)] p-4 text-xs text-[color:var(--pb-soft)]">
              Upload and analyze an invoice to view payment options.
            </div>
          ) : (
            <div className="mt-4 space-y-2.5">
              <button
                type="button"
                onClick={() => setSelectedOption("payNow")}
                className={`pb-choice w-full text-left ${selectedOption === "payNow" ? "pb-choice-active" : ""}`}
              >
                <p className="text-[10px] font-semibold uppercase tracking-wide text-[color:var(--pb-soft)]">Option 1</p>
                <p className="pb-heading mt-0.5 text-base font-bold">Pay Now</p>
                <p className="mt-0.5 text-sm font-semibold">{formatCurrency(optionSummary.payNow, optionSummary.currency)}</p>
                <p className="mt-0.5 text-xs text-[color:var(--pb-soft)]">Immediate payment, no financing charges.</p>
              </button>

              <button
                type="button"
                onClick={() => setSelectedOption("payIn30Days")}
                className={`pb-choice w-full text-left ${selectedOption === "payIn30Days" ? "pb-choice-active" : ""}`}
              >
                <p className="text-[10px] font-semibold uppercase tracking-wide text-[color:var(--pb-soft)]">Option 2</p>
                <p className="pb-heading mt-0.5 text-base font-bold">Pay in 30 Days</p>
                <p className="mt-0.5 text-sm font-semibold">{formatCurrency(optionSummary.payLater, optionSummary.currency)}</p>
                <p className="mt-0.5 text-xs text-[color:var(--pb-soft)]">
                  Includes 5% financing cost of {formatCurrency(optionSummary.financingCost, optionSummary.currency)}.
                </p>
              </button>

              {paymentSubmitted ? (
                <div className="mt-3 rounded-xl border border-[color:var(--pb-success)] bg-[#eefbf3] p-5 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--pb-success)]">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <p className="pb-heading mt-3 text-base font-bold text-[color:var(--pb-success)]">Payment Submitted</p>
                  <p className="mt-1 text-xs text-[color:var(--pb-soft)]">
                    Your {selectedOption === "payNow" ? "immediate" : "30-day financed"} payment of{" "}
                    <strong>{formatCurrency(selectedOption === "payNow" ? optionSummary.payNow : optionSummary.payLater, optionSummary.currency)}</strong>{" "}
                    has been submitted for processing.
                  </p>
                  <p className="mt-1 text-[10px] text-[color:var(--pb-soft)]">
                    Reference: PB-{Date.now().toString(36).toUpperCase()} &middot; {new Date().toLocaleDateString("en-MY", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                  <button
                    type="button"
                    className="pb-action pb-action-ghost mt-3 text-xs"
                    onClick={() => { setPaymentSubmitted(false); setAnalysis(null); setInvoiceFile(null); }}
                  >
                    Make Another Payment
                  </button>
                </div>
              ) : (
                <div className="mt-3 rounded-xl bg-[#eefbf3] p-3.5">
                  <p className="text-xs text-[color:var(--pb-soft)]">Selected Action</p>
                  <p className="pb-heading mt-0.5 text-base font-bold text-[color:var(--pb-success)]">
                    {selectedOption === "payNow" ? "Pay now selected" : "Pay in 30 days selected"}
                  </p>
                  <button
                    type="button"
                    disabled={isPaying}
                    className="pb-action pb-action-primary mt-2.5 w-full text-sm disabled:opacity-60"
                    onClick={handleConfirmPayment}
                  >
                    {isPaying ? "Processing..." : `Confirm ${selectedOption === "payNow" ? "Pay Now" : "Pay in 30 Days"}`}
                  </button>
                </div>
              )}
            </div>
          )}
        </article>
      </section>

      {/* ── Recent Payments ── */}
      <section className="mt-5 pb-card p-5">
        <div className="flex items-center justify-between">
          <h2 className="pb-heading text-sm font-bold">Recent Payments</h2>
          <Link href="#" className="text-xs font-semibold text-[color:var(--pb-red)] hover:underline">
            View all &rsaquo;
          </Link>
        </div>
        <div className="mt-3 divide-y divide-[color:var(--pb-border)]">
          {recentPayments.map((p) => (
            <div key={p.vendor + p.date} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
              <div>
                <p className="text-sm font-semibold">{p.vendor}</p>
                <p className="text-[11px] text-[color:var(--pb-soft)]">{p.date}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold tabular-nums">-{formatCurrency(p.amount)}</p>
                <span
                  className="inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold"
                  style={{
                    background: p.status === "Completed" ? "#eefbf3" : "#fff7ed",
                    color: p.status === "Completed" ? "var(--pb-success)" : "#c2410c",
                  }}
                >
                  {p.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
