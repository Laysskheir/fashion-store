import { Order } from '@prisma/client';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface OrderHistoryProps {
  orders: Order[];
}

export default function OrderHistory({ orders }: OrderHistoryProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-semibold">Recent Orders</h3>
      {orders.length === 0 ? (
        <p className="text-muted-foreground">You haven't placed any orders yet.</p>
      ) : (
        orders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <CardTitle className="flex justify-between">
                <span>Order #{order.orderNumber}</span>
                <Badge>{order.status}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
              <p className="font-semibold mt-2">Total: {formatPrice(order.total)}</p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline">
                <Link href={`/orders/${order.id}`}>View Order Details</Link>
              </Button>
            </CardFooter>
          </Card>
        ))
      )}
      <Button asChild variant="link" className="mt-4">
        <Link href="/orders">View All Orders</Link>
      </Button>
    </div>
  );
}

