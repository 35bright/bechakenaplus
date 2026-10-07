'use client';

import React, { useState } from 'react';
import { Save, Loader2, Settings, ShieldCheck, Tag, Code, Globe } from 'lucide-react';
import { SiteSettings } from '@/types/database';
import { useToast } from '@/context/ToastContext';

interface SettingsClientProps {
  initialSettings: SiteSettings;
}

export function SettingsClient({ initialSettings }: SettingsClientProps) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  // General Store Info
  const [storeName, setStoreName] = useState(initialSettings?.store_name || 'bechakena+');
  const [tagline, setTagline] = useState(initialSettings?.tagline || 'Better Products. Happier You.');
  const [contactEmail, setContactEmail] = useState(initialSettings?.contact_email || 'support@bechakena.plus');
  const [contactPhone, setContactPhone] = useState(initialSettings?.contact_phone || '+880 1700-000000');
  const [currencySymbol, setCurrencySymbol] = useState(initialSettings?.currency_symbol || '৳');
  const [currencyCode, setCurrencyCode] = useState(initialSettings?.currency_code || 'BDT');
  const [footerText, setFooterText] = useState(initialSettings?.footer_text || '© 2026 bechakena+. All rights reserved.');

  // Announcement Bar
  const [announcementEnabled, setAnnouncementEnabled] = useState(initialSettings?.announcement_bar?.enabled ?? true);
  const [announcementText, setAnnouncementText] = useState(initialSettings?.announcement_bar?.text || 'Free delivery on selected products | Trusted by 10,000+ happy shoppers');
  const [announcementLink, setAnnouncementLink] = useState(initialSettings?.announcement_bar?.link || '/deals');

  // Social Links
  const [facebook, setFacebook] = useState(initialSettings?.social_links?.facebook || 'https://facebook.com');
  const [instagram, setInstagram] = useState(initialSettings?.social_links?.instagram || 'https://instagram.com');
  const [youtube, setYoutube] = useState(initialSettings?.social_links?.youtube || 'https://youtube.com');
  const [tiktok, setTiktok] = useState(initialSettings?.social_links?.tiktok || 'https://tiktok.com');

  // Adsterra Ads Configuration
  const [adsEnabled, setAdsEnabled] = useState(initialSettings?.ad_settings?.enabled ?? true);
  const [adsterraBannerCode, setAdsterraBannerCode] = useState(initialSettings?.ad_settings?.adsterra_banner_code || '');
  const [adsterraNativeCode, setAdsterraNativeCode] = useState(initialSettings?.ad_settings?.adsterra_native_code || '');
  const [showOnHomepage, setShowOnHomepage] = useState(initialSettings?.ad_settings?.show_on_homepage ?? true);
  const [showOnProductPage, setShowOnProductPage] = useState(initialSettings?.ad_settings?.show_on_product_page ?? true);
  const [showOnCategoryPage, setShowOnCategoryPage] = useState(initialSettings?.ad_settings?.show_on_category_page ?? true);
  const [showOnBlogPage, setShowOnBlogPage] = useState(initialSettings?.ad_settings?.show_on_blog_page ?? true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const payload = {
      store_name: storeName.trim(),
      tagline: tagline.trim(),
      contact_email: contactEmail.trim(),
      contact_phone: contactPhone.trim(),
      currency_symbol: currencySymbol.trim(),
      currency_code: currencyCode.trim(),
      footer_text: footerText.trim(),
      announcement_bar: {
        enabled: announcementEnabled,
        text: announcementText.trim(),
        link: announcementLink.trim(),
      },
      social_links: {
        facebook: facebook.trim(),
        instagram: instagram.trim(),
        youtube: youtube.trim(),
        tiktok: tiktok.trim(),
      },
      ad_settings: {
        enabled: adsEnabled,
        adsterra_banner_code: adsterraBannerCode,
        adsterra_native_code: adsterraNativeCode,
        show_on_homepage: showOnHomepage,
        show_on_product_page: showOnProductPage,
        show_on_category_page: showOnCategoryPage,
        show_on_blog_page: showOnBlogPage,
      },
    };

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast('Store settings updated successfully!', 'success');
      } else {
        toast(data.error || 'Failed to save settings', 'error');
      }
    } catch {
      toast('Network error saving settings', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      {/* 1. General Branding */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-2xs space-y-4">
        <h3 className="font-heading font-bold text-base text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
          <Globe className="w-4 h-4 text-[#0B5D36]" />
          <span>Brand & Store Identity</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Store Name</label>
            <input
              type="text"
              required
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#f8faf9] border border-gray-200 rounded-xl text-xs outline-hidden focus:border-[#0B5D36]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Tagline Slogan</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#f8faf9] border border-gray-200 rounded-xl text-xs outline-hidden focus:border-[#0B5D36]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Contact Support Email</label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#f8faf9] border border-gray-200 rounded-xl text-xs outline-hidden"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Customer Helpline Phone</label>
            <input
              type="text"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#f8faf9] border border-gray-200 rounded-xl text-xs outline-hidden"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Currency Symbol</label>
            <input
              type="text"
              value={currencySymbol}
              onChange={(e) => setCurrencySymbol(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#f8faf9] border border-gray-200 rounded-xl text-xs outline-hidden font-bold"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Currency Code</label>
            <input
              type="text"
              value={currencyCode}
              onChange={(e) => setCurrencyCode(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#f8faf9] border border-gray-200 rounded-xl text-xs outline-hidden uppercase font-mono"
            />
          </div>
        </div>
      </div>

      {/* 2. Announcement Bar */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h3 className="font-heading font-bold text-base text-gray-900 flex items-center gap-2">
            <Tag className="w-4 h-4 text-[#0B5D36]" />
            <span>Top Announcement Bar</span>
          </h3>
          <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
            <input
              type="checkbox"
              checked={announcementEnabled}
              onChange={(e) => setAnnouncementEnabled(e.target.checked)}
              className="w-4 h-4 accent-[#0B5D36]"
            />
            <span>Enabled</span>
          </label>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Announcement Text</label>
          <input
            type="text"
            value={announcementText}
            onChange={(e) => setAnnouncementText(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-[#f8faf9] border border-gray-200 rounded-xl text-xs outline-hidden focus:border-[#0B5D36]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Destination URL / Link</label>
          <input
            type="text"
            value={announcementLink}
            onChange={(e) => setAnnouncementLink(e.target.value)}
            placeholder="/deals"
            className="w-full px-3.5 py-2.5 bg-[#f8faf9] border border-gray-200 rounded-xl text-xs outline-hidden font-mono"
          />
        </div>
      </div>

      {/* 3. Adsterra Ads Integration */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div>
            <h3 className="font-heading font-bold text-base text-gray-900 flex items-center gap-2">
              <Code className="w-4 h-4 text-[#0B5D36]" />
              <span>Adsterra Third-Party Ads</span>
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">Control advertising banners and scripts across the website</p>
          </div>
          <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
            <input
              type="checkbox"
              checked={adsEnabled}
              onChange={(e) => setAdsEnabled(e.target.checked)}
              className="w-4 h-4 accent-[#0B5D36]"
            />
            <span>Enable Ads</span>
          </label>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
            Adsterra Banner Script / HTML Code
          </label>
          <textarea
            rows={4}
            value={adsterraBannerCode}
            onChange={(e) => setAdsterraBannerCode(e.target.value)}
            placeholder="Paste your Adsterra 728x90 or 300x250 script code here..."
            className="w-full p-3 bg-[#f8faf9] border border-gray-200 rounded-xl text-xs font-mono outline-hidden focus:border-[#0B5D36]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
            Adsterra Native / In-Feed Script Code
          </label>
          <textarea
            rows={3}
            value={adsterraNativeCode}
            onChange={(e) => setAdsterraNativeCode(e.target.value)}
            placeholder="Paste native ad code here..."
            className="w-full p-3 bg-[#f8faf9] border border-gray-200 rounded-xl text-xs font-mono outline-hidden focus:border-[#0B5D36]"
          />
        </div>

        <div className="pt-2">
          <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Ad Placements</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={showOnHomepage}
                onChange={(e) => setShowOnHomepage(e.target.checked)}
                className="w-4 h-4 accent-[#0B5D36]"
              />
              <span>Homepage</span>
            </label>
            <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={showOnProductPage}
                onChange={(e) => setShowOnProductPage(e.target.checked)}
                className="w-4 h-4 accent-[#0B5D36]"
              />
              <span>Product Details</span>
            </label>
            <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={showOnCategoryPage}
                onChange={(e) => setShowOnCategoryPage(e.target.checked)}
                className="w-4 h-4 accent-[#0B5D36]"
              />
              <span>Category Pages</span>
            </label>
            <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={showOnBlogPage}
                onChange={(e) => setShowOnBlogPage(e.target.checked)}
                className="w-4 h-4 accent-[#0B5D36]"
              />
              <span>Blog Articles</span>
            </label>
          </div>
        </div>
      </div>

      {/* 4. Social Links & Footer */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-2xs space-y-4">
        <h3 className="font-heading font-bold text-base text-gray-900 border-b border-gray-100 pb-3">
          Social Links & Footer
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Facebook URL</label>
            <input
              type="url"
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#f8faf9] border border-gray-200 rounded-xl text-xs outline-hidden"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Instagram URL</label>
            <input
              type="url"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#f8faf9] border border-gray-200 rounded-xl text-xs outline-hidden"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Footer Copyright & Disclaimer</label>
          <input
            type="text"
            value={footerText}
            onChange={(e) => setFooterText(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-[#f8faf9] border border-gray-200 rounded-xl text-xs outline-hidden"
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-2 px-8 py-3.5 bg-[#0B5D36] hover:bg-[#074528] text-white font-heading font-bold text-xs rounded-2xl shadow-md transition-all disabled:opacity-50 cursor-pointer"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save Store Settings</span>
        </button>
      </div>
    </form>
  );
}
