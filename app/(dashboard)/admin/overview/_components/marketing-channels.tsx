"use client"

import { Progress } from "@/components/ui/progress"

const channels = [
  {
    name: "Organic Search",
    percentage: 45,
    color: "bg-orange-500",
  },
  {
    name: "Social Media",
    percentage: 35,
    color: "bg-yellow-500",
  },
  {
    name: "Direct",
    percentage: 20,
    color: "bg-teal-500",
  },
]

export function MarketingChannels() {
  return (
    <div className="p-6">
      <h3 className="mb-4 font-semibold">Marketing Channels</h3>
      <div className="space-y-4">
        {channels.map((channel) => (
          <div key={channel.name} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{channel.name}</span>
              <span>{channel.percentage}%</span>
            </div>
            <Progress
              value={channel.percentage}
              className={`h-2 ${channel.color}`}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

