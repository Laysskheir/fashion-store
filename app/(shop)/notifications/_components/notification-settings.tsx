'use client';

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Tag, Gift, Star, AlertCircle, ShoppingBag } from 'lucide-react';
import { getNotifications, markNotificationAsRead, deleteNotification, markAllNotificationsAsRead } from "../_actions/notifications-actions";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Notification } from "@prisma/client";

const PAGE_SIZE = 10;

export default function NotificationsList() {
  const [isPending, startTransition] = useTransition();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    refetch,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['notifications'],
    queryFn: ({ pageParam = 1 }) => getNotifications(pageParam, PAGE_SIZE),
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;
      return lastPage.notifications.length === PAGE_SIZE ? nextPage : undefined;
    },
  });

  const handleMarkAsRead = (notificationId: string) => {
    startTransition(async () => {
      await markNotificationAsRead(notificationId);
      refetch();
    });
  };

  const handleDelete = (notificationId: string) => {
    startTransition(async () => {
      await deleteNotification(notificationId);
      refetch();
    });
  };

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
      case 'NEW_ARRIVAL':
        return <ShoppingBag className="h-5 w-5 text-primary mt-1" />;
      case 'BACK_IN_STOCK':
        return <AlertCircle className="h-5 w-5 text-primary mt-1" />;
      case 'REVIEW_REQUEST':
        return <Star className="h-5 w-5 text-primary mt-1" />;
      default:
        return null;
    }
  };

  const notifications = data?.pages.flatMap(page => page.notifications) ?? [];

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
        {notifications.length > 0 ? (
          <>
            {notifications.map((notification: Notification) => (
              <div key={notification.id} className={`flex gap-4 p-4 rounded-lg ${notification.isRead ? '' : 'bg-secondary/10'}`}>
                {getIcon(notification.type)}
                <div className="flex-1">
                  <p className="font-medium">{notification.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                  <div className="mt-2 space-x-2">
                    {!notification.isRead && (
                      <Button variant="outline" size="sm" onClick={() => handleMarkAsRead(notification.id)}>
                        Mark as read
                      </Button>
                    )}
                   
                    <Button variant="outline" size="sm" onClick={() => handleDelete(notification.id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {hasNextPage && (
              <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                {isFetchingNextPage ? 'Loading more...' : 'Load More'}
              </Button>
            )}
          </>
        ) : (
          <p className="text-center text-muted-foreground">No new notifications</p>
        )}
      </CardContent>
    </Card>
  );
}

