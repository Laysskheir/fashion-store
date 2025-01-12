import { Product, ProductImage, Variant, Review } from '@prisma/client';

export interface CreateProductData {
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  categoryId: string;
  brand?: string;
  weight?: number | null;
  dimensions?: string;
  material?: string;
  careInstructions?: string;
  isActive: boolean;
  images: { url: string; isDefault: boolean }[];
  variants: {
    name: string;
    sku: string;
    color: string;
    size: string;
    price: number;
    comparePrice?: number | null;
    inventory: number;
  }[];
}

type ReviewWithUser = Review & {
  user: {
    name: string;
    image: string | null;
  };
};

export type ProductWithDetails = Product & {
  images: ProductImage[];
  variants: Variant[];
  reviews: ReviewWithUser[];
};
