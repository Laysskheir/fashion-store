import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash, ShoppingCart } from 'lucide-react';

interface WishListProps {
  wishlistItems: {
    id: string;
    product: {
      id: string;
      name: string;
      basePrice: number;
      images: { url: string }[];
    };
  }[];
}

export default function WishList({ wishlistItems }: WishListProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-semibold">My Wishlist</h3>
      {wishlistItems.length === 0 ? (
        <p className="text-muted-foreground">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {wishlistItems.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle className="text-lg">{item.product.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-square relative mb-2">
                  <Image
                    src={item.product.images[0]?.url || '/placeholder.png'}
                    alt={item.product.name}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-md"
                  />
                </div>
                <p className="font-semibold">{formatPrice(item.product.basePrice)}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm">
                  <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                </Button>
                <Button variant="destructive" size="sm">
                  <Trash className="mr-2 h-4 w-4" /> Remove
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

