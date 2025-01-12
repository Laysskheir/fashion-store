import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import TrackOrderClient from "./_components/track-order-client";
import { getRecentOrders } from "./_actions/track-order";

export default async function TrackOrderPage() {
  const session = await getSession();

  if (!session) {
    redirect("/auth/signin");
  }

  const recentOrders = await getRecentOrders();

  return <TrackOrderClient initialOrders={recentOrders} />;
}
