import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth/jwt';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  const { data: product, error } = await supabaseAdmin
    .from('products')
    .select(`
      *,
      category:categories(*),
      features:product_features(*),
      specifications:product_specifications(*)
    `)
    .eq('id', id)
    .single();

  if (error || !product) {
    return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, product });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

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
      rating = 4.8,
      review_count = 0,
      sold_count = '100+ sold',
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

    let calculatedDiscount = discount_percent;
    if ((!calculatedDiscount || calculatedDiscount <= 0) && original_price && original_price > price) {
      calculatedDiscount = Math.round(((original_price - price) / original_price) * 100);
    }

    const { data: updatedProduct, error: updateError } = await supabaseAdmin
      .from('products')
      .update({
        name,
        name_bn,
        slug,
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
        rating: Number(rating) || 4.8,
        review_count: Number(review_count) || 0,
        sold_count,
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
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ success: false, error: updateError.message }, { status: 500 });
    }

    // Replace features
    await supabaseAdmin.from('product_features').delete().eq('product_id', id);
    if (features && Array.isArray(features) && features.length > 0) {
      const featureRows = features
        .filter((f: { title?: string; value?: string }) => f.title && f.value)
        .map((f: { title: string; value: string; icon?: string }, index: number) => ({
          product_id: id,
          title: f.title,
          value: f.value,
          icon: f.icon || null,
          sort_order: index,
        }));
      if (featureRows.length > 0) {
        await supabaseAdmin.from('product_features').insert(featureRows);
      }
    }

    // Replace specifications
    await supabaseAdmin.from('product_specifications').delete().eq('product_id', id);
    if (specifications && Array.isArray(specifications) && specifications.length > 0) {
      const specRows = specifications
        .filter((s: { name?: string; value?: string }) => s.name && s.value)
        .map((s: { name: string; value: string }, index: number) => ({
          product_id: id,
          name: s.name,
          value: s.value,
          sort_order: index,
        }));
      if (specRows.length > 0) {
        await supabaseAdmin.from('product_specifications').insert(specRows);
      }
    }

    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error updating product';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  const { error } = await supabaseAdmin.from('products').delete().eq('id', id);

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, message: 'Product deleted successfully' });
}
