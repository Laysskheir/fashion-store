import { db } from "@/lib/db";
import { sanitizeArrayOfObjects } from '@/lib/utils';

export async function getPopularPicksProducts() {
  try {
    // Get products with their relations and order history
    const products = await db.product.findMany({
      where: {
        isActive: true,
      },
      include: {
        images: true,
        variants: true,
        category: true,
        // orderItems: {
        //   where: {
        //     order: {
        //       createdAt: {
        //         // Only consider orders from the last 30 days
        //         gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        //       }
        //     }
        //   },
        //   select: {
        //     quantity: true,
        //   },
        // },
      },
    });

    // Sanitize products to convert Decimal types
    const sanitizedProducts = sanitizeArrayOfObjects(products);

    return sanitizedProducts;

  } catch (error) {
    console.error('Error fetching popular picks products:', error);
    return [];
  }
}