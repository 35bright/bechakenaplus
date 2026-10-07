import React from 'react';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth/jwt';
import { supabaseAdmin } from '@/lib/supabase/server';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { SettingsClient } from './SettingsClient';
import { SiteSettings } from '@/types/database';

export default async function AdminSettingsPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect('/adminproduct/login');
  }

  const { data: settings } = await supabaseAdmin
    .from('site_settings')
    .select('*')
    .eq('id', 'default')
    .single();

  return (
    <AdminLayout
      title="Store Settings & Adsterra"
      subtitle="Configure store information, currency, announcement banner, and third-party advertising"
    >
      <SettingsClient initialSettings={settings as SiteSettings} />
    </AdminLayout>
  );
}
