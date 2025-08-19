"use client";

import * as React from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import type { EmblaOptionsType } from "embla-carousel";
import { Review } from "@/types";

interface EmblaOpacityCarouselProps {
  slides: Review[];
  options?: EmblaOptionsType;
  className?: string;
  heightClass?: string;
}

const EmblaOpacityCarousel: React.FC<EmblaOpacityCarouselProps> = ({
  slides,
  options = { loop: true, align: "center" },
  className = "",
  heightClass = "h-80 sm:h-96 lg:h-[28rem]",
}) => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  const autoplay = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(options, [autoplay.current]);

  const onSelect = React.useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  React.useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  const scrollPrev = React.useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = React.useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div className={`relative scroll-mt-30 ${className}`} id="reviews">
      <h2 className="font-bold text-3xl mt-5 mb-8">Отзывы</h2>

      {/* Viewport → SEMPRE montato */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.length > 0 ? (
            slides.map((review, i) => {
              const isActive = i === selectedIndex;
              return (
                <div
                  key={review.id}
                  className="relative min-w-0 
                             flex-[0_0_100%] sm:flex-[0_0_33.333%] lg:flex-[0_0_20%] 
                             px-2"
                >
                  <div
                    className={`
                      relative w-full ${heightClass}
                      flex items-center justify-center
                      transition-all duration-500
                      ${isActive ? "opacity-100 scale-105" : "opacity-40 scale-95"}
                    `}
                  >
                    <Image
                      src={review.imageUrl}
                      alt="review image"
                      fill
                      className="object-contain object-center rounded-xl"
                      sizes="(max-width: 640px) 100vw,
                             (max-width: 1024px) 33vw,
                             20vw"
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="w-full flex items-center justify-center py-20 text-gray-400">
              Nessuna recensione
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none">
        <button
          onClick={scrollPrev}
          disabled={!canScrollPrev}
          className="pointer-events-auto rounded-full bg-white/80 backdrop-blur px-3 py-2 shadow hover:bg-white disabled:opacity-50"
        >
          ‹
        </button>
        <button
          onClick={scrollNext}
          disabled={!canScrollNext}
          className="pointer-events-auto rounded-full bg-white/80 backdrop-blur px-3 py-2 shadow hover:bg-white disabled:opacity-50"
        >
          ›
        </button>
      </div>
    </div>
  );
};

export default EmblaOpacityCarousel;