"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { CreateSliderInput } from "../types/slider";
import { HeroSlider } from "@prisma/client";

export async function updateSlider(
  id: string,
  data: Partial<CreateSliderInput>
): Promise<HeroSlider> {
  try {
    const updatedSlider = await db.heroSlider.update({
      where: { id },
      data,
    });

    revalidatePath("/admin/sliders");
    return updatedSlider;
  } catch (error) {
    console.error("Error updating slider:", error);
    throw new Error("Failed to update slider");
  }
}
