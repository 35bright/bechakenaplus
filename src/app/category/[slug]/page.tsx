import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { supabaseAdmin } from '@/lib/supabase/server';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { BottomNav } from '@/components/common/BottomNav';
import { ProductsClient } from '@/app/products/ProductsClient';
import { Category, Product, SiteSettings } from '@/types/database';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { data: category } = await supabaseAdmin
    .from('categories')
    .select('name, description')
    .eq('slug', slug)
    .single();

  if (!category) {
    return { title: 'Category Not Found' };
  }

  return {
    title: `${category.name} — Shop Best Deals & Picks`,
    description: category.description || `Explore top rated ${category.name} on bechakena+.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  const [
    { data: category },
    { data: settings },
    { data: categories },
    { data: products },
  ] = await Promise.all([
    supabaseAdmin.from('categories').select('*').eq('slug', slug).single(),
    supabaseAdmin.from('site_settings').select('*').eq('id', 'default').single(),
    supabaseAdmin.from('categories').select('*').eq('is_active', true).order('sort_order', { ascending: true }),
    supabaseAdmin.from('products').select('*, category:categories(*)').eq('status', 'published').order('sort_order', { ascending: true }),
  ]);

  if (!category) {
    notFound();
  }

  const activeCategories: Category[] = categories || [];
  const allProducts: Product[] = products || [];

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfdfc]">
      <Header categories={activeCategories} settings={settings as SiteSettings} />
      
      {/* Category Hero Banner */}
      <div className="bg-[#f2faf5] border-b border-emerald-100 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#0B5D36] bg-emerald-100/80 px-2.5 py-1 rounded-md inline-block mb-2">
              Category Collection
            </span>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-gray-900">
              {category.name}
            </h1>
            {category.name_bn && (
              <p className="font-bengali text-sm text-gray-600 mt-0.5">{category.name_bn}</p>
            )}
            {category.description && (
              <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-xl">
                {category.description}
              </p>
            )}
          </div>
        </div>
      </div>

      <main className="flex-1 pb-16">
        <ProductsClient
          initialProducts={allProducts}
          categories={activeCategories}
          initialCategorySlug={slug}
        />
      </main>

      <Footer categories={activeCategories} settings={settings as SiteSettings} />
      <BottomNav />
    </div>
  );
}
