'use client';

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Image as ImageIcon, Loader2, X } from 'lucide-react';
import { Banner } from '@/types/database';
import { useToast } from '@/context/ToastContext';
import { ImageUploader } from '@/components/admin/ImageUploader';

interface BannersClientProps {
  initialBanners: Banner[];
}

export function BannersClient({ initialBanners }: BannersClientProps) {
  const { toast } = useToast();
  const [banners, setBanners] = useState<Banner[]>(initialBanners);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [badgeText, setBadgeText] = useState('');
  const [ctaText, setCtaText] = useState('Shop Now →');
  const [ctaUrl, setCtaUrl] = useState('/products');
  const [imageUrl, setImageUrl] = useState('');
  const [bannerType, setBannerType] = useState<'hero' | 'promo_split' | 'ad_strip' | 'category_banner'>('hero');
  const [sortOrder, setSortOrder] = useState<number>(0);
  const [isActive, setIsActive] = useState(true);

  const openCreateModal = () => {
    setEditingBanner(null);
    setTitle('');
    setSubtitle('');
    setBadgeText('');
    setCtaText('Shop Now →');
    setCtaUrl('/products');
    setImageUrl('');
    setBannerType('hero');
    setSortOrder(banners.length + 1);
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (b: Banner) => {
    setEditingBanner(b);
    setTitle(b.title);
    setSubtitle(b.subtitle || '');
    setBadgeText(b.badge_text || '');
    setCtaText(b.cta_text || 'Shop Now →');
    setCtaUrl(b.cta_url || '/products');
    setImageUrl(b.image_url);
    setBannerType(b.banner_type);
    setSortOrder(b.sort_order || 0);
    setIsActive(b.is_active);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim()) {
      toast('Title and image URL are required', 'error');
      return;
    }

    setIsSaving(true);
    const payload = {
      title: title.trim(),
      subtitle: subtitle.trim() || null,
      badge_text: badgeText.trim() || null,
      cta_text: ctaText.trim() || 'Shop Now →',
      cta_url: ctaUrl.trim() || '/products',
      image_url: imageUrl.trim(),
      banner_type: bannerType,
      sort_order: Number(sortOrder) || 0,
      is_active: isActive,
    };

    try {
      const endpoint = editingBanner ? `/api/admin/banners/${editingBanner.id}` : '/api/admin/banners';
      const method = editingBanner ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (editingBanner) {
          setBanners(prev => prev.map(b => b.id === editingBanner.id ? data.banner : b));
          toast('Banner updated!', 'success');
        } else {
          setBanners(prev => [...prev, data.banner]);
          toast('Banner created!', 'success');
        }
        setIsModalOpen(false);
      } else {
        toast(data.error || 'Failed to save banner', 'error');
      }
    } catch {
      toast('Network error saving banner', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete banner "${title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/banners/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setBanners(prev => prev.filter(b => b.id !== id));
        toast('Banner deleted', 'info');
      }
    } catch {
      toast('Failed to delete banner', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#0B5D36] hover:bg-[#074528] text-white text-xs font-semibold rounded-2xl shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Banner</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners.map((b) => (
          <div key={b.id} className="bg-white rounded-3xl border border-gray-100 shadow-2xs overflow-hidden flex flex-col justify-between p-5">
            <div>
              <div className="relative aspect-16/9 w-full bg-emerald-50/50 rounded-2xl overflow-hidden mb-4 border border-gray-100 flex items-center justify-center">
                <img
                  src={b.image_url}
                  alt={b.title}
                  className="w-full h-full object-contain p-2 mix-blend-multiply"
                />
                <span className="absolute top-2 left-2 bg-[#0B5D36] text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-xs">
                  {b.banner_type}
                </span>
              </div>

              <h4 className="font-heading font-bold text-sm text-gray-900">{b.title}</h4>
              {b.subtitle && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{b.subtitle}</p>}
              <p className="text-[11px] text-[#0B5D36] font-semibold mt-2">CTA: {b.cta_text} → {b.cta_url}</p>
            </div>

            <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                b.is_active ? 'bg-emerald-50 text-[#0B5D36]' : 'bg-gray-100 text-gray-400'
              }`}>
                {b.is_active ? 'Active' : 'Hidden'}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openEditModal(b)}
                  className="p-1.5 text-gray-400 hover:text-[#0B5D36] hover:bg-emerald-50 rounded-lg"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(b.id, b.title)}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="font-heading font-bold text-base text-gray-900">
                {editingBanner ? 'Edit Banner' : 'Create New Banner'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Banner Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Better Products Happier You"
                  className="w-full px-3.5 py-2.5 bg-[#f8faf9] border border-gray-200 rounded-xl text-xs outline-hidden focus:border-[#0B5D36]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Subtitle</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Quality picks, great prices and a little extra..."
                  className="w-full px-3.5 py-2.5 bg-[#f8faf9] border border-gray-200 rounded-xl text-xs outline-hidden focus:border-[#0B5D36]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Badge Slogan</label>
                <input
                  type="text"
                  value={badgeText}
                  onChange={(e) => setBadgeText(e.target.value)}
                  placeholder="Smart Picks • Great Value"
                  className="w-full px-3.5 py-2.5 bg-[#f8faf9] border border-gray-200 rounded-xl text-xs outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">CTA Text</label>
                  <input
                    type="text"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    placeholder="Shop Now →"
                    className="w-full px-3.5 py-2 bg-[#f8faf9] border border-gray-200 rounded-xl text-xs outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">CTA Destination</label>
                  <input
                    type="text"
                    value={ctaUrl}
                    onChange={(e) => setCtaUrl(e.target.value)}
                    placeholder="/products or /deals"
                    className="w-full px-3.5 py-2 bg-[#f8faf9] border border-gray-200 rounded-xl text-xs outline-hidden font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Banner Type</label>
                <select
                  value={bannerType}
                  onChange={(e) => setBannerType(e.target.value as typeof bannerType)}
                  className="w-full px-3.5 py-2.5 bg-[#f8faf9] border border-gray-200 rounded-xl text-xs outline-hidden"
                >
                  <option value="hero">Hero Main Banner</option>
                  <option value="promo_split">Promotional Split Banner</option>
                  <option value="ad_strip">Ad Strip</option>
                  <option value="category_banner">Category Banner</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Upload Banner Image (ImgBB)</label>
                <ImageUploader
                  primaryImage={imageUrl}
                  onPrimaryImageChange={setImageUrl}
                  galleryImages={[]}
                  onGalleryImagesChange={() => {}}
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="activeCheck"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 accent-[#0B5D36]"
                />
                <label htmlFor="activeCheck" className="text-xs font-semibold text-gray-700 cursor-pointer">
                  Banner Active on Homepage
                </label>
              </div>

              <div className="pt-3 border-t border-gray-100 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 py-2.5 rounded-xl bg-[#0B5D36] hover:bg-[#074528] text-white text-xs font-semibold flex items-center justify-center gap-2"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  <span>Save Banner</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
