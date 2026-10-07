'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { ProductCard } from '@/components/product/ProductCard';

export function WishlistClient() {
  const { wishlist, removeFromWishlist } = useWishlist();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 w-full">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-2xs mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <Heart className="w-6 h-6 fill-rose-500" />
          </div>
          <div>
            <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-gray-900">
              My Saved Wishlist
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved for later
            </p>
          </div>
        </div>
      </div>

      {wishlist.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {wishlist.map((product) => (
            <div key={product.id} className="relative group">
              <ProductCard product={product} />
              <button
                onClick={() => removeFromWishlist(product.id)}
                className="absolute top-2 right-12 z-20 p-1.5 rounded-full bg-white/90 hover:bg-red-50 text-gray-400 hover:text-red-500 shadow-xs transition-colors"
                title="Remove item"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-2xs max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="font-heading font-bold text-lg text-gray-900">Your wishlist is empty</h3>
          <p className="text-xs text-gray-500 mt-1">
            Tap the heart icon on any product to save it here for easy discovery and price tracking.
          </p>
          <div className="mt-6">
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-[#0B5D36] text-white text-xs font-semibold hover:bg-[#074528] transition-colors"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
