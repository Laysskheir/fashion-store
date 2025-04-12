"use server";

import { db } from "@/lib/db";
import { unstable_cache } from "next/cache";
import { ProductWithDetails } from "../../types/product.types";
import { sanitizeDecimalFields } from "@/lib/utils";

export const getShopProduct = unstable_cache(
    async (slug: string): Promise<ProductWithDetails | null> => {
        try {
            const product = await db.product.findUnique({
                where: {
                    slug,
                    isActive: true,
                },
                include: {
                    images: {
                        select: {
                            id: true,
                            url: true,
                            alt: true,
                        },
                        take: 4, // Limit number of images
                    },
                    variants: {
                        select: {
                            id: true,
                            color: true,
                            size: true,
                            price: true,
                            inventory: true,
                            sku: true,
                        },
                    },
                    category: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    reviews: {
                        take: 5, // Limit number of reviews
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    name: true,
                                    image: true,
                                },
                            },
                        },
                    },
                },
            });

            // Sanitize product to convert Decimal types
            return product ? sanitizeDecimalFields(product) : null;
        } catch (error) {
            console.error("[GET_PRODUCT]", error);
            return null;
        }
    },
    ["shop-product"],
    { revalidate: 60, tags: ["products"] }
);
