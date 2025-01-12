"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Star, MessageSquare, AlertCircle, CheckCircle, Loader, User2, PencilLine } from "lucide-react";
import { Review } from "@prisma/client";
import { useSession } from "@/lib/auth-client";
import { createReview } from "@/features/reviews/actions/review";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

interface ReviewWithUser extends Review {
    user: {
        name: string | null;
        image: string | null;
    };
}

interface ProductReviewsProps {
    productId: string;
    reviews?: ReviewWithUser[];
}

const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(new Date(date));
};

const MotionCard = motion(Card);

export function ProductReviews({ productId, reviews = [] }: ProductReviewsProps) {
    const { data: session } = useSession();
    const [isAddingReview, setIsAddingReview] = useState(false);
    const [rating, setRating] = useState(5);
    const [title, setTitle] = useState("");
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Calculate review statistics
    const averageRating = reviews.length > 0
        ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
        : "0.0";

    const ratingDistribution = Array(5).fill(0).map((_, index) => {
        const count = reviews.filter(review => review.rating === 5 - index).length;
        const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
        return { stars: 5 - index, count, percentage };
    });

    // Render star rating
    const renderStars = (rating: number, interactive = false) => {
        return Array(5).fill(0).map((_, index) => (
            <Star
                key={index}
                className={`h-5 w-5 ${index < rating
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300'} ${interactive ? 'cursor-pointer transition-colors hover:text-yellow-400' : ''
                    }`}
                onClick={interactive ? () => setRating(index + 1) : undefined}
            />
        ));
    };

    const handleSubmitReview = async () => {
        if (!session) {
            toast.error("You must be signed in to leave a review.");
            return;
        }

        try {
            setIsSubmitting(true);
            await createReview({
                productId,
                rating,
                title,
                comment,
            });

            toast.success("Your review has been submitted for approval.");

            setIsAddingReview(false);
            setRating(5);
            setTitle("");
            setComment("");
        } catch (error: any) {
            toast.error("Failed to submit review. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-8 mt-16">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Rating Summary */}
                <div className="w-full lg:w-1/3 space-y-6">
                    <div className="text-center lg:text-left p-6 bg-background rounded-lg border">
                        <div className="flex items-baseline justify-center lg:justify-start gap-2">
                            <h3 className="text-4xl font-bold">{averageRating}</h3>
                            <span className="text-sm text-muted-foreground">out of 5</span>
                        </div>
                        <div className="flex justify-center lg:justify-start gap-1 my-3">
                            {renderStars(Number(averageRating))}
                        </div>
                        <p className="text-sm text-muted-foreground flex items-center justify-center lg:justify-start gap-2">
                            <MessageSquare className="h-4 w-4" />
                            {reviews.length} reviews
                        </p>
                    </div>

                    {/* Rating Distribution */}
                    <div className="space-y-3 p-6 bg-background rounded-lg border">
                        <h4 className="font-medium mb-4">Rating Distribution</h4>
                        {ratingDistribution.map(({ stars, count, percentage }) => (
                            <div key={stars} className="flex items-center gap-3">
                                <div className="flex items-center gap-1 w-16">
                                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                    <span className="text-sm">{stars}</span>
                                </div>
                                <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${percentage}%` }}
                                        transition={{ duration: 0.5, ease: "easeOut" }}
                                        className="h-full bg-primary"
                                    />
                                </div>
                                <span className="text-sm text-muted-foreground w-12 text-right">
                                    {count}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Reviews List */}
                <div className="flex-1 space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-semibold">Customer Reviews</h3>
                        <Dialog open={isAddingReview} onOpenChange={setIsAddingReview}>
                            <DialogTrigger asChild>
                                <Button className="gap-2">
                                    <PencilLine className="h-4 w-4" />
                                    Write a Review
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px]">
                                <DialogHeader>
                                    <DialogTitle>Write a Review</DialogTitle>
                                    <DialogDescription>
                                        Share your thoughts about this product with other customers.
                                    </DialogDescription>
                                </DialogHeader>
                                {session ? (
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Rating</label>
                                            <div className="flex gap-1">
                                                {renderStars(rating, true)}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Title</label>
                                            <Input
                                                placeholder="Summarize your experience"
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Review</label>
                                            <Textarea
                                                placeholder="What did you like or dislike? What did you use this product for?"
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                                rows={4}
                                            />
                                        </div>
                                        <Button
                                            className="w-full"
                                            onClick={handleSubmitReview}
                                            disabled={!title || !comment || isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                                                    Submitting...
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle className="mr-2 h-4 w-4" />
                                                    Submit Review
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="text-center py-6">
                                        <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
                                        <p className="mt-4 text-lg font-medium">Please sign in to write a review</p>
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            Your review helps other shoppers make better decisions
                                        </p>
                                        <Button
                                            className="mt-6"
                                            size="lg"
                                            onClick={() => window.location.href = "/auth/signin"}
                                        >
                                            Sign In to Continue
                                        </Button>
                                    </div>
                                )}
                            </DialogContent>
                        </Dialog>
                    </div>

                    <ScrollArea className="h-[600px] pr-6">
                        <div className="space-y-6">
                            {reviews.length > 0 ? (
                                reviews.map((review, index) => (
                                    <MotionCard
                                        key={review.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="p-6 space-y-4"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex gap-3">
                                                <Avatar className="h-10 w-10">
                                                    <AvatarImage src={review.user.image || undefined} />
                                                    <AvatarFallback>
                                                        <User2 className="h-5 w-5" />
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-medium">
                                                            {review.user.name || "Anonymous"}
                                                        </p>
                                                        <Badge variant={"success"} className="text-xs">
                                                            Verified Purchase
                                                        </Badge>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">
                                                        {formatDate(review.createdAt)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex gap-1">
                                                {renderStars(review.rating)}
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-medium mb-2">{review.title}</h4>
                                            <p className="text-muted-foreground">{review.comment}</p>
                                        </div>
                                    </MotionCard>
                                ))
                            ) : (
                                <div className="text-center py-12">
                                    <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
                                    <h4 className="mt-4 text-lg font-medium">No Reviews Yet</h4>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        Be the first to review this product
                                    </p>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </div>
    );
}
