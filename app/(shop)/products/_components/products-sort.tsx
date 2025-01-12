"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ChevronDown } from 'lucide-react'

export function ProductsSort() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          Sort
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuLabel>Sort By</DropdownMenuLabel>
        <DropdownMenuItem className="cursor-pointer">
          Most Popular
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          Best Rating
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          Newest
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuLabel>Price</DropdownMenuLabel>
        <DropdownMenuItem className="cursor-pointer">
          Low to High
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          High to Low
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}