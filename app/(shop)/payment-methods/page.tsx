"use client";

import { Container } from "@/components/ui/container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, CreditCard } from "lucide-react";

export default function PaymentMethodsPage() {
  return (
    <Container>
      <div className="py-10 space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Payment Methods</h1>
          <p className="text-muted-foreground">Manage your payment methods</p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Saved Payment Methods</CardTitle>
              <CardDescription>Your saved credit cards and payment methods</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Example saved card */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <CreditCard className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="font-medium">•••• •••• •••• 4242</p>
                    <p className="text-sm text-muted-foreground">Expires 12/24</p>
                  </div>
                </div>
                <Button variant="outline">Remove</Button>
              </div>

              <Button className="w-full" variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add New Payment Method
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
}
