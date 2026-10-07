import React from 'react';
import { supabaseAdmin } from '@/lib/supabase/server';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { BottomNav } from '@/components/common/BottomNav';
import { WishlistClient } from './WishlistClient';
import { Category, SiteSettings } from '@/types/database';

export const metadata = {
  title: 'My Wishlist — bechakena+',
  description: 'View your saved products and favorite deals on bechakena+.',
};

export default async function WishlistPage() {
  const [
    { data: settings },
    { data: categories },
  ] = await Promise.all([
    supabaseAdmin.from('site_settings').select('*').eq('id', 'default').single(),
    supabaseAdmin.from('categories').select('*').eq('is_active', true).order('sort_order', { ascending: true }),
  ]);

  const activeCategories: Category[] = categories || [];

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfdfc]">
      <Header categories={activeCategories} settings={settings as SiteSettings} />
      <main className="flex-1">
        <WishlistClient />
      </main>
      <Footer categories={activeCategories} settings={settings as SiteSettings} />
      <BottomNav />
    </div>
  );
}
