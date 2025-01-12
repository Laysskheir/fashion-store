"use client"

import Image from "next/image"
import { FileBarChartIcon } from 'lucide-react'
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Product, ProductImage, Variant } from "@prisma/client"
import { useState, ReactNode } from "react"
import { useRouter } from "next/navigation"
import { formatPrice } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Drawer, DrawerContent } from "@/components/ui/drawer"
import { useCart } from "@/hooks/useCart"
import { toast } from "@/hooks/use-toast"
import { Ruler, ChevronLeft, ChevronRight, Shirt, Weight } from "lucide-react"

interface ProductWithRelations extends Product {
    images: ProductImage[];
    variants: Variant[];
    category: { name: string };
}

interface QuickViewModalProps {
    product: ProductWithRelations;
    children: ReactNode;
}

export function QuickViewModal({ product, children }: QuickViewModalProps) {
    const [open, setOpen] = useState(false)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const router = useRouter()
    const { addToCart } = useCart()
    const isDesktop = useMediaQuery("(min-width: 768px)")

    const nextImage = () => {
        setCurrentImageIndex((prev) =>
            prev === product.images.length - 1 ? 0 : prev + 1
        )
    }

    const previousImage = () => {
        setCurrentImageIndex((prev) =>
            prev === 0 ? product.images.length - 1 : prev - 1
        )
    }

    const handleAddToCart = async () => {
        if (!selectedVariant) {
            toast({
                title: "Variant not selected",
                description: "Please select a variant before adding to cart.",
                variant: "destructive",
            })
            return
        }

        setIsLoading(true)
        try {
            await addToCart(product, {
                id: selectedVariant.id,
                name: product.name,
                price: Number(selectedVariant.price),
                size: selectedVariant.size,
                color: selectedVariant.color,
            })
            toast({
                title: "Success!",
                description: "Item added to cart.",
            })
            setOpen(false)
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to add item to cart. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const productContent = (
        <div className="grid lg:grid-cols-2 h-full gap-8 p-6">
            {/* Image Section */}
            <div className="relative aspect-square rounded-lg overflow-hidden shadow-lg">
                <Image
                    src={product.images[currentImageIndex].url}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105"
                    priority
                />
                {product.images.length > 1 && (
                    <>
                        <Button
                            size="icon"
                            variant="ghost"
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/50 backdrop-blur-sm hover:bg-background/70"
                            onClick={previousImage}
                            aria-label="Previous Image"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            size="icon"
                            variant="ghost"
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/50 backdrop-blur-sm hover:bg-background/70"
                            onClick={nextImage}
                            aria-label="Next Image"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </>
                )}
            </div>

            {/* Content Section */}
            <div className="space-y-6">
                <div className="space-y-2">
                    <div className="flex gap-2">
                        {product.isActive && (
                            <>
                                <Badge variant="default">New Arrival</Badge>
                                <Badge variant="secondary">10% off</Badge>
                            </>
                        )}
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight">{product.name}</h2>
                    <p className="text-muted-foreground text-sm">{product.category.name}</p>
                    <p className="text-muted-foreground text-sm">{product.description}</p>
                </div>

                {/* Product Details */}
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        {product.dimensions && (
                            <div className="flex items-center space-x-2">
                                <Ruler className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground">Dimensions</p>
                                    <p className="text-sm">{product.dimensions}</p>
                                </div>
                            </div>
                        )}
                        {product.material && (
                            <div className="flex items-center space-x-2">
                                <FileBarChartIcon className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground">Material</p>
                                    <p className="text-sm">{product.material}</p>
                                </div>
                            </div>
                        )}
                        {product.careInstructions && (
                            <div className="flex items-center space-x-2">
                                <Shirt className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground">Care</p>
                                    <p className="text-sm">{product.careInstructions}</p>
                                </div>
                            </div>
                        )}
                        {product.weight && (
                            <div className="flex items-center space-x-2">
                                <Weight className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground">Weight</p>
                                    <p className="text-sm">{product.weight}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Pricing */}
                <div className="space-y-2">
                    <div className="flex items-center gap-1">
                        <p className="text-3xl font-bold">
                            {formatPrice(Number(product.variants[0].price))}
                        </p>/
                        <p className="text-muted-foreground line-through">
                            {formatPrice(Number(product.variants[0].comparePrice))}
                        </p>
                    </div>
                    {product.variants[0].comparePrice && (
                        <div className="space-y-2">

                            {product.variants[0].comparePrice && (
                                <p className="text-sm text-green-600">
                                    Save {Math.round(((Number(product.variants[0].comparePrice) - Number(product.variants[0].price)) / Number(product.variants[0].comparePrice)) * 100)}%
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Variants */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Size</label>
                        <div className="grid grid-cols-2 gap-2">
                            {product.variants.map((variant) => (
                                <Button
                                    key={variant.id}
                                    variant={selectedVariant?.id === variant.id ? "default" : "outline"}
                                    onClick={() => setSelectedVariant(variant)}
                                    className="flex items-center gap-2"
                                >
                                    <div
                                        className={`size-4 rounded-full border-2 border-background bg-${variant.color.toLowerCase()}-500`}
                                    />
                                    {variant.size}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-4">
                    <Button
                        className="flex-1"
                        onClick={handleAddToCart}
                        disabled={isLoading || !selectedVariant}
                    >
                        {isLoading ? "Adding..." : "Add to Cart"}
                    </Button>
                    <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => router.push(`/products/${product.slug}`)}
                    >
                        View Details
                    </Button>
                </div>
            </div>
        </div>
    )

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    {children}
                </DialogTrigger>
                <DialogContent className="max-w-5xl gap-0 p-0">
                    {productContent}
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerContent className="max-h-[95vh]">
                <div className="overflow-y-auto max-h-[90vh]">
                    {productContent}
                </div>
            </DrawerContent>
        </Drawer>
    )
}