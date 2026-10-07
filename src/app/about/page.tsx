import React from 'react';
import { supabaseAdmin } from '@/lib/supabase/server';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { BottomNav } from '@/components/common/BottomNav';
import { Category, SiteSettings } from '@/types/database';
import { ShieldCheck, Heart, Search, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'About Us — bechakena+',
  description: 'Learn more about bechakena+, our mission, curation philosophy, and how we help smart shoppers in Bangladesh discover better products.',
};

export default async function AboutPage() {
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

      <main className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full">
        <div className="bg-white rounded-3xl p-6 sm:p-12 border border-gray-100 shadow-2xs space-y-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#0B5D36] bg-emerald-50 px-3 py-1 rounded-full inline-block mb-3">
              Our Mission & Philosophy
            </span>
            <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-gray-900 tracking-tight">
              About bechakena+
            </h1>
            <p className="text-base text-gray-600 mt-3 leading-relaxed">
              <strong>bechakena+</strong> is a modern, value-focused product discovery brand built for smart shoppers across Bangladesh.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-4">
            <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex flex-col items-center text-center">
              <Search className="w-8 h-8 text-[#0B5D36] mb-3" />
              <h3 className="font-heading font-bold text-sm text-gray-900">Handpicked Quality</h3>
              <p className="text-xs text-gray-600 mt-1">We filter through thousands of products so you only see genuine, high-value items.</p>
            </div>
            <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex flex-col items-center text-center">
              <ShieldCheck className="w-8 h-8 text-[#0B5D36] mb-3" />
              <h3 className="font-heading font-bold text-sm text-gray-900">Safe Checkout</h3>
              <p className="text-xs text-gray-600 mt-1">Orders are finalized securely through certified Daraz stores with Cash on Delivery & buyer protection.</p>
            </div>
            <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex flex-col items-center text-center">
              <Heart className="w-8 h-8 text-[#0B5D36] mb-3" />
              <h3 className="font-heading font-bold text-sm text-gray-900">The &quot;+&quot; Value</h3>
              <p className="text-xs text-gray-600 mt-1">The &quot;+&quot; represents extra value, better discovery, and honest buying guides.</p>
            </div>
          </div>

          <div className="space-y-4 text-sm text-gray-700 leading-relaxed border-t border-gray-100 pt-6">
            <h2 className="font-heading font-bold text-xl text-gray-900">Why We Started bechakena+</h2>
            <p>
              Online shopping in Bangladesh has grown exponentially, but finding genuinely reliable products with good reviews and honest pricing can be exhausting. Our editorial and curation team rigorously tests, verifies, and analyzes tech gadgets, fashion accessories, and home items to bring you clear recommendations without clutter.
            </p>

            <h3 className="font-heading font-bold text-lg text-gray-900 mt-4">Our Core Values</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0B5D36] shrink-0" />
                <span><strong>No Fake Numbers:</strong> All ratings and price calculations reflect real, verified marketplace data.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0B5D36] shrink-0" />
                <span><strong>Seamless Purchase:</strong> Direct fulfillment and buyer security through Bangladesh&apos;s leading ecommerce infrastructure.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0B5D36] shrink-0" />
                <span><strong>Fast & Accessible:</strong> Optimized for mobile users across 3G, 4G, and broadband networks nationwide.</span>
              </li>
            </ul>
          </div>
        </div>
      </main>

      <Footer categories={activeCategories} settings={settings as SiteSettings} />
      <BottomNav />
    </div>
  );
}
