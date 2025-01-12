"use client";

import { ProductWithDetails } from "@/features/products/management/types/product.types";
import { ProductCard } from "@/components/product-card";


interface SimilarProductsProps {
    products: ProductWithDetails[];
}

export function SimilarProducts({ products }: SimilarProductsProps) {

    if (products.length === 0) return null;

    return (
        <section className="space-y-10">
            <div className="border-t pt-8 flex justify-center flex-col text-center gap-4">
                <h2 className="text-3xl font-bold tracking-tight ">People Also Bought</h2>
                <p className="text-muted-foreground">
                    Here's some of our most similar products people are buying. Click to discover trending style.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </section>
    );
}
