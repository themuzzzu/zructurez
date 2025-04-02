
-- Create scheduled_posts table
CREATE TABLE IF NOT EXISTS public.scheduled_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  image_url TEXT,
  category TEXT,
  location TEXT,
  group_id UUID REFERENCES public.groups(id) ON DELETE SET NULL,
  scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('scheduled', 'published', 'cancelled', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create index on user_id and status for faster queries
CREATE INDEX IF NOT EXISTS scheduled_posts_user_id_status_idx ON public.scheduled_posts(user_id, status);

-- Create index on scheduled_for for sorting and filtering
CREATE INDEX IF NOT EXISTS scheduled_posts_scheduled_for_idx ON public.scheduled_posts(scheduled_for);

-- Add RLS policies to scheduled_posts table
ALTER TABLE public.scheduled_posts ENABLE ROW LEVEL SECURITY;

-- Users can view their own scheduled posts
CREATE POLICY "Users can view their own scheduled posts" 
ON public.scheduled_posts 
FOR SELECT 
USING (auth.uid() = user_id);

-- Users can insert their own scheduled posts
CREATE POLICY "Users can insert their own scheduled posts" 
ON public.scheduled_posts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can update their own scheduled posts
CREATE POLICY "Users can update their own scheduled posts" 
ON public.scheduled_posts 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Users can delete their own scheduled posts
CREATE POLICY "Users can delete their own scheduled posts" 
ON public.scheduled_posts 
FOR DELETE 
USING (auth.uid() = user_id);
