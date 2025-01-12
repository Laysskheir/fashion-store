"use server";

import { db } from "@/lib/db";
import { ProductWithDetails } from "../../types/product.types";

export async function getAllProducts(): Promise<ProductWithDetails[]> {
    try {
        return await db.product.findMany({
            include: {
                images: true,
                variants: true,
                category: true,
                reviews: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                image: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                isActive: "desc",
            },
        });
    } catch (error) {
        console.error("[GET_ALL_PRODUCTS]", error);
        return [];
    }
}
