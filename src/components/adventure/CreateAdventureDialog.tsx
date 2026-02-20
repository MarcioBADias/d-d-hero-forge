import { useState } from 'react';
import { useAdventures } from '@/hooks/useAdventures';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateAdventureDialog({ open, onOpenChange }: Props) {
  const { createAdventure } = useAdventures();
  const [title, setTitle] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleCreate = () => {
    if (!title.trim()) { setError('Título é obrigatório'); return; }
    if (!password.trim()) { setError('Senha é obrigatória'); return; }
    if (password !== confirmPassword) { setError('Senhas não coincidem'); return; }
    
    createAdventure.mutate(
      { title: title.trim(), password },
      {
        onSuccess: () => {
          onOpenChange(false);
          setTitle('');
          setPassword('');
          setConfirmPassword('');
          setError('');
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="parchment">
        <DialogHeader>
          <DialogTitle className="font-cinzel">Criar Nova Aventura</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Título da Aventura</Label>
            <Input placeholder="Ex: A Maldição de Strahd" value={title} onChange={e => { setTitle(e.target.value); setError(''); }} />
          </div>
          <div className="space-y-2">
            <Label>Senha</Label>
            <Input type="password" placeholder="Senha para jogadores entrarem" value={password} onChange={e => { setPassword(e.target.value); setError(''); }} />
          </div>
          <div className="space-y-2">
            <Label>Confirmar Senha</Label>
            <Input type="password" placeholder="Confirme a senha" value={confirmPassword} onChange={e => { setConfirmPassword(e.target.value); setError(''); }} />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleCreate} className="btn-d20">Criar Aventura</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
