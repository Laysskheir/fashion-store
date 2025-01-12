import { Skeleton } from "@/components/ui/skeleton"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"

export default function ProductLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Carousel Skeleton */}
        <div className="relative aspect-square">
          <Carousel className="w-full">
            <CarouselContent>
              <CarouselItem>
                <Skeleton className="aspect-square w-full rounded-lg" />
              </CarouselItem>
            </CarouselContent>
          </Carousel>
        </div>

        {/* Product Details Skeleton */}
        <div className="space-y-6">
          {/* Brand and Title */}
          <div>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-3/4 mb-4" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-7 w-28" />
              <Skeleton className="h-7 w-28" />
              <Skeleton className="h-6 w-16" />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>

          {/* Variants */}
          <div>
            <Skeleton className="h-6 w-40 mb-4" />
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="p-4 border rounded-lg">
                  <div className="flex gap-2 mb-2">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Attributes */}
          <div>
            <Skeleton className="h-6 w-40 mb-4" />
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="grid grid-cols-2 py-2 border-b">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-32" />
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4 pt-6">
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-11 w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}
