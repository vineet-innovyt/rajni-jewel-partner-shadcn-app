"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductEntity } from "@/services/entities";
import Link from "next/link";
import { PARTNER_PRODUCTS_PAGE } from "@/lib/constants";

interface ProductCarouselProps {
  products: ProductEntity[];
  title: string;
}

export function ProductCarousel({ products, title }: ProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [autoPlay, products.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
    setAutoPlay(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
    setAutoPlay(false);
  };

  if (!products?.length) return;

  const product = products[currentIndex];

  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold text-center mb-8 text-foreground">
        <span className="text-balance">{title}</span>
      </h2>

      <div
        className="relative bg-card border border-border rounded-lg overflow-hidden"
        onMouseEnter={() => setAutoPlay(false)}
        onMouseLeave={() => setAutoPlay(true)}
      >
        <div className="aspect-square md:aspect-video relative">
          <Image
            src={product.images?.[0]?.url || "/placeholder.svg"}
            alt={product.name as string}
            fill
            className="object-cover"
            priority={currentIndex === 0}
          />
        </div>

        {/* Product Info Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6 text-white">
          <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
          <p className="text-sm text-gray-200 mb-4">{product.description}</p>
          <div className="flex justify-between items-center">
            <span className="text-3xl font-bold"> </span>
            <Link
              href={`${PARTNER_PRODUCTS_PAGE}/${product.id}`}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:opacity-90 transition"
            >
              View Details
            </Link>
          </div>
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition backdrop-blur-sm"
          aria-label="Previous product"
        >
          <ChevronLeft size={24} />
        </button>

        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition backdrop-blur-sm"
          aria-label="Next product"
        >
          <ChevronRight size={24} />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {products.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                setAutoPlay(false);
              }}
              className={`w-2 h-2 rounded-full transition ${
                index === currentIndex
                  ? "bg-white w-6"
                  : "bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Go to product ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
