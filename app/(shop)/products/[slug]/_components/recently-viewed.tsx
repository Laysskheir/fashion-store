"use client";

import { useEffect, useState } from "react";
import { ProductWithDetails } from "@/features/products/management/types/product.types";
import { ProductCard } from "@/components/product-card";

interface RecentlyViewedProps {
    currentProductId?: string;
}

export function RecentlyViewed({ currentProductId }: RecentlyViewedProps) {
    const [recentProducts, setRecentProducts] = useState<ProductWithDetails[]>([]);

    useEffect(() => {
        // Get recently viewed products from localStorage
        const getRecentlyViewed = () => {
            const stored = localStorage.getItem("recentlyViewed");
            if (stored) {
                const products = JSON.parse(stored) as ProductWithDetails[];
                // Filter out the current product if it exists
                return currentProductId 
                    ? products.filter(p => p.id !== currentProductId)
                    : products;
            }
            return [];
        };

        setRecentProducts(getRecentlyViewed());
    }, [currentProductId]);

    if (recentProducts.length === 0) return null;

    return (
        <section className="space-y-10">
            <div className="border-t pt-8 flex justify-center flex-col text-center gap-4">
                <h2 className="text-3xl font-bold tracking-tight">Recently Viewed</h2>
                <p className="text-muted-foreground">
                    Explore your recently viewed items, blending quality and style for a refined living experience.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {recentProducts.slice(0, 4).map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </section>
    );
}
