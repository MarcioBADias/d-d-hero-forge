import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { usePublicCharacter, useCharacters } from '@/hooks/useCharacters';
import { useAuth } from '@/contexts/AuthContext';
import { CharacterSheet } from '@/components/character/sheet/CharacterSheet';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Character } from '@/types/character';

export default function CharacterView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: publicCharacter, isLoading: publicLoading, error: publicError } = usePublicCharacter(id || '');
  const { characters: userCharacters, isLoading: userLoading, saveCharacter } = useCharacters();
  const [isSaving, setIsSaving] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);

  // Tenta achar o personagem na lista do usuário (permite edição)
  const userCharacter = user && userCharacters ? userCharacters.find(c => c.id === id) : null;
  
  // Usa o personagem do usuário se existir, senão usa o público
  const character = editingCharacter || userCharacter || publicCharacter;
  const isOwnCharacter = !!userCharacter;
  const isLoading = userLoading || publicLoading;
  const error = publicError;

  const handleUpdateCharacter = (updates: Partial<Character>) => {
    if (!character) return;
    setEditingCharacter(prev => {
      // Acumula mudanças corretamente
      if (!prev) {
        return { ...character, ...updates };
      }
      return { ...prev, ...updates };
    });
  };

  const handleSaveChanges = async (changes: Partial<Character>) => {
    if (!character) return;
    
    setIsSaving(true);
    try {
      // Salva o personagem com as mudanças
      await saveCharacter.mutateAsync({
        ...character,
        ...changes,
      });
      
      // Aguarda a refetch das queries completar para garantir que os dados são atualizados
      // A mutação já invalida a query no onSuccess, mas aguardamos para garantir
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setEditingCharacter(null);
      toast.success('Personagem atualizado com sucesso!');
    } catch (error) {
      console.error('Error saving:', error);
      toast.error('Erro ao salvar personagem');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !character) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-cinzel text-primary">Personagem não encontrado</h1>
        <p className="text-muted-foreground">O personagem pode ser privado ou não existir.</p>
        <Button onClick={() => navigate('/')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar ao Início
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-4">
        <Button variant="outline" onClick={() => navigate('/')} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
      </div>
      <CharacterSheet 
        character={character} 
        onEdit={() => navigate(`/edit/${character.id}`)}
        onUpdateCharacter={isOwnCharacter ? handleUpdateCharacter : () => {}}
        onSaveChanges={isOwnCharacter ? handleSaveChanges : undefined}
        readOnly={!isOwnCharacter}
      />
    </div>
  );
}
