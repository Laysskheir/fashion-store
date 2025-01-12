import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { Eye, Star } from "lucide-react";
import { Product, ProductImage, Variant } from "@prisma/client";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { QuickViewModal } from "./quick-view-modal";

interface ProductCardProps {
    product: ProductWithRelations;
    defaultVariant: Variant;
    defaultImage: ProductImage;
}

interface ProductWithRelations extends Product {
    images: ProductImage[];
    variants: Variant[];
    category: { name: string };
}

export const ProductCard: React.FC<ProductCardProps> = ({
    product,
    defaultVariant,
    defaultImage
}) => {
    return (
        <div className="relative group">
            <Link href={`/products/${product.slug}`}>
                <Card className="group overflow-hidden rounded-lg p-3 border transition-all hover:border-primary">
                    <div className="relative aspect-square">
                        {defaultImage && (
                            <Image
                                src={defaultImage.url}
                                alt={product.name}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                        )}
                        {product.isActive && (
                            <div className="absolute left-2 top-2">
                                <Badge variant="destructive">
                                    New Arrival
                                </Badge>
                            </div>
                        )}
                    </div>
                    <div className="py-4 space-y-2">
                        <h3 className="font-medium leading-none line-clamp-1">{product.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">{product.category.name}</p>
                        <div className="flex justify-between items-center">
                            {/* prices */}
                            <div className="flex items-center gap-1">
                                <div className="text-lg font-semibold">
                                    {defaultVariant && formatPrice(Number(defaultVariant.price))}
                                </div>
                                {defaultVariant?.comparePrice && defaultVariant.comparePrice > defaultVariant.price && (
                                    <>
                                        /
                                        <div className="text-sm text-muted-foreground line-through">
                                            {formatPrice(Number(defaultVariant.comparePrice))}
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* colors */}
                            <div className="flex items-center gap-2">
                                {defaultVariant?.color?.split(',').map((color, index) => (
                                    <div
                                        key={index}
                                        className={`size-3 rounded-full border-2 border-background bg-${color.trim().toLowerCase()}-500`}
                                    />
                                ))}
                                {product.averageRating > 0 && (
                                    <div className="flex items-center text-sm text-yellow-500">
                                        <Star className="h-4 w-4 fill-current" />
                                        <span className="ml-1">{product.averageRating.toFixed(1)}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </Card>
            </Link>
            <QuickViewModal product={product}>
                <Button
                    variant="outline"
                    size="icon"
                    className="absolute rounded-full top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                    <Eye className="h-4 w-4" />
                </Button>
            </QuickViewModal>
        </div>
    );
};
