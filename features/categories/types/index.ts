import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  image: z.string().optional(),
  isActive: z.boolean().default(true),
  parentId: z.string().optional(),
});

export type CategoryFormData = z.infer<typeof categorySchema>;

export interface CategoryWithRelations extends CategoryFormData {
  id: string;
  level: number;
  createdAt: Date;
  updatedAt: Date;
  parent?: CategoryWithRelations | null;
  children?: CategoryWithRelations[];
  _count?: {
    products: number;
  };
}
