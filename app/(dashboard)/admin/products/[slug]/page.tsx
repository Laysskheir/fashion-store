import { getCategories } from "@/features/categories/actions/categories";
import { getSubCategory } from "@/features/categories/actions/subcategories";
import { ProductForm } from "../add/components/product-form";
import { notFound } from "next/navigation";
import { getProduct } from "@/features/products/management/actions/admin/get-product-admin";

interface Props {
  params: {
    slug: string;
  };
}

export default async function EditProductPage({ params }: Props) {
  const [categories, subcategories, product] = await Promise.all([
    getCategories(),
    getSubCategory(),
    getProduct(params.slug),
  ]);

  if (!product) {
    return notFound();
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm
          categories={categories}
          subcategories={subcategories}
          product={product}
          isEditing
        />
      </div>
    </div>
  );
}
