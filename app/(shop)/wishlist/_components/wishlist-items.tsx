"use client"

import { Button } from "@/components/ui/button"
import { WishlistItem } from "@prisma/client"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import Image from "next/image"
import { formatPrice } from "@/lib/utils"
import { Heart, ShoppingCart, Trash2 } from "lucide-react"
import { removeFromWishlist } from "@/features/wishlist/actions/wishlist"
import { toast } from "sonner"
import { useCart } from "@/hooks/useCart"

interface WishlistItemsProps {
  items: (WishlistItem & {
    product: {
      id: string
      name: string
      description: string
      price: number
      images: { url: string }[]
      slug: string
    }
  })[]
}

export function WishlistItems({ items }: WishlistItemsProps) {
  const router = useRouter()
  const cart = useCart();

  const handleRemoveFromWishlist = async (itemId: string) => {
    try {
      await removeFromWishlist(itemId)
      toast.success("Item removed from wishlist", {
        description: "The item has been removed from your wishlist.",
      })
      router.refresh()
    } catch (error) {
      toast.error("Failed to remove item from wishlist")
    }
  }

  const handleAddToCart = async (item: WishlistItemsProps["items"][0]) => {
    cart.addToCart(item.product)
    toast.success("Added to cart", {
      description: "The item has been added to your cart.",
    })
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart className="mx-auto h-12 w-12 text-muted-foreground" />
        <h2 className="mt-4 text-lg font-medium">Your wishlist is empty</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Browse our products and add items you love to your wishlist.
        </p>
        <Button
          onClick={() => router.push("/products")}
          className="mt-8"
        >
          Browse Products
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <Card key={item.id} className="group overflow-hidden">
          <CardContent className="p-0">
            <div
              className="cursor-pointer"
              onClick={() => router.push(`/products/${item.product.slug}`)}
            >
              <AspectRatio ratio={1}>
                <Image
                  src={item.product.images[0]?.url || "/placeholder.svg"}
                  alt={item.product.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </AspectRatio>
            </div>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 p-4">
            <div
              className="cursor-pointer"
              onClick={() => router.push(`/products/${item.product.slug}`)}
            >
              <h3 className="font-medium">{item.product.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                {item.product.description}
              </p>
              <p className="mt-2 font-medium">
                {formatPrice(item.product.price)}
              </p>
            </div>
            <div className="flex w-full gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => handleAddToCart(item)}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0"
                onClick={() => handleRemoveFromWishlist(item.id)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
