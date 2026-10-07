import React from 'react';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth/jwt';
import { supabaseAdmin } from '@/lib/supabase/server';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { CategoriesClient } from './CategoriesClient';
import { Category } from '@/types/database';

export default async function AdminCategoriesPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect('/adminproduct/login');
  }

  const { data: categories } = await supabaseAdmin
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true });

  return (
    <AdminLayout
      title="Category Management"
      subtitle="Organize store departments, Bengali translations, and navigation order"
    >
      <CategoriesClient initialCategories={(categories as Category[]) || []} />
    </AdminLayout>
  );
}
