'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Star, Heart, ExternalLink, ShieldCheck, RotateCcw, 
  Banknote, Truck, Check, Share2, Volume2, Battery, Sparkles, Music, ChevronRight
} from 'lucide-react';
import { Product, SiteSettings } from '@/types/database';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/context/ToastContext';
import { ProductCard } from './ProductCard';
import { AdsterraSlot } from '@/components/ads/AdsterraSlot';

interface ProductDetailViewProps {
  product: Product;
  relatedProducts: Product[];
  adSettings?: SiteSettings['ad_settings'];
}

export function ProductDetailView({ product, relatedProducts, adSettings }: ProductDetailViewProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { toast } = useToast();

  const isFavorited = isInWishlist(product.id);

  // Gallery image selector
  const allImages = [
    product.primary_image,
    ...(product.hover_image ? [product.hover_image] : []),
    ...(Array.isArray(product.gallery_images) ? product.gallery_images : []),
  ].filter((img, idx, arr) => img && arr.indexOf(img) === idx);

  const [selectedImage, setSelectedImage] = useState(allImages[0] || product.primary_image);
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'reviews' | 'delivery' | 'returns'>('description');

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      toast('Product link copied to clipboard!', 'success');
    }
  };

  const handleWishlist = () => {
    toggleWishlist(product);
    if (!isFavorited) {
      toast('Added to your wishlist!', 'success');
    } else {
      toast('Removed from wishlist', 'info');
    }
  };

  const getFeatureIcon = (iconName?: string) => {
    const name = (iconName || '').toLowerCase();
    if (name.includes('noise') || name.includes('vol')) return Volume2;
    if (name.includes('battery') || name.includes('charge')) return Battery;
    if (name.includes('sound') || name.includes('music')) return Music;
    return Sparkles;
  };

  return (
    <div className="w-full bg-[#fbfdfc] pb-24 md:pb-16">
      {/* 1. Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-4 py-3 text-xs text-gray-500 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-[#0B5D36] transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3 text-gray-400" />
        {product.category && (
          <>
            <Link href={`/category/${product.category.slug}`} className="hover:text-[#0B5D36] transition-colors">
              {product.category.name}
            </Link>
            <ChevronRight className="w-3 h-3 text-gray-400" />
          </>
        )}
        {product.subcategory && (
          <>
            <span className="text-gray-600">{product.subcategory}</span>
            <ChevronRight className="w-3 h-3 text-gray-400" />
          </>
        )}
        <span className="text-gray-900 font-medium truncate max-w-[200px] sm:max-w-xs">
          {product.name}
        </span>
      </div>

      {/* 2. Main Product Info Layout (2 Columns) */}
      <div className="max-w-7xl mx-auto px-4 mt-2">
        <div className="bg-white rounded-3xl p-4 sm:p-8 border border-gray-100 shadow-2xs grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* LEFT: Product Gallery */}
          <div className="lg:col-span-6 flex flex-col-reverse sm:flex-row gap-4">
            {/* Thumbnails list */}
            {allImages.length > 1 && (
              <div className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-y-auto max-h-[460px] no-scrollbar shrink-0">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl p-1.5 border-2 bg-[#f8faf9] flex items-center justify-center transition-all ${
                      selectedImage === img
                        ? 'border-[#0B5D36] shadow-xs'
                        : 'border-gray-100 hover:border-gray-300 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} thumbnail ${idx + 1}`}
                      className="w-full h-full object-contain mix-blend-multiply"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Main Image Container */}
            <div className="relative flex-1 aspect-square rounded-3xl bg-[#f8faf9] border border-gray-100 flex items-center justify-center p-6 sm:p-10 overflow-hidden">
              {/* Badge */}
              {product.badges && product.badges.length > 0 && (
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-amber-600 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-md shadow-xs">
                    {product.badges[0]}
                  </span>
                </div>
              )}

              {/* Share button */}
              <button
                onClick={handleShare}
                aria-label="Share product"
                className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/90 hover:bg-white text-gray-500 hover:text-[#0B5D36] shadow-xs transition-colors"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-contain mix-blend-multiply transition-all duration-300"
              />
            </div>
          </div>

          {/* RIGHT: Product Buy Box & Details */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              {/* Brand & Category pill */}
              <div className="flex items-center gap-2 mb-2">
                {product.brand && (
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#0B5D36] bg-emerald-50 px-2.5 py-0.5 rounded-md">
                    {product.brand}
                  </span>
                )}
                {product.category && (
                  <span className="text-xs text-gray-500">
                    in {product.category.name}
                  </span>
                )}
              </div>

              {/* Product Title */}
              <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-gray-900 tracking-tight leading-snug">
                {product.name}
              </h1>

              {/* Bengali Title if available */}
              {product.name_bn && (
                <p className="font-bengali text-sm text-gray-600 mt-1 font-medium">
                  {product.name_bn}
                </p>
              )}

              {/* Rating & Social Proof */}
              <div className="flex items-center gap-3 mt-3.5 pb-4 border-b border-gray-100 flex-wrap text-xs sm:text-sm">
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-gray-900 font-heading">{product.rating ? Number(product.rating).toFixed(1) : '4.8'}</span>
                </div>
                <span className="text-gray-400">
                  ({product.review_count ? `${product.review_count > 999 ? (product.review_count / 1000).toFixed(1) + 'K' : product.review_count}` : '2.1K'} reviews)
                </span>
                <span className="text-gray-300">•</span>
                <span className="text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  {product.sold_count || '10K+ sold'}
                </span>
              </div>

              {/* Trust Badges Strip (matching reference image!) */}
              <div className="grid grid-cols-2 gap-2.5 my-4 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#0B5D36] shrink-0" />
                  <span>100% Original Product</span>
                </div>
                <div className="flex items-center gap-2">
                  <Banknote className="w-4 h-4 text-[#0B5D36] shrink-0" />
                  <span>Cash on Delivery Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-[#0B5D36] shrink-0" />
                  <span>7 Days Easy Return</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#0B5D36] shrink-0" />
                  <span>Fast Nationwide Delivery</span>
                </div>
              </div>

              {/* Price Row */}
              <div className="my-5 p-4 rounded-2xl bg-[#f4fbf7] border border-emerald-100/80 flex items-center justify-between">
                <div className="flex items-baseline gap-3">
                  <span className="font-heading font-extrabold text-3xl text-gray-900">
                    ৳{product.price.toLocaleString()}
                  </span>
                  {Boolean(product.original_price && product.original_price > product.price) && (
                    <span className="text-sm text-gray-400 line-through">
                      ৳{product.original_price?.toLocaleString()}
                    </span>
                  )}
                </div>

                {Boolean(product.discount_percent && product.discount_percent > 0) && (
                  <span className="bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-xs">
                    {Math.round(product.discount_percent || 0)}% OFF
                  </span>
                )}
              </div>

              {/* Primary Action Button (Configured Daraz CTA) */}
              <div className="flex items-center gap-3">
                <a
                  href={`/api/redirect/${product.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-[#0B5D36] hover:bg-[#074528] text-white text-base font-heading font-bold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg shadow-emerald-900/10 hover:-translate-y-0.5"
                >
                  <span>{product.custom_cta_text || 'View on Daraz'}</span>
                  <ExternalLink className="w-5 h-5" />
                </a>

                {/* Wishlist Heart Button */}
                <button
                  onClick={handleWishlist}
                  aria-label="Wishlist"
                  className={`p-3.5 rounded-2xl border-2 transition-all ${
                    isFavorited
                      ? 'border-rose-300 bg-rose-50 text-rose-600'
                      : 'border-gray-200 hover:border-[#0B5D36] text-gray-600 hover:text-[#0B5D36]'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isFavorited ? 'fill-rose-500' : ''}`} />
                </button>
              </div>
              <p className="text-[11px] text-gray-400 mt-2 text-center sm:text-left">
                You will be safely redirected to Daraz Bangladesh to complete your purchase.
              </p>

              {/* Quick Feature Highlights Chips */}
              {product.features && product.features.length > 0 && (
                <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-gray-100">
                  {product.features.map((feat, idx) => {
                    const Icon = getFeatureIcon(feat.icon);
                    return (
                      <div key={idx} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                        <div className="w-7 h-7 rounded-lg bg-emerald-100/70 text-[#0B5D36] flex items-center justify-center shrink-0">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-gray-900 leading-tight truncate">{feat.title}</p>
                          <p className="text-[10px] text-gray-500 truncate">{feat.value}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

        </div>

        {/* 3. Product Tabs Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-2xs mt-8">
          {/* Tabs Navigation */}
          <div className="flex items-center gap-2 border-b border-gray-100 overflow-x-auto no-scrollbar pb-1">
            {[
              { id: 'description', label: 'Description' },
              { id: 'specifications', label: 'Specifications' },
              { id: 'reviews', label: `Reviews (${product.review_count || '2.1K'})` },
              { id: 'delivery', label: 'Delivery' },
              { id: 'returns', label: 'Return Policy' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-4 sm:px-6 py-3 font-heading font-semibold text-xs sm:text-sm whitespace-nowrap transition-all border-b-2 -mb-px ${
                  activeTab === tab.id
                    ? 'border-[#0B5D36] text-[#0B5D36]'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Contents */}
          <div className="py-6 text-sm text-gray-700 leading-relaxed">
            {activeTab === 'description' && (
              <div className="space-y-4">
                {product.full_description ? (
                  <div
                    className="prose prose-emerald max-w-none text-gray-700 prose-headings:font-heading prose-headings:text-gray-900"
                    dangerouslySetInnerHTML={{ __html: product.full_description }}
                  />
                ) : (
                  <p>{product.short_description || 'High quality verified product selected for maximum durability and performance.'}</p>
                )}
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="max-w-2xl divide-y divide-gray-100">
                {product.specifications && product.specifications.length > 0 ? (
                  product.specifications.map((spec, idx) => (
                    <div key={idx} className="grid grid-cols-2 py-3 text-xs sm:text-sm">
                      <span className="font-semibold text-gray-900">{spec.name}</span>
                      <span className="text-gray-600">{spec.value}</span>
                    </div>
                  ))
                ) : (
                  <div className="space-y-2 text-xs sm:text-sm">
                    <div className="grid grid-cols-2 py-2"><span className="font-semibold text-gray-900">Brand</span><span className="text-gray-600">{product.brand || 'Official'}</span></div>
                    <div className="grid grid-cols-2 py-2"><span className="font-semibold text-gray-900">Category</span><span className="text-gray-600">{product.category?.name || 'Accessories'}</span></div>
                    <div className="grid grid-cols-2 py-2"><span className="font-semibold text-gray-900">Currency</span><span className="text-gray-600">BDT (৳)</span></div>
                    <div className="grid grid-cols-2 py-2"><span className="font-semibold text-gray-900">Condition</span><span className="text-gray-600">100% Brand New Authentic</span></div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex items-center gap-6 p-6 rounded-2xl bg-emerald-50/50 border border-emerald-100 max-w-md">
                  <div className="text-center">
                    <p className="font-heading font-extrabold text-4xl text-[#0B5D36]">{product.rating ? Number(product.rating).toFixed(1) : '4.7'}</p>
                    <div className="flex items-center justify-center text-amber-400 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Based on {product.review_count || '2,100'} verified buyers</p>
                  </div>
                </div>

                <div className="space-y-4 max-w-2xl">
                  <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-gray-900">Tanvir A.</span>
                        <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">Verified Purchase</span>
                      </div>
                      <span className="text-xs text-gray-400">2 days ago</span>
                    </div>
                    <p className="text-xs text-gray-600">
                      Excellent build quality for this price point! Bass is deep and battery backup easily lasted through my entire weekend trip.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-gray-900">Sabbir Hossain</span>
                        <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">Verified Purchase</span>
                      </div>
                      <span className="text-xs text-gray-400">1 week ago</span>
                    </div>
                    <p className="text-xs text-gray-600">
                      Fast delivery to Chittagong within 3 days. Original packaging and genuine product as described.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'delivery' && (
              <div className="max-w-xl space-y-4">
                <div className="flex items-start gap-3">
                  <Truck className="w-5 h-5 text-[#0B5D36] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">Delivery Timeframes</h4>
                    <p className="text-xs text-gray-600 mt-1">
                      Dhaka City: 1-2 business days.<br />
                      Outside Dhaka (All 64 districts): 2-4 business days.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#0B5D36] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">Cash on Delivery & Online Payment</h4>
                    <p className="text-xs text-gray-600 mt-1">
                      Pay easily via Cash on Delivery, bKash, Nagad, Visa, Mastercard, or City Bank Amex upon final checkout.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'returns' && (
              <div className="max-w-xl space-y-3">
                <div className="flex items-start gap-3">
                  <RotateCcw className="w-5 h-5 text-[#0B5D36] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">7 Days Return Guarantee</h4>
                    <p className="text-xs text-gray-600 mt-1">
                      If the item is damaged, defective, or not as described, return it hassle-free within 7 days of delivery for a 100% full refund through the official Daraz buyer protection policy.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 4. Sponsored Ad Slot (Adsterra Leaderboard 728x90) */}
        {(adSettings?.enabled ?? true) && (adSettings?.show_on_product_page ?? true) && (
          <AdsterraSlot
            type="728x90"
            adCode={adSettings?.adsterra_banner_728x90_code || adSettings?.adsterra_banner_code}
            slotLabel="Sponsored Partner • 728×90"
          />
        )}

        {/* 5. Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h3 className="font-heading font-bold text-xl text-gray-900 mb-6">
              More Like This
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {relatedProducts.slice(0, 5).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 6. Sticky Mobile Bottom CTA Bar (matching specification & reference!) */}
      <div className="fixed bottom-14 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-gray-200 p-3 lg:hidden shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
        <div className="max-w-md mx-auto flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-gray-500 block uppercase">Price</span>
            <span className="font-heading font-extrabold text-lg text-gray-900">
              ৳{product.price.toLocaleString()}
            </span>
          </div>
          <a
            href={`/api/redirect/${product.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-[#0B5D36] hover:bg-[#074528] text-white text-xs font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs"
          >
            <span>{product.custom_cta_text || 'View on Daraz'}</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
