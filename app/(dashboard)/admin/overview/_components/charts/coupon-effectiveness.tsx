"use client"

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const data = [
  { name: "SUMMER20", usage: 150, revenue: 3000 },
  { name: "NEWCUST10", usage: 100, revenue: 1500 },
  { name: "FLASH30", usage: 80, revenue: 2400 },
  { name: "LOYALTY15", usage: 60, revenue: 1200 },
  { name: "FREESHIP", usage: 200, revenue: 4000 },
]

export function CouponEffectiveness() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Coupon Effectiveness</CardTitle>
        <CardDescription>Usage and revenue generated by coupons</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" stroke="#f97316" />
              <YAxis yAxisId="right" orientation="right" stroke="#8b5cf6" />
              <Tooltip />
              <Bar yAxisId="left" dataKey="usage" fill="#f97316" />
              <Bar yAxisId="right" dataKey="revenue" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

