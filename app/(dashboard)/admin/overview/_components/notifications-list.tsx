import { Bell, Package, ShoppingCart, UserPlus } from 'lucide-react'

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const notifications = [
  {
    id: 1,
    type: "New Order",
    message: "Order #12345 has been placed",
    time: "5 minutes ago",
    icon: ShoppingCart,
  },
  {
    id: 2,
    type: "Low Stock",
    message: "Product 'Summer Dress' is running low on stock",
    time: "1 hour ago",
    icon: Package,
  },
  {
    id: 3,
    type: "New Customer",
    message: "Jane Doe has created an account",
    time: "3 hours ago",
    icon: UserPlus,
  },
  {
    id: 4,
    type: "System Update",
    message: "New feature: Advanced analytics is now available",
    time: "1 day ago",
    icon: Bell,
  },
]

export function NotificationsList() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Notifications</h3>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter notifications" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Notifications</SelectItem>
            <SelectItem value="unread">Unread</SelectItem>
            <SelectItem value="orders">Orders</SelectItem>
            <SelectItem value="customers">Customers</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div key={notification.id} className="flex items-start space-x-4 p-4 bg-card rounded-lg shadow">
            <div className="bg-primary/10 p-2 rounded-full">
              <notification.icon className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="font-medium">{notification.type}</p>
              <p className="text-sm text-muted-foreground">{notification.message}</p>
              <p className="text-xs text-muted-foreground">{notification.time}</p>
            </div>
            <Button variant="ghost" size="sm">
              Mark as read
            </Button>
          </div>
        ))}
      </div>
      <div className="flex justify-center">
        <Button variant="outline">View All Notifications</Button>
      </div>
    </div>
  )
}

