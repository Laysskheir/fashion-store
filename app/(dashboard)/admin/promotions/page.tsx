import { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { Shell } from "@/components/layouts/shell";
import { PromotionsTable } from "./_components/promotions-table";

export const metadata: Metadata = {
  title: "Promotions",
  description: "Manage your store promotions and sales",
};

export default async function PromotionsPage() {
  return (
    <Shell>
      <PageHeader
        title="Promotions"
        description="Manage your store promotions and sales"
      />
      <PromotionsTable />
    </Shell>
  );
}
