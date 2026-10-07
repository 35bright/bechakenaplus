import React from 'react';
import Link from 'next/link';
import { Logo } from './Logo';
import { Heart } from 'lucide-react';
import { Category, SiteSettings } from '@/types/database';

interface FooterProps {
  categories?: Category[];
  settings?: SiteSettings | null;
}

export function Footer({ categories = [], settings }: FooterProps) {
  return (
    <footer className="w-full bg-[#084528] text-white pt-10 pb-16 lg:pb-8 overflow-hidden mt-10 border-t border-emerald-950">
      {/* Main Footer Body */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          <div className="lg:col-span-2 space-y-4">
            <Logo size="md" variant="white" />
            <p className="text-sm text-emerald-100/90 max-w-sm leading-relaxed">
              {settings?.tagline || 'Better Products. Happier You.'} Quality picks, great prices and a little extra — always. We discover and curate the most useful products for everyday living.
            </p>
            <div className="pt-1">
              <span className="text-xs font-semibold text-emerald-200 uppercase tracking-wider block mb-2">
                Follow Us
              </span>
              <div className="flex items-center gap-3">
                <a
                  href={settings?.social_links?.facebook || "https://facebook.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#0B5D36] flex items-center justify-center text-white text-xs font-bold transition-colors"
                >
                  fb
                </a>
                <a
                  href={settings?.social_links?.instagram || "https://instagram.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#0B5D36] flex items-center justify-center text-white text-xs font-bold transition-colors"
                >
                  ig
                </a>
                <a
                  href={settings?.social_links?.youtube || "https://youtube.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#0B5D36] flex items-center justify-center text-white text-xs font-bold transition-colors"
                >
                  yt
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300">Shop Categories</h4>
            <ul className="space-y-2 text-sm text-emerald-100/90">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <Link href={`/category/${cat.slug}`} className="hover:text-white transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/products" className="text-emerald-300 hover:text-white font-medium transition-colors">
                  All Categories →
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300">Discovery</h4>
            <ul className="space-y-2 text-sm text-emerald-100/90">
              <li>
                <Link href="/deals" className="hover:text-white transition-colors">Today&apos;s Hot Deals</Link>
              </li>
              <li>
                <Link href="/products?filter=trending" className="hover:text-white transition-colors">Trending Now</Link>
              </li>
              <li>
                <Link href="/products?filter=best-seller" className="hover:text-white transition-colors">Best Sellers</Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">Buying Guides</Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-white transition-colors">My Saved Wishlist</Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300">About & Legal</h4>
            <ul className="space-y-2 text-sm text-emerald-100/90">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">About bechakena+</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">Contact Support</Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-emerald-900/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-emerald-300/80">
          <p className="text-center md:text-left">
            {settings?.footer_text || '© 2026 bechakena+. All rights reserved.'} Curated shopping experience with direct purchase checkout on Daraz Bangladesh.
          </p>
          <div className="flex items-center gap-1 text-emerald-200">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400 inline" />
            <span>for Bangladeshi Smart Shoppers</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
