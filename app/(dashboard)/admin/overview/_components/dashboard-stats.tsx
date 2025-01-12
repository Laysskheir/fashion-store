import { TrendingDown, TrendingUp } from 'lucide-react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function DashboardStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Sales</CardTitle>
          <div className="flex items-center text-sm text-green-600">
            <TrendingUp className="mr-1 h-4 w-4" />
            7.1%
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$34,840</div>
          <p className="text-xs text-muted-foreground">vs previous period</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Daily Average</CardTitle>
          <div className="flex items-center text-sm text-green-600">
            <TrendingUp className="mr-1 h-4 w-4" />
            2.0%
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$4,860</div>
          <p className="text-xs text-muted-foreground">vs last week</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          <div className="flex items-center text-sm text-red-600">
            <TrendingDown className="mr-1 h-4 w-4" />
            0.5%
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">3.8%</div>
          <p className="text-xs text-muted-foreground">vs last week</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
          <div className="flex items-center text-sm text-green-600">
            <TrendingUp className="mr-1 h-4 w-4" />
            2.1%
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$89,440</div>
          <p className="text-xs text-muted-foreground">vs last week</p>
        </CardContent>
      </Card>
    </div>
  )
}

