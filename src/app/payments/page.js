"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { UploadCloud, FileText } from "lucide-react";

import Navigation from "@/components/Navigation";
import Header from "@/components/Header";

import { getAllAccounts } from "@/lib/data";

const quickActions = [
  { label: "Pay Invoice", icon: "📄", description: "Upload & pay an invoice" },
  { label: "Transfer Funds", icon: "🔄", description: "Between accounts" },
  { label: "Payroll", icon: "👥", description: "Process staff payroll" },
  { label: "FX Conversion", icon: "💱", description: "Convert currencies" },
];

const recentPayments = [
  { id: "op-1", vendor: "Amazon Web Services", date: "4 Apr", amount: 1250.0, dueInDays: 3 },
  { id: "op-2", vendor: "Google Cloud", date: "6 Apr", amount: 840.0, dueInDays: 5 },
  { id: "op-3", vendor: "Office Supplies KL", date: "8 Apr", amount: 320.0, dueInDays: 7 },
];

const mockAccounts = getAllAccounts();

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
  const [selectedAccountId, setSelectedAccountId] = useState(mockAccounts[0].id);

  const selectedAccount = useMemo(() => {
    return mockAccounts.find(acc => acc.id === selectedAccountId);
  }, [selectedAccountId]);

  const handlePayOutstanding = (payment) => {
    // Populate analysis state to mimic an analyzed invoice
    const mockAnalysis = {
      source: "Manual Selection",
      invoice: {
        vendorName: payment.vendor,
        invoiceNumber: `INV-${payment.id.toUpperCase()}`,
        invoiceDate: payment.date + " 2026",
        dueDate: "Within " + payment.dueInDays + " days",
        vendorAccountNumber: `PBB-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        totalAmount: payment.amount,
        currency: "MYR"
      },
      paymentOptions: {
        payNowAmount: payment.amount,
        payIn30DaysAmount: Math.round(payment.amount * 1.025 * 100) / 100,
        financingCost: Math.round(payment.amount * 0.025 * 100) / 100
      }
    };
    setAnalysis(mockAnalysis);
    setSelectedOption("payNow");
    // Scroll to top to show payment options
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
          vendorName: analysis.invoice.vendorName,
          sourceAccountId: selectedAccount.id,
          sourceAccountName: selectedAccount.nickname
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
      <Header />

      <Navigation activeLabel="Payments" />

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
            <div className="relative">
              <label
                htmlFor="invoice"
                className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[color:var(--pb-border)] bg-[color:var(--pb-surface)] p-6 transition-colors hover:border-[color:var(--pb-red)] hover:bg-red-50/30"
              >
                {!invoiceFile ? (
                  <>
                    <UploadCloud className="mb-2 h-8 w-8 text-[color:var(--pb-red)]" />
                    <span className="text-sm font-semibold">Upload PDF Invoice</span>
                    <span className="mt-1 text-[10px] text-[color:var(--pb-soft)]">Click or drag to select file</span>
                  </>
                ) : (
                  <>
                    <FileText className="mb-2 h-8 w-8 text-[color:var(--pb-success)]" />
                    <span className="max-w-[200px] truncate text-sm font-semibold" title={invoiceFile.name}>
                      {invoiceFile.name}
                    </span>
                    <span className="mt-1 text-[10px] text-[color:var(--pb-soft)]">File selected</span>
                  </>
                )}
                <input
                  id="invoice"
                  type="file"
                  accept="application/pdf"
                  className="sr-only"
                  onChange={(event) => {
                    const file = event.target.files?.[0] ?? null;
                    setInvoiceFile(file);
                    setErrorText("");
                  }}
                />
              </label>
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
            <div className="mt-4 rounded-xl border border-[color:var(--pb-border)] bg-white p-4">
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
                <div>
                  <dt className="text-[color:var(--pb-soft)]">Vendor Account</dt>
                  <dd className="font-semibold tracking-wider font-mono">{analysis.invoice.vendorAccountNumber || "N/A"}</dd>
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

          {analysis ? (
            <div className="mt-5 rounded-xl border border-[color:var(--pb-border)] bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="pb-heading text-sm font-bold">Pay From</h3>
                <div className="relative">
                  <select
                    value={selectedAccountId}
                    onChange={(e) => setSelectedAccountId(e.target.value)}
                    className="appearance-none rounded-lg border border-[color:var(--pb-border)] bg-[color:var(--pb-surface)] px-3 py-1.5 pr-8 text-xs font-semibold text-[color:var(--pb-ink)] focus:border-[color:var(--pb-red)] focus:outline-none cursor-pointer"
                  >
                    {mockAccounts.map(acc => (
                      <option key={acc.id} value={acc.id}>
                        {acc.nickname}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[color:var(--pb-soft)]">
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-white border border-[color:var(--pb-border)]">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[color:var(--pb-soft)]">Source Account</p>
                  <p className="text-sm font-bold mt-0.5">{selectedAccount.nickname}</p>
                  <p className="text-[10px] text-[color:var(--pb-soft)]">{selectedAccount.number}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[color:var(--pb-soft)]">Available Balance</p>
                  <p className="pb-heading text-lg font-bold mt-0.5 tabular-nums">
                    {formatCurrency(selectedAccount.balance, selectedAccount.currency)}
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </article>

        <article className="pb-card pb-card-flag p-5">
          <h2 className="pb-heading text-sm font-bold">Payment Options</h2>
          <p className="mt-1 text-xs text-[color:var(--pb-soft)]">
            Choose immediate settlement or pay in 30 days with 2.5% financing.
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
                  Includes 2.5% financing cost of {formatCurrency(optionSummary.financingCost, optionSummary.currency)}.
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
          <h2 className="pb-heading text-sm font-bold">Outstanding Payments</h2>
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
              <div className="text-right flex items-center gap-4">
                <div>
                  <p className="text-sm font-semibold tabular-nums">-{formatCurrency(p.amount)}</p>
                  <span
                    className="inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold"
                    style={{
                      background: p.dueInDays < 4 ? "#fef2f2" : "#fff7ed",
                      color: p.dueInDays < 4 ? "var(--pb-red)" : "#c2410c",
                    }}
                  >
                    Due in {p.dueInDays} days
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handlePayOutstanding(p)}
                  className="rounded-lg bg-[color:var(--pb-red)] px-3 py-1.5 text-[10px] font-bold text-white hover:bg-[color:var(--pb-red-strong)] transition-all shadow-sm"
                >
                  Pay
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
