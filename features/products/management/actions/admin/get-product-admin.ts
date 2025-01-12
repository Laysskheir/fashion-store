"use server";

import { db } from "@/lib/db";
import { ProductWithDetails } from "../../types/product.types";

// Dashboard version without caching - used in admin pages
export const getProduct = async (slug: string): Promise<ProductWithDetails | null> => {
    return await db.product.findUnique({
        where: { slug },
        include: {
            images: true,
            variants: true,
            category: true, // Include category for admin view
            reviews: {
                include: {
                    user: {
                        select: {
                            name: true,
                            image: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            },
        },
    });
};