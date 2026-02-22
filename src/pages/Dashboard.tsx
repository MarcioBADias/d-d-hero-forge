import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCharacters } from '@/hooks/useCharacters';
import { useAdventures } from '@/hooks/useAdventures';
import { useCharacterAdventures } from '@/hooks/useAdventures';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExportDropdown } from '@/components/character/ExportDropdown';
import { Footer } from '@/components/layout/Footer';
import { CreateAdventureDialog } from '@/components/adventure/CreateAdventureDialog';
import { LinkAdventureDialog } from '@/components/adventure/LinkAdventureDialog';
import { 
  Plus, Trash2, Edit, Globe, Lock, LogOut, User, Sword,
  Scroll, Copy, BookOpen, Sparkles, Map, Link2
} from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Character } from '@/types/character';

function CharacterAdventureBadges({ characterId }: { characterId: string }) {
  const { data: links = [] } = useCharacterAdventures(characterId);
  if (links.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {links.map((l: any) => (
        <Badge key={l.id} variant="outline" className="text-xs border-primary/30 text-primary">
          <Map className="w-3 h-3 mr-1" />
          {l.adventures?.title || 'Aventura'}
        </Badge>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { characters, isLoading, deleteCharacter, togglePublic } = useCharacters();
  const { adventures, isLoading: advLoading, deleteAdventure } = useAdventures();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteAdvId, setDeleteAdvId] = useState<string | null>(null);
  const [createAdvOpen, setCreateAdvOpen] = useState(false);
  const [linkCharId, setLinkCharId] = useState<string | null>(null);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleShare = (id: string) => {
    const url = `${window.location.origin}/character/${id}`;
    navigator.clipboard.writeText(url);
    toast.success('Link copiado para a área de transferência!');
  };

  const getClassDisplay = (classes: { className: string; level: number }[]) => {
    if (!classes || classes.length === 0) return 'Sem classe';
    return classes.map(c => `${c.className} ${c.level}`).join(' / ');
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 
            className="text-xl md:text-2xl font-cinzel text-primary cursor-pointer hover:text-primary/80 transition-colors"
            onClick={() => navigate('/')}
          >
            ⚔️ D&D 5e Creator
          </h1>
          
          <div className="flex items-center gap-2 md:gap-4">
            <Button variant="ghost" onClick={() => navigate('/compendium')} className="hidden sm:flex gap-2">
              <BookOpen className="w-4 h-4" /> Compêndio
            </Button>
            <div className="hidden md:flex items-center gap-2 text-muted-foreground">
              <User className="w-4 h-4" />
              <span className="text-sm">{user?.email}</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 md:mr-2" />
              <span className="hidden md:inline">Sair</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex-1 space-y-8">
        {/* Characters Section */}
        <section>
          <motion.div className="flex items-center justify-between mb-6" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-2xl font-cinzel text-primary flex items-center gap-2">
              <Scroll className="w-6 h-6" /> Meus Personagens
            </h2>
            <Button onClick={() => navigate('/create')} className="btn-d20 gap-2">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Novo Personagem</span>
            </Button>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <Card key={i} className="parchment animate-pulse">
                  <CardHeader className="h-20 bg-muted/20" />
                  <CardContent className="h-32" />
                </Card>
              ))}
            </div>
          ) : characters.length === 0 ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <Card className="parchment text-center py-12">
                <Sword className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-cinzel text-primary mb-2">Nenhum personagem ainda</h3>
                <p className="text-muted-foreground mb-4">Crie seu primeiro aventureiro!</p>
                <Button onClick={() => navigate('/create')} className="btn-d20"><Plus className="w-4 h-4 mr-2" /> Criar Personagem</Button>
              </Card>
            </motion.div>
          ) : (
            <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
              <AnimatePresence mode="popLayout">
                {characters.map(char => (
                  <motion.div key={char.id} variants={cardVariants} layout whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 300 }}>
                    <Card className="parchment hover:shadow-lg hover:border-primary/30 transition-all overflow-hidden group cursor-pointer" onClick={() => navigate(`/character/${char.id}`)}>
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-arcane/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                      <CardHeader className="pb-2 relative">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <motion.div whileHover={{ scale: 1.1 }} className="relative">
                              {char.imageUrl ? (
                                <img src={char.imageUrl} alt={char.name} className="w-12 h-12 rounded-full object-cover border-2 border-primary" />
                              ) : (
                                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                                  <Sword className="w-6 h-6 text-primary" />
                                </div>
                              )}
                              <Sparkles className="w-4 h-4 absolute -bottom-1 -right-1 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                            </motion.div>
                            <div>
                              <CardTitle className="font-cinzel text-lg">{char.name}</CardTitle>
                              <p className="text-sm text-muted-foreground">Nível {char.level} • {char.raceName || 'Raça'}</p>
                              <CharacterAdventureBadges characterId={char.id} />
                            </div>
                          </div>
                          <Badge variant={char.isPublic ? 'default' : 'secondary'}>
                            {char.isPublic ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3 relative">
                        <div className="text-sm">
                          <span className="text-muted-foreground">Classe: </span>
                          <span className="font-medium">{getClassDisplay(char.classes)}</span>
                        </div>
                        {char.backgroundName && (
                          <div className="text-sm">
                            <span className="text-muted-foreground">Background: </span>
                            <span className="font-medium">{char.backgroundName}</span>
                          </div>
                        )}
                        <div className="flex flex-wrap gap-2 pt-2">
                          <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/edit/${char.id}`); }} className="gap-1">
                            <Edit className="w-3 h-3" /> Editar
                          </Button>
                          <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); setLinkCharId(char.id); }} className="gap-1">
                            <Link2 className="w-3 h-3" /> Aventura
                          </Button>
                          <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); togglePublic.mutate({ id: char.id, isPublic: !char.isPublic }); }}>
                            {char.isPublic ? <><Lock className="w-3 h-3 mr-1" />Privar</> : <><Globe className="w-3 h-3 mr-1" />Publicar</>}
                          </Button>
                          {char.isPublic && (
                            <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); handleShare(char.id); }}>
                              <Copy className="w-3 h-3 mr-1" /> Link
                            </Button>
                          )}
                          <div onClick={e => e.stopPropagation()}>
                            <ExportDropdown character={char as Character} variant="icon" />
                          </div>
                          <Button variant="destructive" size="sm" onClick={(e) => { e.stopPropagation(); setDeleteId(char.id); }}>
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </section>

        {/* Adventures Section */}
        <section>
          <motion.div className="flex items-center justify-between mb-6" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h2 className="text-2xl font-cinzel text-primary flex items-center gap-2">
              <Map className="w-6 h-6" /> Minhas Aventuras
            </h2>
            <Button onClick={() => setCreateAdvOpen(true)} className="btn-d20 gap-2">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Nova Aventura</span>
            </Button>
          </motion.div>

          {advLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2].map(i => (
                <Card key={i} className="parchment animate-pulse">
                  <CardHeader className="h-16 bg-muted/20" />
                  <CardContent className="h-20" />
                </Card>
              ))}
            </div>
          ) : adventures.length === 0 ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <Card className="parchment text-center py-12">
                <Map className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-cinzel text-primary mb-2">Nenhuma aventura ainda</h3>
                <p className="text-muted-foreground mb-4">Crie sua primeira aventura como Mestre!</p>
                <Button onClick={() => setCreateAdvOpen(true)} className="btn-d20"><Plus className="w-4 h-4 mr-2" /> Criar Aventura</Button>
              </Card>
            </motion.div>
          ) : (
            <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
              {adventures.map(adv => {
                const isAdvOwner = adv.user_id === user?.id;
                return (
                <motion.div key={adv.id} variants={cardVariants} layout whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 300 }}>
                  <Card className="parchment hover:shadow-lg hover:border-primary/30 transition-all cursor-pointer group" onClick={() => navigate(`/adventure/${adv.id}`)}>
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-arcane/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    <CardHeader className="pb-2 relative">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                          <Map className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="font-cinzel text-lg">{adv.title}</CardTitle>
                          <p className="text-xs text-muted-foreground">
                            {isAdvOwner ? 'Mestre' : 'Participante'} • Progresso: {adv.progress}%
                          </p>
                        </div>
                        {!isAdvOwner && (
                          <Badge variant="outline" className="text-xs">Jogador</Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="relative">
                      <div className="w-full bg-secondary rounded-full h-2 mb-3">
                        <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${adv.progress}%` }} />
                      </div>
                      {isAdvOwner && (
                        <div className="flex gap-2">
                          <Button variant="destructive" size="sm" onClick={(e) => { e.stopPropagation(); setDeleteAdvId(adv.id); }}>
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )})}
            </motion.div>
          )}
        </section>
      </main>

      {/* Delete character dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="parchment">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-cinzel">Deletar Personagem?</AlertDialogTitle>
            <AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => { if (deleteId) { deleteCharacter.mutate(deleteId); setDeleteId(null); } }}>
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete adventure dialog */}
      <AlertDialog open={!!deleteAdvId} onOpenChange={() => setDeleteAdvId(null)}>
        <AlertDialogContent className="parchment">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-cinzel">Deletar Aventura?</AlertDialogTitle>
            <AlertDialogDescription>Todos os dados da aventura serão removidos permanentemente.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => { if (deleteAdvId) { deleteAdventure.mutate(deleteAdvId); setDeleteAdvId(null); } }}>
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Create adventure dialog */}
      <CreateAdventureDialog open={createAdvOpen} onOpenChange={setCreateAdvOpen} />

      {/* Link character to adventure dialog */}
      {linkCharId && (
        <LinkAdventureDialog open={!!linkCharId} onOpenChange={(o) => { if (!o) setLinkCharId(null); }} characterId={linkCharId} />
      )}

      <Footer />
    </div>
  );
}
