import { Metadata } from "next";
import { getSaleProducts } from "@/features/products/management/actions/shop/get-sale-products";
import { PageHeader } from "@/components/page-header";
import { ProductGrid } from "../products/_components/product-grid";
import { Badge } from "@/components/ui/badge";
import { Clock, Tag } from "lucide-react";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
    title: "Sales & Special Offers | Beauty Store",
    description: "Discover amazing deals on your favorite beauty products. Limited time offers available!",
    openGraph: {
        title: "Sales & Special Offers | Beauty Store",
        description: "Discover amazing deals on your favorite beauty products. Limited time offers available!",
    },
};

export default async function SalesPage() {
    const products = await getSaleProducts();
    
    const calculateAverageDiscount = () => {
        if (products.length === 0) return 0;
        const totalDiscount = products.reduce((acc, product) => {
            if (product.price && product.salePrice) {
                const discount = ((Number(product.price) - Number(product.salePrice)) / Number(product.price)) * 100;
                return acc + discount;
            }
            return acc;
        }, 0);
        return Math.round(totalDiscount / products.length);
    };

    const averageDiscount = calculateAverageDiscount();

    return (
        <Container>
            <div className="space-y-6">
                <PageHeader
                    title="Sales & Special Offers"
                    description="Discover amazing deals on your favorite beauty products"
                />
                
                <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 bg-secondary/50 rounded-lg px-4 py-2">
                        <Tag className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">
                            Up to {averageDiscount}% Off
                        </span>
                    </div>
                    <div className="flex items-center gap-2 bg-secondary/50 rounded-lg px-4 py-2">
                        <Clock className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">
                            Limited Time Offers
                        </span>
                    </div>
                    <Badge variant="secondary" className="text-sm">
                        {products.length} Products on Sale
                    </Badge>
                </div>
            </div>

            {products.length === 0 ? (
                <div className="text-center py-12">
                    <h3 className="text-lg font-medium mb-2">No Active Sales</h3>
                    <p className="text-muted-foreground">
                        Check back soon for new deals and promotions!
                    </p>
                </div>
            ) : (
                <ProductGrid products={products} />
            )}
        </Container>
    );
}
