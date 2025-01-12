import Stripe from 'stripe';
import PayPal from 'paypal-rest-sdk';

type ConnectionResult = {
  success: boolean;
  message: string;
}

export async function testGatewayConnection(
  type: string, 
  apiKey: string
): Promise<ConnectionResult> {
  try {
    switch (type.toLowerCase()) {
      case 'stripe':
        return await testStripeConnection(apiKey);
      case 'paypal':
        return await testPayPalConnection(apiKey);
      default:
        return { 
          success: false, 
          message: 'Unsupported payment gateway' 
        };
    }
  } catch (error) {
    console.error(`Connection test error for ${type}:`, error);
    return { 
      success: false, 
      message: 'Connection test failed' 
    };
  }
}

async function testStripeConnection(apiKey: string): Promise<ConnectionResult> {
  const stripe = new Stripe(apiKey, { apiVersion: '2023-10-16' });
  
  try {
    // Attempt to retrieve account information
    await stripe.accounts.retrieve();
    return { 
      success: true, 
      message: 'Stripe connection successful' 
    };
  } catch (error) {
    return { 
      success: false, 
      message: 'Invalid Stripe API key' 
    };
  }
}

async function testPayPalConnection(apiKey: string): Promise<ConnectionResult> {
  return new Promise((resolve) => {
    PayPal.configure({
      'mode': 'sandbox', // or 'live'
      'client_id': apiKey.split(':')[0],
      'client_secret': apiKey.split(':')[1]
    });

    PayPal.generate_token((error) => {
      if (error) {
        resolve({ 
          success: false, 
          message: 'PayPal connection failed' 
        });
      } else {
        resolve({ 
          success: true, 
          message: 'PayPal connection successful' 
        });
      }
    });
  });
}