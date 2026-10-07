'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Heart, ShoppingBag, Menu, X, ChevronDown, ShieldCheck, Tag, Flame, ArrowRight } from 'lucide-react';
import { Logo } from './Logo';
import { useWishlist } from '@/context/WishlistContext';
import { Category, SiteSettings } from '@/types/database';

interface HeaderProps {
  categories?: Category[];
  settings?: SiteSettings | null;
}

export function Header({ categories = [], settings }: HeaderProps) {
  const router = useRouter();
  const { wishlistCount } = useWishlist();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<Array<{ name: string; slug: string; price: number; primary_image: string }>>([]);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const announcement = settings?.announcement_bar || {
    enabled: true,
    text: 'Free delivery on selected products | Trusted by 10,000+ happy shoppers',
    link: '/deals',
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(searchQuery.trim())}&status=published`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.products) {
            setSearchSuggestions(data.products.slice(0, 5));
          }
        }
      } catch {
        // Ignore
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearchFocused(false);
    let url = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    if (selectedCategory && selectedCategory !== 'all') {
      url += `&category=${encodeURIComponent(selectedCategory)}`;
    }
    router.push(url);
  };

  return (
    <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-40 shadow-xs">
      {/* 1. Top Announcement Bar (NO Admin links) */}
      {announcement.enabled && (
        <div className="bg-[#0B5D36] text-white text-xs py-2 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="font-medium tracking-wide">{announcement.text}</span>
              {announcement.link && (
                <Link href={announcement.link} className="underline hover:text-emerald-200 font-semibold ml-1 hidden sm:inline">
                  Shop Deals →
                </Link>
              )}
            </div>
            <div className="hidden md:flex items-center gap-5 text-emerald-100 text-xs font-medium">
              <Link href="/about" className="hover:text-white transition-colors">About</Link>
              <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
              <Link href="/deals" className="hover:text-white transition-colors flex items-center gap-1 text-emerald-300 font-semibold">
                <Flame className="w-3.5 h-3.5 fill-emerald-300" /> Deals
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 2. Main Header */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 sm:py-3.5">
        <div className="flex items-center justify-between gap-4 md:gap-8">
          {/* Mobile hamburger + Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:text-[#0B5D36] hover:bg-emerald-50 rounded-lg transition-colors"
              aria-label="Open Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <Logo size="md" />
          </div>

          {/* Search Bar with Category Filter */}
          <div ref={searchContainerRef} className="hidden md:flex flex-1 max-w-2xl relative">
            <form onSubmit={handleSearchSubmit} className="flex w-full rounded-full border-2 border-[#0B5D36] bg-white overflow-hidden shadow-xs hover:border-[#074528] focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-gray-50 text-gray-700 text-xs font-medium px-3 py-2 border-r border-gray-200 outline-hidden hover:bg-gray-100 cursor-pointer transition-colors max-w-[130px] truncate"
              >
                <option value="all">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="Search for headphones, watches, bags, lifestyle..."
                className="flex-1 px-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-hidden"
              />

              <button
                type="submit"
                className="bg-[#0B5D36] text-white px-5 py-2 hover:bg-[#074528] flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Instant Search Suggestions */}
            {isSearchFocused && searchSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                <div className="p-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between text-xs text-gray-500 font-medium">
                  <span>Product Suggestions</span>
                  <span>{searchSuggestions.length} results</span>
                </div>
                <div className="divide-y divide-gray-50">
                  {searchSuggestions.map((item) => (
                    <Link
                      key={item.slug}
                      href={`/products/${item.slug}`}
                      onClick={() => setIsSearchFocused(false)}
                      className="flex items-center gap-3 p-3 hover:bg-emerald-50/50 transition-colors group"
                    >
                      <img
                        src={item.primary_image}
                        alt={item.name}
                        className="w-10 h-10 object-cover rounded-lg border border-gray-100 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate group-hover:text-[#0B5D36]">
                          {item.name}
                        </p>
                        <p className="text-xs font-bold text-[#0B5D36]">
                          ৳{item.price.toLocaleString()}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#0B5D36] shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Customer Actions (Wishlist & Deals) */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/wishlist"
              className="relative p-2.5 text-gray-700 hover:text-[#0B5D36] hover:bg-emerald-50 rounded-full transition-colors flex items-center"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#0B5D36] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-scale">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              href="/deals"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-emerald-50 hover:bg-emerald-100 text-[#0B5D36] text-xs font-bold transition-all shadow-2xs"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Today&apos;s Deals</span>
            </Link>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="mt-2.5 md:hidden">
          <form onSubmit={handleSearchSubmit} className="flex rounded-full border border-gray-300 bg-gray-50 overflow-hidden focus-within:border-[#0B5D36] focus-within:bg-white transition-colors">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="flex-1 px-4 py-2 text-xs text-gray-900 outline-hidden bg-transparent"
            />
            <button
              type="submit"
              className="bg-[#0B5D36] text-white px-4 py-2 hover:bg-[#074528] flex items-center justify-center transition-colors"
              aria-label="Search"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* 3. Sub-Navigation Bar */}
      <div className="hidden lg:block border-t border-gray-100 bg-[#fcfdfc]">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-xs font-medium">
          <div className="relative">
            <button
              onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
              className="flex items-center gap-2 bg-[#0B5D36] text-white font-semibold py-2.5 px-4 rounded-t-lg hover:bg-[#074528] transition-colors cursor-pointer"
            >
              <Menu className="w-4 h-4" />
              <span>All Categories</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isCategoryMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {isCategoryMenuOpen && (
              <div
                onMouseLeave={() => setIsCategoryMenuOpen(false)}
                className="absolute top-full left-0 w-64 bg-white rounded-b-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-1"
              >
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.slug}`}
                    onClick={() => setIsCategoryMenuOpen(false)}
                    className="flex items-center justify-between px-4 py-2.5 text-gray-700 hover:text-[#0B5D36] hover:bg-emerald-50 transition-colors"
                  >
                    <span className="font-medium">{cat.name}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-300" />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Category Pills */}
          <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
            {categories.slice(0, 7).map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="px-3.5 py-1.5 rounded-full text-gray-600 hover:text-[#0B5D36] hover:bg-emerald-50/80 transition-colors whitespace-nowrap font-medium"
              >
                {cat.name}
              </Link>
            ))}
            <Link
              href="/products"
              className="px-3.5 py-1.5 rounded-full text-[#0B5D36] font-bold hover:bg-emerald-100/50 transition-colors whitespace-nowrap"
            >
              View All →
            </Link>
          </nav>

          <div className="flex items-center gap-4 text-gray-500 text-[11px]">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#0B5D36]" /> Verified Products
            </span>
            <span className="flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-[#0B5D36]" /> Direct Deals
            </span>
          </div>
        </div>
      </div>

      {/* 4. Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl z-10 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-left duration-200">
            <div>
              <div className="p-4 bg-white border-b border-gray-100 flex items-center justify-between">
                <Logo size="sm" />
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 rounded-full text-gray-500 hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Categories</p>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/category/${cat.slug}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between p-2.5 rounded-xl text-gray-700 hover:text-[#0B5D36] hover:bg-emerald-50 text-sm font-medium transition-colors"
                    >
                      <span>{cat.name}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                    </Link>
                  ))}
                </div>

                <hr className="my-4 border-gray-100" />

                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Explore</p>
                <div className="space-y-1">
                  <Link
                    href="/products"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block p-2.5 rounded-xl text-gray-700 hover:text-[#0B5D36] hover:bg-emerald-50 text-sm font-medium"
                  >
                    All Products
                  </Link>
                  <Link
                    href="/deals"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block p-2.5 rounded-xl text-emerald-700 hover:bg-emerald-50 text-sm font-semibold"
                  >
                    🔥 Today&apos;s Deals
                  </Link>
                  <Link
                    href="/wishlist"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block p-2.5 rounded-xl text-gray-700 hover:text-[#0B5D36] hover:bg-emerald-50 text-sm font-medium"
                  >
                    Saved Wishlist ({wishlistCount})
                  </Link>
                  <Link
                    href="/blog"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block p-2.5 rounded-xl text-gray-700 hover:text-[#0B5D36] hover:bg-emerald-50 text-sm font-medium"
                  >
                    Buying Guides & Blog
                  </Link>
                  <Link
                    href="/about"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block p-2.5 rounded-xl text-gray-700 hover:text-[#0B5D36] hover:bg-emerald-50 text-sm font-medium"
                  >
                    About Us
                  </Link>
                  <Link
                    href="/contact"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block p-2.5 rounded-xl text-gray-700 hover:text-[#0B5D36] hover:bg-emerald-50 text-sm font-medium"
                  >
                    Contact Support
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
