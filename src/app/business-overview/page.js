"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const navItems = [
  { label: "Home", href: "/", icon: "🏠" },
  { label: "Payments", href: "/payments", icon: "💳" },
  { label: "Business Overview", href: "/business-overview", icon: "📈", active: true },
  { label: "Trade Finance", href: "#", icon: "🌐" },
  { label: "Financial Mgmt", href: "#", icon: "📊" },
];

const cashForecast = [
  { label: "Today", value: 24200 },
  { label: "30D", value: 15800 },
  { label: "60D", value: 48300 },
  { label: "90D", value: 54230 },
];

const receivables = {
  count: 7,
  total: 4800.5,
  customers: 15,
  upcoming: 62,
  overdue: 38,
};

const payables = {
  count: 8,
  total: 4640.0,
};

const invoicesDue = [
  { vendor: "Shopee MY", amount: 1200.0, dueIn: "3 days", status: "upcoming" },
  { vendor: "Grab Merchant", amount: 800.5, dueIn: "12 days", status: "upcoming" },
  { vendor: "TM Unifi", amount: 450.0, dueIn: "overdue", status: "overdue" },
  { vendor: "Young-In Traders", amount: 2350.0, dueIn: "25 days", status: "upcoming" },
];

const formatCurrency = (amount, currency = "MYR") =>
  `${currency} ${amount.toLocaleString("en-MY", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/* SVG donut chart helper */
function DonutChart({ upcoming, overdue }) {
  const total = upcoming + overdue;
  const upcomingAngle = (upcoming / total) * 360;
  const r = 70;
  const cx = 100;
  const cy = 100;

  const toXY = (angle) => ({
    x: cx + r * Math.cos(((angle - 90) * Math.PI) / 180),
    y: cy + r * Math.sin(((angle - 90) * Math.PI) / 180),
  });

  const upcomingEnd = toXY(upcomingAngle);
  const largeUpcoming = upcomingAngle > 180 ? 1 : 0;
  const largeOverdue = 360 - upcomingAngle > 180 ? 1 : 0;

  const upcomingPath = `M ${cx} ${cy - r} A ${r} ${r} 0 ${largeUpcoming} 1 ${upcomingEnd.x} ${upcomingEnd.y}`;
  const overduePath = `M ${upcomingEnd.x} ${upcomingEnd.y} A ${r} ${r} 0 ${largeOverdue} 1 ${cx} ${cy - r}`;

  return (
    <svg viewBox="0 0 200 200" className="h-40 w-40">
      <path d={upcomingPath} fill="none" stroke="#166534" strokeWidth="28" />
      <path d={overduePath} fill="none" stroke="#cc0033" strokeWidth="28" />
      <circle cx={cx} cy={cy} r="50" fill="white" />
    </svg>
  );
}

/* SVG line chart */
function CashChart({ data }) {
  const maxVal = Math.max(...data.map((d) => d.value)) * 1.15;
  const w = 320;
  const h = 160;
  const padX = 40;
  const padY = 20;
  const chartW = w - padX * 2;
  const chartH = h - padY * 2;

  const points = data.map((d, i) => ({
    x: padX + (i / (data.length - 1)) * chartW,
    y: padY + chartH - (d.value / maxVal) * chartH,
    ...d,
  }));

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  const gridLines = [0, 20, 40, 60, 80].map((val) => ({
    y: padY + chartH - (val * 1000 / maxVal) * chartH,
    label: val,
  }));

  return (
    <svg viewBox={`0 0 ${w} ${h + 20}`} className="w-full" style={{ maxWidth: 360 }}>
      {/* Grid lines */}
      {gridLines.map((g) => (
        <g key={g.label}>
          <line x1={padX} y1={g.y} x2={w - padX} y2={g.y} stroke="#e3e6eb" strokeWidth="0.5" strokeDasharray="3 3" />
          <text x={padX - 6} y={g.y + 3} textAnchor="end" fontSize="8" fill="#68707d">{g.label}</text>
        </g>
      ))}
      <text x={padX - 6} y={padY - 6} textAnchor="end" fontSize="7" fill="#68707d">MYR (&apos;000)</text>

      {/* Line */}
      <path d={linePath} fill="none" stroke="#cc0033" strokeWidth="2" strokeLinejoin="round" />

      {/* Points */}
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={i === 1 ? 5 : 3.5} fill={i === 1 ? "#cc0033" : "#cc0033"} stroke="white" strokeWidth="1.5" />
          <text x={p.x} y={h + 12} textAnchor="middle" fontSize="8" fill={i === 1 ? "#cc0033" : "#68707d"} fontWeight={i === 1 ? "700" : "400"}>
            {p.label}
          </text>
        </g>
      ))}

      {/* X-axis label */}
      <text x={padX} y={h + 12} textAnchor="start" fontSize="7" fill="#68707d">→ Cash Position</text>
    </svg>
  );
}

export default function BusinessOverviewPage() {
  const [duePeriod, setDuePeriod] = useState("1-30");

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

      {/* ── Cash Balance Forecast + Receivables/Payables ── */}
      <section className="mt-5 grid gap-5 lg:grid-cols-2">

        {/* Cash Balance Forecast */}
        <article className="pb-card pb-card-flag p-5">
          <div className="flex items-start justify-between">
            <h2 className="pb-heading text-sm font-bold">Cash Balance Forecast</h2>
            <span className="text-[color:var(--pb-soft)] text-sm">&rsaquo;</span>
          </div>

          <div className="mt-3 text-center">
            <p className="text-xs text-[color:var(--pb-soft)]">Your estimated cash balance for</p>
            <p className="text-[11px] text-[color:var(--pb-soft)]">839-203-384-0</p>
          </div>

          <div className="mt-4 flex justify-center">
            <CashChart data={cashForecast} />
          </div>

          <div className="mt-4 border-t border-[color:var(--pb-border)] pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[color:var(--pb-soft)]">Your estimated cash balance</p>
                <p className="pb-heading text-sm font-bold">In 30 days <span className="text-[color:var(--pb-soft)] text-xs font-normal">&rsaquo;</span></p>
              </div>
            </div>
            <div className="mt-2 rounded-xl bg-[#eefbf3] p-3 text-center">
              <p className="pb-heading text-xl font-bold text-[color:var(--pb-success)]">MYR 58,540.60</p>
            </div>
          </div>

          <div className="mt-3 border-t border-[color:var(--pb-border)] pt-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-[color:var(--pb-soft)]">In 60 days</p>
              <p className="pb-heading text-sm font-bold text-[color:var(--pb-success)]">MYR 64,521.70</p>
            </div>
          </div>
        </article>

        {/* Account Receivables / Payables */}
        <article className="pb-card pb-card-flag p-5">
          <h2 className="pb-heading text-sm font-bold">Account Receivables / Payables</h2>

          {/* Toggle pills */}
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-[color:var(--pb-red)] p-3 text-center text-white">
              <p className="text-[11px] font-semibold">{receivables.count} Receivables</p>
              <p className="pb-heading mt-0.5 text-base font-bold">{formatCurrency(receivables.total)}</p>
            </div>
            <div className="rounded-xl bg-[color:var(--pb-surface)] p-3 text-center">
              <p className="text-[11px] font-semibold text-[color:var(--pb-soft)]">{payables.count} Payables</p>
              <p className="pb-heading mt-0.5 text-base font-bold">{formatCurrency(payables.total)}</p>
            </div>
          </div>

          {/* Donut chart */}
          <div className="mt-4 flex flex-col items-center">
            <div className="relative">
              <DonutChart upcoming={receivables.upcoming} overdue={receivables.overdue} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-[10px] text-[color:var(--pb-success)]">{receivables.customers} Customers</p>
                <p className="pb-heading text-sm font-bold">{formatCurrency(receivables.total)}</p>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-4 text-[10px]">
              <span className="flex items-center gap-1">
                <span className="inline-block h-2 w-2 rounded-full bg-[#166534]"></span> Upcoming
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block h-2 w-2 rounded-full bg-[color:var(--pb-red)]"></span> Overdue
              </span>
            </div>
          </div>

          {/* Invoices due */}
          <div className="mt-4 border-t border-[color:var(--pb-border)] pt-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-[color:var(--pb-soft)]">Your invoices due</p>
              <div className="flex items-center gap-2">
                <button type="button" className="text-[color:var(--pb-soft)] hover:text-[color:var(--pb-ink)]">&lsaquo;</button>
                <p className="pb-heading text-xs font-bold">In 1 - 30 days</p>
                <button type="button" className="text-[color:var(--pb-soft)] hover:text-[color:var(--pb-ink)]">&rsaquo;</button>
              </div>
            </div>

            <div className="mt-2 divide-y divide-[color:var(--pb-border)]">
              {invoicesDue.map((inv) => (
                <div key={inv.vendor} className="flex items-center justify-between py-2 first:pt-0 last:pb-0">
                  <div>
                    <p className="text-xs font-semibold">{inv.vendor}</p>
                    <p className="text-[10px] text-[color:var(--pb-soft)]">{inv.dueIn}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold tabular-nums">{formatCurrency(inv.amount)}</p>
                    <span
                      className="inline-block rounded-full px-1.5 py-0.5 text-[9px] font-semibold"
                      style={{
                        background: inv.status === "overdue" ? "#fef2f2" : "#eefbf3",
                        color: inv.status === "overdue" ? "#dc2626" : "var(--pb-success)",
                      }}
                    >
                      {inv.status === "overdue" ? "Overdue" : "Upcoming"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </article>
      </section>

      {/* ── Bottom cards: Cash position summary + Payment received ── */}
      <section className="mt-5 grid gap-5 lg:grid-cols-2">
        <article className="pb-card p-5">
          <div className="flex items-start justify-between">
            <h2 className="pb-heading text-sm font-bold">Cash Balance and Forecast</h2>
            <span className="text-[color:var(--pb-soft)] text-sm">&rsaquo;</span>
          </div>
          <p className="pb-heading mt-2 text-lg font-bold">MYR 52,223.20</p>
          <p className="mt-1 text-xs text-[color:var(--pb-soft)]">Great work! Your accounts position is on the rise.</p>

          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[color:var(--pb-soft)]">In 30 days</span>
              <span className="font-semibold text-[color:var(--pb-success)]">▲ MYR 58,540.60</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[color:var(--pb-soft)]">In 60 days</span>
              <span className="font-semibold text-[color:var(--pb-success)]">▲ MYR 64,521.70</span>
            </div>
          </div>
        </article>

        <article className="pb-card p-5">
          <div className="flex items-start justify-between">
            <h2 className="pb-heading text-sm font-bold">Accounts Receivables / Payables</h2>
            <span className="text-[color:var(--pb-soft)] text-sm">&rsaquo;</span>
          </div>
          <p className="mt-1 text-xs text-[color:var(--pb-soft)]">You have invoices that are currently overdue.</p>

          <div className="mt-3 rounded-xl bg-[color:var(--pb-surface)] p-3">
            <p className="text-[11px] text-[color:var(--pb-soft)]">To collect</p>
            <div className="flex items-center justify-between">
              <p className="pb-heading text-base font-bold">MYR 4,800.50</p>
              <span className="rounded-lg bg-[color:var(--pb-gold)] px-2 py-0.5 text-[10px] font-semibold text-[#865000]">Payment received from MNC</span>
            </div>
            <p className="mt-1.5 rounded-lg bg-white p-2 text-[10px] text-[color:var(--pb-soft)]">
              You received a recent payment of MYR 2,800.00 from Young-In Traders Sdn Bhd.
            </p>
          </div>

          <div className="mt-2 rounded-xl bg-[color:var(--pb-surface)] p-3">
            <p className="text-[11px] text-[color:var(--pb-soft)]">To pay</p>
            <p className="pb-heading text-base font-bold">MYR 4,640.00</p>
            <p className="mt-1 rounded-lg bg-white p-2 text-[10px] text-[color:var(--pb-soft)]">
              Your payment of MYR 3,100.00 to Meat and Vege Pte Ltd is due in 10 days.
            </p>
          </div>
        </article>
      </section>
    </main>
  );
}
