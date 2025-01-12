"use server";

import { db } from "@/lib/db";
import { unstable_cache } from "next/cache";
import { ProductWithDetails } from "../../types/product.types";

export const getAllProducts = unstable_cache(
    async (): Promise<ProductWithDetails[]> => {
        try {
            return await db.product.findMany({
                where: {
                    isActive: true,
                },
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
                    createdAt: "desc",
                },
            });
        } catch (error) {
            console.error("[GET_ALL_PRODUCTS]", error);
            return [];
        }
    },
    ["all-products"],
    { revalidate: 60, tags: ["products"] }
);
