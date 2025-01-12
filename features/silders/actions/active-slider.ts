"use server";

import { db } from "@/lib/db";
import { HeroSlider } from "@prisma/client";

export async function getActiveSliders(): Promise<HeroSlider[]> {
  const now = new Date();
  return await db.heroSlider.findMany({
    where: {
      isActive: true,
      startDate: { lte: now },
      endDate: { gte: now },
    },
    orderBy: { priority: "desc" },
  });
}
