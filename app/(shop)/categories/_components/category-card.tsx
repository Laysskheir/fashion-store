"use client";

import Link from "next/link";
import { Category } from "@prisma/client";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  category: Category;
  className?: string;
}

export function CategoryCard({ category, className }: CategoryCardProps) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className={cn(
        "group block p-6 rounded-lg border border-border bg-background hover:bg-secondary/10 transition-colors duration-300",
        className
      )}
    >
      <div className="space-y-4">
        {/* Category Name */}
        <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
          {category.name}
        </h3>


        {/* Shop Now Button */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-primary group-hover:text-primary/80 transition-colors duration-300">
            Shop Now
          </span>
          <svg
            className="w-4 h-4 text-primary group-hover:text-primary/80 transition-colors duration-300 transform group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </Link>
  );
}