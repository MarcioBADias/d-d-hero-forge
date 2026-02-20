import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Character, AbilityBonuses, AbilityScores } from '@/types/character';
import { toast } from 'sonner';
import { Json } from '@/integrations/supabase/types';

interface DbCharacter {
  id: string;
  user_id: string | null;
  name: string;
  level: number;
  image_url: string | null;
  background_name: string | null;
  background_story: string | null;
  background_ability_bonuses: Json | null;
  race_name: string | null;
  race_options: Json | null;
  classes: Json | null;
  attribute_method: string | null;
  base_abilities: Json | null;
  feats: string[] | null;
  feat_ability_bonuses: Json | null;
  skill_proficiencies: string[] | null;
  spells_known: string[] | null;
  is_public: boolean | null;
  share_mode: string | null;
  created_at: string;
  updated_at: string;
}

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

function dbToCharacter(db: DbCharacter): Character {
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
    skills: db.skill_proficiencies || [],
    spellsKnown: db.spells_known || undefined,
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
    skill_proficiencies: (char.skills || []) as unknown as Json,
    spells_known: char.spellsKnown || null,
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
      return (data || []).map((item) => dbToCharacter(item as unknown as DbCharacter));
    },
    enabled: !!user,
  });

  const saveCharacter = useMutation({
    mutationFn: async (character: Partial<Character>) => {
      if (!user) throw new Error('Você precisa estar logado para salvar');
      const dbData = characterToDb(character, user.id);

      try {
        if (character.id) {
          const { data, error } = await supabase
            .from('characters')
            .update(dbData)
            .eq('id', character.id)
            .eq('user_id', user.id)
            .select()
            .single();

          if (error) throw error;
          return dbToCharacter(data as unknown as DbCharacter);
        } else {
          const { data, error } = await supabase
            .from('characters')
            .insert(dbData)
            .select()
            .single();

          if (error) throw error;
          return dbToCharacter(data as unknown as DbCharacter);
        }
      } catch (err: any) {
        // Workaround for PostgREST schema cache when new column isn't present on remote DB
        const message = err?.message || err?.error_description || '';
        if (message.includes('skill_proficiencies') || err?.code === 'PGRST204') {
          const dbDataNoSkills = { ...dbData } as Record<string, unknown>;
          delete dbDataNoSkills.skill_proficiencies;

          if (character.id) {
            const { data, error } = await supabase
              .from('characters')
              .update(dbDataNoSkills as any)
              .eq('id', character.id)
              .eq('user_id', user.id)
              .select()
              .single();
            if (error) throw error;
            return dbToCharacter(data as unknown as DbCharacter);
          } else {
            const { data, error } = await supabase
              .from('characters')
              .insert(dbDataNoSkills as any)
              .select()
              .single();
            if (error) throw error;
            return dbToCharacter(data as unknown as DbCharacter);
          }
        }

        throw err;
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
        .update({ is_public: isPublic })
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
  return useQuery({
    queryKey: ['character', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('characters')
        .select('*')
        .eq('id', id)
        .eq('is_public', true)
        .maybeSingle();
      
      if (error) throw error;
      if (!data) return null;
      return dbToCharacter(data as unknown as DbCharacter);
    },
    enabled: !!id,
  });
}
