'use server';

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { format } from 'date-fns';

import { db } from "@/lib/db";
import { ActionResponse } from "@/types/action-response";

// Input validation schemas
const OrderActionSchema = z.object({
  orderId: z.string().cuid()
});

// Utility function for consistent error handling
async function executeServerAction<T>(
  action: () => Promise<T>
): Promise<ActionResponse<T>> {
  try {
    const result = await action();
    return { 
      success: true, 
      data: result 
    };
  } catch (error) {
    console.error('Server Action Error:', error);
    return {
      success: false,
      error: error instanceof Error 
        ? error.message 
        : 'An unexpected error occurred'
    };
  }
}

// Utility function to truncate text
function truncateText(text: string, maxLength: number = 30): string {
  return text.length > maxLength 
    ? text.substring(0, maxLength - 3) + '...' 
    : text;
}

// PDF Generation Helper Function with multi-page support
async function generateMultiPageInvoice(order: any): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  
  // Load fonts
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const timesRomanBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

  // Colors
  const BLACK = rgb(0, 0, 0);
  const GRAY = rgb(0.6, 0.6, 0.6);

  // Create first page
  const createPage = () => {
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    return { page, width, height };
  };

  let { page, width, height } = createPage();
  
  // Margins and Layout
  const MARGIN_LEFT = 50;
  const MARGIN_TOP = height - 50;
  const LINE_HEIGHT = 20;
  const MAX_ITEMS_PER_PAGE = 15;

  // Helper function to draw text safely
  const safeDrawText = (text: string, x: number, y: number, size: number, font: PDFFont, color: RGB, maxY?: number) => {
    const safeY = maxY ? Math.max(Math.min(y, maxY), 50) : Math.max(y, 50);
    try {
      page.drawText(text, { x, y: safeY, size, font, color });
    } catch (error) {
      console.error(`Error drawing text: ${text}`, error);
    }
  };

  // Header function
  const drawHeader = () => {
    // Invoice header
    safeDrawText('INVOICE', width - 250, MARGIN_TOP, 24, timesRomanBoldFont, BLACK, height - 50);

    // Company details
    safeDrawText('Your Company Name', MARGIN_LEFT, MARGIN_TOP - LINE_HEIGHT, 12, timesRomanFont, GRAY, height - 100);

    // Order details
    safeDrawText(`Order #: ${order.orderNumber}`, MARGIN_LEFT, MARGIN_TOP - (2 * LINE_HEIGHT), 12, timesRomanFont, BLACK, height - 150);
    safeDrawText(`Date: ${format(order.createdAt, 'PPP')}`, MARGIN_LEFT, MARGIN_TOP - (3 * LINE_HEIGHT), 12, timesRomanFont, BLACK, height - 200);

    // Customer details
    safeDrawText('Bill To:', MARGIN_LEFT, MARGIN_TOP - (4 * LINE_HEIGHT), 12, timesRomanBoldFont, BLACK, height - 250);
    safeDrawText(`${order.user.name}`, MARGIN_LEFT, MARGIN_TOP - (5 * LINE_HEIGHT), 10, timesRomanFont, BLACK, height - 300);

    if (order.address) {
      safeDrawText(`${order.address.street}`, MARGIN_LEFT, MARGIN_TOP - (6 * LINE_HEIGHT), 10, timesRomanFont, BLACK, height - 350);
      safeDrawText(`${order.address.city}, ${order.address.state} ${order.address.postalCode}`, MARGIN_LEFT, MARGIN_TOP - (7 * LINE_HEIGHT), 10, timesRomanFont, BLACK, height - 400);
    }

    // Table headers
    const tableStartY = MARGIN_TOP - (8 * LINE_HEIGHT);
    safeDrawText('Product', MARGIN_LEFT, tableStartY, 12, timesRomanBoldFont, BLACK, height - 450);
    safeDrawText('Quantity', 300, tableStartY, 12, timesRomanBoldFont, BLACK, height - 450);
    safeDrawText('Price', 400, tableStartY, 12, timesRomanBoldFont, BLACK, height - 450);
    safeDrawText('Total', 500, tableStartY, 12, timesRomanBoldFont, BLACK, height - 450);

    return tableStartY - LINE_HEIGHT;
  };

  // Draw order items
  let yOffset = drawHeader();
  order.items.forEach((item: any, index: number) => {
    // Create new page if needed
    if (index > 0 && index % MAX_ITEMS_PER_PAGE === 0) {
      ({ page, width, height } = createPage());
      yOffset = drawHeader();
    }

    const itemY = yOffset - (index % MAX_ITEMS_PER_PAGE * LINE_HEIGHT);
    
    safeDrawText(
      truncateText(`${item.variant.product.name} - ${item.variant.name}`), 
      MARGIN_LEFT, 
      itemY, 
      10, 
      timesRomanFont, 
      BLACK, 
      height - 500
    );
    safeDrawText(`${item.quantity}`, 300, itemY, 10, timesRomanFont, BLACK, height - 500);
    safeDrawText(`$${item.variant.price}`, 400, itemY, 10, timesRomanFont, BLACK, height - 500);
    safeDrawText(`$${(item.quantity * Number(item.variant.price))}`, 500, itemY, 10, timesRomanFont, BLACK, height - 500);
  });

  // Totals section
  let totalY = yOffset - ((order.items.length % MAX_ITEMS_PER_PAGE) * LINE_HEIGHT) - LINE_HEIGHT;
  
  safeDrawText('Subtotal:', 400, totalY, 12, timesRomanFont, BLACK, height - 600);
  safeDrawText(`$${order.subtotal}`, 500, totalY, 12, timesRomanFont, BLACK, height - 600);

  totalY -= LINE_HEIGHT;
  safeDrawText('Tax:', 400, totalY, 12, timesRomanFont, BLACK, height - 650);
  safeDrawText(`$${order.tax}`, 500, totalY, 12, timesRomanFont, BLACK, height - 650);

  totalY -= LINE_HEIGHT;
  safeDrawText('Shipping:', 400, totalY, 12, timesRomanFont, BLACK, height - 700);
  safeDrawText(`$${order.shipping}`, 500, totalY, 12, timesRomanFont, BLACK, height - 700);

  totalY -= LINE_HEIGHT;
  safeDrawText('Total:', 400, totalY, 14, timesRomanBoldFont, BLACK, height - 750);
  safeDrawText(`$${order.total}`, 500, totalY, 14, timesRomanBoldFont, BLACK, height - 750);

  // Save PDF
  return await pdfDoc.save();
}

export async function cancelOrder(orderId: string): Promise<ActionResponse<boolean>> {
  return executeServerAction(async () => {
    // Validate input
    const { orderId: validatedOrderId } = OrderActionSchema.parse({ orderId });

    // Check if order exists and is cancellable
    const order = await db.order.findUnique({
      where: { 
        id: validatedOrderId, 
        status: 'PENDING' 
      }
    });

    if (!order) {
      throw new Error('Order not found or cannot be cancelled');
    }

    // Start transaction
    const result = await db.$transaction(async (tx) => {
      // Update order status
      await tx.order.update({
        where: { id: validatedOrderId },
        data: { 
          status: 'CANCELLED',
          cancelledAt: new Date(),
          updatedAt: new Date()
        }
      });

      // Restore variant inventory
      const orderItems = await tx.orderItem.findMany({
        where: { orderId: validatedOrderId },
        include: { variant: true }
      });

      for (const item of orderItems) {
        await tx.variant.update({
          where: { id: item.variantId! },
          data: { 
            inventory: { increment: item.quantity }
          }
        });
      }

      return true;
    });

    // Revalidate the orders page
    revalidatePath('/dashboard/admin/orders');

    return result;
  });
}

export async function downloadInvoice(orderId: string): Promise<ActionResponse<{
  filename: string;
  pdfBytes: Uint8Array;
}>> {
  return executeServerAction(async () => {
    console.log('Starting downloadInvoice with orderId:', orderId);

    try {
      // Validate input
      const { orderId: validatedOrderId } = OrderActionSchema.parse({ orderId });
      console.log('Validated orderId:', validatedOrderId);

      // Fetch complete order details
      const order = await db.order.findUnique({
        where: { id: validatedOrderId },
        include: {
          items: {
            include: {
              variant: {
                include: { 
                  product: true 
                }
              }
            }
          },
          user: true,
          address: true,
          payment: true,
          coupon: true
        }
      });

      console.log('Order fetched:', JSON.stringify(order, null, 2));

      if (!order) {
        console.error('Order not found for ID:', validatedOrderId);
        throw new Error('Order not found');
      }

      // Generate PDF
      const pdfBytes = await generateMultiPageInvoice(order);

      console.log('PDF generated successfully');

      return {
        filename: `invoice_${order.orderNumber}.pdf`,
        pdfBytes
      };
    } catch (error) {
      console.error('Detailed error in downloadInvoice:', error);
      throw error;
    }
  });
}