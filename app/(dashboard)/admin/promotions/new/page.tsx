import { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { PromotionForm } from "../_components/promotion-form";
import { Shell } from "@/components/layouts/shell";

export const metadata: Metadata = {
  title: "New Promotion",
  description: "Create a new promotion or sale",
};

export default function NewPromotionPage() {
  return (
    <Shell>
      <PageHeader
        title="New Promotion"
        description="Create a new promotion or sale"
      />
      <div className="grid gap-6">
        <PromotionForm />
      </div>
    </Shell>
  );
}
