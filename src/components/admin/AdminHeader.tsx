'use client';

import React from 'react';
import Link from 'next/link';
import { Menu, ExternalLink, ShieldCheck, User } from 'lucide-react';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  onOpenMobileSidebar: () => void;
  actionButton?: React.ReactNode;
}

export function AdminHeader({ title, subtitle, onOpenMobileSidebar, actionButton }: AdminHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200/80 px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 text-gray-700 hover:text-[#0B5D36] hover:bg-emerald-50 rounded-xl"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-heading font-extrabold text-lg sm:text-xl text-gray-900 tracking-tight leading-none">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {actionButton}

        {/* Live storefront preview button */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 text-[#0B5D36] hover:bg-emerald-100 text-xs font-semibold transition-colors"
        >
          <span>View Store</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        {/* Admin Avatar */}
        <div className="flex items-center gap-2 pl-2 sm:border-l sm:border-gray-200">
          <div className="w-8 h-8 rounded-full bg-[#0B5D36] text-white flex items-center justify-center font-bold text-xs">
            NM
          </div>
        </div>
      </div>
    </header>
  );
}
