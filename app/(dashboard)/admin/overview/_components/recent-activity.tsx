import { Card } from '@/components/ui/card'
import { Box, ImageIcon, Package2Icon, TagIcon } from 'lucide-react'

const activities = [
  {
    icon: Package2Icon,
    title: "New Product Added",
    description: "Summer Collection - Floral Maxi Dress",
    time: "11:30 AM",
  },
  {
    icon: TagIcon,
    title: "Price Update",
    description: "Seasonal discount: $129.99 → $99.99",
    time: "10:45 AM",
  },
  {
    icon: Box,
    title: "Inventory Updated",
    description: "Denim Collection: +200 units added",
    time: "09:15 AM",
  },
  {
    icon: ImageIcon,
    title: "Product Images Updated",
    description: "Summer Collection - Updated lookbook",
    time: "08:30 AM",
  },
]

export function RecentActivity() {
  return (
    <Card className="p-6">
      <h3 className="mb-4 font-semibold">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start gap-4">
            <div className="rounded-full bg-muted p-2">
              <activity.icon className="h-4 w-4" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">
                {activity.title}
              </p>
              <p className="text-sm text-muted-foreground">
                {activity.description}
              </p>
              <p className="text-xs text-muted-foreground">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

