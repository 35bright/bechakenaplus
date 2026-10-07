import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth/jwt';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search') || '';
  const categoryId = searchParams.get('category_id') || '';
  const status = searchParams.get('status') || '';

  let query = supabaseAdmin
    .from('products')
    .select(`
      *,
      category:categories(id, name, slug)
    `)
    .order('created_at', { ascending: false });

  if (search) {
    query = query.ilike('name', `%${search}%`);
  }
  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }
  if (status) {
    query = query.eq('status', status);
  }

  const { data: products, error } = await query;

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, products });
}

export async function POST(req: NextRequest) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      name,
      name_bn,
      slug,
      short_description,
      short_description_bn,
      full_description,
      category_id,
      subcategory,
      brand,
      price,
      original_price,
      discount_percent,
      daraz_url,
      custom_cta_text = 'View on Daraz',
      primary_image,
      hover_image,
      gallery_images = [],
      rating = null,
      review_count = 0,
      sold_count = null,
      badges = [],
      tags = [],
      is_featured = false,
      is_trending = false,
      is_deal = false,
      is_best_seller = false,
      is_popular = false,
      is_limited_stock = false,
      show_on_homepage = true,
      status = 'published',
      sort_order = 0,
      seo_title,
      seo_description,
      seo_keywords,
      og_image,
      features = [],
      specifications = [],
    } = body;

    if (!name || !daraz_url || !primary_image || price === undefined) {
      return NextResponse.json({ success: false, error: 'Name, price, Daraz URL, and primary image are required.' }, { status: 400 });
    }

    // Generate or sanitize slug
    const generatedSlug = (slug || name)
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const finalSlug = generatedSlug || `product-${Date.now()}`;

    // Calculate discount automatically if not provided
    let calculatedDiscount = discount_percent;
    if ((!calculatedDiscount || calculatedDiscount <= 0) && original_price && original_price > price) {
      calculatedDiscount = Math.round(((original_price - price) / original_price) * 100);
    }

    const { data: newProduct, error: insertError } = await supabaseAdmin
      .from('products')
      .insert({
        name,
        name_bn,
        slug: finalSlug,
        short_description,
        short_description_bn,
        full_description,
        category_id: category_id || null,
        subcategory,
        brand,
        price: Number(price),
        original_price: original_price ? Number(original_price) : null,
        discount_percent: calculatedDiscount || 0,
        daraz_url,
        custom_cta_text,
        primary_image,
        hover_image,
        gallery_images,
        rating: rating !== null && rating !== undefined && !isNaN(Number(rating)) && Number(rating) > 0 ? Number(rating) : null,
        review_count: Number(review_count) || 0,
        sold_count: sold_count || null,
        badges,
        tags,
        is_featured: Boolean(is_featured),
        is_trending: Boolean(is_trending),
        is_deal: Boolean(is_deal),
        is_best_seller: Boolean(is_best_seller),
        is_popular: Boolean(is_popular),
        is_limited_stock: Boolean(is_limited_stock),
        show_on_homepage: Boolean(show_on_homepage),
        status,
        sort_order: Number(sort_order) || 0,
        seo_title: seo_title || name,
        seo_description: seo_description || short_description,
        seo_keywords,
        og_image: og_image || primary_image,
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json({ success: false, error: insertError.message }, { status: 500 });
    }

    // Insert features
    if (features && Array.isArray(features) && features.length > 0) {
      const featureRows = features
        .filter((f: { title?: string; value?: string }) => f.title && f.value)
        .map((f: { title: string; value: string; icon?: string }, index: number) => ({
          product_id: newProduct.id,
          title: f.title,
          value: f.value,
          icon: f.icon || null,
          sort_order: index,
        }));
      if (featureRows.length > 0) {
        await supabaseAdmin.from('product_features').insert(featureRows);
      }
    }

    // Insert specifications
    if (specifications && Array.isArray(specifications) && specifications.length > 0) {
      const specRows = specifications
        .filter((s: { name?: string; value?: string }) => s.name && s.value)
        .map((s: { name: string; value: string }, index: number) => ({
          product_id: newProduct.id,
          name: s.name,
          value: s.value,
          sort_order: index,
        }));
      if (specRows.length > 0) {
        await supabaseAdmin.from('product_specifications').insert(specRows);
      }
    }

    return NextResponse.json({ success: true, product: newProduct });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error creating product';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
