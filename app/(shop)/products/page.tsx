import { getFilters, getProducts } from "@/actions/product";
import { ProductFilters } from "./_components/product-filters";
import { ProductGrid } from "./_components/product-grid";
import { ProductsLoadingSkeleton } from "./_components/products-loading-skeleton";
import { CategoryBreadcrumbs } from "./_components/category-breadcrumbs";
import { SelectedFiltersBar } from "./_components/selected-filters-bar";
import { ProductFilter } from "@/types";
import { ProductsSort } from "./_components/products-sort";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Fetch filters and products data
  const { categories, colors } = await getFilters();
  const filters = parseFiltersFromSearchParams(searchParams);
  const products = await getProducts(filters);

  // Get the current category name for the heading
  const currentCategoryName = filters.categoryId
    ? categories.find((c) => c.id === filters.categoryId)?.name
    : "All Products";

  return (
    <div className="container mx-auto px-4 py-4">
      {/* Breadcrumbs */}
      <CategoryBreadcrumbs
        categories={categories}
        currentCategoryId={filters.categoryId}
      />

      {/* Main Layout: Filters Sidebar + Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Filters Sidebar - Sticky on desktop */}
        <aside className="col-span-12 lg:col-span-3 lg:sticky lg:top-20 lg:h-[calc(100vh-6rem)] lg:overflow-y-auto">
          <ProductFilters
            categories={categories}
            colors={colors}
            currentFilters={filters}
          />
        </aside>

        {/* Products Grid */}
        <main className="col-span-12 lg:col-span-9">
          {/* Selected Filters Bar */}
          <SelectedFiltersBar filters={filters} categories={categories} />

          {/* Product Grid Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold tracking-tight">
              {currentCategoryName}
            </h1>
            <div className="flex items-center space-x-4">
              <ProductsSort />
            </div>
          </div>

          {/* Product Grid */}
          <ProductGrid products={products} />
        </main>
      </div>
    </div>
  );
}

// Helper function to parse filters from searchParams
function parseFiltersFromSearchParams(searchParams: {
  [key: string]: string | string[] | undefined;
}): ProductFilter {
  return {
    categoryId: searchParams.category as string,
    colors:
      typeof searchParams.colors === "string"
        ? searchParams.colors.split(",")
        : undefined,
    sort: searchParams.sort as string,
  };
}
