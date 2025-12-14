-- Fix 1: Remove email column from profiles (store sensitive data separately)
-- Email is already in auth.users, no need to duplicate in public table
ALTER TABLE public.profiles DROP COLUMN IF EXISTS email;

-- Fix 2: Drop the overly permissive SELECT policy
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Create proper SELECT policies
-- Users can see their own full profile
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

-- Anyone can see public profile data (username, avatar, etc. - no email since we removed it)
CREATE POLICY "Public can view profile basics"
ON public.profiles FOR SELECT
USING (true);

-- Fix 3: Add explicit DELETE policy (block hard deletes, use cascade from auth.users)
CREATE POLICY "Profiles cannot be hard deleted directly"
ON public.profiles FOR DELETE
USING (false);

-- Note: When auth.users is deleted, the ON DELETE CASCADE will handle profile deletion