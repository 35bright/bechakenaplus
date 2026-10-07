import React from 'react';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth/jwt';
import { supabaseAdmin } from '@/lib/supabase/server';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ProductForm } from '@/components/admin/ProductForm';
import { Category } from '@/types/database';

export default async function AddNewProductPage() {
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
      title="Add New Product"
      subtitle="Create a new curated product listing with ImgBB image hosting & Daraz destination"
    >
      <ProductForm categories={(categories as Category[]) || []} />
    </AdminLayout>
  );
}
