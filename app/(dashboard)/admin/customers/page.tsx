import { db } from "@/lib/db";
import CustomersPage from "./_components/customers-page";

export default async function Page() {

    const users = await db.user.findMany({
        orderBy: {
            createdAt: "desc"
        }
    });
    return (
        <CustomersPage users={users} />
    );
}