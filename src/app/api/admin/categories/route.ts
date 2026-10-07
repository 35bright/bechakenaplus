import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth/jwt';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET() {
  const { data: categories, error } = await supabaseAdmin
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, categories });
}

export async function POST(req: NextRequest) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { name, name_bn, slug, description, icon, image_url, sort_order = 0, is_featured = true, is_active = true } = await req.json();

    if (!name) {
      return NextResponse.json({ success: false, error: 'Category name is required' }, { status: 400 });
    }

    const cleanSlug = (slug || name)
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const { data: category, error } = await supabaseAdmin
      .from('categories')
      .insert({
        name,
        name_bn,
        slug: cleanSlug,
        description,
        icon,
        image_url,
        sort_order: Number(sort_order) || 0,
        is_featured: Boolean(is_featured),
        is_active: Boolean(is_active),
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, category });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create category';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
