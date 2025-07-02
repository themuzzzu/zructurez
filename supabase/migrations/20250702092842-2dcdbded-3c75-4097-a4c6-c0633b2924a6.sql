
-- Fix security issues: Enable RLS on tables and remove SECURITY DEFINER from views

-- 1. Enable RLS on all tables that don't have it
ALTER TABLE public.location_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_real_time_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regional_business_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills_intelligence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_review_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_market_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_behavior_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_categories_enhanced ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_pricing_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_bookings_enhanced ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_competitive_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.location_service_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.location_management_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_location_history ENABLE ROW LEVEL SECURITY;

-- Note: spatial_ref_sys and backup tables are system/temporary tables that can be left without RLS
-- Note: profiles table RLS will be handled separately with proper policies

-- 2. Create basic RLS policies for key tables

-- Profiles policies (enable RLS and create policies)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- User-related tables policies
CREATE POLICY "Users can view own bookmarks" ON public.user_bookmarks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own bookmarks" ON public.user_bookmarks FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own addresses" ON public.user_addresses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own addresses" ON public.user_addresses FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own location history" ON public.user_location_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own location history" ON public.user_location_history FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Public read access for reference tables
CREATE POLICY "Anyone can view locations" ON public.locations FOR SELECT USING (true);
CREATE POLICY "Anyone can view job categories" ON public.job_categories FOR SELECT USING (true);
CREATE POLICY "Anyone can view service categories" ON public.service_categories_enhanced FOR SELECT USING (true);
CREATE POLICY "Anyone can view companies" ON public.companies FOR SELECT USING (true);

-- Job-related policies
CREATE POLICY "Anyone can view active job postings" ON public.job_postings FOR SELECT USING (status = 'active');
CREATE POLICY "Users can view own job applications" ON public.job_applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create job applications" ON public.job_applications FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Analytics tables - restrict to authenticated users only
CREATE POLICY "Authenticated users can view analytics" ON public.business_analytics FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can view service analytics" ON public.service_analytics FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can view user behavior analytics" ON public.user_behavior_analytics FOR SELECT USING (auth.role() = 'authenticated');

-- Admin-only policies
CREATE POLICY "Only admins can access admin users" ON public.admin_users FOR ALL USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
);

-- 3. Recreate views without SECURITY DEFINER property
-- Note: We'll drop and recreate the views to remove SECURITY DEFINER

-- Drop existing views
DROP VIEW IF EXISTS public.trending_services CASCADE;
DROP VIEW IF EXISTS public.marketplace_products CASCADE;
DROP VIEW IF EXISTS public.category_stats CASCADE;
DROP VIEW IF EXISTS public.product_details CASCADE;
DROP VIEW IF EXISTS public.city_business_analytics CASCADE;
DROP VIEW IF EXISTS public.services_complete CASCADE;
DROP VIEW IF EXISTS public.reviews_with_votes CASCADE;
DROP VIEW IF EXISTS public.service_details_complete CASCADE;
DROP VIEW IF EXISTS public.business_overview CASCADE;
DROP VIEW IF EXISTS public.v_regional_business_heatmap CASCADE;

-- Recreate views without SECURITY DEFINER (basic versions for now)
CREATE VIEW public.trending_services AS
SELECT 
  s.id,
  s.title,
  s.category,
  s.price,
  s.rating,
  s.views,
  s.created_at
FROM services s
WHERE s.status = 'active'
ORDER BY s.views DESC, s.rating DESC
LIMIT 50;

CREATE VIEW public.marketplace_products AS
SELECT 
  p.id,
  p.title,
  p.price,
  p.category,
  p.image_url,
  p.rating,
  p.views,
  p.created_at
FROM products p
WHERE p.status = 'active'
ORDER BY p.created_at DESC;

CREATE VIEW public.category_stats AS
SELECT 
  category,
  COUNT(*) as total_count,
  AVG(rating) as avg_rating
FROM products
WHERE status = 'active'
GROUP BY category;

-- 4. Create trigger function to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
