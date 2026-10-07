-- ============================================================
-- BECHAKENA+ DATABASE SCHEMA MIGRATION
-- Production-Ready PostgreSQL Schema for Supabase
-- ============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Site Settings Table
CREATE TABLE IF NOT EXISTS public.site_settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    store_name TEXT NOT NULL DEFAULT 'bechakena+',
    tagline TEXT NOT NULL DEFAULT 'Better Products. Happier You.',
    announcement_bar JSONB NOT NULL DEFAULT '{
        "enabled": true,
        "text": "Free delivery on selected products | Trusted by 10,000+ happy shoppers",
        "link": "/deals"
    }'::jsonb,
    logo_url TEXT,
    favicon_url TEXT,
    contact_email TEXT DEFAULT 'support@bechakena.plus',
    contact_phone TEXT DEFAULT '+880 1700-000000',
    currency_symbol TEXT NOT NULL DEFAULT '৳',
    currency_code TEXT NOT NULL DEFAULT 'BDT',
    header_links JSONB DEFAULT '[
        {"title": "About", "url": "/about"},
        {"title": "Blog", "url": "/blog"},
        {"title": "Deals", "url": "/deals"},
        {"title": "Contact", "url": "/contact"}
    ]'::jsonb,
    trust_indicators JSONB DEFAULT '{
        "happy_customers": "10,000+",
        "rating": "4.7/5",
        "features": [
            {"title": "Top Picks", "subtitle": "Handpicked for you", "icon": "CheckCircle2"},
            {"title": "Best Deals", "subtitle": "Save more everyday", "icon": "BadgePercent"},
            {"title": "Trending Now", "subtitle": "What is popular", "icon": "Flame"},
            {"title": "Fast Delivery", "subtitle": "Get it quickly", "icon": "Truck"},
            {"title": "Easy Returns", "subtitle": "Shop with confidence", "icon": "ShieldCheck"}
        ]
    }'::jsonb,
    ad_settings JSONB DEFAULT '{
        "enabled": true,
        "adsterra_banner_code": "",
        "adsterra_native_code": "",
        "adsterra_popunder_code": "",
        "show_on_homepage": true,
        "show_on_product_page": true,
        "show_on_category_page": true,
        "show_on_blog_page": true
    }'::jsonb,
    social_links JSONB DEFAULT '{
        "facebook": "https://facebook.com/bechakenaplus",
        "instagram": "https://instagram.com/bechakenaplus",
        "youtube": "https://youtube.com/@bechakenaplus",
        "tiktok": "https://tiktok.com/@bechakenaplus"
    }'::jsonb,
    footer_text TEXT DEFAULT '© 2026 bechakena+. All rights reserved. Find something you will love.',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Admin Users Table
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'super_admin',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_login_at TIMESTAMPTZ
);

-- 3. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    name_bn TEXT,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT,
    image_url TEXT,
    parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_featured BOOLEAN NOT NULL DEFAULT true,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    name_bn TEXT,
    slug TEXT UNIQUE NOT NULL,
    short_description TEXT,
    short_description_bn TEXT,
    full_description TEXT,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    subcategory TEXT,
    brand TEXT,
    price NUMERIC(12, 2) NOT NULL,
    original_price NUMERIC(12, 2),
    discount_percent NUMERIC(5, 2) DEFAULT 0,
    currency TEXT NOT NULL DEFAULT 'BDT',
    daraz_url TEXT NOT NULL,
    custom_cta_text TEXT NOT NULL DEFAULT 'View on Daraz',
    primary_image TEXT NOT NULL,
    hover_image TEXT,
    gallery_images JSONB NOT NULL DEFAULT '[]'::jsonb,
    rating NUMERIC(3, 2) NOT NULL DEFAULT 4.8,
    review_count INTEGER NOT NULL DEFAULT 0,
    sold_count TEXT DEFAULT '100+ sold',
    badges TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_trending BOOLEAN NOT NULL DEFAULT false,
    is_deal BOOLEAN NOT NULL DEFAULT false,
    is_best_seller BOOLEAN NOT NULL DEFAULT false,
    is_popular BOOLEAN NOT NULL DEFAULT false,
    is_limited_stock BOOLEAN NOT NULL DEFAULT false,
    show_on_homepage BOOLEAN NOT NULL DEFAULT true,
    status TEXT NOT NULL DEFAULT 'published', -- 'published', 'draft', 'archived'
    sort_order INTEGER NOT NULL DEFAULT 0,
    views_count INTEGER NOT NULL DEFAULT 0,
    daraz_clicks_count INTEGER NOT NULL DEFAULT 0,
    seo_title TEXT,
    seo_description TEXT,
    seo_keywords TEXT,
    og_image TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Product Features Table
CREATE TABLE IF NOT EXISTS public.product_features (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    value TEXT NOT NULL,
    icon TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0
);

-- 6. Product Specifications Table
CREATE TABLE IF NOT EXISTS public.product_specifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    value TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0
);

-- 7. Banners Table
CREATE TABLE IF NOT EXISTS public.banners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    subtitle TEXT,
    badge_text TEXT,
    cta_text TEXT NOT NULL DEFAULT 'Shop Now →',
    cta_url TEXT NOT NULL DEFAULT '/products',
    image_url TEXT NOT NULL,
    banner_type TEXT NOT NULL DEFAULT 'hero', -- 'hero', 'promo_split', 'ad_strip', 'category_banner'
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Blog Posts Table
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    title_bn TEXT,
    slug TEXT UNIQUE NOT NULL,
    summary TEXT,
    content TEXT NOT NULL,
    cover_image TEXT,
    category TEXT,
    tags TEXT[] DEFAULT '{}',
    is_published BOOLEAN NOT NULL DEFAULT true,
    read_time TEXT DEFAULT '4 min read',
    author TEXT DEFAULT 'Bechakena+ Team',
    seo_title TEXT,
    seo_description TEXT,
    views_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Analytics Events Table
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL, -- 'page_view', 'product_view', 'category_view', 'daraz_click', 'search', 'wishlist_add', 'banner_click'
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    category_slug TEXT,
    search_query TEXT,
    source_page TEXT,
    destination_url TEXT,
    device_type TEXT,
    user_agent TEXT,
    ip_hash TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Indexes for Fast High-Performance Queries
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(is_featured) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_products_trending ON public.products(is_trending) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_products_deal ON public.products(is_deal) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_active ON public.categories(is_active);
CREATE INDEX IF NOT EXISTS idx_banners_type_active ON public.banners(banner_type, is_active);
CREATE INDEX IF NOT EXISTS idx_blog_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_published ON public.blog_posts(is_published);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON public.analytics_events(event_type, created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_product ON public.analytics_events(product_id);

-- 11. Row Level Security Policies
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_specifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any to ensure idempotency
DROP POLICY IF EXISTS "Public can read site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Public can read active categories" ON public.categories;
DROP POLICY IF EXISTS "Public can read published products" ON public.products;
DROP POLICY IF EXISTS "Public can read product features" ON public.product_features;
DROP POLICY IF EXISTS "Public can read product specs" ON public.product_specifications;
DROP POLICY IF EXISTS "Public can read active banners" ON public.banners;
DROP POLICY IF EXISTS "Public can read published blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Public can insert analytics events" ON public.analytics_events;

-- Public READ policies (for storefront visitors)
CREATE POLICY "Public can read site settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public can read active categories" ON public.categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read published products" ON public.products FOR SELECT USING (status = 'published');
CREATE POLICY "Public can read product features" ON public.product_features FOR SELECT USING (true);
CREATE POLICY "Public can read product specs" ON public.product_specifications FOR SELECT USING (true);
CREATE POLICY "Public can read active banners" ON public.banners FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read published blog posts" ON public.blog_posts FOR SELECT USING (is_published = true);

-- Allow public to insert analytics events (for click/page tracking)
CREATE POLICY "Public can insert analytics events" ON public.analytics_events FOR INSERT WITH CHECK (true);
