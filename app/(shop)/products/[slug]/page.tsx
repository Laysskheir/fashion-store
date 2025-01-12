import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Link from "next/link";
import { getSimilarProducts } from "@/features/products/management/actions/shop/get-similar-products";
import { ProductDetails } from "./_components/product-details";
import { getShopProduct } from "@/features/products/management/actions/shop/get-product";
import { Container } from "@/components/ui/container";

export default async function ProductPage({ params }: { params: { slug: string } }) {
    const product = await getShopProduct(params.slug);

    if (!product) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <h1 className="text-2xl font-bold">Product not found</h1>
                <p className="text-muted-foreground">The product you are looking for does not exist.</p>
            </div>
        );
    }

    // Fetch similar products
    const similarProducts = await getSimilarProducts(product.id);

    return (
        <div className="">
            <Container className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <Breadcrumb className="mx-4 ">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink as={Link as any} href="/">Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink as={Link as any} href="/products">Products</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink>{product.name}</BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </Container>

            <ProductDetails product={product} similarProducts={similarProducts} />
        </div>
    );
}
