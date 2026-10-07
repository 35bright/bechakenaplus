import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth/jwt';
import { supabaseAdmin } from '@/lib/supabase/server';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { 
  ShoppingBag, Layers, MousePointerClick, Eye, 
  TrendingUp, PlusCircle, ExternalLink, ArrowRight, 
  CheckCircle2, Clock, Flame
} from 'lucide-react';
import { Product } from '@/types/database';

export default async function AdminDashboardPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect('/adminproduct/login');
  }

  // Fetch real statistics from Supabase
  const [
    { count: totalProducts },
    { count: publishedProducts },
    { count: draftProducts },
    { count: totalCategories },
    { count: totalViews },
    { count: totalDarazClicks },
    { data: topProducts },
    { data: recentEvents },
  ] = await Promise.all([
    supabaseAdmin.from('products').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('products').select('*', { count: 'exact', head: true }).eq('status', 'published'),
    supabaseAdmin.from('products').select('*', { count: 'exact', head: true }).eq('status', 'draft'),
    supabaseAdmin.from('categories').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('analytics_events').select('*', { count: 'exact', head: true }).eq('event_type', 'product_view'),
    supabaseAdmin.from('analytics_events').select('*', { count: 'exact', head: true }).eq('event_type', 'daraz_click'),
    supabaseAdmin
      .from('products')
      .select('*, category:categories(name)')
      .order('daraz_clicks_count', { ascending: false })
      .limit(6),
    supabaseAdmin
      .from('analytics_events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(8),
  ]);

  const ctr = (totalViews || 0) > 0 ? (((totalDarazClicks || 0) / (totalViews || 1)) * 100).toFixed(1) : '0.0';

  const statCards = [
    {
      title: 'Total Products',
      value: totalProducts || 0,
      subtext: `${publishedProducts || 0} published, ${draftProducts || 0} drafts`,
      icon: ShoppingBag,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      title: 'Active Categories',
      value: totalCategories || 0,
      subtext: 'Catalog departments',
      icon: Layers,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      title: 'Product Views',
      value: totalViews || 0,
      subtext: 'Customer impressions',
      icon: Eye,
      color: 'text-purple-600 bg-purple-50',
    },
    {
      title: 'Daraz Redirects',
      value: totalDarazClicks || 0,
      subtext: 'Purchase intent clicks',
      icon: MousePointerClick,
      color: 'text-[#0B5D36] bg-[#e8f5ee]',
    },
    {
      title: 'Click-Through Rate',
      value: `${ctr}%`,
      subtext: 'View to Daraz click',
      icon: TrendingUp,
      color: 'text-amber-600 bg-amber-50',
    },
  ];

  return (
    <AdminLayout
      title="Admin Dashboard"
      subtitle="Live metrics, product performance, and store analytics"
      actionButton={
        <Link
          href="/adminproduct/products/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#0B5D36] hover:bg-[#074528] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      }
    >
      {/* 1. Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{card.title}</span>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${card.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div>
                <p className="font-heading font-extrabold text-2xl text-gray-900">{card.value}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{card.subtext}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* 2. Top Performing Products Table */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-gray-100 shadow-2xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-heading font-bold text-base text-gray-900 flex items-center gap-2">
                <span>Top Performing Products</span>
                <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">Ranked by outgoing Daraz purchase clicks</p>
            </div>
            <Link
              href="/adminproduct/products"
              className="text-xs font-semibold text-[#0B5D36] hover:underline"
            >
              View All Products →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Product</th>
                  <th className="pb-3 font-semibold">Category</th>
                  <th className="pb-3 font-semibold">Price</th>
                  <th className="pb-3 font-semibold text-center">Daraz Clicks</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {(topProducts as Product[] || []).map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3.5 pr-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.primary_image}
                          alt={p.name}
                          className="w-10 h-10 object-cover rounded-xl border border-gray-100 shrink-0"
                        />
                        <div className="min-w-0 max-w-[200px] sm:max-w-xs">
                          <p className="font-bold text-gray-900 truncate">{p.name}</p>
                          <p className="text-[11px] text-gray-400">{p.brand || 'No brand'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 pr-3 text-gray-600 font-medium">
                      {p.category?.name || 'General'}
                    </td>
                    <td className="py-3.5 pr-3 font-bold text-gray-900 font-heading">
                      ৳{p.price.toLocaleString()}
                    </td>
                    <td className="py-3.5 text-center">
                      <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-50 text-[#0B5D36] font-bold">
                        {p.daraz_clicks_count || 0} clicks
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <Link
                        href={`/adminproduct/products/${p.id}/edit`}
                        className="text-xs font-semibold text-[#0B5D36] hover:underline"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. Quick Actions & Live Feed */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Shortcuts */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-2xs">
            <h3 className="font-heading font-bold text-sm text-gray-900 mb-4">Quick Management</h3>
            <div className="space-y-2">
              <Link
                href="/adminproduct/products/new"
                className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50/60 hover:bg-emerald-100/60 text-[#0B5D36] font-semibold text-xs transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <PlusCircle className="w-4 h-4" />
                  <span>Add New Product</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/adminproduct/categories"
                className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 hover:bg-emerald-50/50 text-gray-700 hover:text-[#0B5D36] font-semibold text-xs transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4" />
                  <span>Manage Categories</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/adminproduct/banners"
                className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 hover:bg-emerald-50/50 text-gray-700 hover:text-[#0B5D36] font-semibold text-xs transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <ShoppingBag className="w-4 h-4" />
                  <span>Hero & Promo Banners</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/adminproduct/settings"
                className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 hover:bg-emerald-50/50 text-gray-700 hover:text-[#0B5D36] font-semibold text-xs transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Site & Adsterra Settings</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Recent Live Activity Feed */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-2xs">
            <h3 className="font-heading font-bold text-sm text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span>Live Store Activity</span>
            </h3>
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {(recentEvents || []).map((ev) => (
                <div key={ev.id} className="flex items-start gap-2.5 text-xs py-1.5 border-b border-gray-50 last:border-0">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-800 capitalize">
                      {ev.event_type.replace('_', ' ')}
                    </p>
                    <p className="text-[11px] text-gray-400 truncate">
                      {ev.source_page || 'Storefront'} • {ev.device_type || 'desktop'}
                    </p>
                  </div>
                  <span className="text-[10px] text-gray-400 whitespace-nowrap">
                    {new Date(ev.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
