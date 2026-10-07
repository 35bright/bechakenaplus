import React from 'react';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth/jwt';
import { supabaseAdmin } from '@/lib/supabase/server';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AnalyticsClient } from './AnalyticsClient';
import { Product, AnalyticsEvent } from '@/types/database';

export default async function AdminAnalyticsPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect('/adminproduct/login');
  }

  const [
    { count: totalProducts },
    { count: totalPageViews },
    { count: totalProductViews },
    { count: totalDarazClicks },
    { count: totalSearches },
    { data: topProducts },
    { data: recentEvents },
  ] = await Promise.all([
    supabaseAdmin.from('products').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('analytics_events').select('*', { count: 'exact', head: true }).eq('event_type', 'page_view'),
    supabaseAdmin.from('analytics_events').select('*', { count: 'exact', head: true }).eq('event_type', 'product_view'),
    supabaseAdmin.from('analytics_events').select('*', { count: 'exact', head: true }).eq('event_type', 'daraz_click'),
    supabaseAdmin.from('analytics_events').select('*', { count: 'exact', head: true }).eq('event_type', 'search'),
    supabaseAdmin.from('products').select('*').order('daraz_clicks_count', { ascending: false }).limit(10),
    supabaseAdmin.from('analytics_events').select('*').order('created_at', { ascending: false }).limit(50),
  ]);

  const totalViews = (totalProductViews || 0) + (totalPageViews || 0);
  const ctr = totalViews > 0 ? (((totalDarazClicks || 0) / totalViews) * 100).toFixed(2) : '0.00';

  return (
    <AdminLayout
      title="Store Analytics & Redirect Tracking"
      subtitle="Monitor customer engagement, search trends, and outgoing Daraz conversion rates"
    >
      <AnalyticsClient
        stats={{
          totalProducts: totalProducts || 0,
          totalPageViews: totalPageViews || 0,
          totalProductViews: totalProductViews || 0,
          totalDarazClicks: totalDarazClicks || 0,
          totalSearches: totalSearches || 0,
          ctr: `${ctr}%`,
        }}
        topProducts={(topProducts as Product[]) || []}
        recentEvents={(recentEvents as AnalyticsEvent[]) || []}
      />
    </AdminLayout>
  );
}
