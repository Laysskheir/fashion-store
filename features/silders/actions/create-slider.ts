"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { CreateSliderInput } from "../types/slider";
import { HeroSlider } from "@prisma/client";

export async function createSlider(
  data: CreateSliderInput
): Promise<HeroSlider> {
  try {
    const slider = await db.heroSlider.create({
      data: {
        ...data,
        isActive: data.isActive ?? true,
        priority: data.priority ?? 50,
        tags: data.tags ?? [],
      },
    });

    revalidatePath("/admin/sliders");
    return slider;
  } catch (error) {
    console.error("Error creating slider:", error);
    throw new Error("Failed to create slider");
  }
}
