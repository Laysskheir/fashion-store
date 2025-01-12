"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { slugify } from "@/lib/utils";
import * as z from "zod";
import { formProductSchema } from "@/schemas";

function generateSku(baseName: string, variantName: string, sku?: string): string {
  return sku || `${baseName}-${variantName}`.toLowerCase().replace(/[^a-z0-9]/g, '-');
}

export async function createProduct(data: z.infer<typeof formProductSchema>) {
  try {
    // Validate image URLs before creating product
    if (!data.images || data.images.length === 0) {
      return { success: false, error: "At least one image is required" };
    }

    // Validate variants
    if (!data.variants || data.variants.length === 0) {
      return { success: false, error: "At least one variant is required" };
    }

    // Check if any variant SKU already exists
    for (const variant of data.variants) {
      const existingVariant = await db.variant.findUnique({
        where: { sku: variant.sku }
      });

      if (existingVariant) {
        return {
          success: false,
          error: `A variant with SKU "${variant.sku}" already exists. Please use unique SKUs.`
        };
      }
    }

    // Generate unique slug if not provided
    let finalSlug = data.slug || slugify(data.name);
    const existingProduct = await db.product.findUnique({
      where: { slug: finalSlug }
    });

    if (existingProduct) {
      // Append a random string to make the slug unique
      const randomString = Math.random().toString(36).substring(2, 7);
      finalSlug = `${finalSlug}-${randomString}`;
    }

    // Create product with variants in a transaction
    const finalData = {
      name: data.name.trim(),
      slug: finalSlug,
      description: data.description.trim(),
      basePrice: parseFloat(data.basePrice),
      category: {
        connect: { id: data.categoryId }
      },
      ...(data.subcategoryId ? { 
        subcategory: {
          connect: { id: data.subcategoryId }
        }
      } : {}),
      brand: data.brand.trim(),
      weight: data.weight ? parseFloat(data.weight) : null,
      dimensions: data.dimensions?.trim() || null,
      material: data.material?.trim() || null,
      careInstructions: data.careInstructions?.trim() || null,
      isActive: data.isActive ?? true,
      images: {
        createMany: {
          data: data.images.map((image) => ({
            url: image.url,
            alt: data.name,
            isDefault: image.isDefault,
          })),
        },
      },
      variants: {
        createMany: {
          data: data.variants.map((variant) => ({
            name: variant.name,
            sku: generateSku(data.name, variant.name, variant.sku),
            color: variant.color,
            size: variant.size,
            price: parseFloat(variant.price),
            comparePrice: variant.comparePrice ? parseFloat(variant.comparePrice) : null,
            inventory: parseInt(variant.inventory, 10) || 0,
            isActive: variant.isActive ?? true,
          })),
        },
      },
    };

    const product = await db.product.create({
      data: finalData,
    });

    revalidatePath("/admin/products");
    return { success: true, data: product };

  } catch (error) {
    console.error("Failed to create product:", error);
    return {
      success: false,
      error: "Failed to create product. Please try again."
    };
  }
}
