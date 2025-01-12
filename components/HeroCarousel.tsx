"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { HeroSlider } from "@prisma/client";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";

interface Props {
  sliders: HeroSlider[];
}

export default function HeroCarousel({ sliders }: Props) {
  const plugin = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  return (
    <div className="relative">
      <Carousel
        plugins={[plugin.current]}
        className="w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {sliders.map((slide, index) => (
            <CarouselItem key={index} className="relative">
              <div className="relative overflow-hidden h-[80vh] w-full">
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/30 z-10" />

                {/* Image */}
                <Image
                  src={slide.imageUrl || "/placeholder.svg"}
                  alt={`Slide ${index + 1}`}
                  fill
                  priority={index === 0}
                  className="object-cover transform scale-105 transition-transform duration-2000 hover:scale-110"
                  quality={90}
                />

                {/* Content */}
                <div className="absolute inset-0 top-1/2 -translate-y-14 z-20 container mx-auto px-4 pl-8">
                  <div className="flex h-full items-center max-w-xl">
                    <div className="animate-fade-up animate-duration-[1000ms] animate-delay-500">
                      {/* Title */}
                      <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                        {slide.title}
                      </h2>

                      {/* Subtitle */}
                      {slide.subtitle && (
                        <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
                          {slide.subtitle}
                        </p>
                      )}

                      {/* Button */}
                      {slide.buttonText && (
                        <Button
                          size="lg"
                          className="bg-background hover:bg-background/90 text-foreground border border-primary/50"
                        >
                          {slide.buttonText}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation Arrows */}
        <CarouselPrevious
          className="left-4 h-12 w-12 opacity-70 hover:opacity-100 transition-opacity"
        />
        <CarouselNext
          className="right-4 h-12 w-12 opacity-70 hover:opacity-100 transition-opacity"
        />

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30 flex space-x-3">
          {sliders.map((_, index) => (
            <div
              key={index}
              className="w-32 h-[3px] rounded-lg bg-white/30"
            />
          ))}
        </div>
      </Carousel>
    </div>
  );
}
