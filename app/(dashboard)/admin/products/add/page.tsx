// app/admin/products/add/page.tsx
import { getCategories } from "@/features/categories/actions/categories";
import { getSubCategory } from "@/features/categories/actions/subcategories";
import { ProductForm } from "./components/product-form";

export default async function AddProductPage() {
  const categories = await getCategories();

  const subcategories = await getSubCategory();
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm categories={categories} subcategories={subcategories} />
      </div>
    </div>
  );
}
