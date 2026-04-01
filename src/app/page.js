"use client";

import Image from "next/image";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Header from "@/components/Header";
import {
  Building2,
  Wallet,
  Globe,
  ChevronRight,
  ArrowUpRight,
  FileText,
  Plus,
  Landmark
} from "lucide-react";

export default function Home() {
  const entities = [
    {
      name: "MNC Holding Company",
      type: "HQ ENTITY",
      accounts: [
        {
          nickname: "MYR 1029-3382 Payroll",
          number: "Current Account • Main Treasury",
          balance: 425000.00,
          currency: "MYR",
          status: "ACTIVE",
          icon: Building2
        },
        {
          nickname: "USD 5520-1192 Ops Reserve",
          number: "Money Market Deposit • Global Yield",
          balance: 112000.00,
          currency: "USD",
          status: "ACTIVE",
          icon: Globe
        }
      ]
    },
    {
      name: "MNC Operating Company",
      type: "OPS ENTITY",
      accounts: [
        {
          nickname: "MYR 8839-4412 CapEx Fix",
          number: "Fixed Deposit • Maturity 12-OCT-2024",
          balance: 285000.00,
          currency: "MYR",
          status: "ACTIVE",
          icon: Landmark
        }
      ]
    }
  ];

  return (
    <main className="portal-shell">
      <Header />
      <Navigation activeLabel="Home" />

      {/* ── Page Header ── */}
      <section className="mt-8 mb-6">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[color:var(--pb-soft)]">GLOBAL PORTFOLIO</p>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="pb-heading text-3xl font-bold tracking-tight">Accounts Overview</h1>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 rounded-lg border border-[color:var(--pb-border)] bg-white px-4 py-2 text-sm font-semibold text-[color:var(--pb-soft)] hover:bg-[color:var(--pb-surface)] transition-all">
              <FileText size={16} className="text-[color:var(--pb-red)]" />
              Statement Export
            </button>
            <button className="flex items-center gap-2 rounded-lg bg-[color:var(--pb-red)] px-4 py-2 text-sm font-semibold text-white hover:bg-[color:var(--pb-red-strong)] transition-all shadow-md">
              <Plus size={16} />
              Add Account
            </button>
          </div>
        </div>
        <p className="mt-2 max-w-2xl text-sm text-[color:var(--pb-soft)]">
          Consolidated view of your corporate liquidity across legal entities and multi-currency holdings.
        </p>
      </section>

      {/* ── Summary Cards ── */}
      <section className="grid gap-4 sm:grid-cols-3">
        <article className="pb-card relative overflow-hidden p-6 border-l-4 border-l-[color:var(--pb-red)]">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[color:var(--pb-soft)]">Total Liquidity (MYR Equiv)</p>
            <div className="opacity-10 grayscale brightness-0">
              <Image src="/brand/pb-logo-mark-white.svg" alt="" width={16} height={16} />
            </div>
          </div>
          <p className="pb-heading mt-2 text-2xl font-bold">MYR 822,550.00</p>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-[color:var(--pb-success)] font-semibold">
            <ArrowUpRight size={14} />
            <span>+4.2% from last month</span>
          </div>
        </article>

        <article className="pb-card p-6">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[color:var(--pb-soft)]">Active Entities</p>
          <p className="pb-heading mt-2 text-3xl font-bold">02</p>
          <div className="mt-4 h-1.5 w-full rounded-full bg-[color:var(--pb-surface)]">
            <div className="h-full w-2/3 rounded-full bg-[#0d6b6b]"></div>
          </div>
        </article>

        <article className="pb-card p-6 bg-[#fcf8f8] border-dashed border-[color:var(--pb-border)]">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[color:var(--pb-soft)]">Pending Approvals</p>
          <p className="pb-heading mt-2 text-3xl font-bold text-[color:var(--pb-red)]">05</p>
          <p className="mt-4 text-xs text-[color:var(--pb-soft)]">Requires immediate attention</p>
        </article>
      </section>

      {/* ── Entities & Accounts ── */}
      <section className="mt-8 space-y-8">
        {entities.map((entity) => (
          <div key={entity.name}>
            <div className="flex items-center justify-between border-b border-[color:var(--pb-border)] pb-2 mb-4">
              <h2 className="pb-heading text-lg font-bold flex items-center gap-2">
                {entity.name}
              </h2>
              <span className="rounded-full bg-[color:var(--pb-surface)] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-[color:var(--pb-soft)]">
                {entity.type}
              </span>
            </div>

            <div className="space-y-4">
              {/* Grouping by Currency for visual effect */}
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#0d6b6b] mb-2 px-2">
                <Wallet size={12} />
                MYR Holdings
              </div>

              {entity.accounts.filter(a => a.currency === "MYR").map((account) => (
                <div key={account.nickname} className="pb-card flex items-center justify-between p-4 hover:shadow-md transition-shadow group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[color:var(--pb-surface)] text-[color:var(--pb-red)]">
                      <account.icon size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold">{account.nickname}</p>
                      <p className="text-[11px] text-[color:var(--pb-soft)]">{account.number}</p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-6">
                    <div>
                      <p className="pb-heading text-lg font-bold tabular-nums">
                        {account.balance.toLocaleString("en-MY", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                      <p className="text-[10px] text-[color:var(--pb-soft)] uppercase font-semibold">Available Balance</p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 min-w-[80px]">
                      <span className="flex items-center gap-1 rounded bg-[#eefbf3] px-2 py-0.5 text-[9px] font-bold text-[color:var(--pb-success)]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--pb-success)]"></span>
                        {account.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {entity.accounts.some(a => a.currency === "USD") && (
                <>
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#0d6b6b] mt-6 mb-2 px-2">
                    <Globe size={12} />
                    USD Holdings
                  </div>
                  {entity.accounts.filter(a => a.currency === "USD").map((account) => (
                    <div key={account.nickname} className="pb-card flex items-center justify-between p-4 hover:shadow-md transition-shadow group cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[color:var(--pb-surface)] text-[color:var(--pb-red)]">
                          <account.icon size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold">{account.nickname}</p>
                          <p className="text-[11px] text-[color:var(--pb-soft)]">{account.number}</p>
                        </div>
                      </div>
                      <div className="text-right flex items-center gap-6">
                        <div>
                          <p className="pb-heading text-lg font-bold tabular-nums">
                            {account.balance.toLocaleString("en-MY", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                          <p className="text-[10px] text-[color:var(--pb-soft)] uppercase font-semibold">Available Balance</p>
                        </div>
                        <div className="flex flex-col items-end gap-1.5 min-w-[80px]">
                          <span className="flex items-center gap-1 rounded bg-[#eefbf3] px-2 py-0.5 text-[9px] font-bold text-[color:var(--pb-success)]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--pb-success)]"></span>
                            {account.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        ))}
      </section>

      {/* ── Cash Position Insights ── */}
      <section className="mt-12 bg-[color:var(--pb-surface)]/50 rounded-2xl p-8 border border-[color:var(--pb-border)] mb-8">
        <div className="grid gap-8 sm:grid-cols-[1.2fr_1.8fr]">
          <div>
            <h2 className="pb-heading text-[11px] font-bold uppercase tracking-widest text-[color:var(--pb-soft)] mb-4">CASH POSITION INSIGHTS</h2>
            <p className="text-sm leading-relaxed text-[color:var(--pb-soft)] italic">
              &quot;Your USD holdings have increased by 12% following the regional dividend distribution. Consider reallocating to Money Market instruments for enhanced yield optimization.&quot;
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-[color:var(--pb-border)] flex items-center justify-between">
            <div className="flex items-center gap-4 overflow-hidden">
              <div className="flex items-end gap-1.5 h-16">
                <div className="w-2.5 h-8 bg-[#bce0dc] rounded-sm"></div>
                <div className="w-2.5 h-12 bg-[#bce0dc] rounded-sm"></div>
                <div className="w-2.5 h-14 bg-[#bce0dc] rounded-sm"></div>
                <div className="w-2.5 h-10 bg-[#bce0dc] rounded-sm"></div>
                <div className="w-2.5 h-16 bg-[color:var(--pb-red)]/70 rounded-sm"></div>
                <div className="w-2.5 h-12 bg-[#bce0dc] rounded-sm"></div>
                <div className="w-2.5 h-9 bg-[#bce0dc] rounded-sm"></div>
              </div>
              <div>
                <p className="text-[11px] font-bold text-[color:var(--pb-ink)] uppercase tracking-wider">YTD Performance Trend</p>
              </div>
            </div>
            <button className="text-xs font-bold text-[color:var(--pb-red)] hover:underline flex items-center gap-1">
              Details <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
