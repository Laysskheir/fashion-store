"use server";

import { db } from "@/lib/db";
import { unstable_cache } from "next/cache";
import { ProductWithDetails } from "../../types/product.types";

export const getSaleProducts = unstable_cache(
    async (): Promise<ProductWithDetails[]> => {
        const currentDate = new Date();

        return await db.product.findMany({
            where: {
                isActive: true,
                variants: {
                    some: {
                        comparePrice: {
                            not: null,
                            gt: 0,
                        },
                    },
                },
            },
            include: {
                images: true,
                variants: true,
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
                category: true,
            },
            orderBy: [
                {
                    variants: {
                        _count: "desc"
                    },
                },
            ],
        });
    },
    ["sale-products"],
    { revalidate: 60, tags: ["products"] }
);
