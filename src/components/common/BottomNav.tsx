'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, Heart, Flame, BookOpen } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';

export function BottomNav() {
  const pathname = usePathname();
  const { wishlistCount } = useWishlist();

  // Hide on admin routes
  if (pathname.startsWith('/adminproduct')) {
    return null;
  }

  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Categories', href: '/products', icon: LayoutGrid },
    { label: 'Deals', href: '/deals', icon: Flame },
    { label: 'Wishlist', href: '/wishlist', icon: Heart, badge: wishlistCount },
    { label: 'Guides', href: '/blog', icon: BookOpen },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-100 lg:hidden shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
      <nav className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center min-w-[56px] py-1 text-[11px] font-medium transition-colors relative ${
                isActive ? 'text-[#0B5D36] font-bold' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                {Boolean(item.badge && item.badge > 0) && (
                  <span className="absolute -top-1.5 -right-2.5 bg-[#0B5D36] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="mt-0.5">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
