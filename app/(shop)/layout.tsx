import Footer from "@/components/layouts/Footer";
import Navbar from "@/components/layouts/Navbar";
import React from "react";
import { Toaster } from "sonner";

const ShopLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Navbar />
      {children}
      <Footer />
      <Toaster/>
    </div>
  );
};

export default ShopLayout;
