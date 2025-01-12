"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Instagram } from "lucide-react";
import Link from "next/link";

const posts = [
  {
    id: 1,
    caption: "Elevating everyday style with our latest collection",
    likes: 1234,
    comments: 45,
    username: "fashionstore",
    link: "https://instagram.com/p/123",
    bgColor: "bg-[#FFE5E5]",
    accentColor: "text-rose-700",
    gradientFrom: "from-rose-100",
    gradientTo: "to-rose-200",
  },
  {
    id: 2,
    caption: "Summer essentials that redefine modern elegance",
    likes: 892,
    comments: 32,
    username: "fashionstore",
    link: "https://instagram.com/p/456",
    bgColor: "bg-[#E5F0FF]",
    accentColor: "text-blue-700",
    gradientFrom: "from-blue-100",
    gradientTo: "to-blue-200",
  },
  {
    id: 3,
    caption: "Curated pieces for the contemporary wardrobe",
    likes: 1567,
    comments: 78,
    username: "fashionstore",
    link: "https://instagram.com/p/789",
    bgColor: "bg-[#E5FFE5]",
    accentColor: "text-green-700",
    gradientFrom: "from-green-100",
    gradientTo: "to-green-200",
  },
  {
    id: 4,
    caption: "Timeless designs meet modern sophistication",
    likes: 2103,
    comments: 95,
    username: "fashionstore",
    link: "https://instagram.com/p/012",
    bgColor: "bg-[#FFE5F6]",
    accentColor: "text-pink-700",
    gradientFrom: "from-pink-100",
    gradientTo: "to-pink-200",
  },
  
  {
    id: 5,
    caption: "Minimalist aesthetics for the modern individual",
    likes: 1456,
    comments: 52,
    username: "fashionstore",
    link: "https://instagram.com/p/678",
    bgColor: "bg-[#FFF5E5]",
    accentColor: "text-orange-700",
    gradientFrom: "from-orange-100",
    gradientTo: "to-orange-200",
  },
];

export default function InstagramFeed() {
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="flex flex-col items-center text-center mb-8">
        <h2 className="text-2xl font-bold tracking-tight mb-3">
          @fashionstore
        </h2>
        <p className="text-muted-foreground max-w-2xl text-sm">
          Join our community of fashion enthusiasts and discover how our pieces come to life
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={post.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group"
          >
            <Card className={`overflow-hidden border-0 ${post.bgColor} hover:shadow-md transition-all duration-300`}>
              <CardContent className="p-3">
                <div className={`w-full aspect-[4/5] rounded-sm bg-gradient-to-br ${post.gradientFrom} ${post.gradientTo} mb-2`} />
                <p className={`text-xs font-medium ${post.accentColor} line-clamp-2`}>
                  {post.caption}
                </p>
                <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{post.likes} likes</span>
                  <span>{post.comments} comments</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link
          href="https://instagram.com/fashionstore"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="outline" size="sm" className="gap-2">
            <Instagram className="h-4 w-4" />
            Follow Us
          </Button>
        </Link>
      </div>
    </section>
  );
}

export function InstagramFeedLoading() {
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="flex flex-col items-center text-center mb-8">
        <Skeleton className="h-8 w-48 mb-3" />
        <Skeleton className="h-4 w-full max-w-xl" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i}>
            <Skeleton className="aspect-[4/5] w-full" />
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Skeleton className="h-9 w-32" />
      </div>
    </section>
  );
}
