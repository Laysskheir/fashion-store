// app/(dashboard)/admin/categories/[slug]/page.tsx

import { getCategories, getCategory } from "@/features/categories/actions/categories";
import AddCategoryForm from "../add/_components/add-category-form";
import { notFound } from "next/navigation";

interface EditCategoryPageProps {
  params: {
    slug: string;
  };
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const categories = await getCategories();
  const category = await getCategory(params.slug);

  if (!category) {
    notFound();
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <AddCategoryForm 
          categories={categories.filter(cat => cat.id !== category.id)} 
          initialData={category}
        />
      </div>
    </div>
  );
}
