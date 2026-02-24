
-- Add ability trackers column for custom ability usage counters
ALTER TABLE public.characters ADD COLUMN IF NOT EXISTS ability_trackers jsonb DEFAULT '[]'::jsonb;

-- Add custom attacks column for player-created attacks
ALTER TABLE public.characters ADD COLUMN IF NOT EXISTS custom_attacks jsonb DEFAULT '[]'::jsonb;
