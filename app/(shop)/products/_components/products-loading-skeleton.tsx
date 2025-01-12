// components/products/products-loading-skeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export function ProductsLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 9 }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <CardContent className="p-0">
            <Skeleton className="aspect-square" />
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 p-4">
            <div className="flex w-full justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {Array.from({ length: 3 }).map((_, j) => (
                <Skeleton key={j} className="h-5 w-12" />
              ))}
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {Array.from({ length: 2 }).map((_, j) => (
                <Skeleton key={j} className="h-3 w-20" />
              ))}
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

// components/products/filters-loading-skeleton.tsx
export function FiltersLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Skeleton className="h-6 w-24" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <Skeleton className="h-6 w-24" />
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <Skeleton className="h-6 w-24" />
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-8" />
          ))}
        </div>
      </div>
    </div>
  );
}
