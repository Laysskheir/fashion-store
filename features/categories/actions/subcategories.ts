"use server";

import { db } from "@/lib/db";
import { Category } from "@prisma/client";
import { revalidatePath, unstable_cache } from "next/cache";

export const getSubCategory = unstable_cache(
  async () => {
    return await db.category.findMany({
      where: {
        level: 1,
      },
      include: {
        parent: true,
      },
      orderBy: {
        name: "asc"
      }
    });
  },
  ["subcategories"],
  { revalidate: 3600, tags: ["subcategories"] }
);

export async function createSubCategory(data: Category) {
  try {
    const category = await db.category.create({
      data: {
        ...data,
        level: 1,
      },
    });

    revalidatePath("/admin/categories");
    return category;
  } catch (error) {
    console.error("[SubCategory_CREATE]", error);
    throw new Error("Internal error");
  }
}
