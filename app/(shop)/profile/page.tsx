import { auth, getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrderHistory from "./_components/order-history";
import UserInfo from "./_components/user-info";
import Reviews from "./_components/reviews";
import WishList from "./_components/wishlist";
import Addresses from "./_components/addresses";
import { getWishlistItems } from "@/features/wishlist/actions/wishlist";
import { headers } from "next/headers";
import Payments from "./_components/payments";

export default async function ProfilePage() {

  const [session, activeSessions] =
    await Promise.all([
      auth.api.getSession({
        headers: await headers(),
      }),
      auth.api.listSessions({
        headers: await headers(),
      }),
    ]).catch(async (e) => {
      throw redirect("/auth/signin");
    });


  if (!session) {
    redirect("/auth/signin");
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      Order: {
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { items: { include: { product: true } } },
      },
      Address: true,
      Review: {
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { product: true },
      },
    },
  });

  if (!user) {
    return <div>User not found</div>;
  }

  const wishlistItems = await getWishlistItems();

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">My Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <UserInfo user={user} session={JSON.parse(JSON.stringify(session))}
            activeSessions={JSON.parse(JSON.stringify(activeSessions))} />
        </CardContent>
      </Card>

      <Tabs defaultValue="orders" className="grid grid-cols-[250px_1fr] gap-6">
        <TabsList className="flex-col h-full bg-background p-2 space-y-2 items-start">
          <TabsTrigger
            value="orders"
            className="w-full justify-start data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Orders
          </TabsTrigger>
          <TabsTrigger
            value="addresses"
            className="w-full justify-start data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Addresses
          </TabsTrigger>
          <TabsTrigger
            value="payments"
            className="w-full justify-start data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Payments
          </TabsTrigger>
          <TabsTrigger
            value="reviews"
            className="w-full justify-start data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Reviews
          </TabsTrigger>
          <TabsTrigger
            value="wishlist"
            className="w-full justify-start data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Wishlist
          </TabsTrigger>
        </TabsList>
        <div>
          <TabsContent value="orders">
            <OrderHistory orders={user.Order} />
          </TabsContent>
          <TabsContent value="addresses">
            <Addresses addresses={user.Address} />
          </TabsContent>
          <TabsContent value="payments">
            <Payments />
          </TabsContent>
          <TabsContent value="reviews">
            <Reviews reviews={user.Review} />
          </TabsContent>
          <TabsContent value="wishlist">
            <WishList wishlistItems={wishlistItems} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
