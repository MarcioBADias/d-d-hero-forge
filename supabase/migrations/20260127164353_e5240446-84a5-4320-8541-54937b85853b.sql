-- Create profiles table for user information
CREATE TABLE public.profiles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT,
    avatar_url TEXT,
    theme TEXT DEFAULT 'dark',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Public profiles are viewable by everyone
CREATE POLICY "Public profiles are viewable"
ON public.profiles FOR SELECT
USING (true);

-- Create characters table
CREATE TABLE public.characters (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    level INTEGER NOT NULL DEFAULT 1,
    image_url TEXT,
    background_name TEXT,
    background_story TEXT,
    background_ability_bonuses JSONB DEFAULT '{"str":0,"dex":0,"con":0,"int":0,"wis":0,"cha":0}'::jsonb,
    race_name TEXT,
    race_options JSONB,
    classes JSONB DEFAULT '[]'::jsonb,
    attribute_method TEXT DEFAULT 'standard',
    base_abilities JSONB DEFAULT '{"str":8,"dex":8,"con":8,"int":8,"wis":8,"cha":8}'::jsonb,
    feats TEXT[] DEFAULT '{}',
    feat_ability_bonuses JSONB DEFAULT '{"str":0,"dex":0,"con":0,"int":0,"wis":0,"cha":0}'::jsonb,
    skill_proficiencies TEXT[] DEFAULT '{}',
    spells_known TEXT[],
    is_public BOOLEAN DEFAULT false,
    share_mode TEXT DEFAULT 'readonly',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on characters
ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;

-- Characters policies
CREATE POLICY "Users can view their own characters"
ON public.characters FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own characters"
ON public.characters FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own characters"
ON public.characters FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own characters"
ON public.characters FOR DELETE
USING (auth.uid() = user_id);

CREATE POLICY "Public characters are viewable by everyone"
ON public.characters FOR SELECT
USING (is_public = true);

-- Function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, username)
    VALUES (NEW.id, NEW.email);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_characters_updated_at
BEFORE UPDATE ON public.characters
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for character images
INSERT INTO storage.buckets (id, name, public) VALUES ('character-images', 'character-images', true);

-- Storage policies for character images
CREATE POLICY "Anyone can view character images"
ON storage.objects FOR SELECT
USING (bucket_id = 'character-images');

CREATE POLICY "Authenticated users can upload character images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'character-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'character-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own images"
ON storage.objects FOR DELETE
USING (bucket_id = 'character-images' AND auth.uid()::text = (storage.foldername(name))[1]);