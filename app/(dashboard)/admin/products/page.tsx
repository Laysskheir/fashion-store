import { getAllProducts } from "@/features/products/management/actions/admin/get-all-products";
import ProductsTable from "./_components/products";

export default async function ProductsPage() {
  const products = await getAllProducts();
  return (
    <ProductsTable products={products} />
  )
}
