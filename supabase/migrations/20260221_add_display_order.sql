-- Add display_order column to all adventure-related tables for drag and drop reordering

-- Add to session_summaries
ALTER TABLE public.session_summaries 
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Add to scenario_locations
ALTER TABLE public.scenario_locations 
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Add to rumors_sidequests
ALTER TABLE public.rumors_sidequests 
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Add to adventure_maps
ALTER TABLE public.adventure_maps 
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Add to dm_notes
ALTER TABLE public.dm_notes 
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Add to adventure_bestiary
ALTER TABLE public.adventure_bestiary 
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Create indexes for faster ordering queries
CREATE INDEX IF NOT EXISTS idx_session_summaries_display_order 
ON public.session_summaries(adventure_id, display_order);

CREATE INDEX IF NOT EXISTS idx_scenario_locations_display_order 
ON public.scenario_locations(adventure_id, display_order);

CREATE INDEX IF NOT EXISTS idx_rumors_sidequests_display_order 
ON public.rumors_sidequests(adventure_id, display_order);

CREATE INDEX IF NOT EXISTS idx_adventure_maps_display_order 
ON public.adventure_maps(adventure_id, display_order);

CREATE INDEX IF NOT EXISTS idx_dm_notes_display_order 
ON public.dm_notes(adventure_id, display_order);

CREATE INDEX IF NOT EXISTS idx_adventure_bestiary_display_order 
ON public.adventure_bestiary(adventure_id, display_order);
