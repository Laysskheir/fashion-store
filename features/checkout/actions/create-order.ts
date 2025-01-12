"use server";

import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { ShippingFormData } from "@/types";
import { generateOrderNumber } from "@/lib/utils";
import { sendOrderConfirmationWhatsApp, sendOrderToAdmin } from "@/lib/whatsapp";

interface CreateOrderParams {
  items: {
    productId: string;
    variantId?: string;
    quantity: number;
    price: number;
    name: string;
  }[];
  addressId: string;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

export async function createOrder(data: CreateOrderParams) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    // Get the address details for WhatsApp message
    const address = await db.address.findUnique({
      where: { id: data.addressId }
    });

    if (!address) {
      return { error: "Invalid address" };
    }

    const orderNumber = generateOrderNumber();

    const order = await db.order.create({
      data: {
        orderNumber,
        userId: session.user.id,
        addressId: data.addressId,
        status: "PENDING",
        subtotal: data.subtotal,
        tax: data.tax,
        shipping: data.shipping,
        total: data.total,
        items: {
          create: data.items.map(item => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            price: item.price,
            total: item.price * item.quantity,
          }))
        },
        payment: {
          create: {
            amount: data.total,
            provider: "CASH_ON_DELIVERY",
            status: "PENDING"
          }
        }
      },
      include: {
        items: true,
        address: true,
        payment: true,
      }
    });

    // Send WhatsApp notifications
    const orderDetails = {
      orderNumber,
      customerName: `${address.firstName} ${address.lastName}`,
      total: data.total,
      items: data.items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      shippingAddress: {
        address1: address.address1,
        address2: address.address2,
        city: address.city,
        state: address.state,
        postalCode: address.postalCode
      },
      customerPhone: address.phone || ''
    };

    // Send notifications asynchronously
    Promise.all([
      sendOrderConfirmationWhatsApp(orderDetails),
      sendOrderToAdmin(orderDetails)
    ]).catch(error => {
      console.error('Error sending WhatsApp notifications:', error);
    });

    return { order };
  } catch (error) {
    console.error('Error creating order:', error);
    return { error: "Failed to create order" };
  }
}
