"use server";

import { db } from "@/lib/db";
import { Category } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { categorySchema, type CategoryFormData } from "../types";

class CategoryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CategoryError";
  }
}

export const getCategories = async () => {
  try {
    const categories = await db.category.findMany({
      where: {
        level: 0,
      },
      include: {
        parent: true,
        children: {
          include: {
            _count: {
              select: {
                products: true,
              },
            },
          },
        },
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: [
        {
          name: "asc",
        },
      ],
    });

    return categories;
  } catch (error) {
    console.error("[CATEGORIES_GET]", error);
    throw new CategoryError("Failed to fetch categories");
  }
};

export const getCategory = async (slug: string) => {
  try {
    const category = await db.category.findUnique({
      where: { slug },
      include: {
        parent: true,
        children: {
          include: {
            _count: {
              select: {
                products: true,
              },
            },
          },
        },
        products: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!category) {
      throw new CategoryError("Category not found");
    }

    return category;
  } catch (error) {
    console.error("[CATEGORY_GET]", error);
    if (error instanceof CategoryError) throw error;
    throw new CategoryError("Failed to fetch category");
  }
};

export async function createCategory(data: CategoryFormData) {
  try {
    const validatedData = categorySchema.parse(data);

    // Check if slug is unique
    const existingCategory = await db.category.findUnique({
      where: { slug: validatedData.slug },
    });

    if (existingCategory) {
      throw new CategoryError("A category with this slug already exists");
    }

    // If parentId is provided, verify parent exists and is a main category
    if (validatedData.parentId) {
      const parent = await db.category.findUnique({
        where: { id: validatedData.parentId },
      });

      if (!parent) {
        throw new CategoryError("Parent category not found");
      }

      if (parent.level !== 0) {
        throw new CategoryError("Parent category must be a main category");
      }
    }

    const category = await db.category.create({
      data: {
        ...validatedData,
        level: validatedData.parentId ? 1 : 0,
      },
    });

    revalidatePath("/admin/categories");
    return category;
  } catch (error) {
    console.error("[CATEGORY_CREATE]", error);
    if (error instanceof CategoryError) throw error;
    throw new CategoryError("Failed to create category");
  }
}

export async function updateCategory(categoryId: string, data: Partial<CategoryFormData>) {
  try {
    const existingCategory = await db.category.findUnique({
      where: { id: categoryId },
      include: {
        children: true,
      },
    });

    if (!existingCategory) {
      throw new CategoryError("Category not found");
    }

    const validatedData = categorySchema.partial().parse(data);

    // Check slug uniqueness if it's being updated
    if (validatedData.slug && validatedData.slug !== existingCategory.slug) {
      const slugExists = await db.category.findUnique({
        where: { slug: validatedData.slug },
      });

      if (slugExists) {
        throw new CategoryError("A category with this slug already exists");
      }
    }

    // Validate parent change
    if (validatedData.parentId) {
      // Prevent self-reference
      if (validatedData.parentId === categoryId) {
        throw new CategoryError("Category cannot be its own parent");
      }

      const parent = await db.category.findUnique({
        where: { id: validatedData.parentId },
      });

      if (!parent) {
        throw new CategoryError("Parent category not found");
      }

      if (parent.level !== 0) {
        throw new CategoryError("Parent category must be a main category");
      }

      // If category has children, it cannot become a subcategory
      if (existingCategory.children.length > 0) {
        throw new CategoryError("Cannot make a category with subcategories into a subcategory");
      }
    }

    const category = await db.category.update({
      where: { id: categoryId },
      data: {
        ...validatedData,
        level: validatedData.parentId ? 1 : 0,
      },
    });

    revalidatePath("/admin/categories");
    return category;
  } catch (error) {
    console.error("[CATEGORY_UPDATE]", error);
    if (error instanceof CategoryError) throw error;
    throw new CategoryError("Failed to update category");
  }
}

export async function deleteCategory(categoryId: string) {
  try {
    const category = await db.category.findUnique({
      where: { id: categoryId },
      include: {
        children: true,
        products: {
          select: { id: true },
        },
      },
    });

    if (!category) {
      throw new CategoryError("Category not found");
    }

    // Check if category has children or products
    if (category.children.length > 0) {
      throw new CategoryError("Cannot delete category with subcategories");
    }

    if (category.products.length > 0) {
      throw new CategoryError("Cannot delete category with products");
    }

    await db.category.delete({
      where: { id: categoryId },
    });

    revalidatePath("/admin/categories");
  } catch (error) {
    console.error("[CATEGORY_DELETE]", error);
    if (error instanceof CategoryError) throw error;
    throw new CategoryError("Failed to delete category");
  }
}


export async function toggleCategoryStatus(categoryId: string) {
  try {
    const category = await db.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new CategoryError("Category not found");
    }

    await db.category.update({
      where: { id: categoryId },
      data: { isActive: !category.isActive },
    });

    revalidatePath("/admin/categories");
  } catch (error) {
    console.error("[CATEGORY_TOGGLE]", error);
    if (error instanceof CategoryError) throw error;
    throw new CategoryError("Failed to toggle category status");
  }
}
