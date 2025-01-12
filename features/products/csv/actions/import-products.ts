"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { importProductsSchema } from "@/lib/validators/product";
import { ImportedProduct, type ImportResponse } from "@/types";
import { Prisma } from "@prisma/client";

export async function importProducts(
  products: ImportedProduct[]
): Promise<ImportResponse> {
  try {
    // Validate products against schema
    const validatedProducts = importProductsSchema.parse(products);

    const results = {
      success: true,
      totalProcessed: products.length,
      successCount: 0,
      failedCount: 0,
      errors: [] as Array<{ row: number; message: string }>,
    };

    // Get all unique category slugs from the products
    const categorySlugs = [...new Set(validatedProducts.map(p => p.categoryId))];

    // Pre-fetch all needed categories
    const categories = await db.category.findMany({
      where: {
        slug: {
          in: categorySlugs
        }
      },
      select: {
        id: true,
        slug: true
      }
    });

    // Create a map of slug to ID for quick lookup
    const categoryMap = new Map(categories.map(c => [c.slug, c.id]));

    // Validate that all required categories exist
    const missingCategories = categorySlugs.filter(slug => !categoryMap.has(slug));
    if (missingCategories.length > 0) {
      throw new Error(`Categories not found: ${missingCategories.join(', ')}`);
    }

    // Process in smaller batches to prevent timeouts
    const batchSize = 25;
    for (let i = 0; i < validatedProducts.length; i += batchSize) {
      const batch = validatedProducts.slice(i, i + batchSize);

      try {
        await db.$transaction(async (tx) => {
          for (let index = 0; index < batch.length; index++) {
            const product = batch[index];
            const currentRow = i + index + 1;

            try {
              // Get category ID from our pre-fetched map
              const categoryId = categoryMap.get(product.categoryId);
              if (!categoryId) {
                throw new Error(`Category with slug "${product.categoryId}" not found`);
              }

              // Check if product exists (by slug)
              const existing = await tx.product.findUnique({
                where: { slug: product.slug },
              });

              const productData = {
                name: product.name,
                description: product.description,
                basePrice: new Prisma.Decimal(product.basePrice),
                brand: product.brand,
                weight: product.weight ? parseFloat(product.weight) : null,
                dimensions: product.dimensions,
                material: product.material,
                careInstructions: product.careInstructions,
                isActive: product.isActive ?? false,
                categoryId: categoryId,
              };

              if (existing) {
                // Update existing product
                await tx.product.update({
                  where: { id: existing.id },
                  data: productData,
                });
              } else {
                // Create new product
                await tx.product.create({
                  data: {
                    ...productData,
                    slug: product.slug,
                  },
                });
              }

              results.successCount++;
            } catch (error) {
              results.failedCount++;
              results.errors.push({
                row: currentRow,
                message: error instanceof Error ? error.message : 'Unknown error occurred',
              });
            }
          }
        });
      } catch (error) {
        // Handle batch transaction error
        results.failedCount += batch.length;
        results.errors.push({
          row: i + 1,
          message: `Batch processing error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        });
      }
    }

    // Revalidate products page
    revalidatePath("/admin/products");

    return {
      ...results,
      success: results.failedCount === 0,
    };
  } catch (error) {
    return {
      success: false,
      totalProcessed: products.length,
      successCount: 0,
      failedCount: products.length,
      errors: [{
        row: 0,
        message: error instanceof Error ? error.message : 'Invalid data format',
      }],
    };
  }
}
