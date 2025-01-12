import { Metadata } from "next";
import LooksTable from "./_components/looks-table";
import { getAdminLooks } from "./actions/look-actions";

export const metadata: Metadata = {
  title: "Looks Management",
  description: "Manage your beauty looks and their products",
};

export default async function LooksPage() {
  const looks = await getAdminLooks();


  const formattedLooks = looks.map((look: any) => ({
    ...look,
    productsCount: look.products.length,
  }));

  return (
    <div className="flex-col">
      <LooksTable looks={formattedLooks} />
    </div>
  );
}