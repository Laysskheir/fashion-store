import Image from "next/image";
import Link from "next/link";

import { Product } from "@prisma/client";
import { formatPrice } from "@/lib/utils";
import { Plus } from "lucide-react";

interface ProductCardProps {
  data: Product & {
    images: { url: string }[];
  };
}

const ProductCard = ({ data }: ProductCardProps) => {
  return (
    <Link href={`/products/${data.slug}`} className="group">
      <div className="relative aspect-square  overflow-hidden bg-muted rounded-lg">
        <Image
          src={data.images[0].url}
          alt={data.name}
          fill
          className="object-cover"
        />
        <button className="absolute right-2 top-2 z-10 rounded-full bg-background/80 p-1.5 opacity-0 transition group-hover:opacity-100">
          <Plus className="h-3 w-3 text-foreground" />
        </button>
      </div>
      <div className="mt-2">
        <div className="flex flex-col gap-1">
          <h3 className="text-xs font-medium text-foreground line-clamp-1">{data.name}</h3>
          <p className="text-xs font-medium text-muted-foreground">{formatPrice(data.basePrice)}</p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
