import React from 'react';
import { supabaseAdmin } from '@/lib/supabase/server';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { BottomNav } from '@/components/common/BottomNav';
import { ProductsClient } from './ProductsClient';
import { Category, Product, SiteSettings } from '@/types/database';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'All Products — Smart Picks & Tech Gadgets',
  description: 'Explore all verified gadgets, fashion, home essentials, and lifestyle products with top discounts and fast delivery in Bangladesh.',
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; filter?: string }>;
}) {
  const { category, filter } = await searchParams;

  const [
    { data: settings },
    { data: categories },
    { data: products },
  ] = await Promise.all([
    supabaseAdmin.from('site_settings').select('*').eq('id', 'default').single(),
    supabaseAdmin.from('categories').select('*').eq('is_active', true).order('sort_order', { ascending: true }),
    supabaseAdmin.from('products').select('*, category:categories(*)').eq('status', 'published').order('sort_order', { ascending: true }),
  ]);

  const activeCategories: Category[] = categories || [];
  const allProducts: Product[] = products || [];

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfdfc]">
      <Header categories={activeCategories} settings={settings as SiteSettings} />
      <main className="flex-1 pb-16">
        <ProductsClient
          initialProducts={allProducts}
          categories={activeCategories}
          initialCategorySlug={category}
          initialFilter={filter}
        />
      </main>
      <Footer categories={activeCategories} settings={settings as SiteSettings} />
      <BottomNav />
    </div>
  );
}
