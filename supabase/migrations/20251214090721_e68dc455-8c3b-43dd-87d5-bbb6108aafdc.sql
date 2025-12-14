-- Create profiles table to store user data
CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  description TEXT DEFAULT '',
  subscribers INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Profiles are viewable by everyone" 
ON public.profiles 
FOR SELECT 
USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, email, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'username', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'avatar_url', 'https://api.dicebear.com/7.x/avataaars/svg?seed=' || NEW.id)
  );
  RETURN NEW;
END;
$$;

-- Create trigger to auto-create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create watch_history table
CREATE TABLE public.watch_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  video_id TEXT NOT NULL,
  watched_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, video_id)
);

ALTER TABLE public.watch_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own watch history" 
ON public.watch_history 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can add to their watch history" 
ON public.watch_history 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own watch history" 
ON public.watch_history 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create liked_videos table
CREATE TABLE public.liked_videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  video_id TEXT NOT NULL,
  liked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, video_id)
);

ALTER TABLE public.liked_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their liked videos" 
ON public.liked_videos 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can like videos" 
ON public.liked_videos 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike videos" 
ON public.liked_videos 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create subscriptions table
CREATE TABLE public.subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  channel_id TEXT NOT NULL,
  subscribed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, channel_id)
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their subscriptions" 
ON public.subscriptions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can subscribe to channels" 
ON public.subscriptions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsubscribe from channels" 
ON public.subscriptions 
FOR DELETE 
USING (auth.uid() = user_id);