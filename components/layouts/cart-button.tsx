'use client';

import { Button } from "../ui/button";
import { useCart } from "@/hooks/useCart";
import { CartSheet } from "../cart-sheet";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ShoppingCart } from "lucide-react";

interface CartButtonProps {
  className?: string;
}

export function CartButton({ className }: CartButtonProps) {
  const { totalItems } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "border-l ring-0 rounded-none h-12 md:h-14 w-12 md:w-14 shrink-0",
          className
        )}
        aria-label="Shopping Cart"
        disabled
      >
        <ShoppingCart className="h-4 w-4 opacity-50" />
      </Button>
    );
  }

  return (
    <div className="relative">
      <Button
        onClick={() => setIsCartOpen(true)}
        variant="ghost"
        size="icon"
        className={cn(
          "border-l ring-0 rounded-none h-12 md:h-14 w-12 md:w-14 shrink-0",
          className
        )}
        aria-label="Shopping Cart"
      >
        <ShoppingCart className="h-4 w-4" />
        {totalItems > 0 && (
          <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </Button>
      <CartSheet open={isCartOpen} onOpenChange={setIsCartOpen} />
    </div>
  );
}