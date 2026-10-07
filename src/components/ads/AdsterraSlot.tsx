'use client';

import React, { useEffect, useRef } from 'react';

interface AdsterraSlotProps {
  type?: 'banner' | 'native';
  adCode?: string;
  className?: string;
}

export function AdsterraSlot({ type = 'banner', adCode, className = '' }: AdsterraSlotProps) {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!adRef.current || !adCode) return;

    // Inject ad HTML or script safely
    try {
      const range = document.createRange();
      const documentFragment = range.createContextualFragment(adCode);
      adRef.current.innerHTML = '';
      adRef.current.appendChild(documentFragment);
    } catch {
      // Fallback
    }
  }, [adCode]);

  // If custom code is set in site_settings, render it
  if (adCode && adCode.trim().length > 0) {
    return (
      <div className={`my-8 max-w-7xl mx-auto px-4 ${className}`}>
        <div className="bg-[#f7fbf9] border border-emerald-100 rounded-2xl p-4 text-center overflow-hidden">
          <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
            Sponsored Partner
          </div>
          <div ref={adRef} className="flex items-center justify-center min-h-[90px]" />
        </div>
      </div>
    );
  }

  // Default clean sponsored banner placeholder matching design reference
  return (
    <div className={`my-8 max-w-7xl mx-auto px-4 ${className}`}>
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-100 p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
        <div className="text-center sm:text-left">
          <span className="text-[10px] font-bold uppercase tracking-wider bg-white/80 border border-emerald-200 text-[#0B5D36] px-2 py-0.5 rounded-md inline-block mb-1.5">
            Verified Partner Offer
          </span>
          <h4 className="font-heading font-bold text-sm sm:text-base text-gray-900">
            Stay in the Flow — Work. Play. Create.
          </h4>
          <p className="text-xs text-gray-500 mt-0.5">
            Discover verified tech accessories and productivity tools at official prices.
          </p>
        </div>
        <a
          href="/deals"
          className="shrink-0 px-4 py-2 rounded-xl bg-[#0B5D36] hover:bg-[#074528] text-white text-xs font-semibold shadow-xs transition-all"
        >
          Explore Offers →
        </a>
      </div>
    </div>
  );
}
