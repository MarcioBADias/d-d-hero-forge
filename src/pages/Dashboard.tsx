import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCharacters } from '@/hooks/useCharacters';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExportDropdown } from '@/components/character/ExportDropdown';
import { Footer } from '@/components/layout/Footer';
import { 
  Plus, 
  Trash2, 
  Edit, 
  Globe, 
  Lock, 
  LogOut, 
  User, 
  Sword,
  Scroll,
  Copy,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Character } from '@/types/character';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { characters, isLoading, deleteCharacter, togglePublic } = useCharacters();
  const [deleteId, setDeleteId] = useState<string | null>(null);

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
            <Button 
              variant="ghost" 
              onClick={() => navigate('/compendium')}
              className="hidden sm:flex gap-2"
            >
              <BookOpen className="w-4 h-4" />
              Compêndio
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

      <main className="container mx-auto px-4 py-8 flex-1">
        <motion.div 
          className="flex items-center justify-between mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-2xl font-cinzel text-primary flex items-center gap-2">
            <Scroll className="w-6 h-6" />
            Meus Personagens
          </h2>
          <Button onClick={() => navigate('/create')} className="btn-d20 gap-2">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Novo Personagem</span>
          </Button>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="parchment animate-pulse">
                <CardHeader className="h-20 bg-muted/20" />
                <CardContent className="h-32" />
              </Card>
            ))}
          </div>
        ) : characters.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="parchment text-center py-12">
              <Sword className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-cinzel text-primary mb-2">Nenhum personagem ainda</h3>
              <p className="text-muted-foreground mb-4">
                Crie seu primeiro aventureiro para começar a jornada!
              </p>
              <Button onClick={() => navigate('/create')} className="btn-d20">
                <Plus className="w-4 h-4 mr-2" />
                Criar Personagem
              </Button>
            </Card>
          </motion.div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
          >
            <AnimatePresence mode="popLayout">
              {characters.map((char) => (
                <motion.div
                  key={char.id}
                  variants={cardVariants}
                  layout
                  whileHover={{ y: -4 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Card 
                    className="parchment hover:shadow-lg hover:border-primary/30 transition-all overflow-hidden group cursor-pointer"
                    onClick={() => navigate(`/character/${char.id}`)}
                  >
                    {/* Glow effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-arcane/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    
                    <CardHeader className="pb-2 relative">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            className="relative"
                          >
                            {char.imageUrl ? (
                              <img 
                                src={char.imageUrl} 
                                alt={char.name}
                                className="w-12 h-12 rounded-full object-cover border-2 border-primary"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                                <Sword className="w-6 h-6 text-primary" />
                              </div>
                            )}
                            <Sparkles className="w-4 h-4 absolute -bottom-1 -right-1 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                          </motion.div>
                          <div>
                            <CardTitle className="font-cinzel text-lg">{char.name}</CardTitle>
                            <p className="text-sm text-muted-foreground">
                              Nível {char.level} • {char.raceName || 'Raça'}
                            </p>
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
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/edit/${char.id}`)}
                          className="gap-1"
                        >
                          <Edit className="w-3 h-3" />
                          Editar
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => togglePublic.mutate({ id: char.id, isPublic: !char.isPublic })}
                        >
                          {char.isPublic ? (
                            <>
                              <Lock className="w-3 h-3 mr-1" />
                              Privar
                            </>
                          ) : (
                            <>
                              <Globe className="w-3 h-3 mr-1" />
                              Publicar
                            </>
                          )}
                        </Button>
                        {char.isPublic && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleShare(char.id)}
                          >
                            <Copy className="w-3 h-3 mr-1" />
                            Link
                          </Button>
                        )}
                        <ExportDropdown character={char as Character} variant="icon" />
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => setDeleteId(char.id)}
                        >
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
      </main>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="parchment">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-cinzel">Deletar Personagem?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O personagem será permanentemente removido.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (deleteId) {
                  deleteCharacter.mutate(deleteId);
                  setDeleteId(null);
                }
              }}
            >
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Footer />
    </div>
  );
}
