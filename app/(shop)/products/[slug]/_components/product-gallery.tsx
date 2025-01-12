import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Share2 } from 'lucide-react';
import { cn } from "@/lib/utils";
import { useState } from 'react';
import { ProductImage } from '@prisma/client';

interface ProductGalleryProps {
  images: ProductImage[];
  name: string;
  onShare: () => void;
}

export function ProductGallery({ images, name, onShare }: ProductGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  return (
    <div className="sticky top-24 space-y-4">
      <div className="relative aspect-square overflow-hidden ">
        <Image
          src={images[selectedImageIndex]?.url || '/placeholder.png'}
          alt={images[selectedImageIndex]?.alt || name}
          fill
          className="object-cover"
          priority
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 z-10 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
          onClick={onShare}
        >
          <Share2 className="h-5 w-5" />
        </Button>
      </div>
      
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedImageIndex(index)}
              className={cn(
                "relative aspect-square cursor-pointer overflow-hidden rounded-lg bg-background p-1",
                selectedImageIndex === index && "ring-2 ring-primary"
              )}
            >
              <Image
                src={image.url}
                alt={image.alt || name}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
