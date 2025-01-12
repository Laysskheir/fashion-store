"use client"

import { useState, useEffect } from "react";
import { ProductWithDetails } from "@/features/products/management/types/product.types";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from 'next/link';
import { Icons } from "@/components/Icons";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/use-wishlist";
import { Separator } from "@/components/ui/separator";
import { ProductGallery } from "./product-gallery";
import { ProductHeader } from "./product-header";
import { ProductFeatures } from "./product-features";
import { ProductTabs } from "./product-tabs";
import { StickyAddToCart } from "./sticky-add-to-cart";
import { VariantSelector } from "./variant-selector";
import { ProductReviews } from "./product-reviews";
import { SimilarProducts } from "./similar-products";
import { RecentlyViewed } from "./recently-viewed";
import { VariantsTable } from "./variants-table";
import { Loader2 } from 'lucide-react';
import { Heart } from 'lucide-react';
import { CartSheet } from "@/components/cart-sheet";
import { cn } from "@/lib/utils";
import { useRecentlyViewed } from "@/hooks/use-recently-viewed";

export function ProductDetails({ product }: { product: ProductWithDetails }) {
  const cart = useCart();
  const wishlist = useWishlist();
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants.length > 0 ? product.variants[0] : null
  );
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const productInfo = document.getElementById('product-info');
      if (productInfo) {
        const rect = productInfo.getBoundingClientRect();
        setShowStickyBar(rect.top < 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const hasDiscount = selectedVariant?.comparePrice && selectedVariant.comparePrice > selectedVariant.price;
  const discountPercentage = hasDiscount
    ? Math.round(((selectedVariant.comparePrice! - selectedVariant.price) / selectedVariant.comparePrice!) * 100)
    : 0;

  const rating = product.reviews.length > 0
    ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length
    : 0;

  const handleAddToCart = () => {
    if (!selectedVariant) {
      toast.error("Please select a variant first");
      return;
    }

    try {
      setIsLoading(true);
      cart.addToCart(product, {
        id: selectedVariant.id,
        name: selectedVariant.name,
        price: selectedVariant.price,
        size: selectedVariant.size,
        color: selectedVariant.color
      });
      setIsCartOpen(true);
      toast.success("Added to cart successfully!");
    } catch (error) {
      toast.error("Failed to add to cart");
      console.error("Error adding to cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToWishlist = async () => {
    try {
      await wishlist.addItem(product.id);
      toast.success("Added to wishlist!");
    } catch (error) {
      console.error("Error adding to wishlist:", error);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } catch (error) {
      toast.error("Failed to share");
    }
  };

  const whatsappMessage = `Hi, I'm interested in purchasing ${product.name}${selectedVariant ? ` (${selectedVariant.name})` : ''} (SKU: ${selectedVariant?.sku || 'N/A'})`;
  const whatsappUrl = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;

  useRecentlyViewed(product);

  console.log('Product Variants:', product.variants);

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-12">
            {/* Gallery */}
            <ProductGallery 
              images={product.images}
              name={product.name}
              onShare={handleShare}
            />

            {/* Product info */}
            <div id="product-info" className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
              <div className="space-y-6">
                <ProductHeader
                  name={product.name}
                  selectedVariant={selectedVariant}
                  rating={rating}
                  reviewCount={product.reviews.length}
                  hasDiscount={hasDiscount}
                  discountPercentage={discountPercentage}
                />

                <Separator />

                {/* Variant Selection */}
                {product.variants.length > 0 && (
                  <div className="space-y-4">
                    <VariantSelector
                      variants={product.variants}
                      selectedVariant={selectedVariant}
                      onVariantSelect={setSelectedVariant}
                    />
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-6 gap-4">
                    <Button
                      onClick={handleAddToCart}
                      disabled={!selectedVariant || selectedVariant.inventory === 0 || isLoading}
                      className="col-span-5"
                      size="lg"
                    >
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : selectedVariant?.inventory === 0 ? (
                        "Out of Stock"
                      ) : (
                        "Add to Cart"
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleAddToWishlist}
                      disabled={wishlist.isLoading}
                      className="relative"
                    >
                      {wishlist.isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Heart className={cn(
                          "h-5 w-5 transition-colors",
                          wishlist.items?.some(item => item.productId === product.id) && "fill-primary text-primary"
                        )} />
                      )}
                    </Button>
                  </div>
                  <Button variant="outline" size="lg" asChild>
                    <Link href={whatsappUrl} target="_blank">
                      <Icons.whatsApp className="mr-2 h-5 w-5" />
                      Chat on WhatsApp
                    </Link>
                  </Button>
                </div>

                <ProductFeatures />

                <ProductTabs product={product} />
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-16" />

        <div className="space-y-16">
          {/* Variants Table */}
          {product.variants.length > 0 && (
            <section>
              <h2 className="mb-8 text-2xl font-bold tracking-tight">Available Variants</h2>
              <VariantsTable
                product={product}
                variants={product.variants}
                onQuantityChange={(variantId, quantity) => {
                  setQuantities(prev => ({
                    ...prev,
                    [variantId]: quantity
                  }));
                }}
                quantities={quantities}
              />
            </section>
          )}

          {/* Reviews */}
          <section id="reviews">
            <h2 className="mb-8 text-2xl font-bold tracking-tight">Customer Reviews</h2>
            <ProductReviews productId={product.id} reviews={product.reviews} />
          </section>

          {/* Similar Products */}
          {product.similarProducts && product.similarProducts.length > 0 && (
            <section>
              <h2 className="mb-8 text-2xl font-bold tracking-tight">Similar Products</h2>
              <SimilarProducts products={product.similarProducts} />
            </section>
          )}

          {/* Recently Viewed */}
          <section>
            <h2 className="mb-8 text-2xl font-bold tracking-tight">Recently Viewed</h2>
            <RecentlyViewed currentProductId={product.id} />
          </section>
        </div>

        <StickyAddToCart
          show={showStickyBar}
          product={product}
          selectedVariant={selectedVariant}
          onVariantChange={setSelectedVariant}
          onAddToCart={handleAddToCart}
          isLoading={isLoading}
        />

        <CartSheet open={isCartOpen} onOpenChange={setIsCartOpen} />
      </div>
    </>
  );
}
