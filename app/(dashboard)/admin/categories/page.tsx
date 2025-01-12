import { getCategories } from "@/features/categories/actions/categories";
import CategoriesTable from "./_components/categories-table";
import { SubcategoriesTable } from "./_components/subcategories-table";
import { getSubCategory } from "@/features/categories/actions/subcategories";

export default async function Page() {
  const categories = await getCategories();
  const subcategories = await getSubCategory();
  
  return (
    <div className="space-y-8">
      <CategoriesTable categories={categories} />
      <SubcategoriesTable data={subcategories} />
    </div>
  );
}
