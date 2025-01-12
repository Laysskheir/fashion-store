import React from 'react';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { formatPrice, formatDate } from '@/lib/utils';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import OrderCard from './_components/order-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Package } from 'lucide-react';
import { cancelOrder } from './_actions/cancel-order';



export default async function OrdersPage() {
  const session = await getSession();

  if (!session) {
    redirect('/auth/signin');
  }

  try {
    const orders = await db.order.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: {
                  where: { isDefault: true },
                  take: 1
                }
              }
            },
            variant: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return (
      <ErrorBoundary fallback={
        <Card className="mx-auto max-w-2xl">
          <CardContent className="pt-6">
            <h1 className="text-2xl font-bold text-destructive text-center">
              Something went wrong while loading your orders
            </h1>
            <p className="text-center mt-2">Please try again later or contact support</p>
          </CardContent>
        </Card>
      }>
        <div className="container mx-auto px-4 py-8">
          <Card className="mb-8 bg-primary text-primary-foreground">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center">My Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-center opacity-90">
                Track, manage, and relive your shopping journey.
              </p>
            </CardContent>
          </Card>

          {orders.length === 0 ? (
            <Card className="shadow-lg rounded-lg p-8 text-center max-w-md mx-auto bg-secondary/10">
              <CardContent className="flex flex-col items-center">
                <div className="relative w-48 h-48 mb-6">
                  <Image 
                    src="/empty-orders.svg" 
                    alt="No orders" 
                    layout="fill"
                    className="object-contain"
                  />
                  <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse"></div>
                </div>
                <h3 className="text-2xl font-bold mb-2 text-primary">Your Order History is Empty</h3>
                <p className="text-muted-foreground mb-6">Start your shopping adventure and watch this space come to life!</p>
                <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300">
                  <Link href="/shop">
                    <ShoppingBag className="mr-2 h-5 w-5" /> Discover Products
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {orders.map((order) => (
                <OrderCard 
                  key={order.id} 
                  order={{ ...order, formattedDate: formatDate(order.createdAt) }}
                  cancelOrder={cancelOrder}
                />
              ))}
            </div>
          )}
        </div>
      </ErrorBoundary>
    );
  } catch (error) {
    console.error('Orders page error:', error);
    return (
      <Card className="mx-auto max-w-2xl">
        <CardContent className="pt-6">
          <h1 className="text-2xl font-bold text-destructive text-center">
            Unable to Load Orders
          </h1>
          <p className="text-center mt-2">We're experiencing technical difficulties. Please try again later.</p>
        </CardContent>
      </Card>
    );
  }
}
