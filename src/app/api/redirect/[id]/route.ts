import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const { data: product, error } = await supabaseAdmin
      .from('products')
      .select('id, name, daraz_url, daraz_clicks_count')
      .eq('id', id)
      .single();

    if (error || !product || !product.daraz_url) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    // Increment click count asynchronously
    await supabaseAdmin
      .from('products')
      .update({ daraz_clicks_count: (product.daraz_clicks_count || 0) + 1 })
      .eq('id', product.id);

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(req.headers.get('user-agent') || '');
    const deviceType = isMobile ? 'mobile' : 'desktop';

    // Log analytics event
    await supabaseAdmin.from('analytics_events').insert({
      event_type: 'daraz_click',
      product_id: product.id,
      destination_url: product.daraz_url,
      source_page: req.headers.get('referer') || '/products',
      device_type: deviceType,
      user_agent: (req.headers.get('user-agent') || '').slice(0, 200),
      metadata: { product_name: product.name }
    });

    return NextResponse.redirect(product.daraz_url, 307);
  } catch {
    return NextResponse.redirect(new URL('/', req.url));
  }
}
