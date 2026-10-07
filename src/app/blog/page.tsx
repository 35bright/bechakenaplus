import React from 'react';
import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabase/server';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { BottomNav } from '@/components/common/BottomNav';
import { BlogPost, Category, SiteSettings } from '@/types/database';
import { BookOpen, ArrowRight, Clock, User } from 'lucide-react';

export const metadata = {
  title: 'Buying Guides & Tech Reviews — bechakena+',
  description: 'Curated shopping advice, gadget comparisons, and smart lifestyle guides for Bangladesh.',
};

export default async function BlogPage() {
  const [
    { data: settings },
    { data: categories },
    { data: posts },
  ] = await Promise.all([
    supabaseAdmin.from('site_settings').select('*').eq('id', 'default').single(),
    supabaseAdmin.from('categories').select('*').eq('is_active', true).order('sort_order', { ascending: true }),
    supabaseAdmin.from('blog_posts').select('*').eq('is_published', true).order('created_at', { ascending: false }),
  ]);

  const activeCategories: Category[] = categories || [];
  const blogPosts: BlogPost[] = posts || [];

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfdfc]">
      <Header categories={activeCategories} settings={settings as SiteSettings} />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        {/* Blog Header */}
        <div className="bg-[#0B5D36] text-white rounded-3xl p-6 sm:p-10 mb-10 shadow-sm relative overflow-hidden">
          <div className="relative z-10 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider bg-white/15 px-3 py-1 rounded-full text-emerald-200 inline-block mb-3">
              Editorial & Guides
            </span>
            <h1 className="font-heading font-extrabold text-2xl sm:text-4xl">
              Smart Shopping Guides & Reviews
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 mt-2">
              Expert buying advice, tech teardowns, and curated recommendations to help you make smarter purchase decisions.
            </p>
          </div>
        </div>

        {/* Blog Articles Grid */}
        {blogPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <article
                key={post.id}
                className="group bg-white rounded-3xl border border-gray-100/90 shadow-2xs hover:shadow-xl hover:border-emerald-200 transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Cover Image */}
                  <div className="relative aspect-16/10 w-full bg-gray-100 overflow-hidden">
                    {post.cover_image ? (
                      <img
                        src={post.cover_image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-emerald-50 text-[#0B5D36]">
                        <BookOpen className="w-10 h-10" />
                      </div>
                    )}
                    {post.category && (
                      <span className="absolute top-3 left-3 bg-[#0B5D36] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-xs">
                        {post.category}
                      </span>
                    )}
                  </div>

                  {/* Body */}
                  <div className="p-5">
                    <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {post.read_time}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5" />
                        {post.author}
                      </span>
                    </div>

                    <Link href={`/blog/${post.slug}`}>
                      <h2 className="font-heading font-bold text-base sm:text-lg text-gray-900 group-hover:text-[#0B5D36] transition-colors leading-snug line-clamp-2">
                        {post.title}
                      </h2>
                    </Link>

                    {post.title_bn && (
                      <p className="font-bengali text-xs text-gray-500 mt-1 font-medium line-clamp-1">
                        {post.title_bn}
                      </p>
                    )}

                    {post.summary && (
                      <p className="text-xs text-gray-600 mt-2 line-clamp-2 leading-relaxed">
                        {post.summary}
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer Link */}
                <div className="px-5 pb-5 pt-2">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B5D36] hover:text-[#074528] group/link"
                  >
                    <span>Read Full Guide</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-3xl border border-gray-100 p-8">
            <BookOpen className="w-10 h-10 text-[#0B5D36] mx-auto mb-2" />
            <p className="text-sm font-bold text-gray-800">New guides coming soon!</p>
            <p className="text-xs text-gray-500 mt-1">Our team is preparing fresh buying guides for 2026.</p>
          </div>
        )}
      </main>

      <Footer categories={activeCategories} settings={settings as SiteSettings} />
      <BottomNav />
    </div>
  );
}
