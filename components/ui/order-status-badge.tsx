import React from "react"
import { cn } from "@/lib/utils"

interface OrderStatusBadgeProps {
  status: "pending" | "shipped" | "delivered" | "canceled"
  className?: string
}

const statusVariants = {
  pending: "bg-yellow-500 text-white",
  shipped: "bg-blue-500 text-white",
  delivered: "bg-green-500 text-white",
  canceled: "bg-red-500 text-white",
}

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status, className }) => {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold", statusVariants[status], className)}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
} 