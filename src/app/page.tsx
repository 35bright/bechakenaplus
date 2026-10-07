import React from 'react';
import { supabaseAdmin } from '@/lib/supabase/server';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { BottomNav } from '@/components/common/BottomNav';
import { HeroBanner } from '@/components/home/HeroBanner';
import { FeaturedProductsSection } from '@/components/home/FeaturedProductsSection';
import { CategorySection } from '@/components/home/CategorySection';
import { PromoSplitBanners } from '@/components/home/PromoSplitBanners';
import { DealsSection } from '@/components/home/DealsSection';
import { AdsterraSlot } from '@/components/ads/AdsterraSlot';
import { Category, Product, Banner, SiteSettings } from '@/types/database';

// Real-time dynamic rendering (ensures any admin updates show immediately with zero cache lag)
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  // Fetch data in parallel from Supabase
  const [
    { data: settings },
    { data: categories },
    { data: banners },
    { data: products },
  ] = await Promise.all([
    supabaseAdmin.from('site_settings').select('*').eq('id', 'default').single(),
    supabaseAdmin.from('categories').select('*').eq('is_active', true).order('sort_order', { ascending: true }),
    supabaseAdmin.from('banners').select('*').eq('is_active', true).order('sort_order', { ascending: true }),
    supabaseAdmin.from('products').select('*, category:categories(*)').eq('status', 'published').order('sort_order', { ascending: true }),
  ]);

  const activeCategories: Category[] = categories || [];
  const allProducts: Product[] = products || [];
  const heroBanners: Banner[] = banners?.filter(b => b.banner_type === 'hero') || [];

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfdfc]">
      <Header categories={activeCategories} settings={settings as SiteSettings} />

      <main className="flex-1 pb-10">
        {/* 1. 16:9 Aspect Ratio Auto Image Slider */}
        <HeroBanner banners={heroBanners} />

        {/* 2. Featured Products (Directly after Hero Slider) */}
        <div className="mt-4 sm:mt-6">
          <FeaturedProductsSection products={allProducts} categories={activeCategories} />
        </div>

        {/* 3. Shop by Category */}
        <div className="mt-6 sm:mt-8">
          <CategorySection categories={activeCategories} />
        </div>

        {/* 4. Promotional Split Banners */}
        <div className="mt-6 sm:mt-8">
          <PromoSplitBanners />
        </div>

        {/* 5. Today's Deals with Countdown */}
        <div className="mt-6 sm:mt-8">
          <DealsSection products={allProducts} />
        </div>

        {/* 6. Sponsored Ad */}
        <AdsterraSlot type="banner" />
      </main>

      <Footer categories={activeCategories} settings={settings as SiteSettings} />
      <BottomNav />
    </div>
  );
}
