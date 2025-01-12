"use server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function getAddresses() {
  try {
    const user = await getSession();
    if (!user) {
      throw new Error("Unauthorized");
    }

    const addresses = await db.address.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        isDefault: 'desc',
      },
    });

    return { addresses };
  } catch (error) {
    return { error: "Failed to fetch addresses" };
  }
}
