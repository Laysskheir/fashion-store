import { db } from "@/lib/db";
import OrdersPage from "./_components/orders-page";

export default async function Page() {
    const orders = await db.order.findMany({
        orderBy: {
            createdAt: "desc"
        }
    });

    return (
        <OrdersPage orders={orders} />
    );
}