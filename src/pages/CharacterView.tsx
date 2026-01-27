import { useParams, useNavigate } from 'react-router-dom';
import { usePublicCharacter } from '@/hooks/useCharacters';
import { CharacterSheet } from '@/components/character/sheet/CharacterSheet';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function CharacterView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: character, isLoading, error } = usePublicCharacter(id || '');

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
        onEdit={() => {}} 
        onUpdateCharacter={() => {}}
        readOnly
      />
    </div>
  );
}
