import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

interface LookCarouselProps {
  images: string[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
}

const LookCarousel = ({ images, currentIndex, onIndexChange }: LookCarouselProps) => {
  return (
    <div className="relative aspect-[3/4] w-full ">
      <Carousel
        opts={{ loop: true }}
        className="w-full"
        index={currentIndex}
        setIndex={onIndexChange}
        {...({ index: currentIndex, setIndex: onIndexChange } as any)}
        as="div"
      >
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index}>
              <div className="relative aspect-[3/4] w-full bg-muted">
                <Image
                  src={image}
                  alt={`Look image ${index + 1}`}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>

      <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 gap-1">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => onIndexChange(index)}
            className={cn(
              "h-1 w-1 rounded-full bg-background/50 transition-all",
              currentIndex === index && "w-2 bg-background"
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default LookCarousel;
