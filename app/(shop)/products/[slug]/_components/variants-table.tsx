"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowRight, Minus, Plus, Trash2 } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { ProductVariant } from "@/types";
import { useCart } from "@/hooks/useCart";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Product } from "@prisma/client";
import { Arrow } from "@radix-ui/react-tooltip";
import { useRouter } from "next/navigation";

interface VariantsTableProps {
  product: Product;
  variants: ProductVariant[];
  selectedVariant: ProductVariant | null;
  onQuantityChange: (variantId: string, quantity: number) => void;
  quantities: { [key: string]: number };
}

export const VariantsTable = ({
  product,
  variants,
  onQuantityChange,
  quantities,
}: VariantsTableProps) => {
  const router = useRouter();
  const { items, totalItems, totalPrice, addToCart, updateQuantity, removeFromCart } = useCart();
  const hasItems = totalItems > 0;

  const handleQuantityChange = (variant: ProductVariant, newQuantity: number) => {
    const currentQuantity = quantities[variant.id] || 0;

    if (newQuantity > currentQuantity) {
      // Adding to cart
      addToCart(product, {
        id: variant.id,
        name: variant.name,
        price: variant.price,
        size: variant.size,
        color: variant.color
      });
    } else if (newQuantity < currentQuantity) {
      // Removing from cart
      removeFromCart(product.id, variant.id);
    }

    onQuantityChange(variant.id, newQuantity);
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium mb-4">Available Variants</h3>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SKU</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Color</TableHead>
              <TableHead className="text-center">Quantity</TableHead>
              <TableHead className="text-center">Price</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {variants.map((variant) => {
              const quantity = quantities[variant.id] || 0;
              const isOutOfStock = variant.inventory === 0;

              return (
                <TableRow key={variant.id}>
                  <TableCell>{variant.sku}</TableCell>
                  <TableCell className="font-medium">{variant.size}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full border border-muted-foreground"
                        style={{ backgroundColor: variant.color }}
                      />
                      {variant.color}
                    </div>
                  </TableCell>
                  <TableCell>
                    {isOutOfStock ? (
                      <span className="text-destructive">Sold out</span>
                    ) : (
                      <div className="flex items-center gap-2 justify-center">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleQuantityChange(variant, Math.max(0, quantity - 1))}
                          disabled={quantity === 0}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleQuantityChange(variant, quantity + 1)}
                          disabled={isOutOfStock || quantity >= variant.inventory}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">{formatPrice(variant.price)}/USD</TableCell>
                  <TableCell className="text-right">{formatPrice(variant.price * quantity)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Cart Summary */}
      <div className="mt-6 border rounded-lg">
        <div className="grid grid-cols-5 gap-4 p-6">
          {/* Items Added */}
          <div className="flex flex-col items-center justify-center border-r">
            <span className="text-sm text-muted-foreground">Items Added</span>
            <span className="text-lg font-medium mt-1">{totalItems}</span>
            <span className="text-xs text-muted-foreground mt-1">
              {totalItems === 1 ? 'item' : 'items'}
            </span>
          </div>

          {/* Total Items */}
          <div className="flex flex-col items-center justify-center border-r">
            <span className="text-sm text-muted-foreground">Total Items</span>
            <span className="text-lg font-medium mt-1">{formatPrice(totalPrice)}</span>
          </div>

          {/* Product Subtotal */}
          <div className="flex flex-col items-center justify-center border-r">
            <span className="text-sm text-muted-foreground">Subtotal</span>
            <span className="text-lg font-medium mt-1">{formatPrice(totalPrice)}</span>
            <span className="text-xs text-muted-foreground mt-1">excl. taxes</span>
          </div>

          {/* Taxes calculated at checkout */}
          <div className="flex flex-col items-center justify-center border-r">
            <span className="text-xs text-muted-foreground mt-1">
              Taxes calculated at checkout
            </span>
          </div>

          {/* View and remove Cart Buttons */}
          <div className="flex items-center justify-center gap-2">

            <Button
              disabled={!hasItems}
              variant="outline"
              onClick={() => {
                const confirmed = window.confirm("Are you sure you want to remove all items from cart?");
                if (confirmed) {
                  variants.forEach(variant => {
                    onQuantityChange(variant.id, 0);
                  });
                }
              }}
              className="text-destructive"
            >
              <Trash2 className="w-4 h-4" />  Remove all
            </Button>
            <Button disabled={!hasItems} onClick={() => router.push('/cart')}>
              View Cart <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
