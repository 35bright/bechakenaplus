import React from 'react';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth/jwt';
import { supabaseAdmin } from '@/lib/supabase/server';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { BannersClient } from './BannersClient';
import { Banner } from '@/types/database';

export default async function AdminBannersPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect('/adminproduct/login');
  }

  const { data: banners } = await supabaseAdmin
    .from('banners')
    .select('*')
    .order('sort_order', { ascending: true });

  return (
    <AdminLayout
      title="Banners & Hero Sliders"
      subtitle="Customize homepage hero visuals, promotional split banners, and CTA links"
    >
      <BannersClient initialBanners={(banners as Banner[]) || []} />
    </AdminLayout>
  );
}
