import { db } from "@/lib/db";
import { unstable_cache } from "next/cache";

export const getLooks = unstable_cache(
  async () => {
    try {
      const looks = await db.look.findMany({
        where: {
          isActive: true,
        },
        include: {
          products: {
            include: {
              product: {
                include: {
                  category: true,
                  images: true,
                },
              },
            },
          },
        },
      });

      return looks;
    } catch (error) {
      console.error("[LOOKS_GET]", error);
      throw new Error("Failed to fetch looks");
    }
  },
  ["looks"],
  { revalidate: 3600 }
);
