"use client";

import Navigation from "@/components/Navigation";
import Header from "@/components/Header";
import { Landmark, TrendingUp, Calendar, ArrowRight, ShieldCheck } from "lucide-react";

const loans = [
    { id: "LN-55271", type: "Working Capital", balance: "MYR 1,200,000.00", rate: "4.25%", nextPayment: "15 Apr 2026", status: "Active" },
    { id: "LN-88210", type: "Equipment Financing", balance: "MYR 340,500.00", rate: "3.80%", nextPayment: "20 Apr 2026", status: "Active" },
];

const lendingOptions = [
    { title: "SME Micro-Loan", desc: "Fast approval for smaller working capital needs.", max: "Up to MYR 100k" },
    { title: "Green Financing", desc: "Preferential rates for sustainable business initiatives.", max: "Up to MYR 2M" },
    { title: "Property Financing", desc: "Long-term loans for commercial property purchase.", max: "Up to MYR 10M" },
];

export default function LendingPage() {
    return (
        <main className="portal-shell">
            <Header />
            <Navigation activeLabel="Lending" />

            <header className="mt-6 flex items-center justify-between">
                <div>
                    <h1 className="pb-heading text-2xl font-bold italic tracking-tight">Lending & Financing</h1>
                    <p className="text-sm text-[color:var(--pb-soft)]">Monitor your active loans and explore new financing options.</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600 border border-orange-200">
                    <Landmark size={24} />
                </div>
            </header>

            {/* Active Loans */}
            <section className="mt-6">
                <h2 className="pb-heading text-sm font-bold mb-4">Active Facilities</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                    {loans.map((loan) => (
                        <div key={loan.id} className="pb-card p-5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4">
                                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 uppercase">
                                    {loan.status}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50 text-[color:var(--pb-red)]">
                                    <TrendingUp size={20} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-800">{loan.type}</h3>
                                    <p className="text-[10px] font-semibold text-[color:var(--pb-soft)]">{loan.id}</p>
                                </div>
                            </div>

                            <div className="mt-6">
                                <p className="text-[10px] font-bold text-[color:var(--pb-soft)] uppercase">Outstanding Balance</p>
                                <p className="text-2xl font-bold text-slate-800">{loan.balance}</p>
                            </div>

                            <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-50 pt-4">
                                <div>
                                    <p className="text-[10px] font-semibold text-[color:var(--pb-soft)]">Interest Rate</p>
                                    <p className="text-xs font-bold text-slate-700">{loan.rate}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-semibold text-[color:var(--pb-soft)]">Next Payment</p>
                                    <p className="text-xs font-bold text-slate-700">{loan.nextPayment}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Explore Options */}
            <section className="mt-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="pb-heading text-sm font-bold">New Financing Options</h2>
                    <p className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md flex items-center gap-1">
                        <ShieldCheck size={12} /> Pre-approved for MYR 500k
                    </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                    {lendingOptions.map((opt) => (
                        <button key={opt.title} className="pb-card flex flex-col p-5 text-left transition-all hover:border-[color:var(--pb-red)] group">
                            <h3 className="text-sm font-bold text-slate-800 group-hover:text-[color:var(--pb-red)]">{opt.title}</h3>
                            <p className="mt-2 text-xs text-[color:var(--pb-soft)] flex-grow">{opt.desc}</p>
                            <div className="mt-4 flex items-center justify-between">
                                <span className="text-[10px] font-bold text-slate-500">{opt.max}</span>
                                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-50 text-slate-400 group-hover:bg-[color:var(--pb-red)] group-hover:text-white transition-colors">
                                    <ArrowRight size={14} />
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </section>

            {/* Schedule */}
            <section className="mt-8 pb-card p-5">
                <div className="flex items-center gap-2 mb-4">
                    <Calendar size={18} className="text-[color:var(--pb-soft)]" />
                    <h2 className="pb-heading text-sm font-bold">Repayment Schedule</h2>
                </div>
                <div className="space-y-3">
                    {[
                        { date: "15 Apr 2026", amount: "MYR 24,500.00", loan: "Working Capital", icon: TrendingUp },
                        { date: "20 Apr 2026", amount: "MYR 8,240.00", loan: "Equipment Financing", icon: Landmark },
                    ].map((item) => {
                        const ItemIcon = item.icon;
                        return (
                            <div key={item.loan + item.date} className="flex items-center justify-between rounded-xl border border-slate-50 p-3">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-400">
                                        <ItemIcon size={16} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-800">{item.loan}</p>
                                        <p className="text-[10px] text-[color:var(--pb-soft)]">{item.date}</p>
                                    </div>
                                </div>
                                <p className="text-sm font-bold text-slate-700">{item.amount}</p>
                            </div>
                        );
                    })}
                </div>
            </section>
        </main>
    );
}
