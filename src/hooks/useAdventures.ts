import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Adventure {
  id: string;
  user_id: string;
  title: string;
  progress: number;
  created_at: string;
  updated_at: string;
}

export interface SessionSummary {
  id: string;
  adventure_id: string;
  title: string;
  session_date: string;
  description: string | null;
  created_at: string;
}

export interface ScenarioLocation {
  id: string;
  adventure_id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
}

export interface RumorSidequest {
  id: string;
  adventure_id: string;
  title: string;
  description: string | null;
  quest_type: string;
  created_at: string;
}

export interface AdventureMap {
  id: string;
  adventure_id: string;
  name: string;
  image_url: string;
  created_at: string;
}

export interface DmNote {
  id: string;
  adventure_id: string;
  title: string;
  content: string | null;
  created_at: string;
}

export interface AdventureCharacter {
  id: string;
  adventure_id: string;
  character_id: string;
  joined_at: string;
}

export interface BestiaryEntry {
  id: string;
  adventure_id: string;
  name: string;
  challenge_rating: string;
  monster_data: any;
  created_at: string;
}

export function useAdventures() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch adventures owned by user
  const { data: ownedAdventures = [], isLoading: ownedLoading } = useQuery({
    queryKey: ['adventures', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('adventures')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });
      if (error) throw error;
      return (data || []) as Adventure[];
    },
    enabled: !!user,
  });

  // Fetch adventures where user has characters participating
  const { data: participatingAdventures = [], isLoading: partLoading } = useQuery({
    queryKey: ['participating-adventures', user?.id],
    queryFn: async () => {
      if (!user) return [];
      // Get character IDs for this user
      const { data: chars, error: charErr } = await supabase
        .from('characters')
        .select('id')
        .eq('user_id', user.id);
      if (charErr) throw charErr;
      if (!chars || chars.length === 0) return [];
      
      const charIds = chars.map(c => c.id);
      
      // Get adventure_characters links for these characters
      const { data: links, error: linkErr } = await supabase
        .from('adventure_characters')
        .select('adventure_id')
        .in('character_id', charIds);
      if (linkErr) throw linkErr;
      if (!links || links.length === 0) return [];
      
      const adventureIds = [...new Set(links.map(l => l.adventure_id))];
      
      // Filter out owned adventures
      const nonOwnedIds = adventureIds.filter(aid => !ownedAdventures.some(a => a.id === aid));
      if (nonOwnedIds.length === 0) return [];
      
      const { data: advs, error: advErr } = await supabase
        .from('adventures')
        .select('*')
        .in('id', nonOwnedIds)
        .order('updated_at', { ascending: false });
      if (advErr) throw advErr;
      return (advs || []) as Adventure[];
    },
    enabled: !!user && !ownedLoading,
  });

  const adventures = [...ownedAdventures, ...participatingAdventures];
  const isLoading = ownedLoading || partLoading;

  const createAdventure = useMutation({
    mutationFn: async ({ title, password }: { title: string; password: string }) => {
      if (!user) throw new Error('Login necessário');
      const { data, error } = await supabase
        .from('adventures')
        .insert({ user_id: user.id, title, password_hash: password })
        .select()
        .single();
      if (error) throw error;
      return data as Adventure;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adventures', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['participating-adventures', user?.id] });
      toast.success('Aventura criada!');
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const updateAdventure = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Adventure> & { id: string }) => {
      if (!user) throw new Error('Login necessário');
      const { error } = await supabase
        .from('adventures')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adventures', user?.id] });
    },
  });

  const deleteAdventure = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error('Login necessário');
      const { error } = await supabase.from('adventures').delete().eq('id', id).eq('user_id', user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adventures', user?.id] });
      toast.success('Aventura deletada');
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return { adventures, isLoading, createAdventure, updateAdventure, deleteAdventure };
}

export function useAdventureDetails(adventureId: string | undefined) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: adventure } = useQuery({
    queryKey: ['adventure', adventureId],
    queryFn: async () => {
      if (!adventureId) return null;
      const { data, error } = await supabase.from('adventures').select('*').eq('id', adventureId).single();
      if (error) throw error;
      return data as Adventure;
    },
    enabled: !!adventureId,
  });

  const isOwner = adventure?.user_id === user?.id;

  const { data: characters = [] } = useQuery({
    queryKey: ['adventure-characters', adventureId],
    queryFn: async () => {
      if (!adventureId) return [];
      const { data, error } = await supabase
        .from('adventure_characters')
        .select('*, characters(*)')
        .eq('adventure_id', adventureId);
      if (error) throw error;
      return data || [];
    },
    enabled: !!adventureId,
  });

  const { data: sessions = [] } = useQuery({
    queryKey: ['sessions', adventureId],
    queryFn: async () => {
      if (!adventureId) return [];
      const { data, error } = await supabase
        .from('session_summaries')
        .select('*')
        .eq('adventure_id', adventureId)
        .order('session_date', { ascending: false });
      if (error) throw error;
      return (data || []) as SessionSummary[];
    },
    enabled: !!adventureId,
  });

  const { data: locations = [] } = useQuery({
    queryKey: ['locations', adventureId],
    queryFn: async () => {
      if (!adventureId) return [];
      const { data, error } = await supabase
        .from('scenario_locations')
        .select('*')
        .eq('adventure_id', adventureId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as ScenarioLocation[];
    },
    enabled: !!adventureId,
  });

  const { data: rumors = [] } = useQuery({
    queryKey: ['rumors', adventureId],
    queryFn: async () => {
      if (!adventureId) return [];
      const { data, error } = await supabase
        .from('rumors_sidequests')
        .select('*')
        .eq('adventure_id', adventureId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as RumorSidequest[];
    },
    enabled: !!adventureId,
  });

  const { data: maps = [] } = useQuery({
    queryKey: ['maps', adventureId],
    queryFn: async () => {
      if (!adventureId) return [];
      const { data, error } = await supabase
        .from('adventure_maps')
        .select('*')
        .eq('adventure_id', adventureId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as AdventureMap[];
    },
    enabled: !!adventureId,
  });

  const { data: dmNotes = [] } = useQuery({
    queryKey: ['dm-notes', adventureId],
    queryFn: async () => {
      if (!adventureId || !isOwner) return [];
      const { data, error } = await supabase
        .from('dm_notes')
        .select('*')
        .eq('adventure_id', adventureId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as DmNote[];
    },
    enabled: !!adventureId && isOwner,
  });

  const { data: bestiary = [] } = useQuery({
    queryKey: ['bestiary', adventureId],
    queryFn: async () => {
      if (!adventureId) return [];
      const { data, error } = await supabase
        .from('adventure_bestiary')
        .select('*')
        .eq('adventure_id', adventureId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as BestiaryEntry[];
    },
    enabled: !!adventureId,
  });

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ['adventure', adventureId] });
    queryClient.invalidateQueries({ queryKey: ['adventure-characters', adventureId] });
    queryClient.invalidateQueries({ queryKey: ['sessions', adventureId] });
    queryClient.invalidateQueries({ queryKey: ['locations', adventureId] });
    queryClient.invalidateQueries({ queryKey: ['rumors', adventureId] });
    queryClient.invalidateQueries({ queryKey: ['maps', adventureId] });
    queryClient.invalidateQueries({ queryKey: ['dm-notes', adventureId] });
    queryClient.invalidateQueries({ queryKey: ['bestiary', adventureId] });
  };

  return { adventure, isOwner, characters, sessions, locations, rumors, maps, dmNotes, bestiary, invalidateAll };
}

export function useAllAdventures() {
  return useQuery({
    queryKey: ['all-adventures'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('adventures')
        .select('id, title, password_hash')
        .order('title');
      if (error) throw error;
      return (data || []) as Array<{ id: string; title: string; password_hash: string }>;
    },
  });
}

export function useLinkCharacter() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ adventureId, characterId }: { adventureId: string; characterId: string }) => {
      const { error } = await supabase
        .from('adventure_characters')
        .insert({ adventure_id: adventureId, character_id: characterId });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adventure-characters'] });
      queryClient.invalidateQueries({ queryKey: ['character-adventures'] });
      toast.success('Personagem vinculado à aventura!');
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useCharacterAdventures(characterId: string | undefined) {
  return useQuery({
    queryKey: ['character-adventures', characterId],
    queryFn: async () => {
      if (!characterId) return [];
      const { data, error } = await supabase
        .from('adventure_characters')
        .select('*, adventures(id, title)')
        .eq('character_id', characterId);
      if (error) throw error;
      return data || [];
    },
    enabled: !!characterId,
  });
}
