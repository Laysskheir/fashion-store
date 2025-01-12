"use client";

import { useState } from "react";
import { Container } from "@/components/ui/container";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Truck, Package, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Order } from "@prisma/client";
import { formatDate, formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { trackOrder } from "../_actions/track-order";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { OrderStatusBadge } from "@/components/ui/order-status-badge";

interface TrackOrderClientProps {
  initialOrders: Order[];
}

export default function TrackOrderClient({
  initialOrders,
}: TrackOrderClientProps) {
  const [orders, setOrders] = useState(initialOrders);
  const [searchOrderNumber, setSearchOrderNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleTrackOrder = async () => {
    if (!searchOrderNumber.trim()) {
      toast.error("Please enter an order number");
      return;
    }

    setIsLoading(true);
    try {
      const order = await trackOrder(searchOrderNumber);
      setOrders([order, ...orders.filter((o) => o.id !== order.id)]);
      toast.success(`Order #${order.orderNumber} has been loaded`);
    } catch (error) {
      toast.error("Unable to find the order. Please check the order number and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle2 className="h-6 w-6 text-green-500" />;
      case "PROCESSING":
        return <Package className="h-6 w-6 text-yellow-500" />;
      case "SHIPPED":
        return <Truck className="h-6 w-6 text-blue-500" />;
      case "CANCELLED":
        return <AlertCircle className="h-6 w-6 text-red-500" />;
      default:
        return <Clock className="h-6 w-6 text-gray-500" />;
    }
  };

  return (
    <Container>
      <Toaster />
      <div className="py-10 space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Track Orders</h1>
          <p className="text-muted-foreground">
            Track your order status and delivery
          </p>
        </div>

        {/* Search Order */}
        <Card>
          <CardHeader>
            <CardTitle>Track an Order</CardTitle>
            <CardDescription>
              Enter your order number to track its status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                placeholder="Enter order number"
                className="max-w-sm"
                value={searchOrderNumber}
                onChange={(e) => setSearchOrderNumber(e.target.value)}
              />
              <Button onClick={handleTrackOrder} disabled={isLoading}>
                {isLoading ? "Searching..." : "Track Order"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Track your recent orders</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {orders.length === 0 ? (
              <p className="text-center text-muted-foreground">
                No recent orders found.
              </p>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-semibold">
                        Order #{order.orderNumber}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Placed on {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {formatPrice(order.total)}
                      </p>
                      <OrderStatusBadge status={order.status.toLowerCase()} />
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        {getStatusIcon(order.status)}
                        <div className="w-px h-full bg-border" />
                      </div>
                      <div>
                        <p className="font-medium">
                          Current Status: {order.status}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>

                    {order.status === "SHIPPED" && (
                      <div className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <Truck className="h-6 w-6 text-blue-500" />
                          <div className="w-px h-full bg-border" />
                        </div>
                        <div>
                          <p className="font-medium">Order Shipped</p>
                          <p className="text-sm text-muted-foreground">
                            Your order is on its way
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <Package className="h-6 w-6 text-yellow-500" />
                        <div className="w-px h-full bg-border" />
                      </div>
                      <div>
                        <p className="font-medium">Order Processed</p>
                        <p className="text-sm text-muted-foreground">
                          Your order has been processed and is being prepared
                          for shipment
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <CheckCircle2 className="h-6 w-6 text-green-500" />
                      </div>
                      <div>
                        <p className="font-medium">Order Confirmed</p>
                        <p className="text-sm text-muted-foreground">
                          We've received your order
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
