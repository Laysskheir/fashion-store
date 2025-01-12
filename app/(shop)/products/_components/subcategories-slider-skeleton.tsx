import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"

export function SubcategoriesSliderSkeleton() {
  return (
    <ScrollArea className="w-full whitespace-nowrap rounded-md">
      <div className="flex gap-4 pb-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="w-[300px] shrink-0 rounded-lg border-0 bg-black/20">
            <CardContent className="p-0">
              <Skeleton className="aspect-[4/3] rounded-t-lg" />
              <div className="space-y-2 p-4">
                <Skeleton className="h-5 w-4/5" />
                <Skeleton className="h-4 w-3/5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  )
}

