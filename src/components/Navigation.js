import Link from "next/link";
import {
    Home as HomeIcon,
    CreditCard,
    Bell,
    BarChart3,
    Globe,
    HandCoins,
    Settings,
} from "lucide-react";

const navItems = [
    { label: "Home", href: "/", icon: HomeIcon },
    { label: "Payments", href: "/payments", icon: CreditCard },
    { label: "Pending actions", href: "/pending-actions", icon: Bell },
    { label: "Business analytics", href: "/business-overview", icon: BarChart3 },
    { label: "Trade finance", href: "/trade-finance", icon: Globe },
    { label: "Lending", href: "/lending", icon: HandCoins },
    { label: "Account admin", href: "/account-admin", icon: Settings },
];

export default function Navigation({ activeLabel }) {
    return (
        <nav className="pb-nav-strip">
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.label === activeLabel;
                return (
                    <Link
                        key={item.label}
                        href={item.href}
                        className={`pb-nav-item relative ${isActive ? "pb-nav-item-active" : ""}`}
                    >
                        <span className="flex items-center justify-center">
                            <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                        </span>
                        <span>{item.label}</span>
                        {item.label === "Pending actions" && (
                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm">
                                3
                            </span>
                        )}
                    </Link>
                );
            })}
        </nav>
    );
}
