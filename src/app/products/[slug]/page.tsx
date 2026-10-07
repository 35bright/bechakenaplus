import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { supabaseAdmin } from '@/lib/supabase/server';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { BottomNav } from '@/components/common/BottomNav';
import { ProductDetailView } from '@/components/product/ProductDetailView';
import { AdsterraPopunder } from '@/components/ads/AdsterraPopunder';
import { AdsterraSocialBar } from '@/components/ads/AdsterraSocialBar';
import { Product, Category, SiteSettings } from '@/types/database';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { data: product } = await supabaseAdmin
    .from('products')
    .select('name, short_description, seo_title, seo_description, primary_image, price')
    .eq('slug', slug)
    .single();

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  const title = product.seo_title || product.name;
  const description = product.seo_description || product.short_description || `Buy ${product.name} at the best price in Bangladesh.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: product.primary_image,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;

  // 1. Fetch the product
  const { data: product, error } = await supabaseAdmin
    .from('products')
    .select(`
      *,
      category:categories(*),
      features:product_features(*),
      specifications:product_specifications(*)
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error || !product) {
    notFound();
  }

  // 2. Fetch categories and related products in parallel
  const [
    { data: settings },
    { data: categories },
    { data: related },
  ] = await Promise.all([
    supabaseAdmin.from('site_settings').select('*').eq('id', 'default').single(),
    supabaseAdmin.from('categories').select('*').eq('is_active', true).order('sort_order', { ascending: true }),
    supabaseAdmin
      .from('products')
      .select('*, category:categories(*)')
      .eq('status', 'published')
      .eq('category_id', product.category_id)
      .neq('id', product.id)
      .limit(5),
  ]);

  // Background increment views
  try {
    await supabaseAdmin
      .from('products')
      .update({ views_count: (product.views_count || 0) + 1 })
      .eq('id', product.id);

    await supabaseAdmin.from('analytics_events').insert({
      event_type: 'product_view',
      product_id: product.id,
      category_slug: product.category?.slug || null,
      source_page: `/products/${product.slug}`,
      metadata: { name: product.name, price: product.price },
    });
  } catch {
    // Non-blocking
  }

  // JSON-LD Structured Data for Google Rich Snippets
  const jsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    image: [product.primary_image, ...(product.gallery_images || [])],
    description: product.short_description || product.name,
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'bechakena+',
    },
    offers: {
      '@type': 'Offer',
      url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://bechakena.plus'}/products/${product.slug}`,
      priceCurrency: 'BDT',
      price: product.price,
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
    ...(product.rating && Number(product.rating) > 0 ? {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: Number(product.rating),
        reviewCount: product.review_count || 1,
      },
    } : {}),
  };

  const adSettings = (settings as SiteSettings)?.ad_settings;
  const showPopunder = (adSettings?.enabled ?? true) && (adSettings?.show_on_product_page ?? true);

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfdfc]">
      <AdsterraPopunder
        popunderCode={adSettings?.adsterra_popunder_code}
        enabled={showPopunder}
      />

      <AdsterraSocialBar
        socialBarCode={adSettings?.adsterra_socialbar_code}
        enabled={showPopunder}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header categories={categories || []} settings={settings as SiteSettings} />
      
      <main className="flex-1">
        <ProductDetailView
          product={product as Product}
          relatedProducts={(related as Product[]) || []}
          adSettings={adSettings}
        />
      </main>

      <Footer categories={categories || []} settings={settings as SiteSettings} />
      <BottomNav />
    </div>
  );
}
