"use client";

import React, { useState, useEffect } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { Billboard as BillboardType } from "@/types";
import Billboard from "./billboard";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BillboardCarouselProps {
  billboards: BillboardType[];
}

const BillboardCarousel: React.FC<BillboardCarouselProps> = ({ billboards }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: {
      perView: 1,
      spacing: 0,
    },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
  });

  // Autoplay
  useEffect(() => {
    const interval = setInterval(() => {
      instanceRef.current?.next();
    }, 4000);
    return () => clearInterval(interval);
  }, [instanceRef]);

  return (
    <div className="relative w-screen h-[80vh] max-[500px]:h-[75vh] overflow-hidden">
      {/* Slider */}
      <div ref={sliderRef} className="keen-slider w-full h-full">
        {billboards.map((item) => (
          <div
            key={item.id}
            className="keen-slider__slide w-screen h-full flex-shrink-0"
          >
            <Billboard data={item} />
          </div>
        ))}
      </div>

      {/* Arrows */}
      <button
        onClick={() => instanceRef.current?.prev()}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full shadow"
      >
        <ChevronLeft />
      </button>
      <button
        onClick={() => instanceRef.current?.next()}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full shadow"
      >
        <ChevronRight />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {billboards.map((_, idx) => (
          <button
            key={idx}
            onClick={() => instanceRef.current?.moveToIdx(idx)}
            className={`h-2 w-2 rounded-full ${
              currentSlide === idx ? "bg-white w-5" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default BillboardCarousel;

