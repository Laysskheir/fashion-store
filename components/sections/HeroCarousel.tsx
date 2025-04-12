"use client";

import Image from "next/image";
import { CoolButton } from "../cool-button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,

} from "@/components/ui/carousel";
import { HeroSlider } from "@prisma/client";
import Autoplay from "embla-carousel-autoplay";
import { useState, useEffect, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";
import Link from "next/link";

interface Props {
  sliders: HeroSlider[];
}

// Memoized Slide Content Component
const MemoizedSlideContent = React.memo(({
  slide,
  index,
  isActive
}: {
  slide: HeroSlider,
  index: number,
  isActive: boolean
}) => (
  <div className="relative overflow-hidden h-[80vh] w-full">
    {/* Dark overlay with motion */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: isActive ? 0.3 : 0,
        transition: {
          duration: 1,
          ease: "easeInOut"
        }
      }}
      className="absolute inset-0 bg-black z-10"
    />

    {/* Image with advanced motion effect */}
    <motion.div
      initial={{
        scale: 1.05,
        opacity: 0.8
      }}
      animate={{
        scale: isActive ? 1.15 : 1.05,
        opacity: isActive ? 1 : 0.8,
        transition: {
          duration: 5,
          type: "tween",
          ease: "anticipate"
        }
      }}
      className="absolute inset-0 overflow-hidden"
    >
      <Image
        src={slide.imageUrl || "/placeholder.svg"}
        alt={`Slide ${index + 1}`}
        fill
        priority={index === 0}
        className="object-cover"
        quality={90}
      />
    </motion.div>

    {/* Content with staggered animation */}
    <div className="absolute inset-0 top-1/2 -translate-y-14 z-20 container mx-auto px-4 pl-8">
      <div className="flex h-full items-center max-w-xl">
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={{
                hidden: {
                  opacity: 0,
                  y: 50,
                  transition: {
                    when: "afterChildren",
                    staggerChildren: 0.3
                  }
                },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    when: "beforeChildren",
                    staggerChildren: 0.3,
                    duration: 0.6,
                    type: "spring",
                    bounce: 0.4
                  }
                },
                exit: {
                  opacity: 0,
                  y: -50,
                  transition: {
                    when: "afterChildren",
                    staggerChildren: 0.1
                  }
                }
              }}
              className="space-y-6"
            >
              {/* Title with individual word animation */}
              <motion.h2
                variants={{
                  hidden: { opacity: 0, y: 50 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      type: "spring",
                      bounce: 0.4
                    }
                  },
                  exit: { opacity: 0, y: -50 }
                }}
                className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight"
              >
                {slide.title}
              </motion.h2>

              {/* Subtitle with staggered animation */}
              {slide.subtitle && (
                <motion.p
                  variants={{
                    hidden: { opacity: 0, y: 50 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        type: "spring",
                        bounce: 0.4,
                        delay: 0.3
                      }
                    },
                    exit: { opacity: 0, y: -50 }
                  }}
                  className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed"
                >
                  {slide.subtitle}
                </motion.p>
              )}

              {/* Button with pop animation */}
              {slide.buttonText && (
                <motion.div
                  variants={{
                    hidden: { opacity: 0, scale: 0.8 },
                    visible: {
                      opacity: 1,
                      scale: 1,
                      transition: {
                        type: "spring",
                        stiffness: 300,
                        damping: 10,
                        delay: 0.6
                      }
                    },
                    exit: { opacity: 0, scale: 0.8 }
                  }}
                >
                  <Link href={slide.linkUrl || ""}><CoolButton
                    size="lg"
                  >
                    {slide.buttonText}
                  </CoolButton></Link>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  </div>
));

export default function HeroCarousel({ sliders }: Props) {
  // Handle empty sliders case
  if (!sliders || sliders.length === 0) {
    return (
      <div
        role="alert"
        className="w-full h-[80vh] flex items-center justify-center bg-gray-100"
      >
        <p className="text-gray-500 text-xl">No slides available</p>
      </div>
    );
  }

  // Use useMemo to memoize plugin creation
  const plugin = useMemo(() =>
    Autoplay({
      delay: 5000,
      stopOnInteraction: true,
    }),
    []
  );

  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);

  // Consolidate state management
  const [carouselState, setCarouselState] = useState({
    api: null as any,
    isPaused: false,
  });

  // Memoized progress animation to reduce unnecessary re-renders
  const startProgressAnimation = useCallback(() => {
    const TOTAL_DURATION = 5000;
    const INTERVAL = 50;
    const STEPS = TOTAL_DURATION / INTERVAL;

    const progressInterval = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + (INTERVAL / TOTAL_DURATION) * 100;

        if (newProgress >= 100) {
          const nextSlideIndex = (currentSlide + 1) % sliders.length;
          carouselState.api?.scrollTo(nextSlideIndex);
          setCurrentSlide(nextSlideIndex);
          return 0;
        }

        return newProgress;
      });
    }, INTERVAL);

    return () => clearInterval(progressInterval);
  }, [currentSlide, sliders.length, carouselState.api]);

  // Simplified effect management
  useEffect(() => {
    const stopAnimation = startProgressAnimation();
    return () => {
      stopAnimation();
    };
  }, [startProgressAnimation]);

  // Simplified pause toggle
  const togglePause = useCallback(() => {
    setCarouselState(prev => ({
      ...prev,
      isPaused: !prev.isPaused
    }));
  }, []);

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Hero Slides"
      className="relative"
    >
      <Carousel
        setApi={(api) => setCarouselState(prev => ({ ...prev, api }))}
        plugins={[plugin]}
        className="w-full"
        opts={{
          loop: true,
          watchSlides: true,
        }}
        onSlideChange={(emblaApi) => {
          const currentIndex = emblaApi?.selectedScrollSnap();
          setCurrentSlide(currentIndex as number);
          setProgress(0);
        }}
      >
        <CarouselContent>
          {sliders.map((slide, index) => (
            <CarouselItem key={slide.id || index}>
              <MemoizedSlideContent
                slide={slide}
                index={index}
                isActive={index === currentSlide}
              />
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Progress Indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30 flex space-x-3">
          {sliders.map((_, index) => (
            <div
              key={index}
              className="relative w-32 h-[4px] bg-white/30 rounded-full overflow-hidden"
            >
              <div
                className={cn(
                  "absolute top-0 left-0 h-full bg-white/90 transition-all duration-300 ease-linear",
                  index === currentSlide ? "visible" : "invisible"
                )}
                style={{
                  width: `${index === currentSlide ? progress : 0}%`
                }}
              />
            </div>
          ))}
        </div>
      </Carousel>
    </div>
  );
}
