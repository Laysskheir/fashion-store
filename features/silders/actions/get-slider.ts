import { db } from "@/lib/db";

export async function getSlider(id: string) {
  try {
    const slider = await db.heroSlider.findUnique({
      where: {
        id,
      },
    });

    return slider;
  } catch (error) {
    console.error("Error getting slider:", error);
    return null;
  }
}
