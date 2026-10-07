'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Banner } from '@/types/database';

interface HeroBannerProps {
  banners?: Banner[];
}

export function HeroBanner({ banners }: HeroBannerProps) {
  // Default high-quality 16:9 e-commerce banners
  const defaultBanners: Banner[] = [
    {
      id: 'banner-1',
      title: 'Better Products, Happier You',
      subtitle: 'Exclusive deals on top-rated electronics, home essentials & lifestyle picks.',
      badge_text: 'HOT PICKS',
      cta_text: 'Shop Now',
      cta_url: '/products',
      image_url: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600&auto=format&fit=crop&q=85',
      banner_type: 'hero',
      sort_order: 1,
      is_active: true,
    },
    {
      id: 'banner-2',
      title: 'Smart Gadgets & Audio Gear',
      subtitle: 'Premium wireless earbuds, smartwatches, and work-from-home accessories.',
      badge_text: 'TECH SPECIAL',
      cta_text: 'Explore Electronics',
      cta_url: '/category/electronics',
      image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1600&auto=format&fit=crop&q=85',
      banner_type: 'hero',
      sort_order: 2,
      is_active: true,
    },
    {
      id: 'banner-3',
      title: 'Home & Modern Living Essentials',
      subtitle: 'Upgrade your living space with minimalist home goods and comfort picks.',
      badge_text: 'HOME PICKS',
      cta_text: 'Discover Home Goods',
      cta_url: '/category/home-living',
      image_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1600&auto=format&fit=crop&q=85',
      banner_type: 'hero',
      sort_order: 3,
      is_active: true,
    },
    {
      id: 'banner-4',
      title: 'Curated Fashion & Daily Accessories',
      subtitle: 'Trendy apparel, premium watches, backpacks, and daily carry.',
      badge_text: 'NEW ARRIVALS',
      cta_text: 'View Collection',
      cta_url: '/category/fashion',
      image_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&auto=format&fit=crop&q=85',
      banner_type: 'hero',
      sort_order: 4,
      is_active: true,
    },
  ];

  const activeBanners = banners && banners.length > 0 ? banners : defaultBanners;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
  }, [activeBanners.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
  }, [activeBanners.length]);

  // Auto sliding every 4.5 seconds
  useEffect(() => {
    if (activeBanners.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      nextSlide();
    }, 4500);

    return () => clearInterval(timer);
  }, [activeBanners.length, isPaused, nextSlide]);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 pt-3 sm:pt-4">
      {/* 16:9 Auto Image Slider Container */}
      <div
        className="relative w-full aspect-16/9 overflow-hidden rounded-2xl sm:rounded-3xl bg-gray-100 shadow-sm border border-gray-200/80 select-none group"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Slides */}
        {activeBanners.map((banner, index) => {
          const isActive = index === currentIndex;
          const href = banner.cta_url || '/products';

          return (
            <div
              key={banner.id || index}
              className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <Link href={href} className="block w-full h-full relative cursor-pointer">
                {/* 16:9 Banner Image */}
                <img
                  src={banner.image_url}
                  alt={banner.title || 'Promotional Banner'}
                  className="w-full h-full object-cover object-center"
                />

                {/* Subtle Gradient Overlay for visual depth and text clarity */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex flex-col justify-end p-4 sm:p-8 md:p-12">
                  <div className="max-w-2xl transform transition-transform duration-500 translate-y-0">
                    {banner.badge_text && (
                      <span className="inline-block px-2.5 py-1 mb-2 rounded-md bg-[#0B5D36] text-white text-[10px] sm:text-xs font-bold tracking-wider uppercase shadow-xs">
                        {banner.badge_text}
                      </span>
                    )}
                    {banner.title && (
                      <h2 className="text-lg sm:text-2xl md:text-4xl font-heading font-black text-white leading-tight drop-shadow-md">
                        {banner.title}
                      </h2>
                    )}
                    {banner.subtitle && (
                      <p className="mt-1 text-xs sm:text-sm md:text-base text-gray-200 line-clamp-1 sm:line-clamp-2 max-w-lg drop-shadow-sm font-medium">
                        {banner.subtitle}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          );
        })}

        {/* Navigation Arrows */}
        {activeBanners.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                prevSlide();
              }}
              aria-label="Previous Slide"
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-[#0B5D36] text-white backdrop-blur-xs flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-md cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                nextSlide();
              }}
              aria-label="Next Slide"
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-[#0B5D36] text-white backdrop-blur-xs flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-md cursor-pointer"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </>
        )}

        {/* Pagination Dots */}
        {activeBanners.length > 1 && (
          <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-xs">
            {activeBanners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  index === currentIndex
                    ? 'w-6 sm:w-8 h-2 bg-[#0B5D36] ring-1 ring-white/60'
                    : 'w-2 h-2 bg-white/60 hover:bg-white'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
