import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function calculateProductMetrics() {
  console.log("Starting product metrics calculation...")

  try {
    // Log total number of products, order items, and reviews
    const productCount = await prisma.product.count()
    const orderItemCount = await prisma.orderItem.count()
    const reviewCount = await prisma.review.count()

    console.log(`Total Products: ${productCount}`)
    console.log(`Total Order Items: ${orderItemCount}`)
    console.log(`Total Reviews: ${reviewCount}`)

    // If no order items or reviews, skip calculation
    if (orderItemCount === 0 && reviewCount === 0) {
      console.log("No order items or reviews found. Skipping metrics calculation.")
      return
    }

    // Calculate total sales
    const salesMetrics = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: {
        quantity: true
      }
    })

    console.log(`Sales Metrics Entries: ${salesMetrics.length}`)

    // Calculate average ratings
    const ratingMetrics = await prisma.review.groupBy({
      by: ['productId'],
      _avg: {
        rating: true
      },
      where: {
        rating: { not: undefined }
      }
    })

    console.log(`Rating Metrics Entries: ${ratingMetrics.length}`)

    // Batch update products
    const updates = salesMetrics.map(async (salesMetric) => {
      const ratingMetric = ratingMetrics.find(
        r => r.productId === salesMetric.productId
      )

      return prisma.product.update({
        where: { id: salesMetric.productId },
        data: {
          totalSales: salesMetric._sum.quantity || 0,
          averageRating: ratingMetric?._avg.rating 
            ? Number(ratingMetric._avg.rating.toFixed(2)) 
            : 0
        }
      })
    })

    await Promise.all(updates)

    console.log(`Updated metrics for ${updates.length} products`)
  } catch (error) {
    console.error("Error calculating product metrics:", error)
  } finally {
    await prisma.$disconnect()
  }
}

// If this file is run directly (for testing)
if (require.main === module) {
  calculateProductMetrics()
    .then(() => console.log("Metrics calculation complete"))
    .catch(console.error)
}