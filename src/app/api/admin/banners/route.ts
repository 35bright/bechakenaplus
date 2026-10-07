import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth/jwt';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET() {
  const { data: banners, error } = await supabaseAdmin
    .from('banners')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, banners });
}

export async function POST(req: NextRequest) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { title, subtitle, badge_text, cta_text = 'Shop Now →', cta_url = '/products', image_url, banner_type = 'hero', sort_order = 0, is_active = true } = await req.json();

    if (!title || !image_url) {
      return NextResponse.json({ success: false, error: 'Title and image URL are required' }, { status: 400 });
    }

    const { data: banner, error } = await supabaseAdmin
      .from('banners')
      .insert({
        title,
        subtitle,
        badge_text,
        cta_text,
        cta_url,
        image_url,
        banner_type,
        sort_order: Number(sort_order) || 0,
        is_active: Boolean(is_active),
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, banner });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create banner';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
