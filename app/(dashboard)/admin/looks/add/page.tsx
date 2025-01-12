import { getAllProducts } from "@/features/products/management/actions/get-all-products";
import LookForm from "../_components/look-form";

export default async function AddLookPage() {
    const products = await getAllProducts();
    return <LookForm products={products} />;
}