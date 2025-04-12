import { db } from "@/lib/db";
import { sanitizeArrayOfObjects } from "@/lib/utils";

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

    // Sanitize products to convert Decimal types
    const sanitizedProducts = sanitizeArrayOfObjects(products);
    return sanitizedProducts;
  } catch (error) {
    console.error('Error fetching trending products:', error);
    return [];
  }
}
