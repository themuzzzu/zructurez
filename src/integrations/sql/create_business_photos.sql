
-- Create business_photos table to store photos for businesses
CREATE TABLE IF NOT EXISTS public.business_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Add RLS policies to business_photos table
ALTER TABLE public.business_photos ENABLE ROW LEVEL SECURITY;

-- Anonymous users can view business photos
CREATE POLICY "Anyone can view business photos" 
ON public.business_photos 
FOR SELECT 
USING (true);

-- Business owners can insert photos for their own businesses
CREATE POLICY "Business owners can add photos" 
ON public.business_photos 
FOR INSERT 
WITH CHECK (
  business_id IN (
    SELECT id FROM public.businesses WHERE user_id = auth.uid()
  )
);

-- Business owners can update their own photos
CREATE POLICY "Business owners can update photos" 
ON public.business_photos 
FOR UPDATE 
USING (
  business_id IN (
    SELECT id FROM public.businesses WHERE user_id = auth.uid()
  )
);

-- Business owners can delete their own photos
CREATE POLICY "Business owners can delete photos" 
ON public.business_photos 
FOR DELETE 
USING (
  business_id IN (
    SELECT id FROM public.businesses WHERE user_id = auth.uid()
  )
);

-- Add storage policies for the new buckets
-- Note: These are already created in storage.buckets table by our previous SQL migration
