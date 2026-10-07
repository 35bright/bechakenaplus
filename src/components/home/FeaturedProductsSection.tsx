'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from '@/components/product/ProductCard';
import { Product, Category } from '@/types/database';

interface FeaturedProductsSectionProps {
  products: Product[];
  categories: Category[];
}

export function FeaturedProductsSection({ products, categories }: FeaturedProductsSectionProps) {
  const [activeTab, setActiveTab] = useState('all');

  const filterTabs = useMemo(() => {
    return [
      { slug: 'all', label: 'All' },
      ...categories.slice(0, 6).map(c => ({ slug: c.slug, label: c.name.split('&')[0].trim() }))
    ];
  }, [categories]);

  const filteredProducts = useMemo(() => {
    if (activeTab === 'all') return products;
    const cat = categories.find(c => c.slug === activeTab);
    if (!cat) return products;
    return products.filter(p => p.category_id === cat.id || (p.category && p.category.slug === activeTab));
  }, [products, activeTab, categories]);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 mt-14">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-heading font-bold text-xl sm:text-2xl text-gray-900 tracking-tight">
            Featured Products
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Handpicked quality picks with verified ratings & best value
          </p>
        </div>

        {/* Category Pills Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {filterTabs.map((tab) => {
            const isActive = activeTab === tab.slug;
            return (
              <button
                key={tab.slug}
                onClick={() => setActiveTab(tab.slug)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#0B5D36] text-white shadow-xs'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-emerald-300 hover:text-[#0B5D36]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Products Grid (matching reference image: 5 cards on wide desktop, 2 on mobile) */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-5">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
          <p className="text-gray-500 text-sm">No products found in this category right now.</p>
          <button
            onClick={() => setActiveTab('all')}
            className="mt-3 text-xs font-semibold text-[#0B5D36] underline"
          >
            Show all products
          </button>
        </div>
      )}

      {/* Bottom View All Link */}
      <div className="mt-8 text-center">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white border-2 border-[#0B5D36] text-[#0B5D36] hover:bg-[#0B5D36] hover:text-white font-heading font-semibold text-xs sm:text-sm transition-all"
        >
          <span>Explore All Products</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
