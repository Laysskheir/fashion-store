"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  {
    time: "Jan",
    sales: 400,
    customers: 240,
  },
  {
    time: "Feb",
    sales: 300,
    customers: 139,
  },
  {
    time: "Mar",
    sales: 200,
    customers: 980,
  },
  {
    time: "Apr",
    sales: 278,
    customers: 390,
  },
  {
    time: "May",
    sales: 189,
    customers: 480,
  },
  {
    time: "Jun",
    sales: 239,
    customers: 380,
  },
  {
    time: "Jul",
    sales: 349,
    customers: 430,
  },
]

export function SalesTrend() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <XAxis
          dataKey="time"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="sales"
          stroke="#8884d8"
          strokeWidth={2}
          activeDot={{ r: 8 }}
        />
        <Line
          type="monotone"
          dataKey="customers"
          stroke="#82ca9d"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
