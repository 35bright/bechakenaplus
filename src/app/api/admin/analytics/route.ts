import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth/jwt';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET() {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 1. Total counts
    const { count: totalProducts } = await supabaseAdmin.from('products').select('*', { count: 'exact', head: true });
    const { count: publishedProducts } = await supabaseAdmin.from('products').select('*', { count: 'exact', head: true }).eq('status', 'published');
    const { count: draftProducts } = await supabaseAdmin.from('products').select('*', { count: 'exact', head: true }).eq('status', 'draft');
    const { count: categoriesCount } = await supabaseAdmin.from('categories').select('*', { count: 'exact', head: true });
    
    // 2. Events breakdown
    const { count: totalPageViews } = await supabaseAdmin.from('analytics_events').select('*', { count: 'exact', head: true }).eq('event_type', 'page_view');
    const { count: totalProductViews } = await supabaseAdmin.from('analytics_events').select('*', { count: 'exact', head: true }).eq('event_type', 'product_view');
    const { count: totalDarazClicks } = await supabaseAdmin.from('analytics_events').select('*', { count: 'exact', head: true }).eq('event_type', 'daraz_click');
    const { count: totalSearches } = await supabaseAdmin.from('analytics_events').select('*', { count: 'exact', head: true }).eq('event_type', 'search');

    // 3. Top clicked products
    const { data: topProducts } = await supabaseAdmin
      .from('products')
      .select('id, name, slug, price, primary_image, views_count, daraz_clicks_count, rating')
      .order('daraz_clicks_count', { ascending: false })
      .limit(6);

    // 4. Recent Analytics Events
    const { data: recentEvents } = await supabaseAdmin
      .from('analytics_events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    // 5. Calculate CTR
    const totalViews = (totalProductViews || 0) + (totalPageViews || 0);
    const ctr = totalViews > 0 ? (((totalDarazClicks || 0) / totalViews) * 100).toFixed(2) : '0.00';

    return NextResponse.json({
      success: true,
      stats: {
        totalProducts: totalProducts || 0,
        publishedProducts: publishedProducts || 0,
        draftProducts: draftProducts || 0,
        categoriesCount: categoriesCount || 0,
        totalPageViews: totalPageViews || 0,
        totalProductViews: totalProductViews || 0,
        totalDarazClicks: totalDarazClicks || 0,
        totalSearches: totalSearches || 0,
        ctr: `${ctr}%`,
      },
      topProducts: topProducts || [],
      recentEvents: recentEvents || [],
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error loading analytics';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
