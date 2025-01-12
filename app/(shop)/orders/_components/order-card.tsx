'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import Image from 'next/image';
import Link from 'next/link';
import { formatPrice, formatDate } from '@/lib/utils';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, CheckCircle, Clock, Eye, XCircle, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import { OrderStatusBadge } from '@/components/ui/order-status-badge';

function OrderCard({ 
  order, 
  cancelOrder 
}: { 
  order: any, 
  cancelOrder: (orderId: string) => Promise<{ success: boolean, message: string }>
}) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [cancelStatus, setCancelStatus] = React.useState<{ 
    loading: boolean, 
    error: string | null 
  }>({ loading: false, error: null });

  const handleCancelOrder = async () => {
    setCancelStatus({ loading: true, error: null });
    try {
      const result = await cancelOrder(order.id);
      if (result.success) {
        setIsModalOpen(false);
      } else {
        setCancelStatus({ loading: false, error: result.message });
      }
    } catch (error) {
      setCancelStatus({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Cancellation failed' 
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'PROCESSING':
        return <Clock className="h-4 w-4 text-yellow-400" />;
      case 'CANCELLED':
        return <XCircle className="h-4 w-4 text-red-400" />;
      default:
        return <AlertCircle className="h-4 w-4 text-white" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
        <CardHeader className="bg-primary text-primary-foreground p-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-medium flex items-center">
              <Package className="mr-2 h-5 w-5" />
              Order #{order.id.slice(-8)}
            </CardTitle>
            <OrderStatusBadge status={order.status.toLowerCase()} className="px-3 py-1" />
            <p className="text-xs opacity-80 mt-1">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-4">
            {order.items.slice(0, 2).map((item, index) => (
              <motion.div 
                key={item.id} 
                className="flex items-center space-x-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="relative w-16 h-16 rounded-md overflow-hidden">
                  <Image 
                    src={item.product.images[0]?.url || '/placeholder-product.png'} 
                    alt={item.product.name} 
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-300 hover:scale-110"
                  />
                </div>
                <div>
                  <p className="font-semibold text-sm">{item.product.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.variant?.name || 'Default Variant'}
                  </p>
                  <p className="text-xs">Quantity: {item.quantity}</p>
                </div>
              </motion.div>
            ))}
            {order.items.length > 2 && (
              <p className="text-sm text-muted-foreground text-center italic">
                +{order.items.length - 2} more item(s)
              </p>
            )}
          </div>
          <Separator className="my-4" />
          <div className="flex justify-between items-center">
            <span className="font-semibold">Total</span>
            <span className="font-bold text-lg text-primary">
              {formatPrice(order.total)}
            </span>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between bg-secondary/10 p-4">
          <Button variant="secondary" asChild className="flex-1 mr-2">
            <Link href={`/orders/${order.id}`}>
              <Eye className="mr-2 h-4 w-4" /> View Details
            </Link>
          </Button>
          {order.status === 'PROCESSING' && (
            <Button 
              variant="destructive"
              onClick={() => setIsModalOpen(true)}
              className="flex-1 ml-2"
            >
              Cancel Order
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Cancellation Confirmation Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Order</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this order? 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {cancelStatus.error && (
            <div className="text-destructive text-sm mb-4">
              {cancelStatus.error}
            </div>
          )}

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsModalOpen(false)}
            >
              Keep Order
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleCancelOrder}
              disabled={cancelStatus.loading}
            >
              {cancelStatus.loading ? 'Cancelling...' : 'Confirm Cancel'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

export default OrderCard;

