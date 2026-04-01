import { Building2, Wallet, Globe, Landmark } from "lucide-react";

export const USD_TO_MYR_RATE = 4.72;

export const entities = [
    {
        name: "MNC Operating Company",
        type: "OPS ENTITY",
        accounts: [
            {
                id: "acc-1",
                nickname: "MYR 1029-3382 Payroll",
                number: "Current Account • Main Treasury",
                balance: 425000.00,
                currency: "MYR",
                status: "ACTIVE",
                icon: Building2
            },
            {
                id: "acc-2",
                nickname: "MYR 8839-4412 General Current",
                number: "Current Account • Operating Fund",
                balance: 285000.00,
                currency: "MYR",
                status: "ACTIVE",
                icon: Wallet
            }
        ]
    },
    {
        name: "MNC Holding Company",
        type: "HQ ENTITY",
        accounts: [
            {
                id: "acc-3",
                nickname: "MYR 1122-3344 Fixed Deposit",
                number: "Fixed Deposit • Maturity 24-DEC-2026",
                balance: 500000.00,
                currency: "MYR",
                status: "ACTIVE",
                icon: Landmark
            },
            {
                id: "acc-4",
                nickname: "USD 5520-1192 Ops Reserve",
                number: "Money Market Deposit • Global Yield",
                balance: 112000.00,
                currency: "USD",
                status: "ACTIVE",
                icon: Globe
            },
            {
                id: "acc-5",
                nickname: "MYR 9988-7766 Current Account",
                number: "Current Account • HQ Treasury",
                balance: 150000.00,
                currency: "MYR",
                status: "ACTIVE",
                icon: Wallet
            }
        ]
    }
];

export const getAllAccounts = () => {
    return entities.flatMap(entity => entity.accounts);
};

export const calculateTotalLiquidity = () => {
    const allAccounts = getAllAccounts();
    return allAccounts.reduce((total, acc) => {
        const valueInMYR = acc.currency === "USD" ? acc.balance * USD_TO_MYR_RATE : acc.balance;
        return total + valueInMYR;
    }, 0);
};
