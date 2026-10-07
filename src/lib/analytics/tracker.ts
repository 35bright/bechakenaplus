import { supabase } from '@/lib/supabase/client';

export interface TrackEventParams {
  event_type: 'page_view' | 'product_view' | 'category_view' | 'daraz_click' | 'search' | 'wishlist_add' | 'banner_click';
  product_id?: string;
  category_slug?: string;
  search_query?: string;
  source_page?: string;
  destination_url?: string;
  metadata?: Record<string, unknown>;
}

export async function trackEvent(params: TrackEventParams) {
  if (typeof window === 'undefined') return;

  try {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const deviceType = isMobile ? 'mobile' : window.innerWidth < 1024 ? 'tablet' : 'desktop';

    // Fire non-blocking event
    await supabase.from('analytics_events').insert({
      event_type: params.event_type,
      product_id: params.product_id || null,
      category_slug: params.category_slug || null,
      search_query: params.search_query || null,
      source_page: params.source_page || window.location.pathname,
      destination_url: params.destination_url || null,
      device_type: deviceType,
      user_agent: navigator.userAgent.slice(0, 200),
      metadata: params.metadata || {},
    });
  } catch {
    // Fail silently in background to not block customer experience
  }
}
