import React from 'react';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth/jwt';
import { supabaseAdmin } from '@/lib/supabase/server';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { BlogClient } from './BlogClient';
import { BlogPost } from '@/types/database';

export default async function AdminBlogPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect('/adminproduct/login');
  }

  const { data: posts } = await supabaseAdmin
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <AdminLayout
      title="Blog & Buying Guides"
      subtitle="Publish editorial reviews, tech comparisons, and search-optimized shopping guides"
    >
      <BlogClient initialPosts={(posts as BlogPost[]) || []} />
    </AdminLayout>
  );
}
