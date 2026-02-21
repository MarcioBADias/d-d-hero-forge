
-- Create bestiary table for monsters/NPCs
CREATE TABLE public.adventure_bestiary (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  adventure_id UUID NOT NULL REFERENCES public.adventures(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  challenge_rating TEXT NOT NULL DEFAULT '0',
  monster_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.adventure_bestiary ENABLE ROW LEVEL SECURITY;

-- Adventure members can view bestiary
CREATE POLICY "Adventure members can view bestiary"
ON public.adventure_bestiary FOR SELECT
USING (
  (EXISTS (SELECT 1 FROM adventures WHERE adventures.id = adventure_bestiary.adventure_id AND adventures.user_id = auth.uid()))
  OR
  (EXISTS (SELECT 1 FROM adventure_characters ac JOIN characters c ON c.id = ac.character_id WHERE ac.adventure_id = adventure_bestiary.adventure_id AND c.user_id = auth.uid()))
);

-- Adventure owner can manage bestiary
CREATE POLICY "Adventure owner can manage bestiary"
ON public.adventure_bestiary FOR INSERT
WITH CHECK (EXISTS (SELECT 1 FROM adventures WHERE adventures.id = adventure_bestiary.adventure_id AND adventures.user_id = auth.uid()));

CREATE POLICY "Adventure owner can update bestiary"
ON public.adventure_bestiary FOR UPDATE
USING (EXISTS (SELECT 1 FROM adventures WHERE adventures.id = adventure_bestiary.adventure_id AND adventures.user_id = auth.uid()));

CREATE POLICY "Adventure owner can delete bestiary"
ON public.adventure_bestiary FOR DELETE
USING (EXISTS (SELECT 1 FROM adventures WHERE adventures.id = adventure_bestiary.adventure_id AND adventures.user_id = auth.uid()));
