'use client';

import React, { useState, useMemo } from 'react';
import { Filter, SlidersHorizontal, X, ArrowUpDown } from 'lucide-react';
import { ProductCard } from '@/components/product/ProductCard';
import { Product, Category } from '@/types/database';

interface ProductsClientProps {
  initialProducts: Product[];
  categories: Category[];
  initialCategorySlug?: string;
  initialFilter?: string;
}

export function ProductsClient({
  initialProducts,
  categories,
  initialCategorySlug,
  initialFilter,
}: ProductsClientProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategorySlug ? [initialCategorySlug] : []
  );
  const [selectedBadges, setSelectedBadges] = useState<string[]>(
    initialFilter ? [initialFilter.toUpperCase()] : []
  );
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('relevance');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  const toggleCategory = (slug: string) => {
    setSelectedCategories(prev =>
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    );
  };

  const toggleBadge = (badge: string) => {
    setSelectedBadges(prev =>
      prev.includes(badge) ? prev.filter(b => b !== badge) : [...prev, badge]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedBadges([]);
    setMinPrice(0);
    setMaxPrice(10000);
    setMinRating(0);
    setSortBy('relevance');
  };

  const filteredProducts = useMemo(() => {
    return initialProducts.filter(product => {
      // Category filter
      if (selectedCategories.length > 0) {
        const catSlug = product.category?.slug;
        const matchesCategory = selectedCategories.some(s => s === catSlug);
        if (!matchesCategory) return false;
      }

      // Badges filter
      if (selectedBadges.length > 0) {
        const hasBadge = selectedBadges.some(b => {
          if (b === 'BEST-SELLER' || b === 'BEST SELLER') return product.is_best_seller || product.badges?.some(x => x.includes('BEST'));
          if (b === 'TRENDING') return product.is_trending || product.badges?.some(x => x.includes('TRENDING'));
          if (b === 'DEAL') return product.is_deal || (product.discount_percent && product.discount_percent > 20);
          return product.badges?.includes(b);
        });
        if (!hasBadge) return false;
      }

      // Price filter
      if (product.price < minPrice || product.price > maxPrice) return false;

      // Rating filter
      if (minRating > 0 && product.rating < minRating) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'discount') return (b.discount_percent || 0) - (a.discount_percent || 0);
      if (sortBy === 'newest') return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
      return (a.sort_order || 0) - (b.sort_order || 0);
    });
  }, [initialProducts, selectedCategories, selectedBadges, minPrice, maxPrice, minRating, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Top Header & Sort Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-2xs mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-gray-900">
            All Products
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Showing {filteredProducts.length} of {initialProducts.length} curated products
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile filter button */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-emerald-50 hover:text-[#0B5D36] transition-colors"
          >
            <Filter className="w-3.5 h-3.5 text-[#0B5D36]" />
            <span>Filters</span>
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-gray-500 font-medium hidden sm:inline">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent font-semibold text-gray-800 outline-hidden cursor-pointer"
            >
              <option value="relevance">Featured & Relevant</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="discount">Biggest Discount</option>
              <option value="newest">Newest Arrivals</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* DESKTOP SIDEBAR FILTERS */}
        <aside className="hidden lg:block lg:col-span-3 bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs space-y-6 sticky top-24">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2 font-heading font-bold text-sm text-gray-900">
              <SlidersHorizontal className="w-4 h-4 text-[#0B5D36]" />
              <span>Filters</span>
            </div>
            <button
              onClick={clearFilters}
              className="text-xs text-[#0B5D36] hover:underline font-semibold"
            >
              Reset All
            </button>
          </div>

          {/* Categories Checklist */}
          <div>
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-gray-900 mb-3">
              Categories
            </h4>
            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {categories.map((cat) => (
                <label key={cat.id} className="flex items-center gap-2.5 text-xs text-gray-700 cursor-pointer hover:text-[#0B5D36]">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat.slug)}
                    onChange={() => toggleCategory(cat.slug)}
                    className="w-4 h-4 rounded text-[#0B5D36] focus:ring-[#0B5D36] accent-[#0B5D36]"
                  />
                  <span>{cat.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="pt-4 border-t border-gray-100">
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-gray-900 mb-3">
              Max Price: ৳{maxPrice.toLocaleString()}
            </h4>
            <input
              type="range"
              min="500"
              max="10000"
              step="250"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#0B5D36] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-gray-400 mt-1 font-mono">
              <span>৳500</span>
              <span>৳10,000+</span>
            </div>
          </div>

          {/* Rating Filter */}
          <div className="pt-4 border-t border-gray-100">
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-gray-900 mb-3">
              Customer Rating
            </h4>
            <div className="space-y-1.5">
              {[4.5, 4.0, 3.5].map((rate) => (
                <button
                  key={rate}
                  onClick={() => setMinRating(minRating === rate ? 0 : rate)}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-medium transition-colors ${
                    minRating === rate ? 'bg-emerald-50 text-[#0B5D36] font-bold' : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <span>★ {rate} & above</span>
                  {minRating === rate && <span className="text-[#0B5D36]">✓</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Badges Filter */}
          <div className="pt-4 border-t border-gray-100">
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-gray-900 mb-3">
              Special Badges
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {['BEST SELLER', 'TRENDING', 'DEAL', 'NEW'].map((b) => {
                const isActive = selectedBadges.includes(b);
                return (
                  <button
                    key={b}
                    onClick={() => toggleBadge(b)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      isActive ? 'bg-[#0B5D36] text-white' : 'bg-gray-100 text-gray-600 hover:bg-emerald-50'
                    }`}
                  >
                    {b}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* PRODUCTS GRID */}
        <div className="lg:col-span-9">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-2xs">
              <p className="font-heading font-bold text-base text-gray-900">No matching products found</p>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                Try loosening your filters or resetting price and category selections.
              </p>
              <button
                onClick={clearFilters}
                className="mt-4 px-5 py-2 rounded-full bg-[#0B5D36] text-white text-xs font-semibold hover:bg-[#074528] transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>

      </div>

      {/* MOBILE FILTER DRAWER */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileFilterOpen(false)} />
          <div className="relative ml-auto w-4/5 max-w-xs bg-white h-full shadow-2xl z-10 flex flex-col justify-between p-5 overflow-y-auto animate-in slide-in-from-right">
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 className="font-heading font-bold text-sm text-gray-900">Filter Products</h3>
                <button onClick={() => setIsMobileFilterOpen(false)} className="p-1 rounded text-gray-500">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-gray-700 mb-2">Categories</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {categories.map((cat) => (
                    <label key={cat.id} className="flex items-center gap-2 text-xs text-gray-700">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat.slug)}
                        onChange={() => toggleCategory(cat.slug)}
                        className="w-4 h-4 rounded text-[#0B5D36] accent-[#0B5D36]"
                      />
                      <span>{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-gray-700 mb-2">
                  Max Price: ৳{maxPrice.toLocaleString()}
                </h4>
                <input
                  type="range"
                  min="500"
                  max="10000"
                  step="250"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#0B5D36]"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex gap-2">
              <button
                onClick={clearFilters}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600"
              >
                Reset
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#0B5D36] text-white text-xs font-semibold"
              >
                Apply ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
