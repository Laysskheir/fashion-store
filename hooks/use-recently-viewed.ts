"use client";

import { useEffect } from "react";
import { ProductWithDetails } from "@/features/products/management/types/product.types";

const MAX_RECENT_PRODUCTS = 8;

export function useRecentlyViewed(product: ProductWithDetails | null) {
    useEffect(() => {
        if (!product) return;

        // Get existing recently viewed products
        const stored = localStorage.getItem("recentlyViewed");
        let recentProducts: ProductWithDetails[] = stored ? JSON.parse(stored) : [];

        // Remove the current product if it exists
        recentProducts = recentProducts.filter(p => p.id !== product.id);

        // Add the current product to the beginning
        recentProducts.unshift(product);

        // Keep only the most recent products
        recentProducts = recentProducts.slice(0, MAX_RECENT_PRODUCTS);

        // Save back to localStorage
        localStorage.setItem("recentlyViewed", JSON.stringify(recentProducts));
    }, [product]);
}
