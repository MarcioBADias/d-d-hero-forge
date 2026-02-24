import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, RotateCcw, X } from 'lucide-react';
import { AbilityTracker } from '@/types/character';
import { cn } from '@/lib/utils';

interface AbilityTrackerSectionProps {
  trackers: AbilityTracker[];
  onChange: (trackers: AbilityTracker[]) => void;
  readOnly?: boolean;
  editMode?: boolean;
}

export function AbilityTrackerSection({ trackers, onChange, readOnly = false, editMode = false }: AbilityTrackerSectionProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newUses, setNewUses] = useState('1');
  const [confirmReload, setConfirmReload] = useState<string | null>(null);

  const addTracker = () => {
    if (!newName.trim()) return;
    onChange([...trackers, { name: newName.trim(), maxUses: Math.max(1, parseInt(newUses) || 1), usedUses: 0 }]);
    setNewName('');
    setNewUses('1');
    setShowAdd(false);
  };

  const removeTracker = (index: number) => {
    onChange(trackers.filter((_, i) => i !== index));
  };

  const toggleUse = (trackerIndex: number, useIndex: number) => {
    if (readOnly) return;
    const updated = [...trackers];
    const tracker = { ...updated[trackerIndex] };
    tracker.usedUses = useIndex < tracker.usedUses ? useIndex : useIndex + 1;
    updated[trackerIndex] = tracker;
    onChange(updated);
  };

  const reloadTracker = (index: number) => {
    const updated = [...trackers];
    updated[index] = { ...updated[index], usedUses: 0 };
    onChange(updated);
    setConfirmReload(null);
  };

  if (trackers.length === 0 && !editMode) return null;

  return (
    <div className="space-y-3 mt-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-primary text-sm">Marcadores de Habilidade</h4>
        {editMode && (
          <Button size="sm" variant="outline" className="gap-1" onClick={() => setShowAdd(true)}>
            <Plus className="w-4 h-4" />
            Adicionar
          </Button>
        )}
      </div>

      {trackers.map((tracker, tIdx) => (
        <div key={tIdx} className="p-3 rounded bg-muted/30 border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-sm">{tracker.name}</span>
            <div className="flex items-center gap-1">
              {!readOnly && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0"
                  onClick={() => setConfirmReload(tracker.name)}
                  title="Recarregar"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </Button>
              )}
              {editMode && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0 text-destructive"
                  onClick={() => removeTracker(tIdx)}
                >
                  <X className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {Array.from({ length: tracker.maxUses }, (_, i) => (
              <button
                key={i}
                onClick={() => toggleUse(tIdx, i)}
                disabled={readOnly}
                className={cn(
                  "w-7 h-7 rounded border-2 transition-all",
                  i < tracker.usedUses
                    ? "bg-primary border-primary"
                    : "border-primary/30 hover:border-primary",
                  !readOnly && "cursor-pointer"
                )}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {tracker.usedUses} / {tracker.maxUses} usados
          </p>
        </div>
      ))}

      {/* Add Tracker Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-cinzel text-primary">Adicionar Contador de Habilidade</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Nome da Habilidade</label>
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Ex: Inspiração Bárdica, Fúria..."
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Quantidade de Usos</label>
              <Input
                type="number"
                value={newUses}
                onChange={(e) => setNewUses(e.target.value)}
                min="1"
                max="20"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdd(false)}>Cancelar</Button>
            <Button onClick={addTracker} disabled={!newName.trim()}>Adicionar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Reload Dialog */}
      <Dialog open={!!confirmReload} onOpenChange={() => setConfirmReload(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-cinzel text-primary">Recarregar Habilidade</DialogTitle>
          </DialogHeader>
          <p>Deseja recarregar a habilidade <strong>{confirmReload}</strong>?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmReload(null)}>Não</Button>
            <Button onClick={() => {
              const idx = trackers.findIndex(t => t.name === confirmReload);
              if (idx >= 0) reloadTracker(idx);
            }}>Sim</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
