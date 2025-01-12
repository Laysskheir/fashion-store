// app/dashboard/page.tsx
"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card"

import { Calendar } from "@/components/ui/calendar"

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  AreaChart,
  Area,
} from "recharts"
import {
  DollarSign,
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react"
import { useState } from "react"

// Mock data - replace with actual database queries
const revenueData = [
  { month: "Jan", revenue: 15000, orders: 120 },
  { month: "Feb", revenue: 20000, orders: 180 },
  { month: "Mar", revenue: 25000, orders: 220 },
  { month: "Apr", revenue: 24345, orders: 210 },
  { month: "May", revenue: 28000, orders: 250 },
  { month: "Jun", revenue: 32000, orders: 300 }
]

const categoryData = [
  { name: "Clothing", value: 45, color: "#8884d8" },
  { name: "Accessories", value: 25, color: "#82ca9d" },
  { name: "Shoes", value: 20, color: "#ffc658" },
  { name: "Bags", value: 10, color: "#ff7300" }
]

const performanceData = [
  { subject: "Sales", A: 120, B: 110, fullMark: 150 },
  { subject: "Revenue", A: 98, B: 130, fullMark: 150 },
  { subject: "Customers", A: 86, B: 130, fullMark: 150 },
  { subject: "Products", A: 99, B: 100, fullMark: 150 },
  { subject: "Marketing", A: 85, B: 90, fullMark: 150 }
]

const topProducts = [
  { name: "Summer Dress", sales: 450, trend: "up" },
  { name: "Leather Jacket", sales: 380, trend: "down" },
  { name: "Running Shoes", sales: 320, trend: "up" },
  { name: "Denim Jeans", sales: 280, trend: "up" }
]

const salesData = [
  { month: "Jan", sales: 4000, revenue: 2400, profit: 1400 },
  { month: "Feb", sales: 3000, revenue: 1398, profit: 1200 },
  { month: "Mar", sales: 2000, revenue: 9800, profit: 2290 },
  { month: "Apr", sales: 2780, revenue: 3908, profit: 2000 },
  { month: "May", sales: 1890, revenue: 4800, profit: 2181 },
  { month: "Jun", sales: 2390, revenue: 3800, profit: 2500 },
  { month: "Jul", sales: 3490, revenue: 4300, profit: 2100 },
  { month: "Aug", sales: 4000, revenue: 2400, profit: 1900 },
  { month: "Sep", sales: 4300, revenue: 2700, profit: 2300 },
  { month: "Oct", sales: 4100, revenue: 3000, profit: 2000 },
  { month: "Nov", sales: 3500, revenue: 2500, profit: 1800 },
  { month: "Dec", sales: 5000, revenue: 4000, profit: 2700 }
]

export default function DashboardPage() {

  return (
    <div className="flex flex-col gap-6 p-8 bg-background min-h-screen">
      {/* Welcome Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Welcome to Your Admin Dashboard</CardTitle>
          <CardDescription>
            Here you can manage your fashion store, track performance, and gain insights into your business.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Quick Overview</h3>
              <p className="text-sm text-muted-foreground">
                Total Revenue: €32,000 | Total Orders: 300
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Today&apos;s Highlights</h3>
              <p className="text-sm text-muted-foreground">
                New Customers: 42 | Pending Orders: 15
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Upcoming Tasks</h3>
              <p className="text-sm text-muted-foreground">
                Inventory Review | Marketing Campaign Setup
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard
          title="Monthly Revenue"
          value="€32,000"
          icon={<DollarSign className="w-4 h-4" />}
          trend={<ArrowUpRight className="w-4 h-4 text-green-500" />}
        />
        <StatsCard
          title="Total Orders"
          value="300"
          icon={<ShoppingCart className="w-4 h-4" />}
          trend={<ArrowUpRight className="w-4 h-4 text-green-500" />}
        />
        <StatsCard
          title="Active Customers"
          value="3,427"
          icon={<Users className="w-4 h-4" />}
          trend={<ArrowUpRight className="w-4 h-4 text-green-500" />}
        />
        <StatsCard
          title="Active Products"
          value="1,234"
          icon={<Package className="w-4 h-4" />}
          trend={<ArrowUpRight className="w-4 h-4 text-green-500" />}
        />
      </div>

      {/* Full Width Area Chart */}
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Comprehensive Sales Analysis</CardTitle>
          <CardDescription>Detailed view of sales, revenue, and profit trends</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart
              data={salesData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#ffc658" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="month"
                stroke="hsl(var(--muted-foreground))"
                className="text-sm"
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                className="text-sm"
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  borderColor: 'hsl(var(--border))'
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="#8884d8"
                fillOpacity={1}
                fill="url(#salesGradient)"
                name="Sales"
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#82ca9d"
                fillOpacity={1}
                fill="url(#revenueGradient)"
                name="Revenue"
              />
              <Area
                type="monotone"
                dataKey="profit"
                stroke="#ffc658"
                fillOpacity={1}
                fill="url(#profitGradient)"
                name="Profit"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Revenue & Orders Line Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue & Orders Trend</CardTitle>
            <CardDescription>Performance over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8884d8"
                  name="Revenue (€)"
                />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#82ca9d"
                  name="Orders"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Product Categories Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Product Categories</CardTitle>
            <CardDescription>Sales distribution by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance Radar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
            <CardDescription>Key metrics comparison</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={performanceData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 150]} />
                <Radar
                  name="Current Period"
                  dataKey="A"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                />
                <Radar
                  name="Previous Period"
                  dataKey="B"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                  fillOpacity={0.6}
                />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Products Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
            <CardDescription>Best performing products</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topProducts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#8884d8">
                  {topProducts.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.trend === "up" ? "#82ca9d" : "#ff7300"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Calendar */}
        <Card>
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        {/* Quick Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product) => (
                <div key={product.name} className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">{product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {product.sales} sales
                    </p>
                  </div>
                  {product.trend === "up" ? (
                    <ArrowUpRight className="w-4 h-4 text-green-500" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-500" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>


    </div>
  )
}

// Stats Card Component
function StatsCard({
  title,
  value,
  icon,
  trend
}: {
  title: string
  value: string
  icon: React.ReactNode
  trend?: React.ReactNode
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="text-muted-foreground flex items-center">
          {trend}
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )
}