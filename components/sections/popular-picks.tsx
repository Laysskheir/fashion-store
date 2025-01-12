import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Product, ProductImage, Variant } from "@prisma/client";
import { Container } from "../ui/container";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { ProductCard } from "../product-card";

interface ProductWithRelations extends Product {
  images: ProductImage[];
  variants: Variant[];
  category: { name: string };
}

export default function PopularPicks({ products }: { products: ProductWithRelations[] }) {
 
  return (
    <Container className="py-16">
      <div className="flex flex-col items-start justify-between space-y-4 md:flex-row md:items-center md:space-y-0 mb-8">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Popular Picks</h2>
          <p className="text-muted-foreground">
            Discover our most-loved beauty essentials
          </p>
        </div>
        <Link
          href="/products"
        >
          <Button variant="ghost" className="group">
            View all products
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>

      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {products.map((product) => {
            const defaultImage = product.images.find((img) => img.isDefault) || product.images[0];
            const defaultVariant = product.variants[0];

            return (
              <CarouselItem key={product.id} className="pl-2 md:pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                <ProductCard product={product} defaultVariant={defaultVariant} defaultImage={defaultImage} />
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <div className="hidden md:block">
          <CarouselPrevious className="-left-12" />
          <CarouselNext className="-right-12" />
        </div>
      </Carousel>

     
    </Container>
  );
}