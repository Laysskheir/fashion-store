"use server";

import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function getCheckoutData() {
  try {
    const session = await getSession();
    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    const addresses = await db.address.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        isDefault: 'desc',
      },
    });

    const defaultAddress = addresses.find(addr => addr.isDefault);

    return {
      addresses,
      defaultAddress,
      user: {
        email: session.user.email,
        name: session.user.name,
      }
    };
  } catch (error) {
    console.error('Error getting checkout data:', error);
    return { error: "Failed to load checkout data" };
  }
}
