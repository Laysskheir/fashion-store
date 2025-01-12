"use client";

import { ProductCard } from "@/components/product-card";
import { Product, ProductImage, Variant } from "@prisma/client";

interface ProductWithRelations extends Product {
  images: ProductImage[];
  variants: Variant[];
  category: { name: string };
}

export function ProductGrid({ products }: { products: ProductWithRelations[] }) {
  if (!products?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-lg text-muted-foreground">No products found</p>
        <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6">
      {products.map((product) => {
        const defaultImage = product.images.find((img) => img.isDefault) || product.images[0];
        const defaultVariant = product.variants[0];

        return (
          <ProductCard
            key={product.id}
            product={product}
            defaultImage={defaultImage}
            defaultVariant={defaultVariant}
          />
        );
      })}
    </div>
  );
}