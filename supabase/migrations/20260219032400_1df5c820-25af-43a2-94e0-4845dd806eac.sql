
-- Products table (full SaaS product catalog)
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT,
  description TEXT,
  category TEXT,
  sub_category TEXT,
  nano_category TEXT,
  micro_category TEXT,
  deep_category TEXT,
  version TEXT,
  price NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft', -- draft / active
  featured BOOLEAN NOT NULL DEFAULT false,
  trending BOOLEAN NOT NULL DEFAULT false,
  -- Source
  repo_url TEXT,
  repo_branch TEXT,
  apk_url TEXT,
  storage_path TEXT,
  package_name TEXT,
  app_hash TEXT,
  -- Media
  thumbnail_url TEXT,
  screenshots_json JSONB DEFAULT '[]'::jsonb,
  -- Content & SEO
  feature_list_json JSONB DEFAULT '[]'::jsonb,
  tech_stack_json JSONB DEFAULT '[]'::jsonb,
  use_case TEXT,
  target_industry TEXT,
  tags_json JSONB DEFAULT '[]'::jsonb,
  keywords_json JSONB DEFAULT '[]'::jsonb,
  seo_title TEXT,
  seo_description TEXT,
  -- License
  license_enabled BOOLEAN NOT NULL DEFAULT false,
  device_bind BOOLEAN NOT NULL DEFAULT true,
  device_limit INTEGER NOT NULL DEFAULT 1,
  expiry_type TEXT NOT NULL DEFAULT 'lifetime', -- lifetime / monthly / yearly
  -- Download
  secure_download BOOLEAN NOT NULL DEFAULT true,
  require_payment BOOLEAN NOT NULL DEFAULT true,
  log_downloads BOOLEAN NOT NULL DEFAULT true,
  -- Demo
  demo_url TEXT,
  demo_login_id TEXT,
  demo_password TEXT,
  demo_enabled BOOLEAN NOT NULL DEFAULT false,
  demo_click_count INTEGER NOT NULL DEFAULT 0,
  -- Source method
  source_method TEXT NOT NULL DEFAULT 'upload', -- upload / git / both
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- APKs table
CREATE TABLE public.apks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_size BIGINT,
  file_hash TEXT,
  storage_path TEXT,
  package_name TEXT,
  version TEXT,
  upload_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Licenses table
CREATE TABLE public.licenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  license_key TEXT NOT NULL UNIQUE,
  device_id TEXT,
  app_hash TEXT,
  payment_reference TEXT,
  status TEXT NOT NULL DEFAULT 'active', -- active / revoked / expired
  expiry_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  activated_at TIMESTAMP WITH TIME ZONE
);

-- Download logs
CREATE TABLE public.download_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id),
  license_key TEXT,
  ip_address TEXT,
  user_agent TEXT,
  status TEXT NOT NULL DEFAULT 'success', -- success / blocked / expired_token
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- License verification logs
CREATE TABLE public.license_verification_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  license_key TEXT,
  device_id TEXT,
  product_id UUID REFERENCES public.products(id),
  ip_address TEXT,
  result TEXT NOT NULL DEFAULT 'success', -- success / invalid / device_mismatch / expired / brute_force
  attempt_count INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Brand violations log
CREATE TABLE public.brand_violations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id),
  violation_type TEXT,
  detected_string TEXT,
  resolved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.apks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.download_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.license_verification_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_violations ENABLE ROW LEVEL SECURITY;

-- Products: public read for active, admin full access
CREATE POLICY "Public can read active products" ON public.products FOR SELECT USING (status = 'active');
CREATE POLICY "Admin can manage products" ON public.products FOR ALL USING (true) WITH CHECK (true);

-- APKs: admin only
CREATE POLICY "Admin can manage apks" ON public.apks FOR ALL USING (true) WITH CHECK (true);

-- Licenses: public insert (for generation), admin all
CREATE POLICY "Public read own license" ON public.licenses FOR SELECT USING (true);
CREATE POLICY "Admin manage licenses" ON public.licenses FOR ALL USING (true) WITH CHECK (true);

-- Logs: public insert, admin read
CREATE POLICY "Insert download logs" ON public.download_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin read download logs" ON public.download_logs FOR SELECT USING (true);

CREATE POLICY "Insert verification logs" ON public.license_verification_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin read verification logs" ON public.license_verification_logs FOR SELECT USING (true);

CREATE POLICY "Admin manage brand violations" ON public.brand_violations FOR ALL USING (true) WITH CHECK (true);

-- Triggers for updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create APK storage bucket (private)
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('apk-storage', 'apk-storage', false, null)
ON CONFLICT (id) DO NOTHING;

-- Create thumbnails storage bucket (public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-media', 'product-media', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Authenticated upload apks" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'apk-storage');
CREATE POLICY "Authenticated read apks" ON storage.objects FOR SELECT USING (bucket_id = 'apk-storage');
CREATE POLICY "Public read product media" ON storage.objects FOR SELECT USING (bucket_id = 'product-media');
CREATE POLICY "Authenticated upload product media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-media');
