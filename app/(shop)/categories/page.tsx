import { getCategories } from "@/features/categories/actions/categories"
import { CategoryCard } from "./_components/category-card"
import { Separator } from "@/components/ui/separator"

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-16 lg:max-w-7xl lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Shop by Category
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              Browse through our collections of carefully selected beauty products
            </p>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {categories.map((category) => (
            <CategoryCard 
              key={category.id} 
              category={category} 
              className="rounded-lg shadow-lg overflow-hidden"
            />
          ))}
          {categories.length === 0 && (
            <div className="col-span-full text-center">
              <p className="">
                No categories found.
              </p>
            </div>
          )}
        </div>

       
      </div>
    </div>
  )
}
