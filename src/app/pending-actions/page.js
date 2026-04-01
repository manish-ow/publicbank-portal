"use client";

import Navigation from "@/components/Navigation";
import Header from "@/components/Header";
import { CheckCircle2, XCircle, Clock, ShieldCheck, CreditCard } from "lucide-react";

const pendingApprovals = [
    {
        id: "PA-1029",
        type: "Payment",
        title: "Supplier Payment - Meat & Vege Pte Ltd",
        amount: "MYR 12,500.00",
        requestor: "Tan Ah Kow",
        date: "1 Apr 2026",
        icon: CreditCard,
    },
    {
        id: "UA-552",
        type: "User Access",
        title: "New User Onboarding - Sarah Lee",
        details: "Role: Finance Manager",
        requestor: "System Admin",
        date: "31 Mar 2026",
        icon: ShieldCheck,
    },
    {
        id: "PA-1030",
        type: "Payment",
        title: "Office Rent - KL Property Group",
        amount: "MYR 8,200.00",
        requestor: "Muthu Raman",
        date: "30 Mar 2026",
        icon: CreditCard,
    },
];

export default function PendingActionsPage() {
    return (
        <main className="portal-shell">
            <Header />
            <Navigation activeLabel="Pending actions" />

            <header className="mt-6 flex items-center justify-between">
                <div>
                    <h1 className="pb-heading text-2xl font-bold italic tracking-tight">Pending Actions</h1>
                    <p className="text-sm text-[color:var(--pb-soft)]">Review and authorize pending requests for your organization.</p>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-orange-50 px-3 py-1.5 text-orange-700 border border-orange-100">
                    <Clock size={16} />
                    <span className="text-xs font-bold">3 Actions Required</span>
                </div>
            </header>

            <section className="mt-6 space-y-4">
                {pendingApprovals.map((item) => {
                    const Icon = item.icon;
                    return (
                        <div key={item.id} className="pb-card flex items-center justify-between p-5 transition-shadow hover:shadow-md">
                            <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-[color:var(--pb-red)]">
                                    <Icon size={20} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-[color:var(--pb-soft)]">{item.type}</span>
                                        <span className="text-[10px] text-[color:var(--pb-border)]">•</span>
                                        <span className="text-[10px] font-semibold text-[color:var(--pb-soft)]">{item.id}</span>
                                    </div>
                                    <h3 className="text-sm font-bold text-slate-800">{item.title}</h3>
                                    <p className="mt-0.5 text-xs text-[color:var(--pb-soft)]">
                                        Requested by <span className="font-semibold">{item.requestor}</span> on {item.date}
                                    </p>
                                    {item.amount && <p className="mt-2 text-base font-bold text-[color:var(--pb-red)]">{item.amount}</p>}
                                    {item.details && <p className="mt-1 text-xs font-medium text-slate-600">{item.details}</p>}
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-500">
                                    <XCircle size={18} />
                                </button>
                                <button className="flex items-center gap-2 rounded-lg bg-[color:var(--pb-red)] px-4 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90 shadow-sm">
                                    <CheckCircle2 size={16} />
                                    Approve
                                </button>
                            </div>
                        </div>
                    );
                })}
            </section>

            {pendingApprovals.length === 0 && (
                <div className="mt-12 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-300">
                        <CheckCircle2 size={32} />
                    </div>
                    <h3 className="mt-4 text-sm font-bold text-slate-800">All caught up!</h3>
                    <p className="text-xs text-[color:var(--pb-soft)]">No pending actions require your attention at this time.</p>
                </div>
            )}
        </main>
    );
}
