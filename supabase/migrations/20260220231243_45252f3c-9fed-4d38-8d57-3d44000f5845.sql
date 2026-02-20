
-- Adventures table
CREATE TABLE public.adventures (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.adventures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own adventures" ON public.adventures FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own adventures" ON public.adventures FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own adventures" ON public.adventures FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own adventures" ON public.adventures FOR DELETE USING (auth.uid() = user_id);
-- Allow anyone authenticated to view adventures (for linking characters)
CREATE POLICY "Authenticated users can view all adventures" ON public.adventures FOR SELECT TO authenticated USING (true);

CREATE TRIGGER update_adventures_updated_at BEFORE UPDATE ON public.adventures FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Adventure characters linking table
CREATE TABLE public.adventure_characters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  adventure_id UUID NOT NULL REFERENCES public.adventures(id) ON DELETE CASCADE,
  character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(adventure_id, character_id)
);

ALTER TABLE public.adventure_characters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view adventure characters" ON public.adventure_characters FOR SELECT TO authenticated USING (true);
CREATE POLICY "Character owners can link their characters" ON public.adventure_characters FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.characters WHERE id = character_id AND user_id = auth.uid())
);
CREATE POLICY "Character owners can unlink their characters" ON public.adventure_characters FOR DELETE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.characters WHERE id = character_id AND user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM public.adventures WHERE id = adventure_id AND user_id = auth.uid())
);

-- Session summaries
CREATE TABLE public.session_summaries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  adventure_id UUID NOT NULL REFERENCES public.adventures(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  session_date DATE NOT NULL DEFAULT CURRENT_DATE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.session_summaries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Adventure members can view sessions" ON public.session_summaries FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.adventures WHERE id = adventure_id AND user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM public.adventure_characters ac JOIN public.characters c ON c.id = ac.character_id WHERE ac.adventure_id = session_summaries.adventure_id AND c.user_id = auth.uid())
);
CREATE POLICY "Adventure owner can manage sessions" ON public.session_summaries FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.adventures WHERE id = adventure_id AND user_id = auth.uid())
);
CREATE POLICY "Adventure owner can update sessions" ON public.session_summaries FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.adventures WHERE id = adventure_id AND user_id = auth.uid())
);
CREATE POLICY "Adventure owner can delete sessions" ON public.session_summaries FOR DELETE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.adventures WHERE id = adventure_id AND user_id = auth.uid())
);

-- Scenario locations
CREATE TABLE public.scenario_locations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  adventure_id UUID NOT NULL REFERENCES public.adventures(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.scenario_locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Adventure members can view locations" ON public.scenario_locations FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.adventures WHERE id = adventure_id AND user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM public.adventure_characters ac JOIN public.characters c ON c.id = ac.character_id WHERE ac.adventure_id = scenario_locations.adventure_id AND c.user_id = auth.uid())
);
CREATE POLICY "Adventure owner can manage locations" ON public.scenario_locations FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.adventures WHERE id = adventure_id AND user_id = auth.uid())
);
CREATE POLICY "Adventure owner can update locations" ON public.scenario_locations FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.adventures WHERE id = adventure_id AND user_id = auth.uid())
);
CREATE POLICY "Adventure owner can delete locations" ON public.scenario_locations FOR DELETE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.adventures WHERE id = adventure_id AND user_id = auth.uid())
);

-- Rumors and side quests
CREATE TABLE public.rumors_sidequests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  adventure_id UUID NOT NULL REFERENCES public.adventures(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  quest_type TEXT NOT NULL DEFAULT 'rumor',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.rumors_sidequests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Adventure members can view rumors" ON public.rumors_sidequests FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.adventures WHERE id = adventure_id AND user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM public.adventure_characters ac JOIN public.characters c ON c.id = ac.character_id WHERE ac.adventure_id = rumors_sidequests.adventure_id AND c.user_id = auth.uid())
);
CREATE POLICY "Adventure owner can manage rumors" ON public.rumors_sidequests FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.adventures WHERE id = adventure_id AND user_id = auth.uid())
);
CREATE POLICY "Adventure owner can update rumors" ON public.rumors_sidequests FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.adventures WHERE id = adventure_id AND user_id = auth.uid())
);
CREATE POLICY "Adventure owner can delete rumors" ON public.rumors_sidequests FOR DELETE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.adventures WHERE id = adventure_id AND user_id = auth.uid())
);

-- Adventure maps
CREATE TABLE public.adventure_maps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  adventure_id UUID NOT NULL REFERENCES public.adventures(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.adventure_maps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Adventure members can view maps" ON public.adventure_maps FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.adventures WHERE id = adventure_id AND user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM public.adventure_characters ac JOIN public.characters c ON c.id = ac.character_id WHERE ac.adventure_id = adventure_maps.adventure_id AND c.user_id = auth.uid())
);
CREATE POLICY "Adventure owner can manage maps" ON public.adventure_maps FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.adventures WHERE id = adventure_id AND user_id = auth.uid())
);
CREATE POLICY "Adventure owner can delete maps" ON public.adventure_maps FOR DELETE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.adventures WHERE id = adventure_id AND user_id = auth.uid())
);

-- DM notes (only visible to adventure owner)
CREATE TABLE public.dm_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  adventure_id UUID NOT NULL REFERENCES public.adventures(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.dm_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only adventure owner can view DM notes" ON public.dm_notes FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.adventures WHERE id = adventure_id AND user_id = auth.uid())
);
CREATE POLICY "Only adventure owner can manage DM notes" ON public.dm_notes FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.adventures WHERE id = adventure_id AND user_id = auth.uid())
);
CREATE POLICY "Only adventure owner can update DM notes" ON public.dm_notes FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.adventures WHERE id = adventure_id AND user_id = auth.uid())
);
CREATE POLICY "Only adventure owner can delete DM notes" ON public.dm_notes FOR DELETE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.adventures WHERE id = adventure_id AND user_id = auth.uid())
);

-- Storage bucket for adventure maps
INSERT INTO storage.buckets (id, name, public) VALUES ('adventure-maps', 'adventure-maps', true);

CREATE POLICY "Authenticated users can upload adventure maps" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'adventure-maps');
CREATE POLICY "Anyone can view adventure maps" ON storage.objects FOR SELECT USING (bucket_id = 'adventure-maps');
CREATE POLICY "Authenticated users can delete their maps" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'adventure-maps');
