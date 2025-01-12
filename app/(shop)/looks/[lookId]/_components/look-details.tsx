"use client";

import { useState } from "react";
import { Look, Product } from "@prisma/client";
import LookCarousel from "./look-carousel";
import ProductCard from "./product-card";

interface LookDetailsProps {
  look: Look & {
    products: {
      product: Product & {
        images: { url: string }[];
      };
    }[];
  };
}

const LookDetails = ({ look }: LookDetailsProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="px-4  sm:px-6 lg:px-8">
      <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
        {/* Look Images */}
        <div >
          <LookCarousel
            images={[look.image]}
            currentIndex={currentIndex}
            onIndexChange={setCurrentIndex}
          />
        </div>

        {/* Look Details & Products */}
        <div className="mt-8 lg:mt-0 ">
          

          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-medium text-foreground">Included in this look</h2>
              <span className="text-sm text-muted-foreground">{look.products.length} items</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {look.products.map(({ product }) => (
                <ProductCard key={product.id} data={product} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LookDetails;
