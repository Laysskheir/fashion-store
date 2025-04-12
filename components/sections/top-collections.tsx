// components/sections/top-collections.tsx
"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card } from "../ui/card";
import { Category } from "@prisma/client";
import { ArrowRight, Star, TrendingUp } from "lucide-react";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import { AspectRatio } from "../ui/aspect-ratio";
import Image from "next/image";

// Type matches the structure from getCategories()
interface CollectionCardProps {
  category: Category & {
    _count: { products: number };
    children: (Category & { _count: { products: number } })[];
  };
}

function CollectionCard({ category }: CollectionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="group relative"
    >
      <Link href={`/categories/${category.slug}`} className="block">
        <Card className="relative overflow-hidden border-0 shadow-lg transition-all duration-300 ease-in-out bg-card text-card-foreground hover:shadow-xl">
          {/* Background Image with Gradient Overlay */}
          <AspectRatio ratio={16 / 9} className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/20" />
            <Image
              src={category.image || "/placeholder.jpg"}
              alt={category.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </AspectRatio>

          {/* Content */}
          <div className="relative z-10 p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-2xl font-bold text-primary">
                  {category.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {category._count.products} Products
                </p>
              </div>
              <ArrowRight
                className="transform transition-transform group-hover:translate-x-2 text-primary"
                size={24}
              />
            </div>

            {/* Quick Stats */}
            <div className="flex gap-2 mt-4">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Star className="h-3 w-3" />
                Featured
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Trending
              </Badge>
            </div>

            {/* Subcategories Preview */}
            {category.children.length > 0 && (
              <div className="mt-4">
                <p className="text-xs text-muted-foreground mb-2">
                  Popular in this collection:
                </p>
                <div className="flex flex-wrap gap-2">
                  {category.children.slice(0, 3).map((subcat) => (
                    <Badge
                      key={subcat.id}
                      variant="outline"
                      className="text-xs"
                    >
                      {subcat.name}
                    </Badge>
                  ))}
                  {category.children.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{category.children.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}

export default function TopCollections({
  categories,
}: {
  categories: (Category & {
    _count: { products: number };
    children: (Category & { _count: { products: number } })[];
  })[];
}) {
  // Filter only main categories (level 0)
  const mainCategories = categories.filter((category) => category.level === 0);

  return (
    <section className="py-24 px-4 bg-background relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />

      <div className="container mx-auto max-w-7xl relative">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-0.5 w-10 bg-primary" />
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Our Collections
            </span>
            <div className="h-0.5 w-10 bg-primary" />
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-primary mb-4">
            Style Meets Individuality
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover collections that reflect your unique personality and
            elevate your wardrobe.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {mainCategories.map((category) => (
            <CollectionCard key={category.id} category={category} />
          ))}
        </motion.div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            href="/categories"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-primary/10 hover:bg-primary/20 transition-colors duration-200"
          >
            View All Collections
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
