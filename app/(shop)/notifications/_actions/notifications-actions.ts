"use server";

import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { NotificationSetting, NotificationType } from "@prisma/client";

export async function getNotifications(page = 1, pageSize = 10) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const notifications = await db.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: pageSize,
    skip: (page - 1) * pageSize,
  });

  const totalCount = await db.notification.count({
    where: { userId: session.user.id },
  });

  return { notifications, totalCount };
}

export async function markNotificationAsRead(notificationId: string) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  await db.notification.update({
    where: { id: notificationId, userId: session.user.id },
    data: { isRead: true },
  });

  revalidatePath("/notifications");
}

export async function markAllNotificationsAsRead() {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  await db.notification.updateMany({
    where: { userId: session.user.id, isRead: false },
    data: { isRead: true },
  });

  revalidatePath("/notifications");
}

export async function deleteNotification(notificationId: string) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  await db.notification.delete({
    where: { id: notificationId, userId: session.user.id },
  });

  revalidatePath("/notifications");
}

export async function getNotificationSettings() {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  let settings = await db.notificationSetting.findUnique({
    where: { userId: session.user.id },
  });

  if (!settings) {
    settings = await db.notificationSetting.create({
      data: { userId: session.user.id },
    });
  }

  return settings;
}

export async function updateNotificationSettings(
  data: Partial<NotificationSetting>
) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  await db.notificationSetting.upsert({
    where: { userId: session.user.id },
    create: { userId: session.user.id, ...data },
    update: data,
  });

  revalidatePath("/notifications");
}

export async function createNotification(
  userId: string,
  type: NotificationType,
  message: string
) {
  await db.notification.create({
    data: {
      userId,
      type,
      message,
    },
  });

  // Here you would typically trigger a real-time update to the client
  // For example, using WebSockets or Server-Sent Events
}
