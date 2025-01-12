'use client';

import { useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Tag, Gift } from 'lucide-react';
import { useQuery } from "@tanstack/react-query";
import { getNotifications, markAllNotificationsAsRead } from "../_actions/notifications-actions";

export default function NotificationsList() {
  const [isPending, startTransition] = useTransition();
  const { data: notifications, refetch } = useQuery({
    queryKey: ['notifications'],
    queryFn: getNotifications,
  });

  const handleMarkAllAsRead = () => {
    startTransition(async () => {
      await markAllNotificationsAsRead();
      refetch();
    });
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'ORDER_UPDATE':
        return <Package className="h-5 w-5 text-primary mt-1" />;
      case 'PRICE_DROP':
        return <Tag className="h-5 w-5 text-primary mt-1" />;
      case 'PROMOTION':
        return <Gift className="h-5 w-5 text-primary mt-1" />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Notifications</CardTitle>
          <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead} disabled={isPending}>
            Mark all as read
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {notifications && notifications.length > 0 ? (
          notifications.map((notification) => (
            <div key={notification.id} className={`flex gap-4 p-4 rounded-lg ${notification.isRead ? '' : 'bg-secondary/10'}`}>
              {getIcon(notification.type)}
              <div className="flex-1">
                <p className="font-medium">{notification.message}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-muted-foreground">No new notifications</p>
        )}
      </CardContent>
    </Card>
  );
}

