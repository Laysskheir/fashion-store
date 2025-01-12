"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deleteSlider(id: string): Promise<void> {
  try {
    await db.heroSlider.delete({
      where: { id },
    });

    revalidatePath("/admin/sliders");
  } catch (error) {
    console.error("Error deleting slider:", error);
    throw new Error("Failed to delete slider");
  }
}
