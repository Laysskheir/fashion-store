import { db } from "@/lib/db";

export const getLook = async (id: string) => {
  try {
    const look = await db.look.findUnique({
      where: {
        id,
        isActive: true,
      },
      include: {
        products: {
          include: {
            product: {
              include: {
                images: true,
                category: true,
              },
            },
          },
        },
      },
    });

    return look;
  } catch (error) {
    console.error("[LOOK_GET]", error);
    return null;
  }
};
