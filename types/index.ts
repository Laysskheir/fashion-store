import { ProductImage, Variant } from "@prisma/client";

// types/index.ts
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number;
  brand?: string;
  inventory: number;
  isActive: boolean;
  category: Category;
  variants: ProductVariant[];
  images: ProductImage[];
  attributes: ProductAttribute[];
}
export type ProductWithRelations = Product & {
  images: ProductImage[];
  variants: Variant[];
  category: Category;
}
export interface ProductVariant {
  id: string;
  sku: string;
  price: number | null;
  inventory: number;
  options: VariantOption[];
}

export interface VariantOption {
  id: string;
  name: string;
  value: string;
}

export interface ProductAttribute {
  id: string;
  name: string;
  value: string;
}



export interface ProductFilter {
  categoryId?: string;
  brands?: string[];
  minPrice?: number;
  maxPrice?: number;
  colors?: string[];
}

export interface Category {
  id: string;
  name: string;
  level: number;
  children?: Category[];
}

export type ImportedProduct = Omit<Product, "id" | "createdAt" | "updatedAt">;

export type ImportResponse = {
  success: boolean;
  totalProcessed: number;
  successCount: number;
  failedCount: number;
  errors: Array<{
    row: number;
    message: string;
  }>;
};



export interface Address {
  id: string;
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}

export interface ShippingFormData {
  firstName: string;
  lastName: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  company?: string;
}


