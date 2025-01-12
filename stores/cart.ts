import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product } from '@prisma/client'

interface CartItem {
  product: Product
  quantity: number
  selectedVariant?: {
    id: string
    name: string
    price: number
    size?: string
    color?: string
  }
}

interface CartStore {
  items: CartItem[]
  addItem: (product: Product, variant?: CartItem['selectedVariant']) => void
  removeItem: (productId: string, variantId?: string) => void
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, variant) => set((state) => {
        // Check if item already exists
        const existingItem = state.items.find(item =>
          item.product.id === product.id &&
          (!variant || !item.selectedVariant
            ? true
            : item.selectedVariant.id === variant.id)
        )

        if (existingItem) {
          return {
            items: state.items.map(item =>
              item.product.id === product.id &&
                (!variant || !item.selectedVariant
                  ? true
                  : item.selectedVariant.id === variant.id)
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          }
        }

        return {
          items: [...state.items, {
            product,
            quantity: 1,
            selectedVariant: variant
          }],
        }
      }),

      removeItem: (productId, variantId) => set((state) => ({
        items: state.items.filter(item =>
          !(item.product.id === productId &&
            (!variantId || !item.selectedVariant
              ? true
              : item.selectedVariant.id === variantId))
        ),
      })),

      updateQuantity: (productId, quantity, variantId) => set((state) => ({
        items: state.items.map(item =>
          item.product.id === productId &&
            (!variantId || !item.selectedVariant
              ? true
              : item.selectedVariant.id === variantId)
            ? { ...item, quantity: Math.max(0, quantity) }
            : item
        ),
      })),

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        const state = get()
        return state.items.reduce((total, item) => total + item.quantity, 0)
      },

      getTotalPrice: () => {
        const state = get()
        return state.items.reduce((total, item) => {
          const price = item.selectedVariant?.price ?? item.product.price
          return total + (price * item.quantity)
        }, 0)
      },
    }),
    {
      name: 'cart-storage',
    }
  )
)
