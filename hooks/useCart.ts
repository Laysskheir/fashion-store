import { useCartStore } from "@/stores/cart";
import { Prisma } from "@prisma/client";

type VariantMinimal = Pick<
  Prisma.VariantGetPayload<{}>,
  "id" | "name" | "size" | "color"
> & { price: number };

export const useCart = () => {
  const cart = useCartStore();

  const addToCart = (
    product: Prisma.ProductGetPayload<{}>,
    variant?: VariantMinimal
  ) => {
    if (variant && typeof variant.price !== "undefined") {
      cart.addItem(product, variant);
    } else {
      // Handle the case where variant is undefined or doesn't have a price
      console.error("Variant is undefined or does not have a price");
    }
  };

  const removeFromCart = (productId: string, variantId?: string) => {
    cart.removeItem(productId, variantId);
  };

  const updateQuantity = (
    productId: string,
    quantity: number,
    variantId?: string
  ) => {
    if (quantity > 0) {
      cart.updateQuantity(productId, quantity, variantId);
    } else {
      cart.removeItem(productId, variantId);
    }
  };

  const clearCart = () => {
    cart.clearCart();
  };

  return {
    items: cart.items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems: cart.getTotalItems(),
    totalPrice: cart.getTotalPrice(),
  };
};
