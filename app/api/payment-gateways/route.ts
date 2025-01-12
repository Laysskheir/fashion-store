import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { encryptApiKey, validateApiKey } from '@/lib/security/encryption';
import { testGatewayConnection } from '@/app/(dashboard)/admin/integrations/payments/payment-validators';

// Input validation schema
const PaymentGatewaySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  type: z.enum(['STRIPE', 'PAYPAL', 'SQUARE', 'BRAINTREE', 'CUSTOM']),
  apiKey: z.string().min(10, "API Key must be valid"),
  isLive: z.boolean(),
  webhookSecret: z.string().optional()
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = PaymentGatewaySchema.parse(body);

    // Validate API key format
    if (!validateApiKey(validatedData.type, validatedData.apiKey)) {
      return NextResponse.json({ 
        error: 'Invalid API key format' 
      }, { status: 400 });
    }

    // Test gateway connection
    const connectionResult = await testGatewayConnection(
      validatedData.type, 
      validatedData.apiKey
    );

    if (!connectionResult.success) {
      return NextResponse.json({ 
        error: connectionResult.message 
      }, { status: 400 });
    }

    // Encrypt API key before storing
    const encryptedApiKey = encryptApiKey(validatedData.apiKey);

    // Create gateway in database
    const newGateway = await db.paymentGateway.create({
      data: {
        ...validatedData,
        apiKeyHash: encryptedApiKey,
        status: connectionResult.success 
          ? 'CONNECTED' 
          : 'ERROR'
      }
    });

    return NextResponse.json(newGateway, { status: 201 });
  } catch (error) {
    console.error('Payment Gateway Creation Error:', error);
    return NextResponse.json({ 
      error: 'Failed to create payment gateway' 
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Fetch all payment gateways, excluding sensitive information
    const gateways = await db.paymentGateway.findMany({
      select: {
        id: true,
        name: true,
        type: true,
        isLive: true,
        status: true
      }
    });

    return NextResponse.json(gateways);
  } catch (error) {
    console.error('Error fetching payment gateways:', error);
    return NextResponse.json({ 
      error: 'Failed to retrieve payment gateways' 
    }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const validatedData = PaymentGatewaySchema.parse(body);

    // Validate API key format
    if (!validateApiKey(validatedData.type, validatedData.apiKey)) {
      return NextResponse.json({ 
        error: 'Invalid API key format' 
      }, { status: 400 });
    }

    // Test gateway connection
    const connectionResult = await testGatewayConnection(
      validatedData.type, 
      validatedData.apiKey
    );

    // Encrypt API key before storing
    const encryptedApiKey = encryptApiKey(validatedData.apiKey);

    // Update gateway in database
    const updatedGateway = await db.paymentGateway.update({
      where: { id: body.id },
      data: {
        ...validatedData,
        apiKeyHash: encryptedApiKey,
        status: connectionResult.success 
          ? 'CONNECTED' 
          : 'ERROR'
      }
    });

    return NextResponse.json(updatedGateway);
  } catch (error) {
    console.error('Payment Gateway Update Error:', error);
    return NextResponse.json({ 
      error: 'Failed to update payment gateway' 
    }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const gatewayId = searchParams.get('id');

    if (!gatewayId) {
      return NextResponse.json({ 
        error: 'Gateway ID is required' 
      }, { status: 400 });
    }

    // Delete gateway from database
    await db.paymentGateway.delete({
      where: { id: gatewayId }
    });

    return NextResponse.json({ 
      message: 'Payment gateway deleted successfully' 
    });
  } catch (error) {
    console.error('Payment Gateway Deletion Error:', error);
    return NextResponse.json({ 
      error: 'Failed to delete payment gateway' 
    }, { status: 500 });
  }
}