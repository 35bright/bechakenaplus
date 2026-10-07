'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Flame, ArrowRight, Clock } from 'lucide-react';
import { ProductCard } from '@/components/product/ProductCard';
import { Product } from '@/types/database';

interface DealsSectionProps {
  products: Product[];
}

export function DealsSection({ products }: DealsSectionProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 6,
    minutes: 24,
    seconds: 13,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNum = (n: number) => n.toString().padStart(2, '0');

  // Filter deal products
  const dealProducts = products.filter(p => p.is_deal || (p.discount_percent && p.discount_percent >= 30)).slice(0, 5);

  if (dealProducts.length === 0) return null;

  return (
    <section className="w-full max-w-7xl mx-auto px-4 mt-14">
      <div className="bg-[#f2faf5] rounded-3xl p-5 sm:p-8 border border-emerald-100">
        {/* Section Header with Countdown Timer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0B5D36] text-white flex items-center justify-center shadow-xs">
              <Flame className="w-5 h-5 fill-amber-300 text-amber-300" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-xl sm:text-2xl text-gray-900 tracking-tight flex items-center gap-2">
                <span>Today&apos;s Deals</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-600 uppercase">
                  Hot
                </span>
              </h2>
              <p className="text-xs text-gray-500">Limited time discounted prices</p>
            </div>
          </div>

          {/* Countdown timer pill (matching mobile & desktop design) */}
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-emerald-200 shadow-2xs">
            <Clock className="w-4 h-4 text-red-500 animate-pulse" />
            <span className="text-xs text-gray-500 font-medium">Ends in:</span>
            <div className="flex items-center gap-1 font-mono font-bold text-sm text-red-600">
              <span className="bg-red-50 px-1.5 py-0.5 rounded">{formatNum(timeLeft.hours)}</span>
              <span>:</span>
              <span className="bg-red-50 px-1.5 py-0.5 rounded">{formatNum(timeLeft.minutes)}</span>
              <span>:</span>
              <span className="bg-red-50 px-1.5 py-0.5 rounded">{formatNum(timeLeft.seconds)}</span>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {dealProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View All Deals CTA */}
        <div className="mt-6 text-center">
          <Link
            href="/deals"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0B5D36] hover:text-[#074528] bg-white px-5 py-2 rounded-full border border-emerald-200 shadow-2xs hover:shadow-xs transition-all"
          >
            <span>See All Deals</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
