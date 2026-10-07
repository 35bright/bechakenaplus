'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, ShoppingBag, PlusCircle, Layers, 
  MousePointerClick, Image as ImageIcon, FileText, Settings, 
  LogOut, ExternalLink, ShieldAlert
} from 'lucide-react';
import { Logo } from '@/components/common/Logo';
import { useToast } from '@/context/ToastContext';

export function AdminSidebar({ isMobile = false, onClose }: { isMobile?: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      toast('Logged out successfully', 'info');
      router.push('/adminproduct/login');
      router.refresh();
    } catch {
      router.push('/adminproduct/login');
    }
  };

  const navGroups = [
    {
      title: 'OVERVIEW',
      items: [
        { label: 'Dashboard', href: '/adminproduct/dashboard', icon: LayoutDashboard },
      ]
    },
    {
      title: 'INVENTORY & CATALOG',
      items: [
        { label: 'All Products', href: '/adminproduct/products', icon: ShoppingBag },
        { label: 'Add Product', href: '/adminproduct/products/new', icon: PlusCircle },
        { label: 'Categories', href: '/adminproduct/categories', icon: Layers },
      ]
    },
    {
      title: 'MARKETING & CONTENT',
      items: [
        { label: 'Banners & Hero', href: '/adminproduct/banners', icon: ImageIcon },
        { label: 'Blog & Guides', href: '/adminproduct/blog', icon: FileText },
        { label: 'Orders & Clicks', href: '/adminproduct/analytics', icon: MousePointerClick },
      ]
    },
    {
      title: 'CONFIGURATION',
      items: [
        { label: 'Site Settings', href: '/adminproduct/settings', icon: Settings },
      ]
    },
  ];

  return (
    <aside className="w-64 bg-[#073d24] text-white h-screen flex flex-col justify-between overflow-y-auto select-none border-r border-emerald-900/60 shadow-xl">
      <div>
        {/* Logo Header */}
        <div className="p-5 border-b border-emerald-800/60 flex items-center justify-between">
          <Logo variant="white" size="sm" />
          {isMobile && (
            <button onClick={onClose} className="text-emerald-300 hover:text-white p-1">
              ✕
            </button>
          )}
        </div>

        {/* Live Storefront quick link */}
        <div className="px-4 py-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-xl bg-emerald-900/50 hover:bg-emerald-800/80 text-emerald-200 hover:text-white text-xs font-semibold transition-colors border border-emerald-800/40"
          >
            <span>Live Storefront</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Navigation Sections */}
        <nav className="p-3 space-y-5">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              <p className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-emerald-400/70 mb-1.5">
                {group.title}
              </p>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== '/adminproduct/dashboard' && pathname.startsWith(item.href) && item.href !== '/adminproduct/products');

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-[#0B5D36] text-white shadow-xs border border-emerald-600/40'
                        : 'text-emerald-100/80 hover:bg-emerald-900/40 hover:text-white'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-300' : 'text-emerald-400'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Admin User Footer & Logout */}
      <div className="p-4 border-t border-emerald-800/60 bg-[#052e1b]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#0B5D36] border border-emerald-400/40 flex items-center justify-center font-bold text-xs text-white shrink-0">
              NM
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">Neamul Morshed</p>
              <p className="text-[10px] text-emerald-300 truncate">Master Admin</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Logout"
            className="p-2 text-emerald-300 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
