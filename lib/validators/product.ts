// lib/validators/product.ts
import { z } from "zod"

export const variantSchema = z.object({
  name: z.string(),
  sku: z.string().min(1),
  color: z.string().min(1),
  size: z.string().min(1),
  price: z.union([z.string(), z.number()]).transform((val) => 
    typeof val === 'string' ? parseFloat(val) : val
  ),
  comparePrice: z.union([z.string(), z.number()]).transform((val) => 
    val ? (typeof val === 'string' ? parseFloat(val) : val) : null
  ).optional().nullable(),
  inventory: z.union([z.string(), z.number()]).transform((val) => 
    typeof val === 'string' ? parseInt(val) : val
  ),
})

export const formProductSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string(),
  basePrice: z.union([z.string(), z.number()]).transform((val) => 
    typeof val === 'string' ? parseFloat(val) : val
  ),
  isActive: z.union([z.boolean(), z.string()]).transform((val) =>
    typeof val === 'string' ? val.toLowerCase() === 'true' : val
  ).default(false),
  brand: z.string().min(1),
  weight: z.union([z.string(), z.number()]).transform((val) =>
    val ? (typeof val === 'string' ? parseFloat(val) : val) : null
  ).optional(),
  dimensions: z.string().optional(),
  material: z.string().optional(),
  careInstructions: z.string().optional(),
  categoryId: z.string().min(1),
  images: z.array(z.object({
    url: z.string(),
    file: z.any().optional(),
    isDefault: z.boolean().default(false)
  })).default([]),
  variants: z.array(variantSchema).default([]),
})

export const importProductSchema = formProductSchema.omit({ 
  images: true, 
  variants: true 
})

export const importProductsSchema = z.array(importProductSchema)

// Helper function to generate slug from name
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}
