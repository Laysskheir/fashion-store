"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const data = [
  {
    age: "18-24",
    male: 20,
    female: 45,
    other: 5,
  },
  {
    age: "25-34",
    male: 35,
    female: 60,
    other: 8,
  },
  {
    age: "35-44",
    male: 40,
    female: 55,
    other: 6,
  },
  {
    age: "45-54",
    male: 30,
    female: 45,
    other: 4,
  },
  {
    age: "55+",
    male: 25,
    female: 35,
    other: 3,
  },
]

export function CustomerDemographics() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="age"
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
          tickFormatter={(value) => `${value}%`}
        />
        <Tooltip />
        <Bar
          dataKey="female"
          fill="#FF69B4"
          radius={[4, 4, 0, 0]}
          stackId="stack"
        />
        <Bar
          dataKey="male"
          fill="#4169E1"
          radius={[4, 4, 0, 0]}
          stackId="stack"
        />
        <Bar
          dataKey="other"
          fill="#9370DB"
          radius={[4, 4, 0, 0]}
          stackId="stack"
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
