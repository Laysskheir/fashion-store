"use server";

import { db } from "@/lib/db";
import { ProductFilter } from "@/types";
import { unstable_cache } from "next/cache";
import { Product, CartItem, Variant } from "@prisma/client";

// Cache the getProducts function with a key based on the filter parameters
export const getProducts = unstable_cache(
  async (filter: ProductFilter & { sort?: string }) => {
    try {
      const where = {
        AND: [
          { isActive: true },
          // Filter by category
          filter.categoryId ? { categoryId: filter.categoryId } : {},
          // Filter by brands
          filter.brands?.length ? { brand: { in: filter.brands } } : {},
          // Filter by price range
          filter.minPrice || filter.maxPrice
            ? {
              OR: [
                {
                  basePrice: {
                    gte: filter.minPrice ?? undefined,
                    lte: filter.maxPrice ?? undefined,
                  },
                },
                {
                  variants: {
                    some: {
                      price: {
                        gte: filter.minPrice ?? undefined,
                        lte: filter.maxPrice ?? undefined,
                      },
                    },
                  },
                },
              ],
            }
            : {},
          // Filter by stock
          filter.inStock
            ? {
              OR: [
                { variants: { some: { inventory: { gt: 0 } } } },
              ],
            }
            : {},
          // Filter by attributes
          filter.attributes && filter.attributes.length > 0
            ? {
              variants: {
                some: {
                  attributes: {
                    some: {
                      name: { in: filter.attributes.map((a) => a.name) },
                      value: { in: filter.attributes.map((a) => a.value) },
                    },
                  },
                },
              },
            }
            : {},
        ],
      };

      // Determine sorting logic
      const orderBy = (() => {
        switch (filter.sort) {
          case "newest":
            return [{ createdAt: "desc" }];
          case "popular":
            return [{ variants: { some: { salesCount: "desc" } } }];
          case "rating":
            return [{ variants: { some: { averageRating: "desc" } } }];
          case "price-asc":
            return [{ basePrice: "asc" }];
          case "price-desc":
            return [{ basePrice: "desc" }];
          default:
            return [{ createdAt: "desc" }];
        }
      })();

      const products = await db.product.findMany({
        where,
        include: {
          images: true,
          variants: true,
          category: true,
        },
        orderBy,
        take: filter.limit ?? 12,
        skip: filter.offset ?? 0,
      });

      return products;
    } catch (error) {
      console.error("[PRODUCTS_GET]", error);
      throw new Error("Failed to fetch products");
    }
  },
  ["products"],
  { revalidate: 60 } // Cache for 60 seconds
);

export async function getFilters() {
  try {
    const [categories, products] = await Promise.all([
      db.category.findMany({
        where: { isActive: true },
        include: { children: true },
      }),
      db.product.findMany({
        select: {
          brand: true,
          basePrice: true,
          variants: {
            select: {
              color: true,
              size: true,
            },
          },
        },
      }),
    ]);

    // Get unique brands
    const brands = Array.from(
      new Set(products.map((p) => p.brand).filter(Boolean) as string[])
    ).sort();

    // Get price range
    const prices = products.flatMap((p) => [
      Number(p.basePrice),
      ...p.variants.map((v) => Number(v.price)),
    ]);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    // Get unique colors
    const colors = Array.from(
      new Set(products.flatMap((p) => p.variants.map((v) => v.color).filter(Boolean)))
    ).sort();

    return {
      categories,
      brands,
      priceRange: { min: minPrice, max: maxPrice },
      colors, // Add colors to the return object
    };
  } catch (error) {
    console.error("[FILTERS_GET]", error);
    throw new Error("Failed to fetch filters");
  }
}

export async function getRecommendedProducts(
  cartItems: (CartItem & { product: Product; variant: Variant | null })[],
  currentProductId?: string
): Promise<Product[]> {
  if (!cartItems.length) return [];

  const cartProductIds = cartItems.map(item => item.productId).filter(Boolean);
  const excludeProductIds = currentProductId
    ? [...cartProductIds, currentProductId]
    : cartProductIds;

  const categoryIds = [...new Set(cartItems.map(item => item.product.categoryId))];
  const prices = cartItems.map(item => Number(item.variant?.price || item.product.basePrice));
  const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;

  const priceRange = {
    min: avgPrice * 0.7,
    max: avgPrice * 1.3,
  };

  const recommendations = await db.product.findMany({
    where: {
      AND: [
        { categoryId: { in: categoryIds } },
        { basePrice: { gte: priceRange.min, lte: priceRange.max } },
        excludeProductIds.length ? { id: { notIn: excludeProductIds } } : {},
        { isActive: true },
      ],
    },
    include: {
      images: {
        take: 1,
        orderBy: {
          sortOrder: 'asc'
        }
      },
      variants: {
        where: { isActive: true },
        take: 1
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 3,
  });

  return recommendations;
}