"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Category, ProductFilter } from "@/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface SelectedFiltersBarProps {
  filters: ProductFilter;
  categories: Category[];
}

export function SelectedFiltersBar({ filters, categories }: SelectedFiltersBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Find category name by recursive search
  const findCategoryNameById = (categories: Category[], categoryId: string): string | null => {
    for (const category of categories) {
      if (category.id === categoryId) return category.name;
      
      if (category.children && category.children.length > 0) {
        const childCategoryName = findCategoryNameById(category.children, categoryId);
        if (childCategoryName) return childCategoryName;
      }
    }
    return null;
  };

  const updateFilter = (name: string, value: string | string[] | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === null) {
      params.delete(name);
    } else if (Array.isArray(value)) {
      value.length > 0 ? params.set(name, value.join(",")) : params.delete(name);
    } else if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Get category name for the current category ID
  const categoryName = filters.categoryId 
    ? findCategoryNameById(categories, filters.categoryId) 
    : null;

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {categoryName && (
        <Badge className="flex items-center gap-2">
          Category: {categoryName}
          <Button
            variant="ghost"
            size="sm"
            className="p-0 h-4 w-4"
            onClick={() => updateFilter("category", null)}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      )}
      
      {filters.colors?.map((color) => (
        <Badge key={color} className="flex items-center gap-2">
          Color: {color}
          <Button
            variant="ghost"
            size="sm"
            className="p-0 h-4 w-4"
            onClick={() =>
              updateFilter("colors", filters.colors?.filter((c) => c !== color) || null)
            }
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      ))}
    </div>
  );
}