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
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"
import { useCart } from "@/hooks/useCart"
import { toast } from "@/hooks/use-toast"
import { Ruler, ChevronLeft, ChevronRight, Shirt, Weight, ShoppingCart, ArrowRight } from "lucide-react"
import { motion } from 'framer-motion'
import { cn } from "@/lib/utils"

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
    const [isImageZoomed, setIsImageZoomed] = useState(false)

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
                title: "Variant Selection Required",
                description: "Please choose a size and color before adding to cart.",
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
                title: "Added to Cart",
                description: `${product.name} has been added to your cart.`,
            })
            setOpen(false)
        } catch (error) {
            toast({
                title: "Cart Error",
                description: "Unable to add item. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const productContent = (
        <div className="grid lg:grid-cols-2 h-full gap-8 p-6 antialiased">
            {/* Image Gallery Section */}
            <div className="space-y-4">
                <div 
                    className="relative aspect-square rounded-xl overflow-hidden shadow-lg group cursor-zoom-in"
                    onClick={() => setIsImageZoomed(!isImageZoomed)}
                >
                    <motion.div
                        initial={{ scale: 1 }}
                        animate={{ 
                            scale: isImageZoomed ? 1.5 : 1,
                            transition: { duration: 0.3 }
                        }}
                    >
                        <Image
                            src={product.images[currentImageIndex].url}
                            alt={`${product.name} - Image ${currentImageIndex + 1}`}
                            fill
                            className={cn(
                                "object-cover transition-transform duration-300 group-hover:scale-105",
                                isImageZoomed ? "scale-150" : ""
                            )}
                            priority
                        />
                    </motion.div>

                    {product.images.length > 1 && (
                        <>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/50 backdrop-blur-sm hover:bg-background/70"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    previousImage()
                                }}
                                aria-label="Previous Image"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/50 backdrop-blur-sm hover:bg-background/70"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    nextImage()
                                }}
                                aria-label="Next Image"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </>
                    )}
                </div>

                {/* Image Thumbnails */}
                <div className="flex justify-center space-x-2">
                    {product.images.map((image, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className={cn(
                                "w-16 h-16 rounded-md overflow-hidden cursor-pointer border-2 transition-all",
                                index === currentImageIndex 
                                    ? "border-primary" 
                                    : "border-transparent opacity-60 hover:opacity-100"
                            )}
                            onClick={() => setCurrentImageIndex(index)}
                        >
                            <Image
                                src={image.url}
                                alt={`Thumbnail ${index + 1}`}
                                width={64}
                                height={64}
                                className="object-cover"
                            />
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Content Section */}
            <div className="space-y-6">
                <div className="space-y-3">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex gap-2 items-center"
                    >
                        {product.isActive && (
                            <>
                                <Badge variant="default" className="animate-pulse">New Arrival</Badge>
                                <Badge variant="secondary">
                                    {Math.round(((Number(product.variants[0].comparePrice) - Number(product.variants[0].price)) / Number(product.variants[0].comparePrice)) * 100)}% Off
                                </Badge>
                            </>
                        )}
                    </motion.div>

                    <h2 className="text-3xl font-bold tracking-tight">{product.name}</h2>
                    <p className="text-muted-foreground text-sm">{product.category.name}</p>
                    <p className="text-muted-foreground text-sm">{product.description}</p>
                </div>

                {/* Product Details Grid */}
                <div className="grid grid-cols-2 gap-4 bg-secondary/10 p-4 rounded-lg">
                    {[
                        { 
                            icon: Ruler, 
                            label: "Dimensions", 
                            value: product.dimensions 
                        },
                        { 
                            icon: FileBarChartIcon, 
                            label: "Material", 
                            value: product.material 
                        },
                        { 
                            icon: Shirt, 
                            label: "Care", 
                            value: product.careInstructions 
                        },
                        { 
                            icon: Weight, 
                            label: "Weight", 
                            value: product.weight 
                        }
                    ].map((detail, index) => detail.value && (
                        <div key={index} className="flex items-center space-x-2">
                            <detail.icon className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="text-xs font-medium text-muted-foreground">{detail.label}</p>
                                <p className="text-sm">{detail.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pricing with Animated Reveal */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                    className="space-y-2"
                >
                    <div className="flex items-center gap-3">
                        <p className="text-3xl font-bold text-primary">
                            {formatPrice(Number(product.variants[0].price))}
                        </p>
                        <p className="text-muted-foreground line-through">
                            {formatPrice(Number(product.variants[0].comparePrice))}
                        </p>
                        {product.variants[0].comparePrice && (
                            <Badge variant="destructive" className="animate-bounce">
                                Save {Math.round(((Number(product.variants[0].comparePrice) - Number(product.variants[0].price)) / Number(product.variants[0].comparePrice)) * 100)}%
                            </Badge>
                        )}
                    </div>
                </motion.div>

                {/* Variant Selection */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Select Size & Color</label>
                        <div className="grid grid-cols-3 gap-2">
                            {product.variants.map((variant) => (
                                <motion.div
                                    key={variant.id}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Button
                                        variant={selectedVariant?.id === variant.id ? "default" : "outline"}
                                        onClick={() => setSelectedVariant(variant)}
                                        className="w-full flex items-center justify-between gap-2"
                                    >
                                        <div 
                                            className={`size-4 rounded-full border-2 border-primary-foreground bg-${variant.color.toLowerCase()}-500`} 
                                        />
                                        {variant.size}
                                    </Button>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                    <Button
                        className="flex-1 group"
                        onClick={handleAddToCart}
                        disabled={isLoading || !selectedVariant}
                    >
                        {isLoading ? "Adding..." : "Add to Cart"}
                        <ShoppingCart className="ml-2 h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="flex-1 group"
                        onClick={() => router.push(`/products/${product.slug}`)}
                    >
                        View Details
                        <ArrowRight className="ml-2 h-4 w-4 " />
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
            <DrawerTrigger asChild>
                {children}
            </DrawerTrigger>
            <DrawerContent className="max-h-[95vh]">
                <div className="overflow-y-auto max-h-[90vh]">
                    {productContent}
                </div>
            </DrawerContent>
        </Drawer>
    )
}