import { BellIcon, CalendarIcon, SearchIcon } from "lucide-react";
import Image from "next/image";

import { SalesChart } from "./_components/sales-chart";
import { CategoryDistribution } from "./_components/charts/category-distribution";
import { RevenueTrend } from "./_components/charts/revenue-trend";
import { TopProducts } from "./_components/charts/top-products";
import { RecentActivity } from "./_components/recent-activity";
import { DashboardStats } from "./_components/dashboard-stats";
import { OrderStatus } from "./_components/charts/order-status";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CouponEffectiveness } from "./_components/charts/coupon-effectiveness";
import { ReturnRate } from "./_components/charts/return-rate";
import { InventoryStatus } from "./_components/charts/inventory-status";
import { CustomerMetrics } from "./_components/charts/customer-metrics";
import { AOVTrend } from "./_components/charts/aov-trend";
import { NotificationsList } from "./_components/notifications-list";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="flex h-16 items-center px-4">
          <div className="ml-auto flex items-center gap-4">
            <Button variant="outline" size="icon">
              <SearchIcon className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <BellIcon className="h-4 w-4" />
            </Button>
            <Select defaultValue="7days">
              <SelectTrigger className="w-40">
                <CalendarIcon className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="90days">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>
      <main className="flex-1 space-y-4 p-8 pt-6">
        <DashboardStats />
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="md:col-span-2">
                <SalesChart />
              </div>
              <div>
                <RecentActivity />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="md:col-span-2">
                <TopProducts />
              </div>
              <div>
                <CategoryDistribution />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="md:col-span-2">
                <RevenueTrend />
              </div>
              <div>
                <AOVTrend />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="md:col-span-2">
                <CustomerMetrics />
              </div>
              <div>
                <ReturnRate />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="reports" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="md:col-span-2">
                <InventoryStatus />
              </div>
              <div>
                <OrderStatus />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="md:col-span-2">
                <CouponEffectiveness />
              </div>
              <div>
                <TopProducts />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="notifications">
            <NotificationsList />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
