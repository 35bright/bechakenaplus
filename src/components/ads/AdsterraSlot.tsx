'use client';

import React, { useEffect, useRef } from 'react';

export type AdSlotType = '728x90' | '160x600' | 'native' | 'banner' | 'skyscraper';

interface AdsterraSlotProps {
  type?: AdSlotType;
  adCode?: string;
  className?: string;
  slotLabel?: string;
}

export function AdsterraSlot({
  type = '728x90',
  adCode,
  className = '',
  slotLabel,
}: AdsterraSlotProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !adCode || adCode.trim().length === 0) return;

    try {
      // Clear previous content
      containerRef.current.innerHTML = '';

      // Create a fragment to parse scripts and HTML
      const fragment = document.createRange().createContextualFragment(adCode);
      containerRef.current.appendChild(fragment);

      // Execute any script tags that were inserted
      const scripts = containerRef.current.querySelectorAll('script');
      scripts.forEach((script) => {
        const newScript = document.createElement('script');
        Array.from(script.attributes).forEach((attr) => {
          newScript.setAttribute(attr.name, attr.value);
        });
        newScript.textContent = script.textContent;
        script.parentNode?.replaceChild(newScript, script);
      });
    } catch {
      // Fallback
    }
  }, [adCode]);

  // Dimension helpers based on ad type
  const isSkyscraper = type === '160x600' || type === 'skyscraper';
  const isNative = type === 'native';
  const isLeaderboard = type === '728x90' || type === 'banner';

  const defaultLabel = isSkyscraper
    ? 'Sponsored • 160x600'
    : isNative
    ? 'Sponsored Recommendation'
    : 'Sponsored Partner • 728x90';

  // If real adCode is provided from Adsterra settings
  if (adCode && adCode.trim().length > 0) {
    if (isSkyscraper) {
      return (
        <div className={`flex flex-col items-center justify-start ${className}`}>
          <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
            {slotLabel || defaultLabel}
          </div>
          <div
            ref={containerRef}
            className="w-[160px] min-h-[600px] bg-white border border-gray-100 rounded-xl overflow-hidden shadow-2xs flex items-center justify-center"
          />
        </div>
      );
    }

    if (isNative) {
      return (
        <div className={`w-full max-w-7xl mx-auto px-4 my-6 ${className}`}>
          <div className="bg-[#f8fbf9] border border-emerald-100 rounded-2xl p-4 overflow-hidden">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#0B5D36] mb-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0B5D36]" />
              <span>{slotLabel || defaultLabel}</span>
            </div>
            <div ref={containerRef} className="w-full min-h-[120px] flex items-center justify-center" />
          </div>
        </div>
      );
    }

    // Default Leaderboard 728x90
    return (
      <div className={`w-full max-w-7xl mx-auto px-4 my-6 ${className}`}>
        <div className="bg-[#f8fbf9] border border-emerald-100 rounded-2xl p-3 sm:p-4 text-center overflow-hidden">
          <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
            {slotLabel || defaultLabel}
          </div>
          <div
            ref={containerRef}
            className="w-full max-w-[728px] mx-auto min-h-[90px] flex items-center justify-center overflow-hidden"
          />
        </div>
      </div>
    );
  }

  // Placeholder when ad code has not yet been pasted by admin
  if (isSkyscraper) {
    return (
      <div className={`hidden xl:flex flex-col items-center justify-start ${className}`}>
        <div className="w-[160px] h-[600px] rounded-2xl bg-linear-to-b from-emerald-50/70 to-emerald-100/40 border border-emerald-200/60 p-4 flex flex-col justify-between text-center shadow-2xs">
          <div>
            <span className="text-[9px] font-bold uppercase tracking-wider bg-white px-2 py-0.5 rounded text-[#0B5D36] shadow-2xs inline-block">
              Sponsored
            </span>
            <p className="font-heading font-bold text-xs text-gray-800 mt-4 leading-snug">
              Top Deals & Tech Accessories
            </p>
          </div>
          <div className="text-[10px] text-gray-500 font-medium">160 × 600 Adsterra Banner</div>
          <a
            href="/deals"
            className="px-2 py-1.5 rounded-lg bg-[#0B5D36] text-white text-[11px] font-semibold hover:bg-[#074528] transition-colors"
          >
            Explore →
          </a>
        </div>
      </div>
    );
  }

  if (isNative) {
    return (
      <div className={`w-full max-w-7xl mx-auto px-4 my-6 ${className}`}>
        <div className="rounded-2xl bg-linear-to-r from-emerald-50 via-teal-50/50 to-emerald-50 border border-emerald-100 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0B5D36] text-white flex items-center justify-center font-bold text-xs shrink-0">
              b+
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B5D36] block">
                Native Recommendation
              </span>
              <p className="font-heading font-bold text-sm text-gray-900">
                Discover Verified Everyday Essentials with Express Delivery
              </p>
            </div>
          </div>
          <a
            href="/products"
            className="shrink-0 px-4 py-2 rounded-xl bg-[#0B5D36] hover:bg-[#074528] text-white text-xs font-semibold shadow-xs transition-all"
          >
            Explore Products →
          </a>
        </div>
      </div>
    );
  }

  // Default Leaderboard 728x90 Placeholder
  return (
    <div className={`w-full max-w-7xl mx-auto px-4 my-6 ${className}`}>
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-emerald-50/80 via-white to-emerald-50/80 border border-emerald-100 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
        <div className="text-center sm:text-left">
          <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100/80 text-[#0B5D36] px-2 py-0.5 rounded-md inline-block mb-1">
            Partner Special • 728×90
          </span>
          <h4 className="font-heading font-bold text-sm sm:text-base text-gray-900">
            Exclusive Deals on High-Quality Electronics & Everyday Carry
          </h4>
          <p className="text-xs text-gray-500 mt-0.5">
            Discover verified picks and seasonal promotions at official prices.
          </p>
        </div>
        <a
          href="/deals"
          className="shrink-0 px-4 py-2 rounded-xl bg-[#0B5D36] hover:bg-[#074528] text-white text-xs font-semibold shadow-xs transition-all"
        >
          View Offers →
        </a>
      </div>
    </div>
  );
}
