import { Separator } from "@/components/ui/separator"
import { WishlistItems } from "./_components/wishlist-items"
import { getWishlistItems } from "@/features/wishlist/actions/wishlist"
import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { Metadata } from "next"
import { siteConfig } from "@/config/site"

export const metadata: Metadata = {
  title: `Wishlist | ${siteConfig.name}`,
  description: "Your favorite items saved for later.",
  keywords: [...siteConfig.keywords, "wishlist", "saved items", "favorites"],
}

export default async function WishlistPage() {
  // Check if user is authenticated
  const session = await getSession()

  if (!session?.user) {
    redirect("/auth/signin")
  }

  const wishlistItems = await getWishlistItems()

  return (
    <div>
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          My Wishlist
        </h1>
        <p className="mt-4 text-base text-muted-foreground">
          Items you have saved for later. Add them to your cart when you&apos;re ready to purchase.
        </p>

        <Separator className="my-8" />

        <WishlistItems items={wishlistItems} />
      </div>
    </div>
  )
}
