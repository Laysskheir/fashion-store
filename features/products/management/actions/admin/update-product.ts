"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { slugify } from "@/lib/utils";
import { ProductFormData } from "@/app/(dashboard)/admin/products/add/components/product-form/types";

export async function updateProduct(id: string, data: ProductFormData) {
  try {
    console.log("Updating product with data:", { id, data });
    
    // Generate slug if not provided
    const slug = data.slug || slugify(data.name);

    // Generate SKU if not provided
    const generateSku = (productName: string, variantName: string, existingSku?: string) => {
      // If an existing SKU is provided, return it
      if (existingSku) {
        return existingSku;
      }

      // Extract first letters and capitalize
      const skuPrefix = productName
        .split(' ')
        .map(word => word.charAt(0).toUpperCase())
        .join('');
      
      // Extract variant details
      const variantDetails = variantName
        .split('/')
        .map(detail => detail.trim().charAt(0).toUpperCase())
        .join('');
      
      // Generate a 3-digit sequential number (001-999)
      const sequenceNumber = Math.floor(Math.random() * 900 + 100).toString();
      
      // Combine parts
      return `${skuPrefix}-${variantDetails}-${sequenceNumber}`;
    };

    // First, find the existing product to get its ID
    const existingProduct = await db.product.findUnique({
      where: { id },
      include: {
        images: true,
        variants: true
      }
    });

    if (!existingProduct) {
      throw new Error("Product not found");
    }

    // Prepare final form data
    const finalData = {
      name: data.name.trim(),
      slug: slug,
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
        deleteMany: {},
        createMany: {
          data: data.images.map((image) => ({
            url: image.url,
            isDefault: image.isDefault,
          })),
        },
      },
      variants: {
        deleteMany: {},
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
      // attributes: {
      //   deleteMany: {},
      //   createMany: {
      //     data: data.attributes
      //       .filter(attr => attr.name.trim() !== '' || attr.value.trim() !== '')
      //       .map(attr => ({
      //         name: attr.name.trim(),
      //         value: attr.value.trim(),
      //       })),
      //   },
      // },
    };

    // Update the product
    const product = await db.product.update({
      where: { id },
      data: finalData,
      include: {
        images: true,
        variants: true,
        category: true,
      }
    });

    console.log("Product updated successfully:", product);

    revalidatePath("/admin/products");
    revalidatePath(`/products/${product.slug}`);

    return {
      success: true,
      data: product,
    };
  } catch (error) {
    console.error("[UPDATE_PRODUCT]", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update product",
    };
  }
}
