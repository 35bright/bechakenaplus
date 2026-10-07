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
import { AdsterraPopunder } from '@/components/ads/AdsterraPopunder';
import { AdsterraSocialBar } from '@/components/ads/AdsterraSocialBar';
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

  const adSettings = (settings as SiteSettings)?.ad_settings;
  const adsEnabled = adSettings?.enabled ?? true;
  const showOnHome = adsEnabled && (adSettings?.show_on_homepage ?? true);

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfdfc]">
      {/* 1. Popunder Ad */}
      <AdsterraPopunder
        popunderCode={adSettings?.adsterra_popunder_code}
        enabled={showOnHome}
      />

      {/* 2. Social Bar In-Page Push Widget */}
      <AdsterraSocialBar
        socialBarCode={adSettings?.adsterra_socialbar_code}
        enabled={showOnHome}
      />

      <Header categories={activeCategories} settings={settings as SiteSettings} />

      <main className="flex-1 pb-10">
        {/* 2. 16:9 Aspect Ratio Auto Image Slider */}
        <HeroBanner banners={heroBanners} />

        {/* 3. Featured Products (Directly after Hero Slider) */}
        <div className="mt-4 sm:mt-6">
          <FeaturedProductsSection products={allProducts} categories={activeCategories} />
        </div>

        {/* 4. Native In-Feed Ad Placement */}
        {showOnHome && (
          <AdsterraSlot
            type="native"
            adCode={adSettings?.adsterra_native_code}
            slotLabel="Recommended For You"
          />
        )}

        {/* 5. Shop by Category */}
        <div className="mt-6 sm:mt-8">
          <CategorySection categories={activeCategories} />
        </div>

        {/* 6. Promotional Split Banners */}
        <div className="mt-6 sm:mt-8">
          <PromoSplitBanners />
        </div>

        {/* 7. Today's Deals with Countdown */}
        <div className="mt-6 sm:mt-8">
          <DealsSection products={allProducts} />
        </div>

        {/* 8. Leaderboard 728x90 Ad Slot */}
        {showOnHome && (
          <AdsterraSlot
            type="728x90"
            adCode={adSettings?.adsterra_banner_728x90_code || adSettings?.adsterra_banner_code}
            slotLabel="Sponsored Partner • 728×90"
          />
        )}
      </main>

      <Footer categories={activeCategories} settings={settings as SiteSettings} />
      <BottomNav />
    </div>
  );
}
