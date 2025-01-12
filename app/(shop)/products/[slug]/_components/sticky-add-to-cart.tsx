import Image from 'next/image';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { ProductWithDetails } from "@/features/products/management/types/product.types";
import { Variant } from '@prisma/client';

interface StickyAddToCartProps {
  show: boolean;
  product: ProductWithDetails;
  selectedVariant: Variant | null;
  onVariantChange: (variant: Variant) => void;
  onAddToCart: () => void;
  isLoading: boolean;
}

export function StickyAddToCart({
  show,
  product,
  selectedVariant,
  onVariantChange,
  onAddToCart,
  isLoading
}: StickyAddToCartProps) {
  if (!show || !selectedVariant) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 border-t border-muted shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
        {/* Product Info */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="w-12 h-12 relative rounded-lg overflow-hidden flex-shrink-0 bg-muted">
            <Image
              src={product.images[0]?.url || '/placeholder.png'}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <h3 className="text-sm font-medium truncate">{product.name}</h3>
            <p className="text-base font-semibold">
              {formatPrice(Number(selectedVariant.price))}
            </p>
          </div>
        </div>

        {/* Variant Selection and Action */}
        <div className="flex items-center gap-3 flex-1 justify-end">
          <div className="text-sm font-medium">
            {selectedVariant.color} / {selectedVariant.size}
          </div>

          <Button 
            onClick={onAddToCart}
            disabled={isLoading || !selectedVariant || selectedVariant.inventory === 0}
            size="default"
            className="w-[140px] font-medium"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <ShoppingCart className="h-4 w-4 mr-2" />
                {selectedVariant.inventory === 0 ? 'Out of Stock' : 'Add to Cart'}
              </>
            )}
          </Button>
        </div>
      </div>
      {/* Safe area spacing for mobile devices */}
      <div className="h-safe-area-bottom bg-background" />
    </div>
  );
}
