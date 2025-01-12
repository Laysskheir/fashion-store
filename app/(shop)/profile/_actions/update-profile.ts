"use server";

import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

interface UpdateProfileData {
  name: string;
  email: string;
}

export async function updateProfile(data: UpdateProfileData) {
  try {
    const session = await getSession();

    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    await db.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        name: data.name,
        email: data.email,
      },
    });

    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    console.error("[PROFILE_UPDATE_ERROR]", error);
    return { error: "Something went wrong" };
  }
}
