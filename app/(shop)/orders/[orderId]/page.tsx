import React from 'react';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { notFound, redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { formatDate, formatPrice } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Package, Truck, Calendar } from 'lucide-react';
import CancelOrderButton from '../_components/cancel-order-button';
import { cancelOrder } from '../_actions/cancel-order';
import { OrderStatusBadge } from '@/components/ui/order-status-badge';

export default async function OrderDetailPage({ params }: { params: { orderId: string } }) {
  const session = await getSession();

  if (!session) {
    redirect('/auth/signin');
  }

  const order = await db.order.findUnique({
    where: {
      id: params.orderId,
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
    }
  });

  if (!order) {
    notFound();
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-500';
      case 'PROCESSING':
        return 'bg-yellow-500';
      case 'CANCELLED':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/orders">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
        </Link>
      </Button>

      <Card className="mb-8">
        <CardHeader className="bg-primary text-primary-foreground">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">Order #{order.id.slice(-8)}</CardTitle>
            <OrderStatusBadge status={order.status.toLowerCase()} className="px-3 py-1" />
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <Calendar className="mr-2 h-5 w-5" /> Order Date
              </h3>
              <p>{formatDate(order.createdAt)}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <Truck className="mr-2 h-5 w-5" /> Shipping Address
              </h3>
              <p>{order.shippingAddress}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          {order.items.map((item, index) => (
            <React.Fragment key={item.id}>
              <div className="flex items-center py-4">
                <div className="flex-shrink-0 mr-4">
                  <Image
                    src={item.product.images[0]?.url || '/placeholder-product.png'}
                    alt={item.product.name}
                    width={80}
                    height={80}
                    className="rounded-md object-cover"
                  />
                </div>
                <div className="flex-grow">
                  <h4 className="font-semibold">{item.product.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {item.variant?.name || 'Default Variant'}
                  </p>
                  <p className="text-sm">Quantity: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatPrice(item.price)} each
                  </p>
                </div>
              </div>
              {index < order.items.length - 1 && <Separator />}
            </React.Fragment>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{formatPrice(order.shipping)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>{formatPrice(order.tax)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {order.status === 'PROCESSING' && (
        <div className="mt-8 text-center">
          <CancelOrderButton orderId={order.id} cancelOrder={cancelOrder} />
        </div>
      )}
    </div>
  );
}
