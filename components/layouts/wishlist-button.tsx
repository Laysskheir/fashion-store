"use client"

import { Heart } from "lucide-react"
import { Button } from "../ui/button"
import Link from "next/link"
import { useWishlist } from "@/hooks/use-wishlist"
import { useEffect } from "react"
import { Badge } from "../ui/badge"
import { cn } from "@/lib/utils"

export function WishlistButton({ className }: { className?: string }) {
  const wishlist = useWishlist()

  useEffect(() => {
    wishlist.loadItems()
  }, [])

  return (
    <Button
      size="icon"
      variant="ghost"
      className={cn(
        "border-l ring-0 rounded-none h-14 w-14 hidden md:flex shrink-0 relative",
        className
      )}
      aria-label="Wishlist"
      asChild
    >
      <Link href="/wishlist">
        <Heart className="w-4 h-4" />
        {wishlist.items.length > 0 && (
          <Badge 
            className="absolute top-1 right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
          >
            {wishlist.items.length}
          </Badge>
        )}
      </Link>
    </Button>
  )
}
