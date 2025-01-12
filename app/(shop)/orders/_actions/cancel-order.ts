'use server';

import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function cancelOrder(orderId: string) {
  try {
    const session = await getSession();
    
    if (!session) {
      throw new Error('Unauthorized');
    }

    const order = await db.order.findUnique({
      where: { 
        id: orderId,
        userId: session.user.id,
        status: 'PROCESSING'
      }
    });

    if (!order) {
      throw new Error('Order not found or cannot be cancelled');
    }

    // Update order status to CANCELLED with cancellation details
    await db.order.update({
      where: { id: orderId },
      data: { 
        status: 'CANCELLED',
        cancelledAt: new Date(),
        cancelReason: 'User initiated cancellation'
      }
    });

    return { 
      success: true, 
      message: 'Order successfully cancelled' 
    };
  } catch (error) {
    console.error('Order cancellation error:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'An unexpected error occurred' 
    };
  }
}