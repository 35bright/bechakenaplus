import React from 'react';
import { supabaseAdmin } from '@/lib/supabase/server';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { BottomNav } from '@/components/common/BottomNav';
import { ProductCard } from '@/components/product/ProductCard';
import { Category, Product, SiteSettings } from '@/types/database';
import { Flame } from 'lucide-react';

export const metadata = {
  title: "Today's Best Deals & Top Discounts",
  description: 'Limited time discounted products, flash sales, and big savings in Bangladesh.',
};

export default async function DealsPage() {
  const [
    { data: settings },
    { data: categories },
    { data: products },
  ] = await Promise.all([
    supabaseAdmin.from('site_settings').select('*').eq('id', 'default').single(),
    supabaseAdmin.from('categories').select('*').eq('is_active', true).order('sort_order', { ascending: true }),
    supabaseAdmin
      .from('products')
      .select('*, category:categories(*)')
      .eq('status', 'published')
      .or('is_deal.eq.true,discount_percent.gte.25')
      .order('discount_percent', { ascending: false }),
  ]);

  const activeCategories: Category[] = categories || [];
  const dealProducts: Product[] = products || [];

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfdfc]">
      <Header categories={activeCategories} settings={settings as SiteSettings} />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        {/* Deals Hero Header */}
        <div className="bg-linear-to-r from-emerald-900 via-[#0B5D36] to-emerald-950 text-white rounded-3xl p-6 sm:p-10 mb-8 shadow-sm relative overflow-hidden">
          <div className="relative z-10 max-w-xl">
            <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 border border-amber-300/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
              <Flame className="w-4 h-4 fill-amber-300 text-amber-300" />
              <span>Verified Direct Discounts</span>
            </div>
            <h1 className="font-heading font-extrabold text-2xl sm:text-4xl text-white">
              Today&apos;s Best Deals & Offers
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 mt-2 leading-relaxed">
              Every day we verify and list top genuine price drops and exclusive promotions across top electronics, fashion, and home lifestyle products.
            </p>
          </div>
        </div>

        {/* Deals Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {dealProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </main>

      <Footer categories={activeCategories} settings={settings as SiteSettings} />
      <BottomNav />
    </div>
  );
}
