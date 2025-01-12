"use server";

import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { ShippingFormData } from "@/types";

export async function saveAddress(data: ShippingFormData) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    const address = await db.address.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        company: data.company,
        address1: data.address1,
        address2: data.address2,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        country: data.country,
        phone: data.phone,
        userId: session.user.id,
        isDefault: false,
      },
    });

    return { address };
  } catch (error) {
    console.error('Error saving address:', error);
    return { error: "Failed to save address" };
  }
}
