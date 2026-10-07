'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Save, Plus, Trash2, Loader2, 
  ExternalLink, Eye, CheckCircle2, Sparkles, Tag 
} from 'lucide-react';
import { Product, Category, ProductFeature, ProductSpecification } from '@/types/database';
import { ImageUploader } from './ImageUploader';
import { ProductCard } from '@/components/product/ProductCard';
import { useToast } from '@/context/ToastContext';

interface ProductFormProps {
  initialProduct?: Product | null;
  categories: Category[];
  isEditing?: boolean;
}

export function ProductForm({ initialProduct, categories, isEditing = false }: ProductFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [name, setName] = useState(initialProduct?.name || '');
  const [nameBn, setNameBn] = useState(initialProduct?.name_bn || '');
  const [slug, setSlug] = useState(initialProduct?.slug || '');
  const [categoryId, setCategoryId] = useState(initialProduct?.category_id || (categories[0]?.id || ''));
  const [subcategory, setSubcategory] = useState(initialProduct?.subcategory || '');
  const [brand, setBrand] = useState(initialProduct?.brand || '');
  const [shortDesc, setShortDesc] = useState(initialProduct?.short_description || '');
  const [shortDescBn, setShortDescBn] = useState(initialProduct?.short_description_bn || '');
  const [fullDesc, setFullDesc] = useState(initialProduct?.full_description || '');
  
  // Pricing
  const [price, setPrice] = useState<number | string>(initialProduct?.price !== undefined ? initialProduct.price : '');
  const [oldPrice, setOldPrice] = useState<number | string>(initialProduct?.original_price !== undefined ? initialProduct.original_price : '');
  const [discountPercent, setDiscountPercent] = useState<number>(initialProduct?.discount_percent || 0);

  // Real Social Proof / Rating from Daraz (Optional)
  const [rating, setRating] = useState<number | string>(initialProduct?.rating !== undefined && initialProduct.rating !== null ? initialProduct.rating : '');
  const [reviewCount, setReviewCount] = useState<number | string>(initialProduct?.review_count !== undefined && initialProduct.review_count !== null ? initialProduct.review_count : '');
  const [soldCount, setSoldCount] = useState<string>(initialProduct?.sold_count || '');

  // Destination
  const [darazUrl, setDarazUrl] = useState(initialProduct?.daraz_url || '');
  const [customCtaText, setCustomCtaText] = useState(initialProduct?.custom_cta_text || 'View on Daraz');

  // Media
  const [primaryImage, setPrimaryImage] = useState(initialProduct?.primary_image || '');
  const [hoverImage, setHoverImage] = useState(initialProduct?.hover_image || '');
  const [galleryImages, setGalleryImages] = useState<string[]>(
    Array.isArray(initialProduct?.gallery_images) ? initialProduct.gallery_images : []
  );

  // Features & Specs
  const [features, setFeatures] = useState<ProductFeature[]>(
    initialProduct?.features && initialProduct.features.length > 0
      ? initialProduct.features
      : [{ title: 'Noise Cancellation', value: 'Active acoustic isolation' }]
  );

  const [specifications, setSpecifications] = useState<ProductSpecification[]>(
    initialProduct?.specifications && initialProduct.specifications.length > 0
      ? initialProduct.specifications
      : [{ name: 'Bluetooth Version', value: '5.3' }]
  );

  // Flags & Status
  const [status, setStatus] = useState<'published' | 'draft' | 'archived'>(initialProduct?.status || 'published');
  const [isFeatured, setIsFeatured] = useState<boolean>(initialProduct?.is_featured ?? false);
  const [isTrending, setIsTrending] = useState<boolean>(initialProduct?.is_trending ?? false);
  const [isDeal, setIsDeal] = useState<boolean>(initialProduct?.is_deal ?? false);
  const [isBestSeller, setIsBestSeller] = useState<boolean>(initialProduct?.is_best_seller ?? false);
  const [isPopular, setIsPopular] = useState<boolean>(initialProduct?.is_popular ?? false);
  const [isLimitedStock, setIsLimitedStock] = useState<boolean>(initialProduct?.is_limited_stock ?? false);
  const [showOnHomepage, setShowOnHomepage] = useState<boolean>(initialProduct?.show_on_homepage ?? true);
  const [badgesText, setBadgesText] = useState<string>(initialProduct?.badges?.join(', ') || 'BEST SELLER');
  const [tagsText, setTagsText] = useState<string>(initialProduct?.tags?.join(', ') || '');

  // Auto-calculate discount
  useEffect(() => {
    const numPrice = Number(price);
    const numOldPrice = Number(oldPrice);
    if (numPrice > 0 && numOldPrice > numPrice) {
      const calc = Math.round(((numOldPrice - numPrice) / numOldPrice) * 100);
      setDiscountPercent(calc);
    } else {
      setDiscountPercent(0);
    }
  }, [price, oldPrice]);

  // Auto-generate slug from name if new
  useEffect(() => {
    if (!isEditing && name && !slug) {
      const gen = name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
      setSlug(gen);
    }
  }, [name, isEditing, slug]);

  const addFeatureRow = () => {
    setFeatures([...features, { title: '', value: '' }]);
  };

  const removeFeatureRow = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const addSpecRow = () => {
    setSpecifications([...specifications, { name: '', value: '' }]);
  };

  const removeSpecRow = (index: number) => {
    setSpecifications(specifications.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast('Please enter a product title', 'error');
      return;
    }
    if (!price || Number(price) <= 0) {
      toast('Please enter a valid product price', 'error');
      return;
    }
    if (!darazUrl.trim()) {
      toast('Please enter the Daraz product URL destination', 'error');
      return;
    }
    if (!primaryImage.trim()) {
      toast('Please upload at least one primary image to ImgBB', 'error');
      return;
    }

    setIsSaving(true);

    const badges = badgesText
      .split(',')
      .map(b => b.trim())
      .filter(Boolean);

    const tags = tagsText
      .split(',')
      .map(t => t.trim().toLowerCase())
      .filter(Boolean);

    const payload = {
      name: name.trim(),
      name_bn: nameBn.trim() || null,
      slug: slug.trim() || name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-'),
      short_description: shortDesc.trim() || null,
      short_description_bn: shortDescBn.trim() || null,
      full_description: fullDesc.trim() || null,
      category_id: categoryId || null,
      subcategory: subcategory.trim() || null,
      brand: brand.trim() || null,
      price: Number(price),
      original_price: oldPrice ? Number(oldPrice) : null,
      discount_percent: discountPercent,
      rating: rating !== '' && !isNaN(Number(rating)) ? Math.min(5, Math.max(0, Number(rating))) : null,
      review_count: reviewCount !== '' && !isNaN(Number(reviewCount)) ? parseInt(String(reviewCount), 10) : 0,
      sold_count: soldCount.trim() || null,
      daraz_url: darazUrl.trim(),
      custom_cta_text: customCtaText.trim() || 'View on Daraz',
      primary_image: primaryImage.trim(),
      hover_image: hoverImage.trim() || null,
      gallery_images: galleryImages,
      features: features.filter(f => f.title.trim() && f.value.trim()),
      specifications: specifications.filter(s => s.name.trim() && s.value.trim()),
      status,
      is_featured: isFeatured,
      is_trending: isTrending,
      is_deal: isDeal,
      is_best_seller: isBestSeller,
      is_popular: isPopular,
      is_limited_stock: isLimitedStock,
      show_on_homepage: showOnHomepage,
      badges,
      tags,
    };

    try {
      const endpoint = isEditing ? `/api/admin/products/${initialProduct?.id}` : '/api/admin/products';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast(isEditing ? 'Product updated successfully!' : 'Product published successfully!', 'success');
        router.push('/adminproduct/products');
        router.refresh();
      } else {
        toast(data.error || 'Failed to save product', 'error');
      }
    } catch {
      toast('Network error saving product', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Construct preview product for live card preview
  const selectedCat = categories.find(c => c.id === categoryId);
  const previewProduct: Product = {
    id: initialProduct?.id || 'preview-id',
    name: name || 'Lenovo Thinkplus TH30 Wireless Headphones',
    name_bn: nameBn,
    slug: slug || 'preview-product',
    short_description: shortDesc || 'Experience premium sound with powerful bass and long battery life.',
    price: Number(price) || 2190,
    original_price: Number(oldPrice) || 3500,
    discount_percent: discountPercent || 37,
    currency: 'BDT',
    daraz_url: darazUrl || 'https://daraz.com.bd',
    custom_cta_text: customCtaText || 'View on Daraz',
    primary_image: primaryImage || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=85',
    hover_image: hoverImage,
    gallery_images: galleryImages,
    rating: initialProduct?.rating || 4.7,
    review_count: initialProduct?.review_count || 2100,
    badges: badgesText.split(',').map(b => b.trim()).filter(Boolean),
    tags: [],
    is_featured: isFeatured,
    is_trending: isTrending,
    is_deal: isDeal,
    is_best_seller: isBestSeller,
    is_popular: isPopular,
    is_limited_stock: isLimitedStock,
    show_on_homepage: showOnHomepage,
    status,
    sort_order: 0,
    views_count: 0,
    daraz_clicks_count: 0,
    category: selectedCat,
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Top action header */}
      <div className="flex items-center justify-between">
        <Link
          href="/adminproduct/products"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-[#0B5D36] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </Link>

        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#0B5D36] hover:bg-[#074528] text-white text-xs font-bold rounded-2xl shadow-md transition-all disabled:opacity-50 cursor-pointer"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{isEditing ? 'Update Product' : 'Save & Publish Product'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT 8 COLS: Main Product Details */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* 1. Basic Information */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-2xs space-y-4">
            <h3 className="font-heading font-bold text-sm text-gray-900 border-b border-gray-100 pb-3">
              1. Basic Information
            </h3>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Product Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Lenovo Thinkplus TH30 Wireless Bluetooth Headphones"
                className="w-full px-4 py-3 bg-[#f8faf9] border border-gray-200 rounded-xl text-xs text-gray-900 outline-hidden focus:border-[#0B5D36] focus:bg-white transition-all font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Bengali Title (Optional)
                </label>
                <input
                  type="text"
                  value={nameBn}
                  onChange={(e) => setNameBn(e.target.value)}
                  placeholder="e.g. লেনোভো থিঙ্কপ্লাস টিএইচ৩০ ওয়্যারলেস হেডফোন"
                  className="w-full px-4 py-3 bg-[#f8faf9] border border-gray-200 rounded-xl text-xs text-gray-900 outline-hidden focus:border-[#0B5D36] focus:bg-white transition-all font-bengali"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  URL Slug
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="lenovo-thinkplus-th30"
                  className="w-full px-4 py-3 bg-[#f8faf9] border border-gray-200 rounded-xl text-xs text-gray-700 outline-hidden focus:border-[#0B5D36] font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3.5 py-3 bg-[#f8faf9] border border-gray-200 rounded-xl text-xs text-gray-900 outline-hidden focus:border-[#0B5D36] cursor-pointer"
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Subcategory
                </label>
                <input
                  type="text"
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                  placeholder="e.g. Headphones & Audio"
                  className="w-full px-3.5 py-3 bg-[#f8faf9] border border-gray-200 rounded-xl text-xs text-gray-900 outline-hidden focus:border-[#0B5D36]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Brand Name
                </label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g. Lenovo"
                  className="w-full px-3.5 py-3 bg-[#f8faf9] border border-gray-200 rounded-xl text-xs text-gray-900 outline-hidden focus:border-[#0B5D36]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Short Description (Card snippet) <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={2}
                value={shortDesc}
                onChange={(e) => setShortDesc(e.target.value)}
                placeholder="Enter short benefit summary shown on product card..."
                className="w-full px-4 py-2.5 bg-[#f8faf9] border border-gray-200 rounded-xl text-xs text-gray-900 outline-hidden focus:border-[#0B5D36]"
              />
            </div>
          </div>

          {/* 2. Pricing & Daraz Destination */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-2xs space-y-4">
            <h3 className="font-heading font-bold text-sm text-gray-900 border-b border-gray-100 pb-3">
              2. Pricing & Daraz Purchase Destination
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Current Price (BDT ৳) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="1"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="2190"
                  className="w-full px-4 py-3 bg-[#f8faf9] border border-gray-200 rounded-xl text-xs text-gray-900 font-bold outline-hidden focus:border-[#0B5D36]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Original / Old Price (BDT ৳)
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={oldPrice}
                  onChange={(e) => setOldPrice(e.target.value)}
                  placeholder="3500"
                  className="w-full px-4 py-3 bg-[#f8faf9] border border-gray-200 rounded-xl text-xs text-gray-900 outline-hidden focus:border-[#0B5D36]"
                />
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between">
                <span className="text-xs text-[#0B5D36] font-semibold">Calculated Discount:</span>
                <span className="text-sm font-extrabold text-[#0B5D36] font-mono">
                  {discountPercent > 0 ? `${discountPercent}% OFF` : '0%'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Daraz Product URL (Destination) <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  required
                  value={darazUrl}
                  onChange={(e) => setDarazUrl(e.target.value)}
                  placeholder="https://www.daraz.com.bd/products/..."
                  className="w-full px-4 py-3 bg-[#f8faf9] border border-gray-200 rounded-xl text-xs text-gray-900 outline-hidden focus:border-[#0B5D36] font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Custom CTA Text
                </label>
                <input
                  type="text"
                  value={customCtaText}
                  onChange={(e) => setCustomCtaText(e.target.value)}
                  placeholder="View on Daraz"
                  className="w-full px-4 py-3 bg-[#f8faf9] border border-gray-200 rounded-xl text-xs text-gray-900 outline-hidden focus:border-[#0B5D36]"
                />
              </div>
            </div>

            {/* Real Rating & Review Count from Daraz */}
            <div className="pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                  Real Daraz Rating & Reviews (Optional)
                </span>
                <span className="text-[10px] text-gray-400 font-medium">
                  Leave blank if no reviews yet (prevents fake reviews)
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Product Rating (0.0 – 5.0)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    placeholder="e.g. 4.8"
                    className="w-full px-4 py-3 bg-[#f8faf9] border border-gray-200 rounded-xl text-xs text-gray-900 outline-hidden focus:border-[#0B5D36]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Review Count
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={reviewCount}
                    onChange={(e) => setReviewCount(e.target.value)}
                    placeholder="e.g. 120"
                    className="w-full px-4 py-3 bg-[#f8faf9] border border-gray-200 rounded-xl text-xs text-gray-900 outline-hidden focus:border-[#0B5D36]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Sold / Order Count
                  </label>
                  <input
                    type="text"
                    value={soldCount}
                    onChange={(e) => setSoldCount(e.target.value)}
                    placeholder="e.g. 50+ sold"
                    className="w-full px-4 py-3 bg-[#f8faf9] border border-gray-200 rounded-xl text-xs text-gray-900 outline-hidden focus:border-[#0B5D36]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3. ImgBB Media Management */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-2xs space-y-4">
            <h3 className="font-heading font-bold text-sm text-gray-900 border-b border-gray-100 pb-3">
              3. Product Images (ImgBB CDN) <span className="text-red-500">*</span>
            </h3>

            <ImageUploader
              primaryImage={primaryImage}
              onPrimaryImageChange={setPrimaryImage}
              galleryImages={galleryImages}
              onGalleryImagesChange={setGalleryImages}
            />

            <div className="pt-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Hover Secondary Image (Optional)
              </label>
              <input
                type="url"
                value={hoverImage}
                onChange={(e) => setHoverImage(e.target.value)}
                placeholder="https://images.unsplash.com/... or ImgBB URL"
                className="w-full px-4 py-2.5 bg-[#f8faf9] border border-gray-200 rounded-xl text-xs text-gray-700 outline-hidden focus:border-[#0B5D36]"
              />
            </div>
          </div>

          {/* 4. Full Description (HTML) */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-2xs space-y-4">
            <h3 className="font-heading font-bold text-sm text-gray-900 border-b border-gray-100 pb-3">
              4. Full Description & Content
            </h3>
            <textarea
              rows={6}
              value={fullDesc}
              onChange={(e) => setFullDesc(e.target.value)}
              placeholder="Detailed product information, key features, packaging details (HTML supported)..."
              className="w-full p-4 bg-[#f8faf9] border border-gray-200 rounded-xl text-xs text-gray-900 outline-hidden focus:border-[#0B5D36] font-mono leading-relaxed"
            />
          </div>

          {/* 5. Key Highlights / Features */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-heading font-bold text-sm text-gray-900">
                5. Product Highlights (Key Features)
              </h3>
              <button
                type="button"
                onClick={addFeatureRow}
                className="text-xs font-semibold text-[#0B5D36] hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Feature</span>
              </button>
            </div>

            <div className="space-y-3">
              {features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <input
                    type="text"
                    value={feat.title}
                    onChange={(e) => {
                      const updated = [...features];
                      updated[idx].title = e.target.value;
                      setFeatures(updated);
                    }}
                    placeholder="Feature Title (e.g. Battery Life)"
                    className="flex-1 px-3 py-2 bg-[#f8faf9] border border-gray-200 rounded-xl text-xs outline-hidden focus:border-[#0B5D36]"
                  />
                  <input
                    type="text"
                    value={feat.value}
                    onChange={(e) => {
                      const updated = [...features];
                      updated[idx].value = e.target.value;
                      setFeatures(updated);
                    }}
                    placeholder="Value (e.g. Up to 70 Hours)"
                    className="flex-1 px-3 py-2 bg-[#f8faf9] border border-gray-200 rounded-xl text-xs outline-hidden focus:border-[#0B5D36]"
                  />
                  <button
                    type="button"
                    onClick={() => removeFeatureRow(idx)}
                    className="p-2 text-gray-400 hover:text-red-500 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 6. Specifications */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-heading font-bold text-sm text-gray-900">
                6. Product Specifications
              </h3>
              <button
                type="button"
                onClick={addSpecRow}
                className="text-xs font-semibold text-[#0B5D36] hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Spec</span>
              </button>
            </div>

            <div className="space-y-3">
              {specifications.map((spec, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <input
                    type="text"
                    value={spec.name}
                    onChange={(e) => {
                      const updated = [...specifications];
                      updated[idx].name = e.target.value;
                      setSpecifications(updated);
                    }}
                    placeholder="Specification Name (e.g. Bluetooth)"
                    className="flex-1 px-3 py-2 bg-[#f8faf9] border border-gray-200 rounded-xl text-xs outline-hidden focus:border-[#0B5D36]"
                  />
                  <input
                    type="text"
                    value={spec.value}
                    onChange={(e) => {
                      const updated = [...specifications];
                      updated[idx].value = e.target.value;
                      setSpecifications(updated);
                    }}
                    placeholder="Value (e.g. 5.3 Low Latency)"
                    className="flex-1 px-3 py-2 bg-[#f8faf9] border border-gray-200 rounded-xl text-xs outline-hidden focus:border-[#0B5D36]"
                  />
                  <button
                    type="button"
                    onClick={() => removeSpecRow(idx)}
                    className="p-2 text-gray-400 hover:text-red-500 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT 4 COLS: Publish Controls & Live Preview (matching reference layout!) */}
        <div className="lg:col-span-4 space-y-6 sticky top-24">
          
          {/* Publish Box */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-2xs space-y-5">
            <h3 className="font-heading font-bold text-sm text-gray-900 border-b border-gray-100 pb-3">
              Publication Settings
            </h3>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as typeof status)}
                className="w-full px-3.5 py-2.5 bg-[#f8faf9] border border-gray-200 rounded-xl text-xs text-gray-900 outline-hidden font-semibold cursor-pointer"
              >
                <option value="published">Published (Visible on site)</option>
                <option value="draft">Draft (Hidden)</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            {/* Visibility Toggles */}
            <div className="space-y-3 pt-2 border-t border-gray-100">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs font-semibold text-gray-700">Featured Product</span>
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 accent-[#0B5D36]"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs font-semibold text-gray-700">Show on Homepage</span>
                <input
                  type="checkbox"
                  checked={showOnHomepage}
                  onChange={(e) => setShowOnHomepage(e.target.checked)}
                  className="w-4 h-4 accent-[#0B5D36]"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs font-semibold text-gray-700">Today&apos;s Deal</span>
                <input
                  type="checkbox"
                  checked={isDeal}
                  onChange={(e) => setIsDeal(e.target.checked)}
                  className="w-4 h-4 accent-[#0B5D36]"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs font-semibold text-gray-700">Trending Now</span>
                <input
                  type="checkbox"
                  checked={isTrending}
                  onChange={(e) => setIsTrending(e.target.checked)}
                  className="w-4 h-4 accent-[#0B5D36]"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs font-semibold text-gray-700">Best Seller</span>
                <input
                  type="checkbox"
                  checked={isBestSeller}
                  onChange={(e) => setIsBestSeller(e.target.checked)}
                  className="w-4 h-4 accent-[#0B5D36]"
                />
              </label>
            </div>

            {/* Badges & Tags */}
            <div className="pt-2 border-t border-gray-100 space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Badges (e.g. BEST SELLER, 36% OFF)
                </label>
                <input
                  type="text"
                  value={badgesText}
                  onChange={(e) => setBadgesText(e.target.value)}
                  placeholder="BEST SELLER, 36% OFF"
                  className="w-full px-3 py-2 bg-[#f8faf9] border border-gray-200 rounded-xl text-xs outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={tagsText}
                  onChange={(e) => setTagsText(e.target.value)}
                  placeholder="headphones, audio, wireless"
                  className="w-full px-3 py-2 bg-[#f8faf9] border border-gray-200 rounded-xl text-xs outline-hidden"
                />
              </div>
            </div>

            {/* Prominent Save Button */}
            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-3.5 bg-[#0B5D36] hover:bg-[#074528] text-white font-heading font-bold text-xs rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{isEditing ? 'Save Changes' : 'Publish Product'}</span>
            </button>
          </div>

          {/* Live Card Preview Box (matching reference mockup!) */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Live Card Preview
              </span>
              <Eye className="w-3.5 h-3.5 text-[#0B5D36]" />
            </div>

            <div className="max-w-[260px] mx-auto pt-2">
              <ProductCard product={previewProduct} />
            </div>
          </div>

        </div>

      </div>
    </form>
  );
}
