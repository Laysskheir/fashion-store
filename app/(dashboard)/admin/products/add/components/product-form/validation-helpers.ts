import { z } from 'zod';
import { ProductFormData } from './types';

export const validateProductForm = (data: ProductFormData) => {
  const errors: Record<string, string> = {};

  // Basic validation checks
  if (!data.name.trim()) errors.name = 'Product name is required';
  if (!data.slug.trim()) errors.slug = 'Product slug is required';
  if (!data.description.trim()) errors.description = 'Product description is required';
  
  // Price validation
  const basePrice = parseFloat(data.basePrice);
  if (isNaN(basePrice) || basePrice <= 0) {
    errors.basePrice = 'Valid base price is required';
  }

  // Category validation
  if (!data.categoryId) errors.categoryId = 'Category is required';

  // Image validation
  if (!data.images || data.images.length === 0) {
    errors.images = 'At least one product image is required';
  }
  
  // Check if there's a default image
  if (data.images && !data.images.some(img => img.isDefault)) {
    errors.images = 'Please select a default image';
  }

  // Variant validation
  data.variants.forEach((variant, index) => {
    const variantPrice = parseFloat(variant.price);
    
    if (!variant.name.trim()) {
      errors[`variants.${index}.name`] = 'Variant name is required';
    }
    
    if (isNaN(variantPrice) || variantPrice <= 0) {
      errors[`variants.${index}.price`] = 'Valid variant price is required';
    }
    
    if (!variant.sku.trim()) {
      errors[`variants.${index}.sku`] = 'SKU is required for each variant';
    }
  });

  // Attributes validation (optional, but ensure no empty attributes)
  if (data.attributes) {
    data.attributes = data.attributes.filter(attr => 
      attr.name.trim() !== '' || attr.value.trim() !== ''
    );
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Zod schema for additional runtime validation
export const productFormSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  slug: z.string().min(1, 'Product slug is required'),
  description: z.string().min(1, 'Product description is required'),
  basePrice: z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, 'Valid base price is required'),
  categoryId: z.string(),
  subcategoryId: z.string().optional(),
  brand: z.string().optional(),
  weight: z.string().optional(),
  dimensions: z.string().optional(),
  material: z.string().optional(),
  careInstructions: z.string().optional(),
  isActive: z.boolean().default(true),
  images: z.array(z.object({
    url: z.string(),
    isDefault: z.boolean(),
    file: z.any().optional()
  })).min(1, 'At least one image is required'),
  variants: z.array(z.object({
    name: z.string().min(1, "Variant name is required"),
    sku: z.string().optional(),
    color: z.string().min(1, "Color is required"),
    size: z.string().min(1, "Size is required"),
    price: z.string().refine(val => !isNaN(parseFloat(val)), { message: "Price must be a number" }),
    comparePrice: z.string().optional().nullable(),
    inventory: z.string().refine(val => !isNaN(parseInt(val)), { message: "Inventory must be a number" }),
    isActive: z.boolean().optional().default(true)
  })),
  attributes: z.array(z.object({
    name: z.string().optional(),
    value: z.string().optional()
  })).optional()
});