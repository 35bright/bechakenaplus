'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Banner } from '@/types/database';

interface HeroBannerProps {
  banners?: Banner[];
}

export function HeroBanner({ banners }: HeroBannerProps) {
  // Default high-quality 16:9 curated e-commerce banners
  const defaultBanners: Banner[] = [
    {
      id: 'banner-1',
      title: 'Better Products, Happier You',
      subtitle: 'Exclusive deals on top-rated electronics, home essentials & lifestyle picks.',
      badge_text: 'HOT PICKS',
      cta_text: 'Shop Now',
      cta_url: '/products',
      image_url: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&auto=format&fit=crop&q=85',
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
      image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&auto=format&fit=crop&q=85',
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
      image_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&auto=format&fit=crop&q=85',
      banner_type: 'hero',
      sort_order: 3,
      is_active: true,
    },
    {
      id: 'banner-4',
      title: 'Curated Fashion & Daily Carry',
      subtitle: 'Trendy apparel, premium watches, backpacks, and daily accessories.',
      badge_text: 'NEW ARRIVALS',
      cta_text: 'View Collection',
      cta_url: '/category/fashion',
      image_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=85',
      banner_type: 'hero',
      sort_order: 4,
      is_active: true,
    },
    {
      id: 'banner-5',
      title: 'Fitness & Outdoor Exploration',
      subtitle: 'Gear up for active adventures, workouts, and outdoor comfort.',
      badge_text: 'ACTIVE LIFE',
      cta_text: 'Shop Fitness',
      cta_url: '/category/sports-outdoors',
      image_url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1200&auto=format&fit=crop&q=85',
      banner_type: 'hero',
      sort_order: 5,
      is_active: true,
    },
    {
      id: 'banner-6',
      title: 'Beauty & Daily Wellness Care',
      subtitle: 'Skincare, wellness essentials, and genuine self-care products.',
      badge_text: 'WELLNESS PICKS',
      cta_text: 'Explore Beauty',
      cta_url: '/category/beauty-personal-care',
      image_url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&auto=format&fit=crop&q=85',
      banner_type: 'hero',
      sort_order: 6,
      is_active: true,
    },
  ];

  const activeBanners = banners && banners.length > 0 ? banners : defaultBanners;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const totalSlides = activeBanners.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Auto-slide every 4.5 seconds
  useEffect(() => {
    if (totalSlides <= 1 || isPaused) return;

    const timer = setInterval(() => {
      nextSlide();
    }, 4500);

    return () => clearInterval(timer);
  }, [totalSlides, isPaused, nextSlide]);

  // Second banner index for Desktop (side-by-side)
  const secondaryIndex = (currentIndex + 1) % totalSlides;

  const primaryBanner = activeBanners[currentIndex];
  const secondaryBanner = activeBanners[secondaryIndex];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 pt-2.5 sm:pt-3">
      <div
        className="relative group select-none"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Desktop: 2 photos side by side | Mobile: 1 photo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          
          {/* Banner Card 1 (Mobile & Desktop) */}
          <div className="relative aspect-16/9 w-full overflow-hidden rounded-2xl bg-gray-100 shadow-xs border border-gray-200/80 transition-all duration-300 hover:shadow-md">
            <Link
              href={primaryBanner.cta_url || '/products'}
              className="block w-full h-full relative group/item cursor-pointer"
            >
              <img
                src={primaryBanner.image_url}
                alt={primaryBanner.title || 'Promotional Banner'}
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover/item:scale-105"
              />

              {/* Gradient text overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent flex flex-col justify-end p-4 sm:p-6">
                <div className="max-w-md">
                  {primaryBanner.badge_text && (
                    <span className="inline-block px-2.5 py-0.5 mb-1.5 rounded-md bg-[#0B5D36] text-white text-[10px] font-bold tracking-wider uppercase shadow-xs">
                      {primaryBanner.badge_text}
                    </span>
                  )}
                  {primaryBanner.title && (
                    <h2 className="text-base sm:text-xl font-heading font-extrabold text-white leading-tight drop-shadow-md line-clamp-1">
                      {primaryBanner.title}
                    </h2>
                  )}
                  {primaryBanner.subtitle && (
                    <p className="mt-1 text-xs text-gray-200 line-clamp-1 font-medium drop-shadow-xs">
                      {primaryBanner.subtitle}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          </div>

          {/* Banner Card 2 (Desktop Side-by-Side) */}
          <div className="hidden md:block relative aspect-16/9 w-full overflow-hidden rounded-2xl bg-gray-100 shadow-xs border border-gray-200/80 transition-all duration-300 hover:shadow-md">
            <Link
              href={secondaryBanner.cta_url || '/products'}
              className="block w-full h-full relative group/item cursor-pointer"
            >
              <img
                src={secondaryBanner.image_url}
                alt={secondaryBanner.title || 'Promotional Banner'}
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover/item:scale-105"
              />

              {/* Gradient text overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent flex flex-col justify-end p-4 sm:p-6">
                <div className="max-w-md">
                  {secondaryBanner.badge_text && (
                    <span className="inline-block px-2.5 py-0.5 mb-1.5 rounded-md bg-[#0B5D36] text-white text-[10px] font-bold tracking-wider uppercase shadow-xs">
                      {secondaryBanner.badge_text}
                    </span>
                  )}
                  {secondaryBanner.title && (
                    <h2 className="text-base sm:text-xl font-heading font-extrabold text-white leading-tight drop-shadow-md line-clamp-1">
                      {secondaryBanner.title}
                    </h2>
                  )}
                  {secondaryBanner.subtitle && (
                    <p className="mt-1 text-xs text-gray-200 line-clamp-1 font-medium drop-shadow-xs">
                      {secondaryBanner.subtitle}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          </div>

        </div>

        {/* Navigation Arrows */}
        {totalSlides > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                prevSlide();
              }}
              aria-label="Previous Slide"
              className="absolute left-1 sm:-left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-[#0B5D36] text-gray-800 hover:text-white backdrop-blur-xs flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-lg border border-gray-200 hover:border-emerald-600 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                nextSlide();
              }}
              aria-label="Next Slide"
              className="absolute right-1 sm:-right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-[#0B5D36] text-gray-800 hover:text-white backdrop-blur-xs flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-lg border border-gray-200 hover:border-emerald-600 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </>
        )}

        {/* Pagination Dots */}
        {totalSlides > 1 && (
          <div className="flex items-center justify-center gap-1.5 mt-2.5">
            {activeBanners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  index === currentIndex
                    ? 'w-5 sm:w-6 h-1.5 bg-[#0B5D36]'
                    : 'w-1.5 h-1.5 bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
