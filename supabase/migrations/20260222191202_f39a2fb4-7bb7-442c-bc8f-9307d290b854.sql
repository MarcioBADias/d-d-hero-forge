
-- Add missing character data columns
ALTER TABLE public.characters
  ADD COLUMN IF NOT EXISTS selected_equipment text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS custom_equipment jsonb DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS equipped_weapons text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS weapon_equip_states jsonb DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS armor_equip_states jsonb DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS armor_ac integer DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS shield_ac integer DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS equipped_armor text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS equipped_shield text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS current_hp integer DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS temp_hp integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS death_saves jsonb DEFAULT '{"successes": 0, "failures": 0}',
  ADD COLUMN IF NOT EXISTS inventory text DEFAULT '',
  ADD COLUMN IF NOT EXISTS coins jsonb DEFAULT '{"cp": 0, "sp": 0, "ep": 0, "gp": 0, "pp": 0}',
  ADD COLUMN IF NOT EXISTS adventure_notes text DEFAULT '',
  ADD COLUMN IF NOT EXISTS spell_slots jsonb DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS prepared_spells text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS feat_selections jsonb DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS skill_proficiencies text[] DEFAULT '{}';
