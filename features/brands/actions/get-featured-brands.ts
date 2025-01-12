import { db } from "@/lib/db";

export async function getFeaturedBrands() {
  try {
    const brands = await db.brand.findMany({

      take: 8,
      orderBy: {
        createdAt: 'desc'
      }
    });

    return brands.map(brand => ({
      ...brand,
      productCount: brand._count.products
    }));
  } catch (error) {
    console.error('Error fetching featured brands:', error);
    return [];
  }
}
