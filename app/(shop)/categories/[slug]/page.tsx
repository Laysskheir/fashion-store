import { notFound } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { getCategory } from "@/features/categories/actions/categories";
import { getProductsByCategory } from "@/features/products/management/actions/shop/get-product-category";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { Home } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category = await getCategory(params.slug);

  if (!category) {
    return notFound();
  }

  const products = await getProductsByCategory(params.slug);

  return (
    <div>
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-16 lg:max-w-7xl lg:px-8">
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">
                <Home className="h-4 w-4" />
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/categories">Categories</BreadcrumbLink>
            </BreadcrumbItem>
            {category.level === 1 && category.parent && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/categories/${category.parent.slug}`}>
                    {category.parent.name}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            )}
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{category.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Category Header */}
        <div className="mt-8 md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {category.name}
            </h2>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Subcategories Grid */}
        {category.children && category.children.length > 0 && (
          <>
            <h3 className="text-2xl font-semibold mb-6">Subcategories</h3>
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8 mb-12">
              {category.children.map((subcategory) => (
                <Link href={`/categories/${subcategory.slug}`} key={subcategory.id}>
                  <Card className="group h-full overflow-hidden transition-shadow hover:shadow-lg">
                    <CardContent className="p-6">
                      <CardTitle className="text-xl font-semibold group-hover:text-primary transition-colors">
                        {subcategory.name}
                      </CardTitle>
                    </CardContent>
                    {/* Shop Now Button */}
                    <CardFooter>
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
                      </div></CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
            {products.length > 0 && <Separator className="my-8" />}
          </>
        )}

        {/* Products Grid */}
        {products.length > 0 && (
          <>
            <h3 className="text-2xl font-semibold mb-6">Products</h3>
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
              {products.map((product) => (
                <Link href={`/products/${product.slug}`} key={product.id}>
                  <Card className="group h-full overflow-hidden transition-shadow hover:shadow-lg">
                    {product.images[0]?.url && (
                      <CardContent className="p-0">
                        <AspectRatio ratio={1}>
                          <Image
                            src={product.images[0].url}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            priority={false}
                            quality={80}
                          />
                        </AspectRatio>
                      </CardContent>
                    )}
                    <CardFooter className="flex-col items-start gap-2 p-4">
                      <CardTitle className="text-xl font-semibold group-hover:text-primary transition-colors">
                        {product.name}
                      </CardTitle>
                      {product.description && (
                        <p className="mt-2 text-sm text-muted-foreground">
                          {product.description}
                        </p>
                      )}
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* No Products or Subcategories */}
        {products.length === 0 && !category.children?.length && (
          <div className="text-center">
            <p className="text-muted-foreground">
              No products or subcategories found.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}