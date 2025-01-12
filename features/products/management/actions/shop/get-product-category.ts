"use server";

import { db } from "@/lib/db";
import { unstable_cache } from "next/cache";
import { ProductWithDetails } from "../../types/product.types";

export const getProductsByCategory = unstable_cache(
    async (categorySlug: string): Promise<ProductWithDetails[]> => {
        try {
            return await db.product.findMany({
                where: {
                    isActive: true,
                    category: {
                        slug: categorySlug
                    }
                },
                include: {
                    images: true,
                    variants: true,
                    reviews: {
                        include: {
                            user: {
                                select: {
                                    name: true,
                                    image: true
                                }
                            }
                        }
                    },
                    category: true
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
        } catch (error) {
            console.error("[GET_PRODUCTS_BY_CATEGORY]", error);
            return [];
        }
    },
    ["products-by-category"],
    { revalidate: 60, tags: ["products"] }
);
