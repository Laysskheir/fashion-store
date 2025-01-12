import { db } from "@/lib/db";
import ReviewsPage from "./_components/reviews-page";

export default async function Page() {
    const reviews = await db.review.findMany({
        orderBy: {
            createdAt: "desc"
        }
    });

    return (
        <ReviewsPage reviews={reviews} />
    );
}