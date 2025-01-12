"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const data = [
  { month: "Jan", newCustomers: 100, returningCustomers: 20 },
  { month: "Feb", newCustomers: 120, returningCustomers: 40 },
  { month: "Mar", newCustomers: 140, returningCustomers: 60 },
  { month: "Apr", newCustomers: 160, returningCustomers: 80 },
  { month: "May", newCustomers: 180, returningCustomers: 100 },
  { month: "Jun", newCustomers: 200, returningCustomers: 120 },
]

export function CustomerMetrics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Acquisition & Retention</CardTitle>
        <CardDescription>New vs Returning Customers</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="newCustomers" stroke="#f97316" strokeWidth={2} />
              <Line type="monotone" dataKey="returningCustomers" stroke="#8b5cf6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

