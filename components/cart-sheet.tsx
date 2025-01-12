import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";
import { Button } from "./ui/button";
import Image from "next/image";
import { Lock, Minus, Plus, X } from 'lucide-react';
import Link from "next/link";
import { Separator } from "./ui/separator";
import { PaymentCards } from "./payments-cards";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Prisma } from "@prisma/client";
import { useEffect, useState } from "react";
import { getRecommendedProducts } from "@/actions/product";

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartSheet({ open, onOpenChange }: CartSheetProps) {
  const router = useRouter()
  const {
    items,
    removeFromCart,
    updateQuantity,
    totalItems,
    totalPrice
  } = useCart();

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [recommendedProducts, setRecommendedProducts] = useState<Prisma.ProductGetPayload<{
    include: { images: true }
  }>[]>([]);

  useEffect(() => {
    async function loadRecommendations() {
      const recommendations = await getRecommendedProducts(items);
      setRecommendedProducts(recommendations);
    }

    if (items.length > 0) {
      loadRecommendations();
    }
  }, [items]);

  const cartContent = (
    <>
      <div className="flex-1 overflow-y-auto">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-muted-foreground mb-4">Your cart is empty</p>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="space-y-6 p-2">
            {items.map((item) => (
              <div key={item.product.id} className="flex gap-4">
                <div className="relative aspect-square h-24 bg-muted">
                  <Image
                    src={item.product.images[0]?.url || '/placeholder.svg'}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{item.product.name}</h3>
                    <div className="text-right">
                      <div className="text-primary font-medium">
                        {formatPrice(item.selectedVariant?.price || item.product.basePrice)}
                      </div>
                      {item.selectedVariant?.comparePrice && (
                        <div className="text-sm line-through text-muted-foreground">
                          {formatPrice(item.selectedVariant.comparePrice)}
                        </div>
                      )}
                    </div>
                  </div>
                  {item.selectedVariant && (
                    <div className="text-sm text-muted-foreground mt-1">
                      {item.selectedVariant?.size} / {item.selectedVariant?.color}
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border rounded-sm">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-none"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-none"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <Button
                      variant="link"
                      className="text-sm h-auto p-0 text-muted-foreground hover:text-foreground"
                      onClick={() => removeFromCart(item.product.id, item.selectedVariant?.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {/* You might also like section */}
            <div className="pt-6">
              <h3 className="font-medium mb-4">YOU MIGHT ALSO LIKE</h3>
              <div className="grid grid-cols-3 gap-4">
                {recommendedProducts.map((product) => (
                  <div key={product.id} className="space-y-2">
                    <div className="relative aspect-square bg-muted">
                      <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1">
                        {formatPrice(product.basePrice)} OFF
                      </div>
                      <Image
                        src={product.images[0]?.url || '/placeholder.svg'}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="text-sm">
                      <h4 className="font-medium">{product.name}</h4>
                      <div className="flex gap-2">
                        <span className="text-primary">{formatPrice(product.basePrice)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {items.length > 0 && (
        <div className="border-t pt-4 space-y-4 mt-auto text-sm">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between text-primary">
              <span>Discount</span>
              <span className="text-destructive">-{formatPrice(80)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-medium">
              <span>CART TOTAL:</span>
              <span>{formatPrice(totalPrice - 80)}</span>
            </div>
          </div>
          <div className="text-xs text-center text-muted-foreground">
            Gift cards & promotional codes applied at checkout
          </div>
          <Button className="w-full" onClick={() => router.push("/checkout")}>
            SECURE CHECKOUT
            <Lock className="ml-2 h-3 w-3" />
          </Button>
          <div className="mt-2">
            <PaymentCards />
          </div>
        </div>
      )}
    </>
  );

  if (isDesktop) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="flex flex-col w-full sm:max-w-lg">
          <SheetHeader className="space-y-0 pb-4">
            <SheetTitle className="text-xl"><Link href="/cart">YOUR CART ({totalItems > 0 ? totalItems : 0})</Link></SheetTitle>
          </SheetHeader>
          {cartContent}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="flex flex-col">
        <DrawerHeader className="space-y-0 pb-4 text-left">
          <DrawerTitle className="text-xl">YOUR CART ({totalItems > 0 ? totalItems : 0})</DrawerTitle>
        </DrawerHeader>
        {cartContent}
      </DrawerContent>
    </Drawer>
  );
}