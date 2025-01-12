"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { getSession } from "@/lib/auth"

export async function getWishlistItems() {
  const session = await getSession()

  if (!session?.user) {
    throw new Error("Unauthorized")
  }

  try {
    const items = await db.wishlistItem.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            description: true,
            basePrice: true,
            images: true,
            slug: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return items
  } catch (error) {
    console.error("[WISHLIST_GET]", error)
    throw new Error("Failed to fetch wishlist items")
  }
}

export async function addToWishlist(productId: string) {
  const session = await getSession()
  
  if (!session?.user) {
    throw new Error("Unauthorized")
  }

  try {
    const existingItem = await db.wishlistItem.findFirst({
      where: {
        productId,
        userId: session.user.id,
      },
    })

    if (existingItem) {
      throw new Error("Item already in wishlist")
    }

    await db.wishlistItem.create({
      data: {
        productId,
        userId: session.user.id,
      },
    })

    revalidatePath("/wishlist")
    return { success: true }
  } catch (error) {
    console.error("[WISHLIST_ADD]", error)
    throw error
  }
}

export async function removeFromWishlist(itemId: string) {
  const session = await getSession()
  
  if (!session?.user) {
    throw new Error("Unauthorized")
  }

  try {
    await db.wishlistItem.delete({
      where: {
        id: itemId,
        userId: session.user.id,
      },
    })

    revalidatePath("/wishlist")
    return { success: true }
  } catch (error) {
    console.error("[WISHLIST_REMOVE]", error)
    throw error
  }
}
