import { db } from "@/lib/db";

export async function getTrendingProducts() {
  try {
    const products = await db.product.findMany({
      where: {
        isActive: false,
      },
      include: {
        category: true,
        images: true,
      },
      take: 6,
      orderBy: {
        createdAt: 'desc'
      }
    });

    return products;
  } catch (error) {
    console.error('Error fetching trending products:', error);
    return [];
  }
}
