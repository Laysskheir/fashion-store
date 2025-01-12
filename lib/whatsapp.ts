// WhatsApp Business API configuration
const WHATSAPP_BUSINESS_PHONE = process.env.WHATSAPP_BUSINESS_PHONE;
const WHATSAPP_API_KEY = process.env.WHATSAPP_API_KEY;

interface OrderDetails {
  orderNumber: string;
  customerName: string;
  total: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress: {
    address1: string;
    address2?: string;
    city: string;
    state: string;
    postalCode: string;
  };
  customerPhone: string;
}

export async function sendOrderConfirmationWhatsApp(order: OrderDetails) {
  try {
    // Format the message
    const itemsList = order.items
      .map(item => `• ${item.quantity}x ${item.name} - $${item.price}`)
      .join('\n');

    const message = `🛍️ *New Order Confirmation* #${order.orderNumber}\n\n` +
      `Dear ${order.customerName},\n\n` +
      `Thank you for your order! Here are your order details:\n\n` +
      `*Order Items:*\n${itemsList}\n\n` +
      `*Total Amount:* $${order.total}\n\n` +
      `*Delivery Address:*\n` +
      `${order.shippingAddress.address1}\n` +
      `${order.shippingAddress.address2 ? order.shippingAddress.address2 + '\n' : ''}` +
      `${order.shippingAddress.city}, ${order.shippingAddress.state}\n` +
      `${order.shippingAddress.postalCode}\n\n` +
      `*Payment Method:* Cash on Delivery\n\n` +
      `Please reply with "CONFIRM" to verify this order.\n\n` +
      `If you have any questions, feel free to reply to this message.`;

    // Send message using WhatsApp Business API
    const response = await fetch(`https://graph.facebook.com/v17.0/${WHATSAPP_BUSINESS_PHONE}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHATSAPP_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: order.customerPhone,
        type: "text",
        text: {
          body: message
        }
      })
    });

    if (!response.ok) {
      throw new Error('Failed to send WhatsApp message');
    }

    return { success: true };
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    return { success: false, error: 'Failed to send WhatsApp message' };
  }
}

export async function sendOrderToAdmin(order: OrderDetails) {
  try {
    // Format the message for admin
    const itemsList = order.items
      .map(item => `• ${item.quantity}x ${item.name} - $${item.price}`)
      .join('\n');

    const adminMessage = `🔔 *New Order Alert* #${order.orderNumber}\n\n` +
      `*Customer Details:*\n` +
      `Name: ${order.customerName}\n` +
      `Phone: ${order.customerPhone}\n\n` +
      `*Order Items:*\n${itemsList}\n\n` +
      `*Total Amount:* $${order.total}\n\n` +
      `*Delivery Address:*\n` +
      `${order.shippingAddress.address1}\n` +
      `${order.shippingAddress.address2 ? order.shippingAddress.address2 + '\n' : ''}` +
      `${order.shippingAddress.city}, ${order.shippingAddress.state}\n` +
      `${order.shippingAddress.postalCode}\n\n` +
      `*Payment Method:* Cash on Delivery\n\n` +
      `Please verify and process this order.`;

    // Send message to admin using WhatsApp Business API
    const ADMIN_PHONE = process.env.ADMIN_WHATSAPP_PHONE;
    const response = await fetch(`https://graph.facebook.com/v17.0/${WHATSAPP_BUSINESS_PHONE}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHATSAPP_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: ADMIN_PHONE,
        type: "text",
        text: {
          body: adminMessage
        }
      })
    });

    if (!response.ok) {
      throw new Error('Failed to send WhatsApp message to admin');
    }

    return { success: true };
  } catch (error) {
    console.error('Error sending WhatsApp message to admin:', error);
    return { success: false, error: 'Failed to send WhatsApp message to admin' };
  }
}
