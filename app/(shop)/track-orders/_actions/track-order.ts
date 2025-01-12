'use server'

import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function trackOrder(orderNumber: string) {
  const session = await getSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  const order = await db.order.findFirst({
    where: {
      orderNumber: orderNumber,
      userId: session.user.id,
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  return order;
}

export async function getRecentOrders() {
  const session = await getSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  return await db.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });
}

