// app/admin/categories/add/page.tsx

import { getCategories } from "@/features/categories/actions/categories";
import AddCategoryForm from "./_components/add-category-form";

export default async function AddCategoryPage() {
  const categories = await getCategories();

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <AddCategoryForm categories={categories} />
      </div>
    </div>
  );
}
