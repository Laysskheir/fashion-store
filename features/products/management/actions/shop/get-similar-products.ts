"use server";

import { db } from "@/lib/db";
import { unstable_cache } from "next/cache";
import { ProductWithDetails } from "../../types/product.types";

export const getSimilarProducts = unstable_cache(
    async (productId: string): Promise<ProductWithDetails[]> => {
        return await db.product.findMany({
            where: {
                isActive: true,
                NOT: {
                    id: productId,
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
            },
            orderBy: [
                {
                    reviews: {
                        _count: "desc",
                    },
                },
                {
                    createdAt: "desc",
                },
            ],
            take: 4,
        });
    },
    ["similar-products"],
    { revalidate: 3600, tags: ["products"] }
);
