import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabase/server';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { BottomNav } from '@/components/common/BottomNav';
import { AdsterraSlot } from '@/components/ads/AdsterraSlot';
import { Category, SiteSettings } from '@/types/database';
import { ArrowLeft, Clock, User, Calendar } from 'lucide-react';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { data: post } = await supabaseAdmin
    .from('blog_posts')
    .select('title, summary, seo_title, seo_description, cover_image')
    .eq('slug', slug)
    .single();

  if (!post) {
    return { title: 'Post Not Found' };
  }

  return {
    title: post.seo_title || post.title,
    description: post.seo_description || post.summary || `Read ${post.title} on bechakena+.`,
    openGraph: {
      title: post.seo_title || post.title,
      description: post.seo_description || post.summary,
      images: post.cover_image ? [{ url: post.cover_image }] : [],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  const [
    { data: post, error },
    { data: settings },
    { data: categories },
  ] = await Promise.all([
    supabaseAdmin.from('blog_posts').select('*').eq('slug', slug).eq('is_published', true).single(),
    supabaseAdmin.from('site_settings').select('*').eq('id', 'default').single(),
    supabaseAdmin.from('categories').select('*').eq('is_active', true).order('sort_order', { ascending: true }),
  ]);

  if (error || !post) {
    notFound();
  }

  // Increment view count in background
  try {
    await supabaseAdmin
      .from('blog_posts')
      .update({ views_count: (post.views_count || 0) + 1 })
      .eq('id', post.id);
  } catch {
    // Non-blocking
  }

  const activeCategories: Category[] = categories || [];

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfdfc]">
      <Header categories={activeCategories} settings={settings as SiteSettings} />

      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full">
        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-[#0B5D36] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Buying Guides</span>
        </Link>

        <article className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-2xs">
          {/* Category Pill */}
          {post.category && (
            <span className="bg-[#0B5D36] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-md inline-block mb-3">
              {post.category}
            </span>
          )}

          {/* Title */}
          <h1 className="font-heading font-extrabold text-2xl sm:text-4xl text-gray-900 leading-tight">
            {post.title}
          </h1>

          {post.title_bn && (
            <p className="font-bengali text-base sm:text-lg text-gray-600 font-medium mt-2">
              {post.title_bn}
            </p>
          )}

          {/* Meta Bar */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 py-4 my-4 border-y border-gray-100">
            <span className="flex items-center gap-1.5 text-gray-700 font-medium">
              <User className="w-3.5 h-3.5 text-[#0B5D36]" />
              {post.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              {post.read_time}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              {new Date(post.created_at || '').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>

          {/* Cover Image */}
          {post.cover_image && (
            <div className="relative aspect-16/9 w-full rounded-2xl overflow-hidden my-6 bg-gray-100">
              <img
                src={post.cover_image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Post Content */}
          <div
            className="prose prose-emerald max-w-none text-gray-800 leading-relaxed prose-headings:font-heading prose-headings:text-gray-900 prose-a:text-[#0B5D36] mt-6"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-gray-500 mr-1">Tags:</span>
              {post.tags.map((tag: string) => (
                <span key={tag} className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </article>

        {/* Adsterra Slot */}
        <AdsterraSlot type="banner" />
      </main>

      <Footer categories={activeCategories} settings={settings as SiteSettings} />
      <BottomNav />
    </div>
  );
}
