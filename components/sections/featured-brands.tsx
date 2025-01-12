import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Brand } from "@prisma/client";

interface FeaturedBrandsProps {
  brands: Brand[];
}

export default function FeaturedBrands({ brands }: FeaturedBrandsProps) {
  return (
    <section className="container mx-auto px-4">
      <div className="flex items-center justify-between mb-8">
        <div className="mb-4">
          <h2 className="text-3xl font-bold mb-2">Featured Fashion Brands</h2>
          <p className="text-muted-foreground">
            Discover our curated selection of premium fashion brands and styles.
          </p>
        </div>
        <Link href="/brands">
          <Button variant="ghost" className="group">
            All Brands
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {brands.map((brand) => (
          <Link key={brand.id} href={`/brands/${brand.id}`}>
            <Card className="group h-full hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="relative aspect-square mb-4 overflow-hidden rounded-lg bg-gradient-to-br from-gray-100 to-gray-200">
                  <Image
                    src={brand.logo || "/placeholder.svg"}
                    alt={brand.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {brand.featured && (
                    <div className="absolute top-2 right-2">
                      <span className="bg-primary/90 text-primary-foreground text-xs px-2 py-1 rounded-full">
                        Featured
                      </span>
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-lg mb-2">{brand.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {brand.description}
                </p>
                <div className="text-sm">
                  {brand.productCount} Products Available
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-gradient-to-br from-black via-orange-700/50 to-neutral-800">
          <div className="absolute inset-0 opacity-50 mix-blend-overlay bg-gradient-to-t from-black via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/80" />
          <div className="absolute bottom-6 left-6 right-6">
            <h3 className="text-white text-2xl font-bold mb-2">
              Summer Fashion Essentials
            </h3>
            <p className="text-gray-200 mb-4">
              Refresh your wardrobe with breezy, vibrant summer styles that keep you cool and trendy.
            </p>
            <Link href="/categories/summer-fashion">
              <Button variant="secondary" className="bg-white/90 hover:bg-white text-black">
                Explore Summer Looks
              </Button>
            </Link>
          </div>
        </div>

        <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-gradient-to-br from-black via-blue-700/50 to-neutral-800">
          <div className="absolute inset-0 opacity-50 mix-blend-overlay bg-gradient-to-t from-black via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/80" />
          <div className="absolute bottom-6 left-6 right-6">
            <h3 className="text-white text-2xl font-bold mb-2">
              Winter Wardrobe Elegance
            </h3>
            <p className="text-gray-200 mb-4">
              Stay warm and stylish with our curated selection of cozy, sophisticated winter fashion.
            </p>
            <Link href="/categories/winter-fashion">
              <Button variant="secondary" className="bg-white/90 hover:bg-white text-black">
                Shop Winter Styles
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function FeaturedBrandsLoading() {
  return (
    <div className="container mx-auto px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="aspect-square w-full rounded-lg mb-4" />
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-4" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        {[1, 2].map((i) => (
          <Skeleton key={i} className="aspect-[16/9] w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}