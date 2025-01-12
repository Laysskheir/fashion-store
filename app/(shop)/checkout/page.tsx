import { redirect } from "next/navigation";
import { getCheckoutData } from "@/features/checkout/actions/get-checkout-data";
import { getSession } from "@/lib/auth";
import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import CheckoutPage from "./_components/checkout-page";

export const metadata: Metadata = {
  title: `Checkout | ${siteConfig.name}`,
  description: "Securely complete your purchase and review your order.",
  keywords: [...siteConfig.keywords, "checkout", "payment", "order", "shipping"],
}

export default async function Page() {
    const session = await getSession();
    if (!session?.user) {
        redirect("/login");
    }

    const initialData = await getCheckoutData();
    if (initialData.error) {
        redirect("/cart");
    }

    return <CheckoutPage initialData={initialData} />;
}
