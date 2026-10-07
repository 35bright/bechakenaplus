'use client';

import React, { useState } from 'react';
import { 
  MousePointerClick, Eye, TrendingUp, Search, 
  Smartphone, Monitor, ExternalLink, Calendar, Flame 
} from 'lucide-react';
import { Product, AnalyticsEvent } from '@/types/database';

interface AnalyticsClientProps {
  stats: {
    totalProducts: number;
    totalPageViews: number;
    totalProductViews: number;
    totalDarazClicks: number;
    totalSearches: number;
    ctr: string;
  };
  topProducts: Product[];
  recentEvents: AnalyticsEvent[];
}

export function AnalyticsClient({ stats, topProducts, recentEvents }: AnalyticsClientProps) {
  const [filterType, setFilterType] = useState('all');

  const filteredEvents = recentEvents.filter(ev => {
    if (filterType === 'all') return true;
    return ev.event_type === filterType;
  });

  return (
    <div className="space-y-8">
      {/* 1. Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Product Impressions</span>
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Eye className="w-5 h-5" />
            </div>
          </div>
          <p className="font-heading font-extrabold text-3xl text-gray-900">{stats.totalProductViews.toLocaleString()}</p>
          <p className="text-xs text-gray-400 mt-1">Total product page views</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Daraz Outgoing Clicks</span>
            <div className="w-10 h-10 rounded-2xl bg-[#e8f5ee] text-[#0B5D36] flex items-center justify-center">
              <MousePointerClick className="w-5 h-5" />
            </div>
          </div>
          <p className="font-heading font-extrabold text-3xl text-[#0B5D36]">{stats.totalDarazClicks.toLocaleString()}</p>
          <p className="text-xs text-gray-400 mt-1">Purchase intent redirects</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Conversion CTR</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="font-heading font-extrabold text-3xl text-gray-900">{stats.ctr}</p>
          <p className="text-xs text-gray-400 mt-1">View-to-click conversion rate</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Customer Searches</span>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Search className="w-5 h-5" />
            </div>
          </div>
          <p className="font-heading font-extrabold text-3xl text-gray-900">{stats.totalSearches.toLocaleString()}</p>
          <p className="text-xs text-gray-400 mt-1">Keyword queries logged</p>
        </div>
      </div>

      {/* 2. Top Products Performance Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-2xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-heading font-bold text-base text-gray-900 flex items-center gap-2">
              <span>Top Converting Products (Daraz Clicks)</span>
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">Products generating the highest purchase intent</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                <th className="pb-3 font-semibold">Rank</th>
                <th className="pb-3 font-semibold">Product Name</th>
                <th className="pb-3 font-semibold">Price</th>
                <th className="pb-3 font-semibold text-center">Daraz Clicks</th>
                <th className="pb-3 font-semibold text-right">Destination URL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {topProducts.map((p, idx) => (
                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-3.5 pr-3 font-mono font-bold text-gray-400">
                    #{idx + 1}
                  </td>
                  <td className="py-3.5 pr-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.primary_image}
                        alt={p.name}
                        className="w-10 h-10 object-contain rounded-xl bg-[#f8faf9] border border-gray-100 shrink-0"
                      />
                      <span className="font-bold text-gray-900 truncate max-w-xs">{p.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 pr-3 font-bold text-gray-900 font-heading">
                    ৳{p.price.toLocaleString()}
                  </td>
                  <td className="py-3.5 text-center">
                    <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-[#0B5D36] font-extrabold text-xs">
                      {p.daraz_clicks_count || 0} clicks
                    </span>
                  </td>
                  <td className="py-3.5 text-right font-mono text-[11px] text-gray-400">
                    <a
                      href={p.daraz_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0B5D36] hover:underline inline-flex items-center gap-1"
                    >
                      <span>Daraz Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Live Event Stream */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="font-heading font-bold text-base text-gray-900">
              First-Party Event Log Stream
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">Privacy-compliant visitor actions recorded in real-time</p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-1.5 bg-[#f8faf9] border border-gray-200 rounded-xl text-xs text-gray-700 outline-hidden"
            >
              <option value="all">All Event Types</option>
              <option value="daraz_click">Daraz Clicks</option>
              <option value="product_view">Product Views</option>
              <option value="search">Searches</option>
              <option value="page_view">Page Views</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                <th className="pb-3 font-semibold">Event</th>
                <th className="pb-3 font-semibold">Source Page / Query</th>
                <th className="pb-3 font-semibold">Device</th>
                <th className="pb-3 font-semibold text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredEvents.map((ev) => (
                <tr key={ev.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 pr-3">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      ev.event_type === 'daraz_click'
                        ? 'bg-emerald-100 text-[#0B5D36]'
                        : ev.event_type === 'product_view'
                        ? 'bg-purple-100 text-purple-700'
                        : ev.event_type === 'search'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {ev.event_type.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 pr-3 font-medium text-gray-800">
                    {ev.search_query ? `Search: "${ev.search_query}"` : ev.source_page || '/'}
                  </td>
                  <td className="py-3 pr-3 text-gray-500 capitalize">
                    {ev.device_type || 'Desktop'}
                  </td>
                  <td className="py-3 text-right text-gray-400 font-mono text-[11px]">
                    {new Date(ev.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
