import { db } from "@/lib/db";

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

    // Clean up the response by removing orderItems
    return products;

  } catch (error) {
    console.error('Error fetching popular picks products:', error);
    return [];
  }
}