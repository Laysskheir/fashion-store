import { useCartStore } from '@/stores/cart'
import { Prisma } from '@prisma/client'

type VariantMinimal = Pick<Prisma.VariantGetPayload<{}>, 'id' | 'name' | 'size' | 'color'> & { price: number }

export const useCart = () => {
  const cart = useCartStore()

  const addToCart = (product: Prisma.ProductGetPayload<{}>, variant?: VariantMinimal) => {
    if (variant && typeof variant.price !== 'undefined') {
      cart.addItem(product, variant)
    } else {
      // Handle the case where variant is undefined or doesn't have a price
      console.error('Variant is undefined or does not have a price')
    }
  }

  const removeFromCart = (cartItemId: string) => {
    cart.removeItem(cartItemId)
  }

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity > 0) {
      cart.updateQuantity(cartItemId, quantity)
    } else {
      cart.removeItem(cartItemId)
    }
  }

  const clearCart = () => {
    cart.clearCart()
  }

  return {
    items: cart.items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems: cart.getTotalItems(),
    totalPrice: cart.getTotalPrice(),
  }
}