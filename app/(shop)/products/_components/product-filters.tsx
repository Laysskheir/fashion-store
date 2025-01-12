"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCallback, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Check, X, ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Category, ProductFilter } from "@/types";
import { FilterSection } from "./filter-section";
import { Button } from "@/components/ui/button";

interface ProductFiltersProps {
  categories: Category[];
  colors: string[];
  currentFilters: ProductFilter;
}

export function ProductFilters({
  categories,
  colors,
  currentFilters,
}: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // State to manage expanded categories
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (currentFilters.categoryId) count++;
    if (currentFilters.colors?.length) count++;
    return count;
  }, [currentFilters]);

  // Handle filter updates
  const updateFilter = useCallback(
    (name: string, value: string | string[] | null) => {
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
    },
    [searchParams, pathname, router]
  );

  // Clear all filters
  const clearAllFilters = () => {
    const params = new URLSearchParams();
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Toggle category expansion
  const toggleCategoryExpansion = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Render dynamic colors
  const renderColorSwatches = () => {
    return colors.map((color) => {
      const isSelected = currentFilters.colors?.includes(color);
      return (
        <motion.button
          key={color}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "w-8 h-8 rounded-full border-2 transition-all duration-200 relative group",
            isSelected
              ? "border-primary ring-2 ring-primary/50"
              : "border-border hover:border-primary"
          )}
          style={{ backgroundColor: color }}
          onClick={() => {
            const currentColors = currentFilters.colors || [];
            const newColors = isSelected
              ? currentColors.filter((c) => c !== color)
              : [...currentColors, color];
            updateFilter("colors", newColors);
          }}
        >
          {isSelected && (
            <Check className="w-4 h-4 absolute inset-0 m-auto text-white" />
          )}
          <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 transition-opacity bg-secondary px-2 py-1 rounded-md whitespace-nowrap">
            {color}
          </span>
        </motion.button>
      );
    });
  };

  // Recursive category rendering
  const renderCategories = (categories: Category[], level = 0) => {
    return categories.map((category) => (
      <div key={category.id} className={`pl-${level * 4}`}>
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "flex items-center justify-between px-3 py-2 rounded-md cursor-pointer transition-colors duration-200 group",
            currentFilters.categoryId === category.id
              ? "bg-primary text-primary-foreground"
              : "hover:bg-secondary/10 text-foreground"
          )}
          onClick={() => updateFilter("category", category.id)}
        >
          <span className="text-sm font-medium flex-grow">{category.name}</span>
          
          {category.children && category.children.length > 0 && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                toggleCategoryExpansion(category.id);
              }}
              className="ml-2 hover:bg-secondary/20 rounded-full p-1 transition-colors"
            >
              {expandedCategories.includes(category.id) ? (
                <ChevronDown className="h-4 w-4 opacity-70 group-hover:opacity-100" />
              ) : (
                <ChevronRight className="h-4 w-4 opacity-70 group-hover:opacity-100" />
              )}
            </button>
          )}
        </motion.div>

        {category.children && category.children.length > 0 && 
         expandedCategories.includes(category.id) && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-1"
            >
              {renderCategories(category.children, level + 1)}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    ));
  };

  return (
    <div className="w-full bg-background rounded-lg border border-border overflow-hidden">
      {/* Header with active filters count */}
      <div className="bg-secondary/20 px-6 py-4 border-b border-border flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          Filters
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFiltersCount}
            </Badge>
          )}
        </h2>
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-muted-foreground hover:text-destructive"
          >
            Clear all
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      <ScrollArea className="h-[calc(100vh-12rem)] px-6 py-4">
        <div className="space-y-6">
          {/* Categories Section */}
          <FilterSection title="Categories">
            <div className="space-y-1">
              {renderCategories(categories.filter((category) => category.level === 0))}
            </div>
          </FilterSection>

          {/* Colors Section */}
          <FilterSection title="Colors">
            <div className="flex flex-wrap gap-2 px-3">
              {renderColorSwatches()}
            </div>
          </FilterSection>
        </div>
      </ScrollArea>
    </div>
  );
}