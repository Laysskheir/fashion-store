import { z } from "zod";

// Zod schema for form validation

export const sliderSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be 100 characters or less"),
  subtitle: z.string().max(200, "Subtitle must be 200 characters or less").optional(),
  imageUrl: z.string().refine((val) => {
    // Allow both valid URLs and our temporary upload state
    return val === "pending-upload" || z.string().url().safeParse(val).success;
  }, "Must be a valid URL"),
  linkUrl: z.string().url("Must be a valid URL").optional(),
  buttonText: z.string().max(50, "Button text must be 50 characters or less").optional(),
  isActive: z.boolean(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  priority: z.number().int().min(1).max(100),
  tags: z.array(z.string()),
})

export const formProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(1, "Description is required"),
  basePrice: z.string().min(1, "Base price is required"),
  categoryId: z.string(),
  subcategoryId: z.string().optional().nullable(),
  brand: z.string().min(1, "Brand is required"),
  weight: z.union([z.string(), z.number()]).optional().nullable().transform(val => 
    val ? String(val) : null
  ),
  dimensions: z.string().optional().nullable(),
  material: z.string().optional().nullable(),
  careInstructions: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
  images: z.array(z.object({
    url: z.string(),
    isDefault: z.boolean().optional().default(false),
    file: z.any().optional()
  })).default([]),
  variants: z.array(
    z.object({
      name: z.string().min(1, "Variant name is required"),
      sku: z.string().optional(),
      color: z.string().min(1, "Color is required"),
      size: z.string().min(1, "Size is required"),
      price: z.string().refine(val => !isNaN(parseFloat(val)), { message: "Price must be a number" }),
      comparePrice: z.string().optional().nullable(),
      inventory: z.string().refine(val => !isNaN(parseInt(val)), { message: "Inventory must be a number" }),
      isActive: z.boolean().optional().default(true),
    })
  ),
  attributes: z.array(z.object({
    name: z.string().optional(),
    value: z.string().optional()
  })).optional().default([])
}).superRefine((data, ctx) => {
  // Custom validation for images
  if (data.images.length === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "At least one image is required",
      path: ["images"]
    });
  }

  // Custom validation for variants
  if (data.variants.length === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "At least one variant is required",
      path: ["variants"]
    });
  }

  // Validate that at least one image is marked as default
  if (!data.images.some(img => img.isDefault)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "One image must be marked as default",
      path: ["images"]
    });
  }
});

export const mainCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  image: z.string().optional(),
  isActive: z.boolean(),
  type: z.enum(["PRODUCT", "COLLECTION", "ACCESSORY"]),
});

export const subCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  image: z.string().optional(),
  isActive: z.boolean(),
  type: z.enum(["PRODUCT", "COLLECTION", "ACCESSORY"]),
  parentId: z.string().min(1, "Parent category is required"),
});