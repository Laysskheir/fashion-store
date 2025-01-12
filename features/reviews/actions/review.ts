"use server";

import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

interface CreateReviewData {
    productId: string;
    rating: number;
    title: string;
    comment: string;
}

export async function createReview(data: CreateReviewData) {
    try {
        const session = await getSession();

        if (!session?.user) {
            throw new Error("Unauthorized");
        }

        const product = await db.product.findUnique({
            where: { id: data.productId },
        });

        const review = await db.review.create({
            data: {
                ...data,
                userId: session.user.id,
                isVerified: false, // Reviews start as unverified
            },
        });

        // Revalidate the product page to show the new review
        revalidatePath(`/products/${product?.slug}`);

        return { success: true, review };
    } catch (error) {
        console.error("[REVIEW_CREATE]", error);
        throw error;
    }
}

export async function getProductReviews(productId: string) {
    try {
        const reviews = await db.review.findMany({
            where: {
                productId,
                isVerified: true,
            },
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
        });

        return reviews;
    } catch (error) {
        console.error("[REVIEWS_GET]", error);
        throw error;
    }
}
