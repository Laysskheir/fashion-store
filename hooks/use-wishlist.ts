"use client"

import { create } from "zustand"
import { toast } from "sonner"
import { addToWishlist, removeFromWishlist, getWishlistItems } from "@/features/wishlist/actions/wishlist"
import { useEffect } from "react"

interface WishlistStore {
  items: any[]
  isLoading: boolean
  addItem: (productId: string) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  loadItems: () => Promise<void>
}

export const useWishlist = create<WishlistStore>((set) => ({
  items: [],
  isLoading: false,
  loadItems: async () => {
    try {
      const items = await getWishlistItems()
      set({ items })
    } catch (error) {
      console.error("Failed to load wishlist items:", error)
    }
  },
  addItem: async (productId: string) => {
    try {
      set({ isLoading: true })
      await addToWishlist(productId)
      const items = await getWishlistItems()
      set({ items })
      toast.success("Added to wishlist!")
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Unauthorized") {
          toast.error("Please sign in to add items to your wishlist")
        } else if (error.message === "Item already in wishlist") {
          toast.info("Item is already in your wishlist")
        } else {
          toast.error("Failed to add item to wishlist")
        }
      }
      throw error
    } finally {
      set({ isLoading: false })
    }
  },
  removeItem: async (itemId: string) => {
    try {
      set({ isLoading: true })
      await removeFromWishlist(itemId)
      const items = await getWishlistItems()
      set({ items })
      toast.success("Removed from wishlist!")
    } catch (error) {
      if (error instanceof Error && error.message === "Unauthorized") {
        toast.error("Please sign in to manage your wishlist")
      } else {
        toast.error("Failed to remove item from wishlist")
      }
      throw error
    } finally {
      set({ isLoading: false })
    }
  },
}))
