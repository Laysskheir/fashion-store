import Footer from "@/components/layouts/Footer";
import Navbar from "@/components/layouts/Navbar";
import { Toaster } from "@/components/ui/toaster";
import React from "react";
import { getCategories } from "@/features/categories/actions/categories";
import { unstable_cache } from "@/lib/unstable-cache";

// Cache the categories fetch
const getCachedCategories = unstable_cache(
  async () => {
    return getCategories();
  },
  ["categories"],
  { revalidate: 3600 }
);

export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await getCachedCategories();

  return (
    <div>
      <Navbar categories={categories} />
      {children}
      <Footer />
      <Toaster />
    </div>
  );
}
