import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface ContainerProps {
  children: ReactNode
  className?: string
}

export const Container = ({ children, className }: ContainerProps) => {
  return (
    <div className={cn("container mx-auto p-4 sm:p-6 lg:p-8", className)}>
      {children}
    </div>
  )
}
