// app/admin/sliders/page.tsx
import { getAllSliders } from "@/features/silders/actions/get-all-sliders";
import SlidersTable from "./_components/sliders-table";

export default async function SliderManagementPage() {
  const sliders = await getAllSliders();

  return <SlidersTable sliders={sliders} />;
}
