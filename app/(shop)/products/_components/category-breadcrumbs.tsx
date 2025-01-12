// components/products/category-breadcrumbs.tsx
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string | null;
}

interface CategoryBreadcrumbsProps {
  categories: Category[];
  currentCategoryId?: string;
}

export function CategoryBreadcrumbs({
  categories,
  currentCategoryId,
}: CategoryBreadcrumbsProps) {
  // Function to get category path (from root to current category)
  function getCategoryPath(categoryId: string): Category[] {
    const path: Category[] = [];
    let currentCategory = categories.find((c) => c.id === categoryId);

    while (currentCategory) {
      path.unshift(currentCategory);
      currentCategory = currentCategory.parentId
        ? categories.find((c) => c.id === currentCategory!.parentId) ?? undefined
        : undefined;
    }

    return path;
  }

  const categoryPath = currentCategoryId
    ? getCategoryPath(currentCategoryId)
    : [];

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
      <Link
        href="/products"
        className="flex items-center hover:text-foreground transition-colors"
      >
        <Home className="h-4 w-4" />
        <span className="sr-only">Home</span>
      </Link>
      <ChevronRight className="h-4 w-4" />
      <Link
        href="/products"
        className="hover:text-foreground transition-colors"
      >
        Products
      </Link>
      {categoryPath.map((category, index) => (
        <span key={category.id} className="flex items-center">
          <ChevronRight className="h-4 w-4" />
          {index === categoryPath.length - 1 ? (
            <span className="text-foreground font-medium">{category.name}</span>
          ) : (
            <Link
              href={`/products?category=${category.id}`}
              className="hover:text-foreground transition-colors"
            >
              {category.name}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
