"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Product, ProductImage, Variant } from "@prisma/client";

interface ProductWithRelations extends Product {
  images: ProductImage[];
  variants: Variant[];
}

export default function TrendingNow({ products }: { products: ProductWithRelations[] }) {
  return (
    <section className="container mx-auto px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Trending Fashion</h2>
          <p className="text-muted-foreground mt-2">
            Most loved clothing pieces this season
          </p>
        </div>
        <Link href="/products">
          <Button variant="ghost" className="group">
            View All Products
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <Card key={product.id} className="group overflow-hidden">
            <CardContent className="p-0">
              <div className="relative">
                {/* Product Image */}
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={product.images[0].url || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Overlay with quick actions */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-2">
                    <Link href={`/products/${product.id}`}>
                      <Button size="lg" className="w-full">
                        View Details
                      </Button>
                    </Link>
                    <Button size="lg" variant="secondary" className="w-full">
                      Add to Cart
                    </Button>
                  </div>
                </div>

                {/* Wishlist button */}
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Heart className="h-4 w-4" />
                </Button>


              </div>

              {/* Product Info */}
              <div className="p-4">
                <Link href={`/products/${product.id}`} className="hover:underline">
                  <h3 className="font-medium text-lg mb-2">{product.name}</h3>
                </Link>
                <div className="flex items-center justify-between">
                  <div className="text-lg font-bold">
                    ${product.basePrice}
                  </div>

                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

export function TrendingNowLoading() {
  return (
    <div className="container mx-auto px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-0">
              <Skeleton className="aspect-[4/5] w-full" />
              <div className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-5 w-24" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
