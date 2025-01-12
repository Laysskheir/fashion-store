"use client"

import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const categories = [
  {
    name: "Dresses",
    products: 48,
    growth: "+4.5%",
    percentage: 75,
  },
  {
    name: "Tops",
    products: 32,
    growth: "+2.8%",
    percentage: 65,
  },
  {
    name: "Bottoms",
    products: 24,
    growth: "+3.2%",
    percentage: 45,
  },
  {
    name: "Accessories",
    products: 18,
    growth: "+1.8%",
    percentage: 35,
  },
]

export function ProductCategories() {
  return (
    <div className="p-6">
      <h3 className="font-semibold">Product Categories</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Category</TableHead>
            <TableHead>Products</TableHead>
            <TableHead>Growth</TableHead>
            <TableHead>Distribution</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.name}>
              <TableCell>{category.name}</TableCell>
              <TableCell>{category.products}</TableCell>
              <TableCell className="text-green-600">
                {category.growth}
              </TableCell>
              <TableCell className="w-[200px]">
                <Progress value={category.percentage} className="h-2" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

