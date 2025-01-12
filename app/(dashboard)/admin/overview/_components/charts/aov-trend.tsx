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
  { month: "Jan", aov: 120 },
  { month: "Feb", aov: 125 },
  { month: "Mar", aov: 130 },
  { month: "Apr", aov: 135 },
  { month: "May", aov: 140 },
  { month: "Jun", aov: 145 },
]

export function AOVTrend() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Average Order Value Trend</CardTitle>
        <CardDescription>Monthly AOV in USD</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="aov" stroke="#14b8a6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

