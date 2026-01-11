"use client";

import { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";

// ✅ import modules from 'swiper/modules'
import { Navigation, Thumbs } from "swiper/modules";

// ✅ import CSS
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";

interface ProductSwiperGalleryProps {
  images: string[];
}

export default function ProductSwiperGallery({
  images,
}: ProductSwiperGalleryProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);

  if (!images || images.length === 0) return null;

  return (
    <div>
      {/* Main Swiper */}
      <Swiper
        modules={[Navigation, Thumbs]}
        navigation
        thumbs={{ swiper: thumbsSwiper }}
        spaceBetween={10}
        className="w-full md:w-3/4"
      >
        {images.map((img, i) => (
          <SwiperSlide key={i}>
            <Image
              src={img}
              alt={`Product Image ${i}`}
              width={700}
              height={700}
              className="w-full h-auto object-contain rounded"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Thumbnails */}
      <Swiper
        onSwiper={setThumbsSwiper}
        modules={[Thumbs]}
        spaceBetween={10}
        slidesPerView={images.length > 5 ? 5 : images.length}
        watchSlidesProgress
        className="w-full md:w-1/4 mt-2 md:mt-2"
      >
        {images.map((img, i) => (
          <SwiperSlide
            key={i}
            className="cursor-pointer border border-gray-300 rounded"
          >
            <Image
              src={img}
              alt={`Thumbnail ${i}`}
              width={100}
              height={100}
              className="object-cover w-full h-full"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
