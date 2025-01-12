"use client";

import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tag, Copy, Clock, CheckCircle } from "lucide-react";

export default function CouponsPage() {
  return (
    <Container>
      <div className="py-10 space-y-8">
        <div>
          <h1 className="text-3xl font-bold">My Coupons</h1>
          <p className="text-muted-foreground">View and manage your discount coupons</p>
        </div>

        {/* Add Coupon */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <Input placeholder="Enter coupon code" className="max-w-sm" />
              <Button>Apply Coupon</Button>
            </div>
          </CardContent>
        </Card>

        {/* Available Coupons */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Active Coupon */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Tag className="h-5 w-5 text-primary" />
                    <span className="font-semibold text-lg">SPRING20</span>
                  </div>
                  <div>
                    <h3 className="font-medium">20% Off Spring Collection</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Valid on all spring collection items
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Expires in 5 days</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <Copy className="h-4 w-4" />
                  Copy
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Another Coupon */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Tag className="h-5 w-5 text-primary" />
                    <span className="font-semibold text-lg">WELCOME10</span>
                  </div>
                  <div>
                    <h3 className="font-medium">10% Off First Order</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      For new customers only
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Expires in 30 days</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <Copy className="h-4 w-4" />
                  Copy
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Used Coupon */}
          <Card className="opacity-60">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-semibold text-lg">WINTER50</span>
                  </div>
                  <div>
                    <h3 className="font-medium">50% Off Winter Sale</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Used on order #1234
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Expired</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
}
