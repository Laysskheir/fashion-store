'use client';

import { Icons } from "./Icons";

interface PaymentCardsProps {
    className?: string;
}

export function PaymentCards({ className }: PaymentCardsProps) {
    const paymentIcons = [
        { icon: Icons.mastercart, name: "Mastercard", id: "mastercard" },
        { icon: Icons.visa, name: "Visa", id: "visa" },
        { icon: Icons.applepay, name: "Apple Pay", id: "applepay" },
        { icon: Icons.googlepay, name: "Google Pay", id: "googlepay" },
        { icon: Icons.amazonpay, name: "Amazon Pay", id: "amazonpay" },
    ];

    return (
        <div className={className}>
            <div className="flex items-center justify-center gap-4">
                {paymentIcons.map(({ icon: Icon, name, id }) => (
                    <div key={id} className="text-muted-foreground hover:text-foreground transition-colors">
                        <Icon className="h-6 w-auto" aria-hidden="true" />
                        <span className="sr-only">Pay with {name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
