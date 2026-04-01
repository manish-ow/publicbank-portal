"use client";

import Navigation from "@/components/Navigation";
import Header from "@/components/Header";
import { FileText, Globe, ArrowUpRight, ShieldCheck, Download } from "lucide-react";

const tradeFacilities = [
    { name: "Letter of Credit", limit: "MYR 5,000,000.00", utilized: "MYR 2,150,000.00", color: "bg-blue-500" },
    { name: "Bank Guarantee", limit: "MYR 1,000,000.00", utilized: "MYR 450,000.00", color: "bg-emerald-500" },
    { name: "Shipping Guarantee", limit: "MYR 500,000.00", utilized: "MYR 0.00", color: "bg-orange-500" },
];

const recentTradeDocs = [
    { ref: "LC/2026/001", type: "Letter of Credit", status: "Issued", date: "28 Mar 2026", amount: "USD 45,000.00" },
    { ref: "BG/2026/042", type: "Bank Guarantee", status: "In Progress", date: "30 Mar 2026", amount: "MYR 120,000.00" },
    { ref: "TF/2026/882", type: "Trade Financing", status: "Settled", date: "25 Mar 2026", amount: "MYR 85,000.00" },
];

export default function TradeFinancePage() {
    return (
        <main className="portal-shell">
            <Header />
            <Navigation activeLabel="Trade finance" />

            <header className="mt-6">
                <h1 className="pb-heading text-2xl font-bold italic tracking-tight">Trade Finance</h1>
                <p className="text-sm text-[color:var(--pb-soft)]">Manage your global trade operations and letters of credit.</p>
            </header>

            {/* Facilities Overview */}
            <section className="mt-6 grid gap-4 sm:grid-cols-3">
                {tradeFacilities.map((f) => {
                    const utilizedPercent = (parseFloat(f.utilized.replace(/[^0-9.]/g, "")) / parseFloat(f.limit.replace(/[^0-9.]/g, ""))) * 100;
                    return (
                        <div key={f.name} className="pb-card p-5">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">{f.name}</h3>
                            <p className="mt-2 text-lg font-bold text-slate-800">{f.limit}</p>
                            <div className="mt-4">
                                <div className="flex justify-between text-[10px] font-semibold mb-1">
                                    <span className="text-[color:var(--pb-soft)]">Utilized</span>
                                    <span className="text-slate-800">{f.utilized}</span>
                                </div>
                                <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${f.color}`}
                                        style={{ width: `${utilizedPercent}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </section>

            <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.4fr]">
                {/* Recent Activity */}
                <section className="pb-card p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="pb-heading text-sm font-bold">Recent Trade Documents</h2>
                        <button className="text-xs font-semibold text-[color:var(--pb-red)] hover:underline">View All Documents</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-100 text-[10px] font-bold text-[color:var(--pb-soft)] uppercase tracking-wider">
                                    <th className="pb-3 px-2">Reference</th>
                                    <th className="pb-3 px-2">Type</th>
                                    <th className="pb-3 px-2">Status</th>
                                    <th className="pb-3 px-2">Date</th>
                                    <th className="pb-3 px-2 text-right">Amount</th>
                                    <th className="pb-3 px-2 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {recentTradeDocs.map((doc) => (
                                    <tr key={doc.ref} className="text-xs hover:bg-slate-50/50 transition-colors">
                                        <td className="py-4 px-2 font-mono font-semibold text-slate-700">{doc.ref}</td>
                                        <td className="py-4 px-2 font-medium text-slate-600">{doc.type}</td>
                                        <td className="py-4 px-2">
                                            <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${doc.status === "Issued" ? "bg-emerald-50 text-emerald-700" :
                                                    doc.status === "In Progress" ? "bg-blue-50 text-blue-700" : "bg-slate-50 text-slate-500"
                                                }`}>
                                                {doc.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-2 text-slate-500">{doc.date}</td>
                                        <td className="py-4 px-2 text-right font-bold text-slate-800">{doc.amount}</td>
                                        <td className="py-4 px-2 text-center">
                                            <button className="text-slate-400 hover:text-[color:var(--pb-red)]">
                                                <Download size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Quick Tools */}
                <section className="space-y-4">
                    <div className="pb-card p-5 bg-gradient-to-br from-red-600 to-red-700 text-white border-0">
                        <Globe className="mb-2 opacity-50" size={24} />
                        <h3 className="text-sm font-bold">New Trade Facility</h3>
                        <p className="mt-1 text-xs opacity-80">Apply for Import/Export financing or Letters of Credit online.</p>
                        <button className="mt-4 w-full rounded-lg bg-white/20 py-2 text-xs font-bold hover:bg-white/30 transition-colors">
                            Apply Now
                        </button>
                    </div>

                    <div className="pb-card p-5">
                        <h3 className="text-sm font-bold mb-3">Trade Tools</h3>
                        <div className="space-y-3">
                            {[
                                { label: "FX Rates", icon: Globe },
                                { label: "Compliance Check", icon: ShieldCheck },
                                { label: "Document Templates", icon: FileText },
                            ].map((tool) => {
                                const ToolIcon = tool.icon;
                                return (
                                    <button key={tool.label} className="flex w-full items-center justify-between rounded-lg border border-slate-100 p-2.5 text-left transition-colors hover:bg-slate-50">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-600">
                                                <ToolIcon size={16} />
                                            </div>
                                            <span className="text-xs font-semibold text-slate-700">{tool.label}</span>
                                        </div>
                                        <ArrowUpRight size={14} className="text-slate-300" />
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
