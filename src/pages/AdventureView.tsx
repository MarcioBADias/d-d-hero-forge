import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';
import { useAdventureDetails } from '@/hooks/useAdventures';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Footer } from '@/components/layout/Footer';
import MonsterStatBlock from '@/components/adventure/MonsterStatBlock';
import { toast } from 'sonner';
import {
  ArrowLeft, Users, ScrollText, MapPin, Compass, Map, BookLock,
  Plus, ChevronDown, ChevronUp, Sword, Trash2, Upload, Skull, Pen
} from 'lucide-react';

export default function AdventureView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { adventure, isOwner, characters, sessions, locations, rumors, maps, dmNotes, bestiary, invalidateAll } = useAdventureDetails(id);

  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    characters: true, sessions: false, locations: false, rumors: false, maps: false, dmNotes: false, bestiary: false,
  });
  const [selectedCharId, setSelectedCharId] = useState<string | null>(null);
  const [expandedNotes, setExpandedNotes] = useState<Record<string, boolean>>({});
  const [expandedMonsters, setExpandedMonsters] = useState<Record<string, boolean>>({});

  // Dialog states
  const [sessionDialog, setSessionDialog] = useState(false);
  const [locationDialog, setLocationDialog] = useState(false);
  const [rumorDialog, setRumorDialog] = useState(false);
  const [mapDialog, setMapDialog] = useState(false);
  const [noteDialog, setNoteDialog] = useState(false);
  const [progressDialog, setProgressDialog] = useState(false);
  const [bestiaryDialog, setBestiaryDialog] = useState(false);
  const [imageViewerDialog, setImageViewerDialog] = useState(false);
  const [editingMonsterId, setEditingMonsterId] = useState<string | null>(null);
  const [editSessionId, setEditSessionId] = useState<string | null>(null);
  const [editLocationId, setEditLocationId] = useState<string | null>(null);
  const [editRumorId, setEditRumorId] = useState<string | null>(null);
  const [editMapId, setEditMapId] = useState<string | null>(null);
  const [editNoteId, setEditNoteId] = useState<string | null>(null);
  const [viewImageUrl, setViewImageUrl] = useState<string>('');

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formType, setFormType] = useState('rumor');
  const [mapFile, setMapFile] = useState<File | null>(null);
  const [monsterImageFile, setMonsterImageFile] = useState<File | null>(null);
  const [progressValue, setProgressValue] = useState(adventure?.progress || 0);
  const [monsterJson, setMonsterJson] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const jsonFileInputRef = useRef<HTMLInputElement>(null);
  const monsterImageInputRef = useRef<HTMLInputElement>(null);

  const toggle = (key: string) => setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
  const toggleNote = (id: string) => setExpandedNotes(prev => ({ ...prev, [id]: !prev[id] }));
  const toggleMonster = (id: string) => setExpandedMonsters(prev => ({ ...prev, [id]: !prev[id] }));

  if (!adventure) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Carregando aventura...</p>
      </div>
    );
  }

  // If viewing a character sheet
  if (selectedCharId) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <Button variant="ghost" onClick={() => setSelectedCharId(null)} className="gap-2">
              <ArrowLeft className="w-4 h-4" /> Voltar à Aventura
            </Button>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8 flex-1">
          <p className="text-muted-foreground">
            <Button variant="link" onClick={() => navigate(`/character/${selectedCharId}`)}>
              Abrir ficha completa do personagem →
            </Button>
          </p>
        </main>
      </div>
    );
  }

  const handleAddSession = async () => {
    if (!formTitle.trim()) return;
    if (editSessionId) {
      return handleUpdateSession();
    }
    const { error } = await supabase.from('session_summaries').insert({
      adventure_id: id, title: formTitle, session_date: formDate, description: formDesc || null,
    });
    if (error) { toast.error(error.message); return; }
    toast.success('Sessão adicionada!');
    setSessionDialog(false); setFormTitle(''); setFormDesc(''); invalidateAll();
  };

  const handleAddLocation = async () => {
    if (!formTitle.trim()) return;
    if (editLocationId) {
      return handleUpdateLocation();
    }
    const { error } = await supabase.from('scenario_locations').insert({
      adventure_id: id, name: formTitle, description: formDesc || null,
    });
    if (error) { toast.error(error.message); return; }
    toast.success('Localidade adicionada!');
    setLocationDialog(false); setFormTitle(''); setFormDesc(''); invalidateAll();
  };

  const handleAddRumor = async () => {
    if (!formTitle.trim()) return;
    if (editRumorId) {
      return handleUpdateRumor();
    }
    const { error } = await supabase.from('rumors_sidequests').insert({
      adventure_id: id, title: formTitle, description: formDesc || null, quest_type: formType,
    });
    if (error) { toast.error(error.message); return; }
    toast.success('Adicionado!');
    setRumorDialog(false); setFormTitle(''); setFormDesc(''); invalidateAll();
  };

  const handleAddMap = async () => {
    if (!formTitle.trim()) return;
    if (!editMapId && !mapFile) return; // Precisa de arquivo ao criar novo
    
    if (editMapId) {
      // Se editando, atualizar apenas o nome (ou nome + imagem se tiver arquivo)
      const updateData: any = { name: formTitle };
      
      if (mapFile) {
        const filePath = `${id}/${Date.now()}_${mapFile.name}`;
        const { error: upErr } = await supabase.storage.from('adventure-maps').upload(filePath, mapFile);
        if (upErr) { toast.error(upErr.message); return; }
        const { data: urlData } = supabase.storage.from('adventure-maps').getPublicUrl(filePath);
        updateData.image_url = urlData.publicUrl;
      }
      
      const { error } = await supabase.from('adventure_maps').update(updateData).eq('id', editMapId);
      if (error) { toast.error(error.message); return; }
      toast.success('Mapa atualizado!');
    } else {
      // Criar novo (precisa de arquivo)
      const filePath = `${id}/${Date.now()}_${mapFile!.name}`;
      const { error: upErr } = await supabase.storage.from('adventure-maps').upload(filePath, mapFile!);
      if (upErr) { toast.error(upErr.message); return; }
      const { data: urlData } = supabase.storage.from('adventure-maps').getPublicUrl(filePath);
      
      const { error } = await supabase.from('adventure_maps').insert({
        adventure_id: id, name: formTitle, image_url: urlData.publicUrl,
      });
      if (error) { toast.error(error.message); return; }
      toast.success('Mapa adicionado!');
    }
    
    setMapDialog(false); setFormTitle(''); setMapFile(null); setEditMapId(null); invalidateAll();
  };

  const handleAddNote = async () => {
    if (!formTitle.trim()) return;
    if (editNoteId) {
      return handleUpdateNote();
    }
    const { error } = await supabase.from('dm_notes').insert({
      adventure_id: id, title: formTitle, content: formDesc || null,
    });
    if (error) { toast.error(error.message); return; }
    toast.success('Nota adicionada!');
    setNoteDialog(false); setFormTitle(''); setFormDesc(''); invalidateAll();
  };

  const handleAddMonster = async () => {
    try {
      const parsed = JSON.parse(monsterJson);
      const monsterData = parsed.monster || parsed;
      if (!monsterData.name) { toast.error('JSON inválido: campo "name" não encontrado'); return; }
      
      let imageUrl: string | null = null;
      if (monsterImageFile) {
        const filePath = `monsters/${id}/${Date.now()}_${monsterImageFile.name}`;
        const { error: upErr } = await supabase.storage.from('adventure-maps').upload(filePath, monsterImageFile);
        if (upErr) { toast.error(upErr.message); return; }
        const { data: urlData } = supabase.storage.from('adventure-maps').getPublicUrl(filePath);
        imageUrl = urlData.publicUrl;
      }

      const insertData: any = {
        adventure_id: id,
        name: monsterData.name,
        challenge_rating: monsterData.challenge_rating || '0',
        monster_data: imageUrl ? { ...monsterData, image_url: imageUrl } : monsterData,
      };

      if (editingMonsterId) {
        const { error } = await supabase.from('adventure_bestiary').update(insertData).eq('id', editingMonsterId);
        if (error) { toast.error(error.message); return; }
        toast.success(`${monsterData.name} atualizado!`);
      } else {
        const { error } = await supabase.from('adventure_bestiary').insert(insertData);
        if (error) { toast.error(error.message); return; }
        toast.success(`${monsterData.name} adicionado ao bestiário!`);
      }
      
      setBestiaryDialog(false);
      setMonsterJson('');
      setMonsterImageFile(null);
      setEditingMonsterId(null);
      
      // Refetch imediato para atualizar a UI
      await queryClient.refetchQueries({ queryKey: ['bestiary', id] });
    } catch {
      toast.error('JSON inválido. Verifique o formato.');
    }
  };

  const handleEditMonster = (monster: any) => {
    try {
      setEditingMonsterId(monster.id);
      setMonsterJson(JSON.stringify(monster.monster_data, null, 2));
      setBestiaryDialog(true);
    } catch {
      toast.error('Erro ao editar monstro');
    }
  };

  const handleEditSession = (sessionId: string, title: string, description: string, date: string) => {
    setEditSessionId(sessionId);
    setFormTitle(title);
    setFormDesc(description);
    setFormDate(date);
    setSessionDialog(true);
  };

  const handleUpdateSession = async () => {
    if (!editSessionId || !formTitle.trim()) return;
    const { error } = await supabase.from('session_summaries').update({
      title: formTitle, session_date: formDate, description: formDesc || null,
    }).eq('id', editSessionId);
    if (error) { toast.error(error.message); return; }
    toast.success('Sessão atualizada!');
    setSessionDialog(false);
    setEditSessionId(null);
    setFormTitle('');
    setFormDesc('');
    invalidateAll();
  };

  const handleEditLocation = (locationId: string, name: string, description: string) => {
    setEditLocationId(locationId);
    setFormTitle(name);
    setFormDesc(description);
    setLocationDialog(true);
  };

  const handleUpdateLocation = async () => {
    if (!editLocationId || !formTitle.trim()) return;
    const { error } = await supabase.from('scenario_locations').update({
      name: formTitle, description: formDesc || null,
    }).eq('id', editLocationId);
    if (error) { toast.error(error.message); return; }
    toast.success('Localidade atualizada!');
    setLocationDialog(false);
    setEditLocationId(null);
    setFormTitle('');
    setFormDesc('');
    invalidateAll();
  };

  const handleEditRumor = (rumorId: string, title: string, description: string, type: string) => {
    setEditRumorId(rumorId);
    setFormTitle(title);
    setFormDesc(description);
    setFormType(type);
    setRumorDialog(true);
  };

  const handleUpdateRumor = async () => {
    if (!editRumorId || !formTitle.trim()) return;
    const { error } = await supabase.from('rumors_sidequests').update({
      title: formTitle, description: formDesc || null, quest_type: formType,
    }).eq('id', editRumorId);
    if (error) { toast.error(error.message); return; }
    toast.success('Rumor/Quest atualizado!');
    setRumorDialog(false);
    setEditRumorId(null);
    setFormTitle('');
    setFormDesc('');
    invalidateAll();
  };

  const handleEditMap = (mapId: string, name: string) => {
    setEditMapId(mapId);
    setFormTitle(name);
    setMapDialog(true);
  };

  const handleEditNote = (noteId: string, title: string, content: string) => {
    setEditNoteId(noteId);
    setFormTitle(title);
    setFormDesc(content);
    setNoteDialog(true);
  };

  const handleUpdateNote = async () => {
    if (!editNoteId || !formTitle.trim()) return;
    const { error } = await supabase.from('dm_notes').update({
      title: formTitle, content: formDesc || null,
    }).eq('id', editNoteId);
    if (error) { toast.error(error.message); return; }
    toast.success('Nota atualizada!');
    setNoteDialog(false);
    setEditNoteId(null);
    setFormTitle('');
    setFormDesc('');
    invalidateAll();
  };

  const handleJsonFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setMonsterJson(ev.target?.result as string || '');
    };
    reader.readAsText(file);
  };

  const handleUpdateProgress = async () => {
    if (!id) return;
    const { error } = await supabase.from('adventures').update({ progress: progressValue }).eq('id', id);
    if (error) { toast.error(error.message); return; }
    toast.success('Progresso atualizado!');
    setProgressDialog(false); invalidateAll();
  };

  const handleDelete = async (table: string, itemId: string) => {
    const { error } = await supabase.from(table as any).delete().eq('id', itemId);
    if (error) { toast.error(error.message); return; }
    toast.success('Removido!');
    invalidateAll();
  };

  const SectionHeader = ({ title, icon: Icon, sectionKey, onAdd }: { title: string; icon: any; sectionKey: string; onAdd?: () => void }) => (
    <div
      className="flex items-center justify-between cursor-pointer p-3 rounded-lg hover:bg-secondary/50 transition-colors"
      onClick={() => toggle(sectionKey)}
    >
      <div className="flex items-center gap-2 text-primary font-cinzel text-lg">
        <Icon className="w-5 h-5" />
        {title}
      </div>
      <div className="flex items-center gap-2">
        {isOwner && onAdd && (
          <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); onAdd(); }} className="gap-1">
            <Plus className="w-4 h-4" />
          </Button>
        )}
        {expanded[sectionKey] ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </Button>
          <h1 className="text-xl font-cinzel text-primary">{adventure.title}</h1>
          <div className="w-20" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 flex-1 space-y-4 max-w-4xl">
        {/* Progress bar */}
        <Card className="parchment">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-cinzel text-primary">Progresso da Aventura</span>
              <span className="text-sm text-muted-foreground">{adventure.progress}%</span>
            </div>
            <Progress value={adventure.progress} className="h-3" />
            {isOwner && (
              <Button size="sm" variant="ghost" className="mt-2 text-xs" onClick={() => { setProgressValue(adventure.progress); setProgressDialog(true); }}>
                Atualizar Progresso
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Characters */}
        <Card className="parchment">
          <SectionHeader title="Personagens" icon={Users} sectionKey="characters" />
          <AnimatePresence>
            {expanded.characters && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <CardContent className="pt-0">
                  {characters.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4">Nenhum personagem vinculado ainda.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {characters.map((ac: any) => {
                        const c = ac.characters;
                        if (!c) return null;
                        const classes = Array.isArray(c.classes) ? c.classes : [];
                        return (
                          <Card
                            key={ac.id}
                            className="cursor-pointer hover:border-primary/50 transition-colors"
                            onClick={() => setSelectedCharId(c.id)}
                          >
                            <CardContent className="p-3 flex items-center gap-3">
                              {c.image_url ? (
                                <img src={c.image_url} alt={c.name} className="w-12 h-12 rounded-full object-cover border-2 border-primary" />
                              ) : (
                                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                                  <Sword className="w-6 h-6 text-primary" />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="font-cinzel font-semibold truncate">{c.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {c.race_name || 'Raça'} • {classes.map((cl: any) => `${cl.className} ${cl.level}`).join('/') || 'Classe'} • Nv {c.level}
                                </p>
                                {c.background_name && <p className="text-xs text-muted-foreground">{c.background_name}</p>}
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* Session summaries */}
        <Card className="parchment">
          <SectionHeader title="Resumo de Sessões" icon={ScrollText} sectionKey="sessions" onAdd={() => { setFormTitle(''); setFormDesc(''); setSessionDialog(true); }} />
          <AnimatePresence>
            {expanded.sessions && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <CardContent className="pt-0 space-y-2">
                  {sessions.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4">Nenhuma sessão registrada.</p>
                  ) : sessions.map((s, index) => (
                    <Card 
                      key={s.id} 
                      className="bg-secondary/30"
                    >
                      <CardContent className="p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold">{s.title}</p>
                            <p className="text-xs text-muted-foreground">{new Date(s.session_date).toLocaleDateString('pt-BR')}</p>
                            {s.description && <p className="text-sm mt-1">{s.description}</p>}
                          </div>
                          {isOwner && (
                            <div className="flex gap-1">
                              <Button size="icon" variant="ghost" onClick={() => handleEditSession(s.id, s.title, s.description || '', s.session_date)}>
                                <Pen className="w-4 h-4 text-primary" />
                              </Button>
                              <Button size="icon" variant="ghost" onClick={() => handleDelete('session_summaries', s.id)}>
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* Locations */}
        <Card className="parchment">
          <SectionHeader title="Informações de Cenário" icon={MapPin} sectionKey="locations" onAdd={() => { setFormTitle(''); setFormDesc(''); setLocationDialog(true); }} />
          <AnimatePresence>
            {expanded.locations && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <CardContent className="pt-0 space-y-2">
                  {locations.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4">Nenhuma localidade cadastrada.</p>
                  ) : locations.map((l, index) => (
                    <Card 
                      key={l.id} 
                      className="bg-secondary/30"
                    >
                      <CardContent className="p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold flex items-center gap-1"><MapPin className="w-4 h-4 text-primary" />{l.name}</p>
                            {l.description && <p className="text-sm mt-1">{l.description}</p>}
                          </div>
                          {isOwner && (
                            <div className="flex gap-1">
                              <Button size="icon" variant="ghost" onClick={() => handleEditLocation(l.id, l.name, l.description || '')}>
                                <Pen className="w-4 h-4 text-primary" />
                              </Button>
                              <Button size="icon" variant="ghost" onClick={() => handleDelete('scenario_locations', l.id)}>
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* Rumors */}
        <Card className="parchment">
          <SectionHeader title="Rumores e Aventuras Paralelas" icon={Compass} sectionKey="rumors" onAdd={() => { setFormTitle(''); setFormDesc(''); setFormType('rumor'); setRumorDialog(true); }} />
          <AnimatePresence>
            {expanded.rumors && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <CardContent className="pt-0 space-y-2">
                  {rumors.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4">Nenhum rumor cadastrado.</p>
                  ) : rumors.map((r, index) => (
                    <Card 
                      key={r.id} 
                      className="bg-secondary/30"
                    >
                      <CardContent className="p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold">{r.title}</p>
                              <Badge variant="secondary" className="text-xs">{r.quest_type === 'rumor' ? 'Rumor' : 'Sidequest'}</Badge>
                            </div>
                            {r.description && <p className="text-sm mt-1">{r.description}</p>}
                          </div>
                          {isOwner && (
                            <div className="flex gap-1">
                              <Button size="icon" variant="ghost" onClick={() => handleEditRumor(r.id, r.title, r.description || '', r.quest_type)}>
                                <Pen className="w-4 h-4 text-primary" />
                              </Button>
                              <Button size="icon" variant="ghost" onClick={() => handleDelete('rumors_sidequests', r.id)}>
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* Bestiary */}
        {isOwner && (
          <Card className="parchment">
            <SectionHeader title="Bestiário da Aventura" icon={Skull} sectionKey="bestiary" onAdd={() => { setMonsterJson(''); setMonsterImageFile(null); setEditingMonsterId(null); setBestiaryDialog(true); }} />
            <AnimatePresence>
              {expanded.bestiary && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <CardContent className="pt-0 space-y-2">
                    {bestiary.length === 0 ? (
                      <p className="text-sm text-muted-foreground py-4">Nenhum monstro/NPC cadastrado.</p>
                    ) : bestiary.map((b, index) => (
                      <Card 
                        key={b.id} 
                        className="bg-secondary/30"
                      >
                        <CardContent className="p-0">
                          <div
                            className="flex items-center justify-between p-3 cursor-pointer hover:bg-secondary/50 transition-colors"
                            onClick={() => toggleMonster(b.id)}
                          >
                            <div className="flex items-center gap-2">
                              {b.monster_data.image_url ? (
                                <img
                                  src={b.monster_data.image_url}
                                  alt={b.name}
                                  className="w-8 h-8 rounded-full object-cover border-2 border-primary flex-shrink-0"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setViewImageUrl(b.monster_data.image_url);
                                    setImageViewerDialog(true);
                                  }}
                                />
                              ) : (
                                <Skull className="w-4 h-4 text-primary" />
                              )}
                              <span className="font-semibold">{b.name}</span>
                              <Badge variant="outline" className="border-primary text-primary text-xs">CR {b.challenge_rating}</Badge>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button size="icon" variant="ghost" onClick={(e) => { e.stopPropagation(); handleEditMonster(b); }}>
                                <Pen className="w-4 h-4 text-primary" />
                              </Button>
                              <Button size="icon" variant="ghost" onClick={(e) => { e.stopPropagation(); handleDelete('adventure_bestiary', b.id); }}>
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                              {expandedMonsters[b.id] ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                            </div>
                          </div>
                          <AnimatePresence>
                            {expandedMonsters[b.id] && (
                              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                <div className="px-3 pb-3">
                                  <MonsterStatBlock data={b.monster_data} onImageClick={() => {
                                    if (b.monster_data.image_url) {
                                      setViewImageUrl(b.monster_data.image_url);
                                      setImageViewerDialog(true);
                                    }
                                  }} />
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
          </Card>
        )}

        {/* Maps */}
        <Card className="parchment">
          <SectionHeader title="Mapas" icon={Map} sectionKey="maps" onAdd={() => { setFormTitle(''); setMapFile(null); setMapDialog(true); }} />
          <AnimatePresence>
            {expanded.maps && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <CardContent className="pt-0 space-y-2">
                  {maps.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4">Nenhum mapa carregado.</p>
                  ) : maps.map((m, index) => (
                    <Card 
                      key={m.id} 
                      className="bg-secondary/30"
                    >
                      <CardContent className="p-3">
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-semibold">{m.name}</p>
                          {isOwner && (
                            <div className="flex gap-1">
                              <Button size="icon" variant="ghost" onClick={() => handleEditMap(m.id, m.name)}>
                                <Pen className="w-4 h-4 text-primary" />
                              </Button>
                              <Button size="icon" variant="ghost" onClick={() => handleDelete('adventure_maps', m.id)}>
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                          )}
                        </div>
                        <img src={m.image_url} alt={m.name} className="w-full rounded-lg border border-border max-h-96 object-contain" />
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* DM Notes - only for owner, with collapsible individual notes */}
        {isOwner && (
          <Card className="parchment border-primary/30">
            <SectionHeader title="Notas do Mestre" icon={BookLock} sectionKey="dmNotes" onAdd={() => { setFormTitle(''); setFormDesc(''); setNoteDialog(true); }} />
            <AnimatePresence>
              {expanded.dmNotes && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <CardContent className="pt-0 space-y-2">
                    {dmNotes.length === 0 ? (
                      <p className="text-sm text-muted-foreground py-4">Nenhuma nota do mestre.</p>
                    ) : dmNotes.map((n, index) => (
                      <Card 
                        key={n.id} 
                        className="bg-secondary/30 border-primary/20"
                      >
                        <CardContent className="p-0">
                          <div
                            className="flex items-center justify-between p-3 cursor-pointer hover:bg-secondary/50 transition-colors"
                            onClick={() => toggleNote(n.id)}
                          >
                            <div className="flex items-center gap-2">
                              <BookLock className="w-4 h-4 text-primary" />
                              <span className="font-semibold">{n.title}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button size="icon" variant="ghost" onClick={(e) => { e.stopPropagation(); handleEditNote(n.id, n.title, n.content || ''); }}>
                                <Pen className="w-4 h-4 text-primary" />
                              </Button>
                              <Button size="icon" variant="ghost" onClick={(e) => { e.stopPropagation(); handleDelete('dm_notes', n.id); }}>
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                              {expandedNotes[n.id] ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                            </div>
                          </div>
                          <AnimatePresence>
                            {expandedNotes[n.id] && n.content && (
                              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                <div className="px-3 pb-3">
                                  <p className="text-sm whitespace-pre-wrap">{n.content}</p>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </CardContent>
                      </Card>
                    ))}
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        )}
      </main>

      {/* Dialogs */}
      {/* Session dialog */}
      <Dialog open={sessionDialog} onOpenChange={(open) => {
        setSessionDialog(open);
        if (!open) {
          setEditSessionId(null);
          setFormTitle('');
          setFormDesc('');
          setFormDate(new Date().toISOString().split('T')[0]);
        }
      }}>
        <DialogContent className="parchment">
          <DialogHeader><DialogTitle className="font-cinzel">{editSessionId ? 'Editar' : 'Nova'} Sessão</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Título da sessão" value={formTitle} onChange={e => setFormTitle(e.target.value)} />
            <Input type="date" value={formDate} onChange={e => setFormDate(e.target.value)} />
            <Textarea placeholder="Descrição..." value={formDesc} onChange={e => setFormDesc(e.target.value)} rows={4} />
          </div>
          <DialogFooter>
            <Button onClick={handleAddSession} className="btn-d20">{editSessionId ? 'Atualizar' : 'Adicionar'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Location dialog */}
      <Dialog open={locationDialog} onOpenChange={(open) => {
        setLocationDialog(open);
        if (!open) {
          setEditLocationId(null);
          setFormTitle('');
          setFormDesc('');
        }
      }}>
        <DialogContent className="parchment">
          <DialogHeader><DialogTitle className="font-cinzel">{editLocationId ? 'Editar' : 'Nova'} Localidade</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Nome da localidade" value={formTitle} onChange={e => setFormTitle(e.target.value)} />
            <Textarea placeholder="Descrição..." value={formDesc} onChange={e => setFormDesc(e.target.value)} rows={4} />
          </div>
          <DialogFooter>
            <Button onClick={handleAddLocation} className="btn-d20">{editLocationId ? 'Atualizar' : 'Adicionar'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rumor dialog */}
      <Dialog open={rumorDialog} onOpenChange={(open) => {
        setRumorDialog(open);
        if (!open) {
          setEditRumorId(null);
          setFormTitle('');
          setFormDesc('');
          setFormType('rumor');
        }
      }}>
        <DialogContent className="parchment">
          <DialogHeader><DialogTitle className="font-cinzel">{editRumorId ? 'Editar' : 'Novo'} Rumor / Sidequest</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Título" value={formTitle} onChange={e => setFormTitle(e.target.value)} />
            <div className="flex gap-2">
              <Button variant={formType === 'rumor' ? 'default' : 'outline'} size="sm" onClick={() => setFormType('rumor')}>Rumor</Button>
              <Button variant={formType === 'sidequest' ? 'default' : 'outline'} size="sm" onClick={() => setFormType('sidequest')}>Sidequest</Button>
            </div>
            <Textarea placeholder="Descrição..." value={formDesc} onChange={e => setFormDesc(e.target.value)} rows={4} />
          </div>
          <DialogFooter>
            <Button onClick={handleAddRumor} className="btn-d20">{editRumorId ? 'Atualizar' : 'Adicionar'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Map dialog */}
      <Dialog open={mapDialog} onOpenChange={(open) => {
        setMapDialog(open);
        if (!open) {
          setEditMapId(null);
          setFormTitle('');
          setMapFile(null);
        }
      }}>
        <DialogContent className="parchment">
          <DialogHeader><DialogTitle className="font-cinzel">{editMapId ? 'Editar' : 'Nova'} Mapa</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Nome do mapa" value={formTitle} onChange={e => setFormTitle(e.target.value)} />
            {!editMapId && <p className="text-sm text-muted-foreground">Selecione a imagem do mapa</p>}
            {editMapId && <p className="text-sm text-muted-foreground">Opcionalmente, escolha uma nova imagem para o mapa</p>}
            <div
              className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {mapFile ? (
                <p className="text-sm">{mapFile.name}</p>
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Upload className="w-8 h-8" />
                  <p className="text-sm">Clique para selecionar imagem</p>
                </div>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={e => setMapFile(e.target.files?.[0] || null)} />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddMap} className="btn-d20" disabled={!formTitle.trim() || (!mapFile && !editMapId)}>{editMapId ? 'Atualizar' : 'Carregar'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DM Note dialog */}
      <Dialog open={noteDialog} onOpenChange={(open) => {
        setNoteDialog(open);
        if (!open) {
          setEditNoteId(null);
          setFormTitle('');
          setFormDesc('');
        }
      }}>
        <DialogContent className="parchment">
          <DialogHeader><DialogTitle className="font-cinzel">{editNoteId ? 'Editar' : 'Nova'} Nota do Mestre</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Título" value={formTitle} onChange={e => setFormTitle(e.target.value)} />
            <Textarea placeholder="Conteúdo..." value={formDesc} onChange={e => setFormDesc(e.target.value)} rows={6} />
          </div>
          <DialogFooter>
            <Button onClick={handleAddNote} className="btn-d20">{editNoteId ? 'Atualizar' : 'Adicionar'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bestiary dialog */}
      <Dialog open={bestiaryDialog} onOpenChange={(open) => {
        setBestiaryDialog(open);
        if (!open) {
          setMonsterJson('');
          setMonsterImageFile(null);
          setEditingMonsterId(null);
        }
      }}>
        <DialogContent className="parchment max-w-2xl">
          <DialogHeader><DialogTitle className="font-cinzel">{editingMonsterId ? 'Editar' : 'Adicionar'} Monstro / NPC</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Cole o JSON do monstro ou faça upload de um arquivo .json</p>
            <div
              className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => jsonFileInputRef.current?.click()}
            >
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Upload className="w-6 h-6" />
                <p className="text-sm">Upload arquivo .json</p>
              </div>
              <input ref={jsonFileInputRef} type="file" accept=".json,application/json" className="hidden" onChange={handleJsonFileUpload} />
            </div>
            {editingMonsterId && (
              <>
                <p className="text-sm text-muted-foreground">Ou carregue uma nova imagem para o monstro:</p>
                <div
                  className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => monsterImageInputRef.current?.click()}
                >
                  {monsterImageFile ? (
                    <p className="text-sm">{monsterImageFile.name}</p>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Upload className="w-6 h-6" />
                      <p className="text-sm">Clique para selecionar imagem</p>
                    </div>
                  )}
                  <input ref={monsterImageInputRef} type="file" accept="image/*" className="hidden" onChange={e => setMonsterImageFile(e.target.files?.[0] || null)} />
                </div>
              </>
            )}
            {!editingMonsterId && (
              <>
                <p className="text-sm text-muted-foreground">Opcionalmente, carregue uma imagem avatar para o monstro:</p>
                <div
                  className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => monsterImageInputRef.current?.click()}
                >
                  {monsterImageFile ? (
                    <p className="text-sm">{monsterImageFile.name}</p>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Upload className="w-6 h-6" />
                      <p className="text-sm">Clique para selecionar imagem</p>
                    </div>
                  )}
                  <input ref={monsterImageInputRef} type="file" accept="image/*" className="hidden" onChange={e => setMonsterImageFile(e.target.files?.[0] || null)} />
                </div>
              </>
            )}
            <Textarea
              placeholder='{"monster": {"name": "...", ...}}'
              value={monsterJson}
              onChange={e => setMonsterJson(e.target.value)}
              rows={12}
              className="font-mono text-xs"
            />
          </div>
          <DialogFooter>
            <Button onClick={handleAddMonster} className="btn-d20" disabled={!monsterJson.trim()}>{editingMonsterId ? 'Atualizar' : 'Adicionar'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image viewer dialog */}
      <Dialog open={imageViewerDialog} onOpenChange={setImageViewerDialog}>
        <DialogContent className="parchment max-w-2xl">
          <DialogHeader><DialogTitle className="font-cinzel">Visualizar Imagem</DialogTitle></DialogHeader>
          {viewImageUrl && (
            <div className="flex justify-center">
              <img src={viewImageUrl} alt="Monster" className="max-w-full max-h-96 rounded-lg border border-primary" />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Progress dialog */}
      <Dialog open={progressDialog} onOpenChange={setProgressDialog}>
        <DialogContent className="parchment">
          <DialogHeader><DialogTitle className="font-cinzel">Progresso da Aventura</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Progresso</span>
              <span className="text-sm font-semibold">{progressValue}%</span>
            </div>
            <Slider value={[progressValue]} onValueChange={v => setProgressValue(v[0])} max={100} step={5} />
          </div>
          <DialogFooter>
            <Button onClick={handleUpdateProgress} className="btn-d20">Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
