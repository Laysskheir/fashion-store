"use client";

import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Heart } from "lucide-react";

const EXAMPLE_PRODUCTS = [
  {
    id: 1,
    name: "Nike Air Max 270",
    price: 150,
    image: "/placeholder.png",
    category: "Sneakers",
    viewedAt: "2 hours ago"
  },
  {
    id: 2,
    name: "Adidas Ultra Boost",
    price: 180,
    image: "/placeholder.png",
    category: "Running",
    viewedAt: "5 hours ago"
  },
  {
    id: 3,
    name: "Puma RS-X",
    price: 120,
    image: "/placeholder.png",
    category: "Casual",
    viewedAt: "1 day ago"
  },
  // Add more products as needed
];

export default function RecentlyViewedPage() {
  return (
    <Container>
      <div className="py-10 space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Recently Viewed</h1>
          <p className="text-muted-foreground">Products you've viewed recently</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {EXAMPLE_PRODUCTS.map((product) => (
            <Card key={product.id} className="group">
              <CardContent className="p-0">
                <div className="aspect-square relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="object-cover w-full h-full rounded-t-lg"
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Heart className="h-5 w-5" />
                  </Button>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">{product.category}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="font-medium">${product.price}</p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{product.viewedAt}</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4">View Product</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {EXAMPLE_PRODUCTS.length === 0 && (
          <Card>
            <CardContent className="py-8">
              <div className="text-center">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Recently Viewed Items</h3>
                <p className="text-muted-foreground">
                  Start browsing our collection to see your recently viewed items here
                </p>
                <Button className="mt-4">Browse Products</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Container>
  );
}
