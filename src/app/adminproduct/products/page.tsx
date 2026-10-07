import React from 'react';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth/jwt';
import { supabaseAdmin } from '@/lib/supabase/server';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ProductsTableClient } from './ProductsTableClient';
import { Product, Category } from '@/types/database';

export default async function AdminProductsPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect('/adminproduct/login');
  }

  const [
    { data: products },
    { data: categories },
  ] = await Promise.all([
    supabaseAdmin
      .from('products')
      .select('*, category:categories(id, name, slug)')
      .order('created_at', { ascending: false }),
    supabaseAdmin
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true }),
  ]);

  return (
    <AdminLayout
      title="Product Inventory"
      subtitle="Manage all products, prices, Daraz URLs, and publication status"
    >
      <ProductsTableClient
        initialProducts={(products as Product[]) || []}
        categories={(categories as Category[]) || []}
      />
    </AdminLayout>
  );
}
