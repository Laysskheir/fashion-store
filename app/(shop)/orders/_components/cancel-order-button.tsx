'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

interface CancelOrderButtonProps {
  orderId: string;
  cancelOrder: (orderId: string) => Promise<{ success: boolean; message: string }>;
}

export default function CancelOrderButton({ orderId, cancelOrder }: CancelOrderButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleCancelOrder = async () => {
    setIsLoading(true);
    try {
      const result = await cancelOrder(orderId);
      if (result.success) {
        toast({
          title: 'Order Cancelled',
          description: 'Your order has been successfully cancelled.',
          variant: 'default',
        });
        setIsDialogOpen(false);
        router.refresh();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to cancel order',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button variant="destructive" onClick={() => setIsDialogOpen(true)}>
        Cancel Order
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Order</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this order? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Keep Order
            </Button>
            <Button variant="destructive" onClick={handleCancelOrder} disabled={isLoading}>
              {isLoading ? 'Cancelling...' : 'Confirm Cancellation'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

