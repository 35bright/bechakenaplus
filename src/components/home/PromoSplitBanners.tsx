import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function PromoSplitBanners() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 mt-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        
        {/* Banner 1: Smart Gadgets (Dark Green) */}
        <div className="relative overflow-hidden rounded-3xl bg-[#0B5D36] text-white p-6 sm:p-8 flex flex-col justify-between min-h-[220px] shadow-sm">
          <div className="relative z-10 max-w-[65%] sm:max-w-[60%]">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-md mb-3 inline-block">
              Tech Deals
            </span>
            <h3 className="font-heading font-bold text-lg sm:text-2xl leading-tight mb-2">
              Smart Gadgets for a Smarter You
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100 mb-4 line-clamp-2">
              Discover verified audio, wearables & productivity tech.
            </p>
            <Link
              href="/category/electronics"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-white bg-white/15 hover:bg-white hover:text-[#0B5D36] px-4 py-2 rounded-full backdrop-blur-xs transition-all"
            >
              <span>Explore Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Product Graphics */}
          <div className="absolute -right-4 -bottom-4 w-44 h-44 sm:w-56 sm:h-56 pointer-events-none opacity-95">
            <img
              src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80"
              alt="Smart Gadgets"
              className="w-full h-full object-contain drop-shadow-xl"
            />
          </div>
        </div>

        {/* Banner 2: Home Essentials (Soft Light Tint) */}
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#f2f9f5] to-[#e6f3eb] border border-emerald-100 text-gray-900 p-6 sm:p-8 flex flex-col justify-between min-h-[220px] shadow-sm">
          <div className="relative z-10 max-w-[65%] sm:max-w-[60%]">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-[#0B5D36]/10 text-[#0B5D36] px-2.5 py-1 rounded-md mb-3 inline-block">
              Home & Living
            </span>
            <h3 className="font-heading font-bold text-lg sm:text-2xl leading-tight mb-2 text-gray-900">
              Home Essentials for Better Everyday
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mb-4 line-clamp-2">
              Aesthetic lighting, cozy lifestyle gear and comfort picks.
            </p>
            <Link
              href="/category/home-living"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-white bg-[#0B5D36] hover:bg-[#074528] px-4 py-2 rounded-full transition-all shadow-xs"
            >
              <span>Shop Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Product Graphics */}
          <div className="absolute -right-4 -bottom-4 w-44 h-44 sm:w-56 sm:h-56 pointer-events-none opacity-95">
            <img
              src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&q=80"
              alt="Home Essentials"
              className="w-full h-full object-contain drop-shadow-xl"
            />
          </div>
        </div>

      </div>
    </section>
  );
}
