import Image from "next/image";
import { calculateTotalLiquidity } from "@/lib/data";

export default function Header() {
    const totalLiquidity = calculateTotalLiquidity();

    return (
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
                        <p className="text-[11px] uppercase tracking-wider text-white/60">Total Liquidity (MYR Equiv)</p>
                        <p className="pb-heading text-xl font-bold tracking-tight sm:text-2xl">
                            MYR {totalLiquidity.toLocaleString("en-MY", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-3 border-t border-white/15 pt-3">
                <p className="text-sm text-white/90"> <strong>MNC Pte Ltd</strong></p>
            </div>
        </section>
    );
}
