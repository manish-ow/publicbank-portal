import Image from "next/image";
import Link from "next/link";

const navItems = [
  { label: "Home", href: "/", icon: "🏠", active: true },
  { label: "Payments", href: "/payments", icon: "💳" },
  { label: "Business Overview", href: "/business-overview", icon: "📈" },
  { label: "Trade Finance", href: "#", icon: "🌐" },
  { label: "Financial Mgmt", href: "#", icon: "📊" },
];

const transactions = [
  { name: "Shopee MY - Invoice #4521", category: "Revenue", date: "10 Feb", amount: 12500.0, currency: "MYR", type: "inflow" },
  { name: "AWS Cloud Services", category: "Technology", date: "9 Feb", amount: 2340.0, currency: "USD", type: "outflow" },
  { name: "Staff Payroll - Feb 2026", category: "Payroll", date: "8 Feb", amount: 45600.0, currency: "MYR", type: "outflow" },
  { name: "Lazada MY - Payment", category: "Revenue", date: "7 Feb", amount: 8900.0, currency: "MYR", type: "inflow" },
  { name: "Office Rent - Bangsar South", category: "Rent", date: "5 Feb", amount: 6800.0, currency: "MYR", type: "outflow" },
];

const alerts = [
  {
    title: "Unusual inflow detected",
    description: "A MYR 12,500 payment from Shopee exceeded your 30-day average receivable by 42%. This may indicate seasonal uplift or a new recurring contract.",
    confidence: 89,
    color: "blue",
  },
  {
    title: "Payroll shortfall risk in 18 days",
    description: "Based on projected inflows and committed outflows, your payroll pool account may fall MYR 8,200 short of March payroll (due Feb 28).",
    confidence: 76,
    color: "green",
  },
  {
    title: "FX opportunity: USD/MYR favorable",
    description: "USD/MYR is at 4.425, 2.1% below your 90-day average conversion rate. Converting USD 10,000 now could save approximately MYR 930.",
    confidence: 82,
    color: "amber",
  },
];

const formatAmount = (amount, currency) =>
  `${currency} ${amount.toLocaleString("en-MY", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const alertBorderColor = { blue: "#3b82f6", green: "#22c55e", amber: "#f59e0b" };

export default function Home() {
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
              <p className="text-xs text-white/70">Commercial Banking Portal</p>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="text-right">
              <p className="text-[11px] uppercase tracking-wider text-white/60">Preferred Account · 839-203-384-0</p>
              <p className="pb-heading text-xl font-bold tracking-tight sm:text-2xl">MYR 375,691.50</p>
            </div>
            <div className="pb-pill-tabs" style={{ width: "160px" }}>
              <div className="pb-pill text-xs">Personal</div>
              <div className="pb-pill pb-pill-active text-xs">Business</div>
            </div>
          </div>
        </div>

        <div className="mt-3 border-t border-white/15 pt-3">
          <p className="text-sm text-white/90"> <strong>eSolution Delta pte ltd.</strong></p>
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

      {/* ── Summary cards row ── */}
      <section className="mt-5 grid gap-4 sm:grid-cols-3">
        <article className="pb-card p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[color:var(--pb-soft)]">Current Cash</p>
          <p className="pb-heading mt-1 text-lg font-bold">MYR 52,223.20</p>
          <p className="mt-1 text-xs text-[color:var(--pb-success)]">↑ 4.2% vs last month</p>
        </article>
        <article className="pb-card p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[color:var(--pb-soft)]">To Collect</p>
          <p className="pb-heading mt-1 text-lg font-bold">MYR 4,800.50</p>
          <p className="mt-1 text-xs text-[color:var(--pb-soft)]">2 pending invoices</p>
        </article>
        <article className="pb-card p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[color:var(--pb-soft)]">To Pay</p>
          <p className="pb-heading mt-1 text-lg font-bold">MYR 4,640.00</p>
          <p className="mt-1 text-xs text-red-500">1 due in 10 days</p>
        </article>
      </section>

      {/* ── Main grid: Transactions + Alerts ── */}
      <section className="mt-5 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">

        {/* Recent Transactions */}
        <article className="pb-card p-5">
          <div className="flex items-center justify-between">
            <h2 className="pb-heading text-sm font-bold">Recent Transactions</h2>
            <Link href="#" className="text-xs font-semibold text-[color:var(--pb-red)] hover:underline">
              View all &rsaquo;
            </Link>
          </div>

          <div className="mt-4 space-y-0 divide-y divide-[color:var(--pb-border)]">
            {transactions.map((tx) => (
              <div key={tx.name} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                  style={{
                    background: tx.type === "inflow" ? "#eefbf3" : "#fef2f2",
                    color: tx.type === "inflow" ? "var(--pb-success)" : "#ef4444",
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d={tx.type === "inflow" ? "M7 11V3m0 0l3.5 3.5M7 3L3.5 6.5" : "M7 3v8m0 0l3.5-3.5M7 11L3.5 7.5"}
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold leading-tight">{tx.name}</p>
                  <p className="text-[11px] text-[color:var(--pb-soft)]">{tx.category} &middot; {tx.date}</p>
                </div>
                <p
                  className="shrink-0 text-sm font-semibold tabular-nums"
                  style={{ color: tx.type === "inflow" ? "var(--pb-success)" : "var(--pb-ink)" }}
                >
                  {tx.type === "inflow" ? "+" : "-"}{formatAmount(tx.amount, tx.currency)}
                </p>
              </div>
            ))}
          </div>
        </article>

        {/* Priority Alerts */}
        <article className="pb-card p-5">
          <h2 className="pb-heading text-sm font-bold">Priority Alerts</h2>

          <div className="mt-4 space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.title}
                className="relative rounded-xl bg-[color:var(--pb-surface)] p-4 pl-5"
                style={{ borderLeft: `3px solid ${alertBorderColor[alert.color]}` }}
              >
                <p className="text-sm font-semibold leading-tight">{alert.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-[color:var(--pb-soft)]">{alert.description}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-[color:var(--pb-border)] px-2 py-0.5 text-[10px] font-semibold text-[color:var(--pb-soft)]">
                    {alert.confidence}% confidence
                  </span>
                  <button type="button" className="text-xs font-semibold text-[color:var(--pb-red)] hover:underline">
                    Take action
                  </button>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      {/* ── Smart Invoice CTA ── */}
      <section className="mt-5 pb-card p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="pb-heading text-sm font-bold">Smart Invoice Payment</h2>
            <p className="text-xs text-[color:var(--pb-soft)]">
              Upload an invoice PDF and let AI propose immediate payment or 30-day financing.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/payments" className="pb-action pb-action-primary text-sm">
              Go to Payments
            </Link>
            <a href="#" className="pb-action pb-action-ghost text-sm">
              Task List
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
