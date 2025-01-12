"use server";

import { db } from "@/lib/db";
import { HeroSlider } from "@prisma/client";
import { unstable_cache } from "next/cache";

export const getAllSliders = unstable_cache(
  async (): Promise<HeroSlider[]> => {
    return await db.heroSlider.findMany({
      orderBy: { priority: "desc" },
    });
  },
  ["all-sliders"],
  { revalidate: 3600, tags: ["sliders"] }
);
