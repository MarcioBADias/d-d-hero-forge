import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Character, AbilityBonuses, AbilityScores, Coins, DeathSaves, SpellSlotState } from '@/types/character';
import { toast } from 'sonner';
import { Json } from '@/integrations/supabase/types';

function parseAbilityBonuses(json: Json | null): AbilityBonuses {
  if (!json || typeof json !== 'object' || Array.isArray(json)) {
    return { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 };
  }
  const obj = json as Record<string, Json | undefined>;
  return {
    str: typeof obj.str === 'number' ? obj.str : 0,
    dex: typeof obj.dex === 'number' ? obj.dex : 0,
    con: typeof obj.con === 'number' ? obj.con : 0,
    int: typeof obj.int === 'number' ? obj.int : 0,
    wis: typeof obj.wis === 'number' ? obj.wis : 0,
    cha: typeof obj.cha === 'number' ? obj.cha : 0,
  };
}

function parseAbilityScores(json: Json | null): AbilityScores {
  if (!json || typeof json !== 'object' || Array.isArray(json)) {
    return { str: 8, dex: 8, con: 8, int: 8, wis: 8, cha: 8 };
  }
  const obj = json as Record<string, Json | undefined>;
  return {
    str: typeof obj.str === 'number' ? obj.str : 8,
    dex: typeof obj.dex === 'number' ? obj.dex : 8,
    con: typeof obj.con === 'number' ? obj.con : 8,
    int: typeof obj.int === 'number' ? obj.int : 8,
    wis: typeof obj.wis === 'number' ? obj.wis : 8,
    cha: typeof obj.cha === 'number' ? obj.cha : 8,
  };
}

function parseClasses(json: Json | null): Array<{ className: string; level: number; subclass?: string }> {
  if (!json || !Array.isArray(json)) return [];
  return json.map((item) => {
    if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
      const obj = item as Record<string, Json | undefined>;
      return {
        className: typeof obj.className === 'string' ? obj.className : '',
        level: typeof obj.level === 'number' ? obj.level : 1,
        subclass: typeof obj.subclass === 'string' ? obj.subclass : undefined,
      };
    }
    return { className: '', level: 1 };
  });
}

function parseRaceOptions(json: Json | null): Record<string, string> | undefined {
  if (!json || typeof json !== 'object' || Array.isArray(json)) return undefined;
  const result: Record<string, string> = {};
  const obj = json as Record<string, Json | undefined>;
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      result[key] = obj[key] as string;
    }
  }
  return Object.keys(result).length > 0 ? result : undefined;
}

function parseCoins(json: Json | null): Coins {
  if (!json || typeof json !== 'object' || Array.isArray(json)) {
    return { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 };
  }
  const obj = json as Record<string, Json | undefined>;
  return {
    cp: typeof obj.cp === 'number' ? obj.cp : 0,
    sp: typeof obj.sp === 'number' ? obj.sp : 0,
    ep: typeof obj.ep === 'number' ? obj.ep : 0,
    gp: typeof obj.gp === 'number' ? obj.gp : 0,
    pp: typeof obj.pp === 'number' ? obj.pp : 0,
  };
}

function parseDeathSaves(json: Json | null): DeathSaves {
  if (!json || typeof json !== 'object' || Array.isArray(json)) {
    return { successes: 0, failures: 0 };
  }
  const obj = json as Record<string, Json | undefined>;
  return {
    successes: typeof obj.successes === 'number' ? obj.successes : 0,
    failures: typeof obj.failures === 'number' ? obj.failures : 0,
  };
}

function parseSpellSlots(json: Json | null): SpellSlotState {
  if (!json || typeof json !== 'object' || Array.isArray(json)) return {};
  const result: SpellSlotState = {};
  const obj = json as Record<string, Json | undefined>;
  for (const key in obj) {
    const val = obj[key];
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      const slot = val as Record<string, Json | undefined>;
      result[parseInt(key)] = {
        max: typeof slot.max === 'number' ? slot.max : 0,
        used: typeof slot.used === 'number' ? slot.used : 0,
      };
    }
  }
  return result;
}

function parseStringRecord(json: Json | null): Record<string, boolean> {
  if (!json || typeof json !== 'object' || Array.isArray(json)) return {};
  const result: Record<string, boolean> = {};
  const obj = json as Record<string, Json | undefined>;
  for (const key in obj) {
    result[key] = !!obj[key];
  }
  return result;
}

function parseCustomEquipment(json: Json | null): { name: string; description: string; type: 'mundane' | 'magic' | 'custom' }[] {
  if (!json || !Array.isArray(json)) return [];
  return json.map((item) => {
    if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
      const obj = item as Record<string, Json | undefined>;
      return {
        name: typeof obj.name === 'string' ? obj.name : '',
        description: typeof obj.description === 'string' ? obj.description : '',
        type: (typeof obj.type === 'string' ? obj.type : 'custom') as 'mundane' | 'magic' | 'custom',
      };
    }
    return { name: '', description: '', type: 'custom' as const };
  });
}

function parseFeatSelections(json: Json | null): Record<string, any> | undefined {
  if (!json || typeof json !== 'object' || Array.isArray(json)) return {};
  return json as Record<string, any>;
}

function dbToCharacter(db: any): Character {
  return {
    id: db.id,
    name: db.name,
    level: db.level,
    imageUrl: db.image_url || undefined,
    backgroundName: db.background_name || '',
    backgroundStory: db.background_story || '',
    backgroundAbilityBonuses: parseAbilityBonuses(db.background_ability_bonuses),
    raceName: db.race_name || '',
    raceOptions: parseRaceOptions(db.race_options),
    classes: parseClasses(db.classes),
    attributeMethod: (db.attribute_method as 'standard' | 'pointbuy') || 'standard',
    baseAbilities: parseAbilityScores(db.base_abilities),
    feats: db.feats || [],
    featAbilityBonuses: parseAbilityBonuses(db.feat_ability_bonuses),
    featSelections: parseFeatSelections(db.feat_selections),
    skills: db.skill_proficiencies || [],
    spellsKnown: db.spells_known || [],
    preparedSpells: db.prepared_spells || [],
    spellSlots: parseSpellSlots(db.spell_slots),
    selectedEquipment: db.selected_equipment || [],
    customEquipment: parseCustomEquipment(db.custom_equipment),
    equippedWeapons: db.equipped_weapons || [],
    weaponEquipStates: parseStringRecord(db.weapon_equip_states),
    armorEquipStates: parseStringRecord(db.armor_equip_states),
    armorAC: db.armor_ac ?? undefined,
    shieldAC: db.shield_ac ?? undefined,
    equippedArmor: db.equipped_armor || undefined,
    equippedShield: db.equipped_shield || undefined,
    currentHp: db.current_hp ?? undefined,
    tempHp: db.temp_hp ?? 0,
    deathSaves: parseDeathSaves(db.death_saves),
    inventory: db.inventory || '',
    coins: parseCoins(db.coins),
    adventureNotes: db.adventure_notes || '',
    createdAt: new Date(db.created_at),
    updatedAt: new Date(db.updated_at),
    userId: db.user_id || undefined,
    isPublic: db.is_public || false,
  };
}

function characterToDb(char: Partial<Character>, userId?: string) {
  return {
    user_id: userId,
    name: char.name || 'Novo Personagem',
    level: char.level || 1,
    image_url: char.imageUrl || null,
    background_name: char.backgroundName || null,
    background_story: char.backgroundStory || null,
    background_ability_bonuses: (char.backgroundAbilityBonuses || { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 }) as unknown as Json,
    race_name: char.raceName || null,
    race_options: (char.raceOptions || null) as unknown as Json,
    classes: (char.classes || []) as unknown as Json,
    attribute_method: char.attributeMethod || 'standard',
    base_abilities: (char.baseAbilities || { str: 8, dex: 8, con: 8, int: 8, wis: 8, cha: 8 }) as unknown as Json,
    feats: char.feats || [],
    feat_ability_bonuses: (char.featAbilityBonuses || { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 }) as unknown as Json,
    feat_selections: (char.featSelections || {}) as unknown as Json,
    skill_proficiencies: char.skills || [],
    spells_known: char.spellsKnown || [],
    prepared_spells: char.preparedSpells || [],
    spell_slots: (char.spellSlots || {}) as unknown as Json,
    selected_equipment: char.selectedEquipment || [],
    custom_equipment: (char.customEquipment || []) as unknown as Json,
    equipped_weapons: char.equippedWeapons || [],
    weapon_equip_states: (char.weaponEquipStates || {}) as unknown as Json,
    armor_equip_states: (char.armorEquipStates || {}) as unknown as Json,
    armor_ac: char.armorAC ?? null,
    shield_ac: char.shieldAC ?? null,
    equipped_armor: char.equippedArmor || null,
    equipped_shield: char.equippedShield || null,
    current_hp: char.currentHp ?? null,
    temp_hp: char.tempHp ?? 0,
    death_saves: (char.deathSaves || { successes: 0, failures: 0 }) as unknown as Json,
    inventory: char.inventory || '',
    coins: (char.coins || { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 }) as unknown as Json,
    adventure_notes: char.adventureNotes || '',
    is_public: char.isPublic || false,
  };
}

export function useCharacters() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: characters = [], isLoading } = useQuery({
    queryKey: ['characters', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('characters')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      return (data || []).map((item: any) => dbToCharacter(item));
    },
    enabled: !!user,
  });

  const saveCharacter = useMutation({
    mutationFn: async (character: Partial<Character>) => {
      if (!user) throw new Error('Você precisa estar logado para salvar');
      const dbData = characterToDb(character, user.id);

      if (character.id) {
        const { data, error } = await supabase
          .from('characters')
          .update(dbData as any)
          .eq('id', character.id)
          .eq('user_id', user.id)
          .select()
          .single();

        if (error) throw error;
        return dbToCharacter(data);
      } else {
        const { data, error } = await supabase
          .from('characters')
          .insert(dbData as any)
          .select()
          .single();

        if (error) throw error;
        return dbToCharacter(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['characters', user?.id] });
      toast.success('Personagem salvo com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao salvar personagem');
    },
  });

  const deleteCharacter = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error('Você precisa estar logado');
      
      const { error } = await supabase
        .from('characters')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['characters', user?.id] });
      toast.success('Personagem deletado');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao deletar personagem');
    },
  });

  const togglePublic = useMutation({
    mutationFn: async ({ id, isPublic }: { id: string; isPublic: boolean }) => {
      if (!user) throw new Error('Você precisa estar logado');
      
      const { error } = await supabase
        .from('characters')
        .update({ is_public: isPublic } as any)
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) throw error;
    },
    onSuccess: (_, { isPublic }) => {
      queryClient.invalidateQueries({ queryKey: ['characters', user?.id] });
      toast.success(isPublic ? 'Personagem agora é público!' : 'Personagem agora é privado');
    },
  });

  return {
    characters,
    isLoading,
    saveCharacter,
    deleteCharacter,
    togglePublic,
  };
}

export function usePublicCharacter(id: string) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['character', id, user?.id],
    queryFn: async () => {
      // Try to fetch as owner first (can see own private chars)
      if (user) {
        const { data: ownData } = await supabase
          .from('characters')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .maybeSingle();
        if (ownData) return dbToCharacter(ownData);
      }
      
      // Fall back to public
      const { data, error } = await supabase
        .from('characters')
        .select('*')
        .eq('id', id)
        .eq('is_public', true)
        .maybeSingle();
      
      if (error) throw error;
      if (!data) return null;
      return dbToCharacter(data);
    },
    enabled: !!id,
  });
}