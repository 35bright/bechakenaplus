import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth/jwt';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET() {
  const { data: settings, error } = await supabaseAdmin
    .from('site_settings')
    .select('*')
    .eq('id', 'default')
    .single();

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, settings });
}

export async function PUT(req: NextRequest) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      store_name,
      tagline,
      announcement_bar,
      logo_url,
      favicon_url,
      contact_email,
      contact_phone,
      currency_symbol,
      currency_code,
      header_links,
      trust_indicators,
      ad_settings,
      social_links,
      footer_text,
    } = body;

    const { data: updated, error } = await supabaseAdmin
      .from('site_settings')
      .update({
        store_name,
        tagline,
        announcement_bar,
        logo_url,
        favicon_url,
        contact_email,
        contact_phone,
        currency_symbol,
        currency_code,
        header_links,
        trust_indicators,
        ad_settings,
        social_links,
        footer_text,
        updated_at: new Date().toISOString(),
      })
      .eq('id', 'default')
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, settings: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update settings';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
