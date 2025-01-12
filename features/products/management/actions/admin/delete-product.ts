"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

export async function deleteProduct(productId: string) {
    try {
        // Delete all related records and the product in a transaction
        await db.$transaction(async (tx) => {
            // Delete product images
            await tx.productImage.deleteMany({
                where: { productId },
            });

            // Delete variants
            await tx.variant.deleteMany({
                where: { productId },
            });

            // Delete cart items
            await tx.cartItem.deleteMany({
                where: { productId },
            });

            // Delete wishlist items
            await tx.wishlistItem.deleteMany({
                where: { productId },
            });

            // Delete order items
            await tx.orderItem.deleteMany({
                where: { productId },
            });

            // Delete reviews
            await tx.review.deleteMany({
                where: { productId },
            });

            // Delete look products
            await tx.lookProduct.deleteMany({
                where: { productId },
            });

            // Finally delete the product
            await tx.product.delete({
                where: { id: productId },
            });
        });

        revalidatePath("/admin/products");
        return { success: true };
    } catch (error) {
        console.error("[DELETE_PRODUCT]", error);
        return {
            success: false,
            error: "Failed to delete product",
        };
    }
}