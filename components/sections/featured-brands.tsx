// components/sections/featured-brands.tsx
"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Star, Globe } from "lucide-react";
import { Brand } from "@prisma/client";
import { cn } from "@/lib/utils";

interface FeaturedBrandsProps {
  brands: Brand[];
}

export default function FeaturedBrands({ brands }: FeaturedBrandsProps) {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row items-center justify-between mb-12"
        >
          <div className="text-center md:text-left mb-6 md:mb-0">
            <h2 className="text-3xl font-bold mb-3">Featured Brands</h2>
            <p className="text-muted-foreground">
              Discover our curated selection of premium fashion brands
            </p>
          </div>
          <Link href="/brands">
            <Button variant="outline" size="lg">
              View All Brands
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {brands.map((brand) => (
            <motion.div
              key={brand.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.3 },
                },
              }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <Link href={`/brands/${brand.id}`}>
                <Card className="h-full border-border/50 hover:border-primary/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-lg">{brand.name}</h3>
                      {brand.featured && (
                        <span className="text-xs font-medium text-primary flex items-center gap-1">
                          <Star className="h-3.5 w-3.5" />
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm mb-4">
                      {brand.description || "Premium fashion brand"}
                    </p>
                    <div className="flex items-center justify-between">
                      {brand.website && (
                        <Link
                          href={brand.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
                        >
                          <Globe className="h-3.5 w-3.5" />
                          Website
                        </Link>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-primary"
                      >
                        View Collection
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {[
            {
              title: "Summer Collection",
              description: "Explore our latest summer fashion essentials",
              href: "/categories/summer-fashion",
            },
            {
              title: "Winter Collection",
              description: "Discover premium winter fashion pieces",
              href: "/categories/winter-fashion",
            },
          ].map((section) => (
            <motion.div
              key={section.title}
              whileHover={{ y: -5 }}
              className="group"
            >
              <Link href={section.href}>
                <Card className="h-full border-border/50 hover:border-primary/50 transition-colors">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-2">
                      {section.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      {section.description}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-primary"
                    >
                      Shop Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export function FeaturedBrandsLoading() {
  return (
    <div className="container mx-auto px-4 py-20">
      <div className="flex items-center justify-between mb-12">
        <div className="space-y-3">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="h-full">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-4 w-full mb-4" />
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-full mb-4" />
              <Skeleton className="h-4 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
