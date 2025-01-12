import { Review } from '@prisma/client';
import { Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ReviewsProps {
  reviews: (Review & { product: { name: string } })[];
}

export default function Reviews({ reviews }: ReviewsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-semibold">My Reviews</h3>
      {reviews.length === 0 ? (
        <p className="text-muted-foreground">You haven't written any reviews yet.</p>
      ) : (
        reviews.map((review) => (
          <Card key={review.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{review.product.name}</span>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <h4 className="font-semibold">{review.title}</h4>
              <p className="text-muted-foreground">{review.comment}</p>
              <p className="text-sm text-muted-foreground mt-2">
                Posted on {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}

