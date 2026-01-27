import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCharacters } from '@/hooks/useCharacters';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Trash2, 
  Edit, 
  Share2, 
  Globe, 
  Lock, 
  LogOut, 
  User, 
  Sword,
  Scroll,
  Copy
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 
            className="text-xl md:text-2xl font-cinzel text-primary cursor-pointer"
            onClick={() => navigate('/')}
          >
            ⚔️ D&D 5e Creator
          </h1>
          
          <div className="flex items-center gap-2 md:gap-4">
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

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-cinzel text-primary flex items-center gap-2">
            <Scroll className="w-6 h-6" />
            Meus Personagens
          </h2>
          <Button onClick={() => navigate('/create')} className="btn-d20">
            <Plus className="w-4 h-4 mr-2" />
            Novo Personagem
          </Button>
        </div>

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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {characters.map((char) => (
              <Card key={char.id} className="parchment hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
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
                <CardContent className="space-y-3">
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
                    >
                      <Edit className="w-3 h-3 mr-1" />
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
                        Copiar Link
                      </Button>
                    )}
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
            ))}
          </div>
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
    </div>
  );
}
