import { useState } from 'react';
import { useAllAdventures, useLinkCharacter } from '@/hooks/useAdventures';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Lock, Sword } from 'lucide-react';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  characterId: string;
}

export function LinkAdventureDialog({ open, onOpenChange, characterId }: Props) {
  const { data: adventures = [] } = useAllAdventures();
  const linkCharacter = useLinkCharacter();
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const filtered = adventures.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleConfirm = () => {
    if (!selectedId) return;
    const adv = adventures.find(a => a.id === selectedId);
    if (!adv) return;

    if (adv.password_hash !== password) {
      setError('Senha incorreta');
      return;
    }

    linkCharacter.mutate(
      { adventureId: selectedId, characterId },
      {
        onSuccess: () => {
          onOpenChange(false);
          setSelectedId(null);
          setPassword('');
          setError('');
          setSearch('');
        },
      }
    );
  };

  const handleBack = () => {
    setSelectedId(null);
    setPassword('');
    setError('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="parchment max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-cinzel">
            {selectedId ? 'Senha da Aventura' : 'Vincular a uma Aventura'}
          </DialogTitle>
        </DialogHeader>

        {!selectedId ? (
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar aventura..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {filtered.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">Nenhuma aventura encontrada</p>
              ) : filtered.map(adv => (
                <Card
                  key={adv.id}
                  className="cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => setSelectedId(adv.id)}
                >
                  <CardContent className="p-3 flex items-center gap-3">
                    <Sword className="w-5 h-5 text-primary" />
                    <span className="font-semibold">{adv.title}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Lock className="w-4 h-4" />
              <span className="text-sm">Digite a senha da aventura para vincular seu personagem</span>
            </div>
            <Input
              type="password"
              placeholder="Senha da aventura"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(''); }}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={handleBack}>Voltar</Button>
              <Button onClick={handleConfirm} className="btn-d20">Confirmar</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
