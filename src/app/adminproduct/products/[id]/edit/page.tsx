import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth/jwt';
import { supabaseAdmin } from '@/lib/supabase/server';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ProductForm } from '@/components/admin/ProductForm';
import { Product, Category } from '@/types/database';

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const session = await getAdminSession();
  if (!session) {
    redirect('/adminproduct/login');
  }

  const { id } = await params;

  const [
    { data: product, error },
    { data: categories },
  ] = await Promise.all([
    supabaseAdmin
      .from('products')
      .select(`
        *,
        category:categories(*),
        features:product_features(*),
        specifications:product_specifications(*)
      `)
      .eq('id', id)
      .single(),
    supabaseAdmin.from('categories').select('*').order('sort_order', { ascending: true }),
  ]);

  if (error || !product) {
    notFound();
  }

  return (
    <AdminLayout
      title="Edit Product"
      subtitle={`Editing product: ${product.name}`}
    >
      <ProductForm
        initialProduct={product as Product}
        categories={(categories as Category[]) || []}
        isEditing
      />
    </AdminLayout>
  );
}
