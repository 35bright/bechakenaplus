export interface SiteSettings {
  id: string;
  store_name: string;
  tagline: string;
  announcement_bar: {
    enabled: boolean;
    text: string;
    link?: string;
  };
  logo_url?: string;
  favicon_url?: string;
  contact_email?: string;
  contact_phone?: string;
  currency_symbol: string;
  currency_code: string;
  header_links: Array<{ title: string; url: string }>;
  trust_indicators: {
    happy_customers: string;
    rating: string;
    features: Array<{ title: string; subtitle: string; icon: string }>;
  };
  ad_settings: {
    enabled: boolean;
    adsterra_banner_728x90_code?: string;
    adsterra_skyscraper_160x600_code?: string;
    adsterra_native_code?: string;
    adsterra_popunder_code?: string;
    adsterra_socialbar_code?: string;
    adsterra_banner_code?: string;
    show_on_homepage?: boolean;
    show_on_product_page?: boolean;
    show_on_category_page?: boolean;
    show_on_blog_page?: boolean;
  };
  social_links: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    tiktok?: string;
  };
  footer_text: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  name_bn?: string;
  slug: string;
  description?: string;
  icon?: string;
  image_url?: string;
  parent_id?: string;
  sort_order: number;
  is_featured: boolean;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  product_count?: number;
}

export interface ProductFeature {
  id?: string;
  product_id?: string;
  title: string;
  value: string;
  icon?: string;
  sort_order?: number;
}

export interface ProductSpecification {
  id?: string;
  product_id?: string;
  name: string;
  value: string;
  sort_order?: number;
}

export interface Product {
  id: string;
  name: string;
  name_bn?: string;
  slug: string;
  short_description?: string;
  short_description_bn?: string;
  full_description?: string;
  category_id?: string;
  category?: Category;
  subcategory?: string;
  brand?: string;
  price: number;
  original_price?: number;
  discount_percent?: number;
  currency: string;
  daraz_url: string;
  custom_cta_text: string;
  primary_image: string;
  hover_image?: string;
  gallery_images: string[];
  rating: number;
  review_count: number;
  sold_count?: string;
  badges: string[];
  tags: string[];
  is_featured: boolean;
  is_trending: boolean;
  is_deal: boolean;
  is_best_seller: boolean;
  is_popular: boolean;
  is_limited_stock: boolean;
  show_on_homepage: boolean;
  status: 'published' | 'draft' | 'archived';
  sort_order: number;
  views_count: number;
  daraz_clicks_count: number;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  og_image?: string;
  features?: ProductFeature[];
  specifications?: ProductSpecification[];
  created_at?: string;
  updated_at?: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  badge_text?: string;
  cta_text: string;
  cta_url: string;
  image_url: string;
  banner_type: 'hero' | 'promo_split' | 'ad_strip' | 'category_banner';
  sort_order: number;
  is_active: boolean;
  start_date?: string;
  end_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  title_bn?: string;
  slug: string;
  summary?: string;
  content: string;
  cover_image?: string;
  category?: string;
  tags: string[];
  is_published: boolean;
  read_time: string;
  author: string;
  seo_title?: string;
  seo_description?: string;
  views_count: number;
  created_at?: string;
  updated_at?: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  created_at: string;
  last_login_at?: string;
}

export interface AnalyticsEvent {
  id: string;
  event_type: 'page_view' | 'product_view' | 'category_view' | 'daraz_click' | 'search' | 'wishlist_add' | 'banner_click';
  product_id?: string;
  category_slug?: string;
  search_query?: string;
  source_page?: string;
  destination_url?: string;
  device_type?: string;
  user_agent?: string;
  ip_hash?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}
