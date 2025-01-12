'use client'

import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Card, CardContent } from '@/components/ui/card'

interface Subcategory {
  id: string
  name: string
  imageUrl: string
  slug: string
}

interface SubcategoriesSliderProps {
  subcategories: Subcategory[]
  className?: string
}

export function SubcategoriesSlider({ subcategories, className }: SubcategoriesSliderProps) {
  return (
    <ScrollArea className={cn("w-full whitespace-nowrap rounded-md", className)}>
      <div className="flex w-full gap-4 pb-4">
        {subcategories.map((item) => (
          <Card key={item.id} className="w-[300px] shrink-0 rounded-lg border-0 bg-black/20">
            <Link href={`/products?category=${item.slug}`}>
              <CardContent className="p-0">
                <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="space-y-1 p-4">
                  <h3 className="font-semibold text-lg text-white line-clamp-1">
                    {item.name}
                  </h3>
                  
                </div>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
      <ScrollBar 
        orientation="horizontal" 
        className="mt-2 h-2 bg-gray-800/50"
      />
    </ScrollArea>
  )
}

