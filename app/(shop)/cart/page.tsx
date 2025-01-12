'use client'

import { useCart } from '@/hooks/useCart'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Minus, Plus, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
import Link from 'next/link'
import { Metadata } from "next"
import { siteConfig } from "@/config/site"

// export const metadata: Metadata = {
//   title: `Shopping Cart | ${siteConfig.name}`,
//   description: "View and manage your shopping cart items.",
//   keywords: [...siteConfig.keywords, "shopping cart", "checkout", "order"],
// }

export default function CartPage() {
  const { 
    items, 
    removeFromCart, 
    updateQuantity, 
    totalItems, 
    totalPrice 
  } = useCart()

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] px-4">
        <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
        <p className="text-muted-foreground mb-8">Add some items to your cart to see them here.</p>
        <Button variant="default" size="lg" onClick={() => window.history.back()}>
          Continue Shopping
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart ({totalItems} items)</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ScrollArea className="h-[600px] rounded-lg">
            <div className="space-y-4">
              {items.map((item) => (
                <Card 
                  key={`${item.product.id}-${item.selectedVariant?.id || 'default'}`} 
                  className="p-4"
                >
                  <div className="flex gap-4">
                    <div className="relative w-24 h-24">
                      {item.product.images?.[0]?.url && (
                        <Image
                          src={item.product.images[0].url}
                          alt={item.product.name}
                          fill
                          className="object-cover rounded-md"
                        />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-semibold">{item.product.name}</h3>
                          {item.selectedVariant && (
                            <div className="text-sm text-muted-foreground flex items-center gap-2">
                              {item.selectedVariant.color && (
                                <p>Color: {item.selectedVariant.color}</p>
                              )}
                              /
                              {item.selectedVariant.size && (
                                <p>Size: {item.selectedVariant.size}</p>
                              )}
                            </div>
                          )}
                          <p className="text-sm text-muted-foreground mt-1">
                            SKU: {item.selectedVariant?.id || item.product.sku}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(item.product.id, item.selectedVariant?.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(
                              item.product.id, 
                              item.quantity - 1,
                              item.selectedVariant?.id
                            )}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(
                              item.product.id, 
                              parseInt(e.target.value),
                              item.selectedVariant?.id
                            )}
                            className="w-16 text-center"
                            min="1"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(
                              item.product.id, 
                              item.quantity + 1,
                              item.selectedVariant?.id
                            )}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            {formatPrice((item.selectedVariant?.price || item.product.price) * item.quantity)}
                          </p>
                          {item.selectedVariant?.price !== item.product.price && (
                            <p className="text-sm text-muted-foreground">
                              {formatPrice(item.selectedVariant?.price || item.product.price)} each
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
        
        <div className="lg:col-span-1">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <Button className="w-full" size="lg">
               <Link href="/checkout" className="w-full">
               Proceed to Checkout
               </Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}