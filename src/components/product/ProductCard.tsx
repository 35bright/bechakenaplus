'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Star, Heart, ArrowRight, ExternalLink } from 'lucide-react';
import { Product } from '@/types/database';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/context/ToastContext';

interface ProductCardProps {
  product: Product;
  showDirectDarazCta?: boolean;
}

export function ProductCard({ product, showDirectDarazCta = false }: ProductCardProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { toast } = useToast();
  const [isHovered, setIsHovered] = useState(false);

  const isFavorited = isInWishlist(product.id);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    if (!isFavorited) {
      toast(`Added "${product.name.slice(0, 24)}..." to your wishlist!`, 'success');
    } else {
      toast(`Removed from wishlist`, 'info');
    }
  };

  // Badge styling helper
  const getBadgeClass = (badge: string) => {
    const b = badge.toUpperCase();
    if (b.includes('BEST SELLER')) return 'bg-amber-600 text-white';
    if (b.includes('OFF') || b.includes('%')) return 'bg-red-500 text-white';
    if (b.includes('TRENDING')) return 'bg-[#0B5D36] text-white';
    if (b.includes('POPULAR')) return 'bg-orange-500 text-white';
    if (b.includes('NEW')) return 'bg-emerald-600 text-white';
    if (b.includes('LIMITED')) return 'bg-rose-600 text-white';
    return 'bg-gray-800 text-white';
  };

  const primaryBadge = product.badges && product.badges.length > 0 ? product.badges[0] : product.discount_percent && product.discount_percent > 0 ? `${Math.round(product.discount_percent)}% OFF` : null;

  return (
    <div
      className="group bg-white rounded-2xl border border-gray-100/90 shadow-2xs hover:shadow-xl hover:border-emerald-200/80 transition-all duration-300 flex flex-col overflow-hidden relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 1. Image Container */}
      <div className="relative aspect-square w-full bg-[#f8faf9] overflow-hidden p-3 flex items-center justify-center">
        {/* Top Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 items-start">
          {primaryBadge && (
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-xs ${getBadgeClass(primaryBadge)}`}>
              {primaryBadge}
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={handleWishlistToggle}
          aria-label="Toggle Wishlist"
          className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-md transition-all shadow-xs ${
            isFavorited
              ? 'bg-rose-50 text-rose-600 border border-rose-200'
              : 'bg-white/90 text-gray-400 hover:text-rose-500 hover:bg-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Product Image with Hover Swap */}
        <Link href={`/products/${product.slug}`} className="w-full h-full flex items-center justify-center">
          <img
            src={isHovered && product.hover_image ? product.hover_image : product.primary_image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
      </div>

      {/* 2. Card Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-heading font-semibold text-sm text-gray-900 group-hover:text-[#0B5D36] transition-colors line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Short Benefit / Spec Snippet */}
          {product.short_description && (
            <p className="text-xs text-gray-500 mt-1 line-clamp-1">
              {product.short_description}
            </p>
          )}

          {/* Rating and Reviews */}
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs font-bold text-gray-900 ml-1">{product.rating ? Number(product.rating).toFixed(1) : '4.8'}</span>
            </div>
            <span className="text-xs text-gray-400">
              ({product.review_count ? `${product.review_count > 999 ? (product.review_count / 1000).toFixed(1) + 'K' : product.review_count}` : '1.2K'})
            </span>
          </div>
        </div>

        {/* 3. Price & Purchase CTA */}
        <div className="mt-4 pt-3 border-t border-gray-50">
          {/* Pricing Row */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-base sm:text-lg font-bold text-gray-900 font-heading">
              ৳{product.price.toLocaleString()}
            </span>
            {Boolean(product.original_price && product.original_price > product.price) && (
              <span className="text-xs text-gray-400 line-through">
                ৳{product.original_price?.toLocaleString()}
              </span>
            )}
          </div>

          {/* Action CTA Button */}
          {showDirectDarazCta ? (
            <a
              href={`/api/redirect/${product.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#0B5D36] hover:bg-[#074528] text-white text-xs font-semibold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs hover:shadow-md"
            >
              <span>{product.custom_cta_text || 'View on Daraz'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          ) : (
            <Link
              href={`/products/${product.slug}`}
              className="w-full bg-[#0B5D36] hover:bg-[#074528] text-white text-xs font-semibold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs hover:shadow-md"
            >
              <span>View Product</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
