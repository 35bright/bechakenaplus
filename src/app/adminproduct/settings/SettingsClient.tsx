'use client';

import React, { useState } from 'react';
import { Save, Loader2, Tag, Code, Globe, Sparkles } from 'lucide-react';
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

  // 5 Adsterra Ad Formats
  const [adsEnabled, setAdsEnabled] = useState(initialSettings?.ad_settings?.enabled ?? true);
  const [adsterraBanner728x90, setAdsterraBanner728x90] = useState(
    initialSettings?.ad_settings?.adsterra_banner_728x90_code || initialSettings?.ad_settings?.adsterra_banner_code || ''
  );
  const [adsterraNative, setAdsterraNative] = useState(initialSettings?.ad_settings?.adsterra_native_code || '');
  const [adsterraSkyscraper160x600, setAdsterraSkyscraper160x600] = useState(
    initialSettings?.ad_settings?.adsterra_skyscraper_160x600_code || ''
  );
  const [adsterraPopunder, setAdsterraPopunder] = useState(initialSettings?.ad_settings?.adsterra_popunder_code || '');
  const [adsterraSocialBar, setAdsterraSocialBar] = useState(initialSettings?.ad_settings?.adsterra_socialbar_code || '');

  // Placement Toggles
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
        adsterra_banner_728x90_code: adsterraBanner728x90,
        adsterra_banner_code: adsterraBanner728x90,
        adsterra_native_code: adsterraNative,
        adsterra_skyscraper_160x600_code: adsterraSkyscraper160x600,
        adsterra_popunder_code: adsterraPopunder,
        adsterra_socialbar_code: adsterraSocialBar,
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
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl pb-12">
      {/* 1. Brand & General Info */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-2xs space-y-6">
        <h3 className="font-heading font-bold text-base text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
          <Globe className="w-4 h-4 text-[#0B5D36]" />
          <span>General Store Information</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Store Name</label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#f8faf9] border border-gray-200 rounded-xl text-xs outline-hidden focus:border-[#0B5D36]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Brand Tagline</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#f8faf9] border border-gray-200 rounded-xl text-xs outline-hidden focus:border-[#0B5D36]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Support Email</label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#f8faf9] border border-gray-200 rounded-xl text-xs outline-hidden focus:border-[#0B5D36]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Support Phone</label>
            <input
              type="text"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#f8faf9] border border-gray-200 rounded-xl text-xs outline-hidden focus:border-[#0B5D36]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Footer Copyright Text</label>
          <input
            type="text"
            value={footerText}
            onChange={(e) => setFooterText(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-[#f8faf9] border border-gray-200 rounded-xl text-xs outline-hidden focus:border-[#0B5D36]"
          />
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

      {/* 3. Adsterra 5 Ad Units Integration */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-2xs space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div>
            <h3 className="font-heading font-bold text-base text-gray-900 flex items-center gap-2">
              <Code className="w-4 h-4 text-[#0B5D36]" />
              <span>Adsterra 5 Ad Units Configuration</span>
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Paste the codes from your Adsterra dashboard (<code className="font-mono text-[#0B5D36]">GET CODE</code>)
            </p>
          </div>
          <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer bg-emerald-50 px-3 py-1.5 rounded-full text-[#0B5D36] border border-emerald-200">
            <input
              type="checkbox"
              checked={adsEnabled}
              onChange={(e) => setAdsEnabled(e.target.checked)}
              className="w-4 h-4 accent-[#0B5D36]"
            />
            <span>Enable Advertising</span>
          </label>
        </div>

        {/* Ad 1: Banner 160x600 */}
        <div className="p-4 rounded-2xl bg-[#f8faf9] border border-gray-200/80 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-gray-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0B5D36]" />
              <span>1. Banner 160×600 (Skyscraper)</span>
            </label>
            <span className="text-[10px] font-mono text-gray-400 bg-white px-2 py-0.5 rounded border border-gray-200">
              Unit: 160x600_1 (ID: 31610404)
            </span>
          </div>
          <p className="text-[11px] text-gray-500">
            Vertical skyscraper placement for desktop sidebars beside product listings and catalogs.
          </p>
          <textarea
            rows={3}
            value={adsterraSkyscraper160x600}
            onChange={(e) => setAdsterraSkyscraper160x600(e.target.value)}
            placeholder="Paste your Adsterra 160x600 script code here..."
            className="w-full p-3 bg-white border border-gray-200 rounded-xl text-xs font-mono outline-hidden focus:border-[#0B5D36]"
          />
        </div>

        {/* Ad 2: Banner 728x90 */}
        <div className="p-4 rounded-2xl bg-[#f8faf9] border border-gray-200/80 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-gray-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0B5D36]" />
              <span>2. Banner 728×90 (Leaderboard)</span>
            </label>
            <span className="text-[10px] font-mono text-gray-400 bg-white px-2 py-0.5 rounded border border-gray-200">
              Unit: 728x90_1 (ID: 31610406)
            </span>
          </div>
          <p className="text-[11px] text-gray-500">
            Horizontal leaderboard banner on Homepage, Category pages, Deals, and Product detail views.
          </p>
          <textarea
            rows={3}
            value={adsterraBanner728x90}
            onChange={(e) => setAdsterraBanner728x90(e.target.value)}
            placeholder="Paste your Adsterra 728x90 script code here..."
            className="w-full p-3 bg-white border border-gray-200 rounded-xl text-xs font-mono outline-hidden focus:border-[#0B5D36]"
          />
        </div>

        {/* Ad 3: Native Banner */}
        <div className="p-4 rounded-2xl bg-[#f8faf9] border border-gray-200/80 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-gray-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0B5D36]" />
              <span>3. Native Banner (In-Feed)</span>
            </label>
            <span className="text-[10px] font-mono text-gray-400 bg-white px-2 py-0.5 rounded border border-gray-200">
              Unit: NativeBanner_1 (ID: 31610403)
            </span>
          </div>
          <p className="text-[11px] text-gray-500">
            Blends natively into product feeds, recommendation grids, and blog articles.
          </p>
          <textarea
            rows={3}
            value={adsterraNative}
            onChange={(e) => setAdsterraNative(e.target.value)}
            placeholder="Paste your Adsterra Native Banner script code here..."
            className="w-full p-3 bg-white border border-gray-200 rounded-xl text-xs font-mono outline-hidden focus:border-[#0B5D36]"
          />
        </div>

        {/* Ad 4: Popunder */}
        <div className="p-4 rounded-2xl bg-[#f8faf9] border border-gray-200/80 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-gray-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0B5D36]" />
              <span>4. Popunder Script</span>
            </label>
            <span className="text-[10px] font-mono text-gray-400 bg-white px-2 py-0.5 rounded border border-gray-200">
              Unit: Popunder_1 (ID: 31610407)
            </span>
          </div>
          <p className="text-[11px] text-gray-500">
            Injected globally to execute upon user click interactions across the storefront.
          </p>
          <textarea
            rows={3}
            value={adsterraPopunder}
            onChange={(e) => setAdsterraPopunder(e.target.value)}
            placeholder="Paste your Adsterra Popunder script code here..."
            className="w-full p-3 bg-white border border-gray-200 rounded-xl text-xs font-mono outline-hidden focus:border-[#0B5D36]"
          />
        </div>

        {/* Ad 5: Social Bar (New) */}
        <div className="p-4 rounded-2xl bg-[#f8faf9] border border-gray-200/80 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-gray-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>5. Social Bar (In-Page Push / Floating Widget)</span>
            </label>
            <span className="text-[10px] font-mono text-gray-400 bg-white px-2 py-0.5 rounded border border-gray-200">
              Unit: SocialBar_1 (ID: 31610909)
            </span>
          </div>
          <p className="text-[11px] text-gray-500">
            Adsterra interactive in-page push widget / floating notification bubble that delivers high CTRs without obstructing page content.
          </p>
          <textarea
            rows={3}
            value={adsterraSocialBar}
            onChange={(e) => setAdsterraSocialBar(e.target.value)}
            placeholder="Paste your Adsterra Social Bar script code here..."
            className="w-full p-3 bg-white border border-gray-200 rounded-xl text-xs font-mono outline-hidden focus:border-[#0B5D36]"
          />
        </div>

        {/* Placement Toggles */}
        <div className="pt-2">
          <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Enabled Pages</label>
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

      {/* 4. Social Links */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-2xs space-y-4">
        <h3 className="font-heading font-bold text-base text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
          <Globe className="w-4 h-4 text-[#0B5D36]" />
          <span>Social Media Links</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Facebook</label>
            <input
              type="text"
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#f8faf9] border border-gray-200 rounded-xl text-xs outline-hidden focus:border-[#0B5D36]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Instagram</label>
            <input
              type="text"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#f8faf9] border border-gray-200 rounded-xl text-xs outline-hidden focus:border-[#0B5D36]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">YouTube</label>
            <input
              type="text"
              value={youtube}
              onChange={(e) => setYoutube(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#f8faf9] border border-gray-200 rounded-xl text-xs outline-hidden focus:border-[#0B5D36]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">TikTok</label>
            <input
              type="text"
              value={tiktok}
              onChange={(e) => setTiktok(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#f8faf9] border border-gray-200 rounded-xl text-xs outline-hidden focus:border-[#0B5D36]"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#0B5D36] hover:bg-[#074528] text-white font-heading font-bold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save All Settings</span>
        </button>
      </div>
    </form>
  );
}
