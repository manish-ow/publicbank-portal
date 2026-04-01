"use client";

import Navigation from "@/components/Navigation";
import Header from "@/components/Header";
import { UserPlus, Settings2, ShieldCheck, Mail, MoreVertical } from "lucide-react";

const teamMembers = [
    { name: "John Doe", role: "Super Admin", email: "john@mnc.com", status: "Active", access: ["Payments", "Approvals", "Admin"] },
    { name: "Sarah Lee", role: "Finance Manager", email: "sarah@mnc.com", status: "Active", access: ["Payments", "Approvals"] },
    { name: "Tan Ah Kow", role: "Associate", email: "tan@mnc.com", status: "Invited", access: ["Payments"] },
    { name: "Muthu Raman", role: "Accountant", email: "muthu@mnc.com", status: "Active", access: ["Payments", "Reports"] },
];

export default function AccountAdminPage() {
    return (
        <main className="portal-shell">
            <Header />
            <Navigation activeLabel="Account admin" />

            <header className="mt-6 flex items-center justify-between">
                <div>
                    <h1 className="pb-heading text-2xl font-bold italic tracking-tight">Account Administration</h1>
                    <p className="text-sm text-[color:var(--pb-soft)]">Manage team members, roles, and organizational settings.</p>
                </div>
                <button className="flex items-center gap-2 rounded-lg bg-[color:var(--pb-red)] px-4 py-2 text-sm font-bold text-white shadow-sm transition-opacity hover:opacity-90">
                    <UserPlus size={18} />
                    Add User
                </button>
            </header>

            {/* Stats Cards */}
            <section className="mt-6 grid gap-4 grid-cols-2 sm:grid-cols-4">
                {[
                    { label: "Total Users", val: "4", icon: UserPlus, color: "text-blue-600" },
                    { label: "Active Roles", val: "3", icon: Settings2, color: "text-purple-600" },
                    { label: "Pending Invites", val: "1", icon: Mail, color: "text-orange-600" },
                    { label: "Security Health", val: "Good", icon: ShieldCheck, color: "text-emerald-600" },
                ].map((stat) => {
                    const StatIcon = stat.icon;
                    return (
                        <div key={stat.label} className="pb-card p-4 flex flex-col items-center text-center">
                            <StatIcon className={`mb-2 ${stat.color}`} size={20} />
                            <p className="pb-heading text-xl font-bold text-slate-800">{stat.val}</p>
                            <p className="text-[10px] font-semibold text-[color:var(--pb-soft)] uppercase">{stat.label}</p>
                        </div>
                    );
                })}
            </section>

            {/* User Management Table */}
            <section className="mt-6 pb-card p-5">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="pb-heading text-sm font-bold">Team Members</h2>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:border-[color:var(--pb-red)] focus:outline-none"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-100 text-[10px] font-bold text-[color:var(--pb-soft)] uppercase tracking-wider">
                                <th className="pb-4 px-2">Member</th>
                                <th className="pb-4 px-2">Role</th>
                                <th className="pb-4 px-2">Permissions</th>
                                <th className="pb-4 px-2">Status</th>
                                <th className="pb-4 px-2 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {teamMembers.map((member) => (
                                <tr key={member.email} className="text-xs hover:bg-slate-50/50 transition-colors">
                                    <td className="py-4 px-2">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-500 uppercase">
                                                {member.name.split(" ").map(n => n[0]).join("")}
                                            </div>
                                            <div>
                                                <p className="pb-heading font-bold text-slate-800">{member.name}</p>
                                                <p className="text-[10px] text-[color:var(--pb-soft)]">{member.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-2 text-slate-600 font-medium">{member.role}</td>
                                    <td className="py-4 px-2">
                                        <div className="flex flex-wrap gap-1">
                                            {member.access.map(tag => (
                                                <span key={tag} className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold text-slate-500">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="py-4 px-2">
                                        <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${member.status === "Active" ? "bg-emerald-50 text-emerald-700" : "bg-orange-50 text-orange-700"
                                            }`}>
                                            {member.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-2 text-right">
                                        <button className="text-slate-400 hover:text-slate-600">
                                            <MoreVertical size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Other Settings */}
            <section className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="pb-card p-5 flex items-center justify-between group cursor-pointer hover:border-[color:var(--pb-red)]">
                    <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-[color:var(--pb-red)]">
                            <ShieldCheck size={20} />
                        </div>
                        <div>
                            <h3 className="pb-heading text-sm font-bold text-slate-800">Security Settings</h3>
                            <p className="text-xs text-[color:var(--pb-soft)]">2FA, session limits, and security logs.</p>
                        </div>
                    </div>
                    <Settings2 size={18} className="text-slate-300 group-hover:text-[color:var(--pb-red)] transition-colors" />
                </div>
                <div className="pb-card p-5 flex items-center justify-between group cursor-pointer hover:border-[color:var(--pb-red)]">
                    <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <Mail size={20} />
                        </div>
                        <div>
                            <h3 className="pb-heading text-sm font-bold text-slate-800">Notification Preferences</h3>
                            <p className="text-xs text-[color:var(--pb-soft)]">Email and push notification alerts.</p>
                        </div>
                    </div>
                    <Settings2 size={18} className="text-slate-300 group-hover:text-blue-600 transition-colors" />
                </div>
            </section>
        </main>
    );
}
