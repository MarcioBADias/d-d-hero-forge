import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Character } from '@/types/character';
import { races, dragonAncestries, elvenLineages, gnomeLineages, giantAncestries, tieflingLegacies, aasimarRevelations } from '@/data/races';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Footprints, Ruler, Heart, Sparkles } from 'lucide-react';

interface StepRaceProps {
  character: Partial<Character>;
  updateCharacter: (updates: Partial<Character>) => void;
}

export function StepRace({ character, updateCharacter }: StepRaceProps) {
  const selectedRace = races.find((r) => r.name === character.raceName);

  const handleRaceSelect = (name: string) => {
    updateCharacter({ raceName: name, raceOptions: {} });
  };

  const handleOptionSelect = (optionKey: string, value: string) => {
    updateCharacter({
      raceOptions: {
        ...character.raceOptions,
        [optionKey]: value,
      },
    });
  };

  const getSpecialOptions = () => {
    if (!selectedRace) return null;

    switch (selectedRace.name) {
      case 'Dragonborn':
        return (
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Ancestralidade Dracônica</Label>
            <Select
              value={character.raceOptions?.ancestry || ''}
              onValueChange={(v) => handleOptionSelect('ancestry', v)}
            >
              <SelectTrigger className="bg-background/50">
                <SelectValue placeholder="Escolha seu dragão ancestral..." />
              </SelectTrigger>
              <SelectContent>
                {dragonAncestries.map((da) => (
                  <SelectItem key={da.type} value={da.type}>
                    {da.type} ({da.damageType} - {da.shape})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      case 'Elf':
        return (
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Linhagem Élfica</Label>
            <Select
              value={character.raceOptions?.lineage || ''}
              onValueChange={(v) => handleOptionSelect('lineage', v)}
            >
              <SelectTrigger className="bg-background/50">
                <SelectValue placeholder="Escolha sua linhagem..." />
              </SelectTrigger>
              <SelectContent>
                {elvenLineages.map((l) => (
                  <SelectItem key={l} value={l}>{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      case 'Gnome':
        return (
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Linhagem Gnômica</Label>
            <Select
              value={character.raceOptions?.lineage || ''}
              onValueChange={(v) => handleOptionSelect('lineage', v)}
            >
              <SelectTrigger className="bg-background/50">
                <SelectValue placeholder="Escolha sua linhagem..." />
              </SelectTrigger>
              <SelectContent>
                {gnomeLineages.map((l) => (
                  <SelectItem key={l} value={l}>{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      case 'Goliath':
        return (
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Ancestralidade Gigante</Label>
            <Select
              value={character.raceOptions?.ancestry || ''}
              onValueChange={(v) => handleOptionSelect('ancestry', v)}
            >
              <SelectTrigger className="bg-background/50">
                <SelectValue placeholder="Escolha seu gigante ancestral..." />
              </SelectTrigger>
              <SelectContent>
                {giantAncestries.map((g) => (
                  <SelectItem key={g} value={g}>{g} Giant</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      case 'Tiefling':
        return (
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Legado Infernal</Label>
            <Select
              value={character.raceOptions?.legacy || ''}
              onValueChange={(v) => handleOptionSelect('legacy', v)}
            >
              <SelectTrigger className="bg-background/50">
                <SelectValue placeholder="Escolha seu legado..." />
              </SelectTrigger>
              <SelectContent>
                {tieflingLegacies.map((l) => (
                  <SelectItem key={l} value={l}>{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      case 'Aasimar':
        return (
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Revelação Celestial (Nível 3)</Label>
            <Select
              value={character.raceOptions?.revelation || ''}
              onValueChange={(v) => handleOptionSelect('revelation', v)}
            >
              <SelectTrigger className="bg-background/50">
                <SelectValue placeholder="Escolha sua revelação..." />
              </SelectTrigger>
              <SelectContent>
                {aasimarRevelations.map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Race Selector */}
      <div className="space-y-2">
        <Label className="text-lg font-cinzel text-primary">
          Escolha sua Raça
        </Label>
        <Select
          value={character.raceName || ''}
          onValueChange={handleRaceSelect}
        >
          <SelectTrigger className="w-full bg-background/50">
            <SelectValue placeholder="Selecione uma raça..." />
          </SelectTrigger>
          <SelectContent>
            {races.map((race) => (
              <SelectItem key={race.name} value={race.name}>
                {race.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Race Details */}
      {selectedRace && (
        <div className="space-y-4 p-4 rounded-lg bg-background/30 border border-border animate-fade-in">
          <div className="flex items-center justify-between">
            <h4 className="font-cinzel text-xl text-primary">{selectedRace.name}</h4>
            <Badge variant="outline">{selectedRace.source}</Badge>
          </div>

          {/* Basic Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="flex items-center gap-2 p-2 rounded bg-muted/50">
              <Heart className="w-4 h-4 text-blood" />
              <div>
                <p className="text-xs text-muted-foreground">Tipo</p>
                <p className="text-sm font-medium">{selectedRace.creatureType}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 rounded bg-muted/50">
              <Ruler className="w-4 h-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Tamanho</p>
                <p className="text-sm font-medium">{selectedRace.size.split(' ')[0]}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 rounded bg-muted/50">
              <Footprints className="w-4 h-4 text-nature" />
              <div>
                <p className="text-xs text-muted-foreground">Velocidade</p>
                <p className="text-sm font-medium">{selectedRace.speed}</p>
              </div>
            </div>
          </div>

          {/* Special Options */}
          {getSpecialOptions()}

          {/* Traits */}
          <div className="space-y-2">
            <h5 className="text-sm font-semibold text-primary flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Traços Raciais
            </h5>
            <ScrollArea className="h-48">
              <div className="space-y-2 pr-4">
                {selectedRace.traits.map((trait, index) => {
                  const [title, ...desc] = trait.split(': ');
                  return (
                    <div key={index} className="p-2 rounded bg-muted/30">
                      <p className="font-semibold text-sm text-primary">{title}</p>
                      {desc.length > 0 && (
                        <p className="text-sm text-muted-foreground">{desc.join(': ')}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        </div>
      )}
    </div>
  );
}
