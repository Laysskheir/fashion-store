import Link from 'next/link';
import { StarRating } from "@/components/star-rating";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/format";
import { ProductVariant } from '@/types';

interface ProductHeaderProps {
  name: string;
  selectedVariant: ProductVariant | null;
  rating: number;
  reviewCount: number;
  hasDiscount: boolean;
  discountPercentage: number;
}

export function ProductHeader({
  name,
  selectedVariant,
  rating,
  reviewCount,
  hasDiscount,
  discountPercentage
}: ProductHeaderProps) {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">{name}</h1>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {selectedVariant && (
            <>
              <p className="text-3xl font-bold tracking-tight">
                {formatPrice(selectedVariant.price)}
              </p>
              {hasDiscount && (
                <>
                  <p className="text-lg text-muted-foreground line-through">
                    {formatPrice(selectedVariant.comparePrice!)}
                  </p>
                  <Badge variant="destructive" className="text-sm">
                    Save {discountPercentage}%
                  </Badge>
                </>
              )}
            </>
          )}
        </div>
        {rating > 0 && (
          <Link href="#reviews" className="flex items-center gap-2 text-sm">
            <StarRating rating={rating} />
            <span className="text-muted-foreground">
              ({reviewCount} reviews)
            </span>
          </Link>
        )}
      </div>
    </div>
  );
}
