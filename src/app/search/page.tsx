import React from 'react';
import { supabaseAdmin } from '@/lib/supabase/server';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { BottomNav } from '@/components/common/BottomNav';
import { ProductCard } from '@/components/product/ProductCard';
import { Category, Product, SiteSettings } from '@/types/database';
import { Search as SearchIcon } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Search Products — bechakena+',
  description: 'Search verified tech, lifestyle and essentials in Bangladesh.',
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q = '', category = '' } = await searchParams;
  const query = q.trim();

  const [
    { data: settings },
    { data: categories },
    { data: allProducts },
  ] = await Promise.all([
    supabaseAdmin.from('site_settings').select('*').eq('id', 'default').single(),
    supabaseAdmin.from('categories').select('*').eq('is_active', true).order('sort_order', { ascending: true }),
    supabaseAdmin.from('products').select('*, category:categories(*)').eq('status', 'published').order('sort_order', { ascending: true }),
  ]);

  const activeCategories: Category[] = categories || [];
  const products: Product[] = allProducts || [];

  // Filter products by search term
  const matchedProducts = products.filter(p => {
    if (category && category !== 'all' && p.category?.slug !== category) {
      return false;
    }
    if (!query) return true;
    const term = query.toLowerCase();
    const matchName = p.name.toLowerCase().includes(term);
    const matchNameBn = p.name_bn?.toLowerCase().includes(term);
    const matchDesc = p.short_description?.toLowerCase().includes(term);
    const matchBrand = p.brand?.toLowerCase().includes(term);
    const matchTags = p.tags?.some(t => t.toLowerCase().includes(term));
    return matchName || matchNameBn || matchDesc || matchBrand || matchTags;
  });

  // Log search analytics event
  if (query) {
    try {
      await supabaseAdmin.from('analytics_events').insert({
        event_type: 'search',
        search_query: query,
        source_page: `/search?q=${encodeURIComponent(query)}`,
        metadata: { results_count: matchedProducts.length },
      });
    } catch {
      // Non-blocking
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfdfc]">
      <Header categories={activeCategories} settings={settings as SiteSettings} />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        {/* Search Query Header */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-2xs mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#0B5D36] flex items-center justify-center shrink-0">
              <SearchIcon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-heading font-bold text-xl sm:text-2xl text-gray-900">
                {query ? `Search results for "${query}"` : 'All Products Search'}
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                Found {matchedProducts.length} matching products
              </p>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        {matchedProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {matchedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-2xs max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#0B5D36] flex items-center justify-center mx-auto mb-4">
              <SearchIcon className="w-8 h-8" />
            </div>
            <h3 className="font-heading font-bold text-lg text-gray-900">No products found</h3>
            <p className="text-xs text-gray-500 mt-1">
              We couldn&apos;t find anything matching &quot;{query}&quot;. Try checking for typos or searching with broader keywords.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <Link href="/category/electronics" className="px-3 py-1.5 rounded-full bg-gray-100 text-xs text-gray-700 hover:bg-emerald-50 hover:text-[#0B5D36]">
                Headphones
              </Link>
              <Link href="/category/fashion" className="px-3 py-1.5 rounded-full bg-gray-100 text-xs text-gray-700 hover:bg-emerald-50 hover:text-[#0B5D36]">
                Backpacks
              </Link>
              <Link href="/deals" className="px-3 py-1.5 rounded-full bg-emerald-100 text-xs font-semibold text-[#0B5D36]">
                Today&apos;s Deals 🔥
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer categories={activeCategories} settings={settings as SiteSettings} />
      <BottomNav />
    </div>
  );
}
