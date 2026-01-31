import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Character, AbilityBonuses, AbilityScore } from '@/types/character';
import { backgrounds } from '@/data/backgrounds';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Gift, Wrench, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StepBackgroundProps {
  character: Partial<Character>;
  updateCharacter: (updates: Partial<Character>) => void;
}

const abilityOptions: { key: AbilityScore; label: string }[] = [
  { key: 'str', label: 'Força' },
  { key: 'dex', label: 'Destreza' },
  { key: 'con', label: 'Constituição' },
  { key: 'int', label: 'Inteligência' },
  { key: 'wis', label: 'Sabedoria' },
  { key: 'cha', label: 'Carisma' },
];

export function StepBackground({ character, updateCharacter }: StepBackgroundProps) {
  const selectedBackground = backgrounds.find((b) => b.name === character.backgroundName);
  
  const [bonusDistribution, setBonusDistribution] = useState<AbilityBonuses>(
    character.backgroundAbilityBonuses || { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 }
  );

  const totalBonuses = Object.values(bonusDistribution).reduce((a, b) => a + b, 0);
  const maxBonuses = 3; // +2 to one, +1 to another = 3 total points

  const handleBonusChange = (ability: AbilityScore, delta: number) => {
    const currentValue = bonusDistribution[ability];
    const newValue = currentValue + delta;
    
    // Can't go below 0 or above 2
    if (newValue < 0 || newValue > 2) return;
    
    // Can't exceed total of 3 points
    if (totalBonuses + delta > maxBonuses) return;
    
    const newBonuses = { ...bonusDistribution, [ability]: newValue };
    setBonusDistribution(newBonuses);
    updateCharacter({ backgroundAbilityBonuses: newBonuses });
  };

  const handleBackgroundSelect = (name: string) => {
    const bg = backgrounds.find((b) => b.name === name);
    if (bg) {
      // Reset bonuses when changing background
      const emptyBonuses = { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 };
      setBonusDistribution(emptyBonuses);
      // Merge background skill proficiencies into character.skills (avoid duplicates)
      const existingSkills = character.skills || [];
      const bgSkills = bg.skillProficiencies || [];
      const merged = Array.from(new Set([...existingSkills, ...bgSkills]));

      updateCharacter({ 
        backgroundName: name,
        backgroundAbilityBonuses: emptyBonuses,
        skills: merged,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Background Selector */}
      <div className="space-y-2">
        <Label className="text-lg font-cinzel text-primary">
          Escolha seu Background
        </Label>
        <Select
          value={character.backgroundName || ''}
          onValueChange={handleBackgroundSelect}
        >
          <SelectTrigger className="w-full bg-background/50">
            <SelectValue placeholder="Selecione um background..." />
          </SelectTrigger>
          <SelectContent>
            <ScrollArea className="h-64">
              {backgrounds.map((bg) => (
                <SelectItem key={bg.name} value={bg.name}>
                  {bg.name}
                </SelectItem>
              ))}
            </ScrollArea>
          </SelectContent>
        </Select>
      </div>

      {/* Background Details */}
      {selectedBackground && (
        <div className="space-y-4 p-4 rounded-lg bg-background/30 border border-border animate-fade-in">
          <div className="flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-primary mt-1" />
            <div className="flex-1">
              <h4 className="font-semibold mb-1">{selectedBackground.name}</h4>
              <p className="text-sm text-muted-foreground">{selectedBackground.info}</p>
              <p className="text-xs text-muted-foreground mt-1">{selectedBackground.source}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Skills */}
            <div className="space-y-2">
              <h5 className="text-sm font-semibold text-primary flex items-center gap-2">
                <Wrench className="w-4 h-4" />
                Proficiências
              </h5>
              <div className="flex flex-wrap gap-1">
                {selectedBackground.skillProficiencies.map((skill) => (
                  <Badge key={skill} variant="secondary">{skill}</Badge>
                ))}
                <Badge variant="outline">{selectedBackground.toolProficiency}</Badge>
              </div>
            </div>

            {/* Feat */}
            <div className="space-y-2">
              <h5 className="text-sm font-semibold text-primary flex items-center gap-2">
                <Gift className="w-4 h-4" />
                Feat Bônus
              </h5>
              <Badge className="bg-primary/20 text-primary border-primary">
                {selectedBackground.feat}
              </Badge>
            </div>
          </div>

          {/* Ability Score Bonuses */}
          <div className="space-y-3 pt-4 border-t border-border">
            <h5 className="text-sm font-semibold text-primary">
              Bônus de Atributos ({totalBonuses}/3 pontos)
            </h5>
            <p className="text-xs text-muted-foreground">
              Distribua +2 em um atributo e +1 em outro (escolha entre: {selectedBackground.abilityScores.join(', ')})
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {abilityOptions
                .filter((opt) => 
                  selectedBackground.abilityScores.some(
                    (a) => a.toLowerCase().startsWith(opt.key) || 
                           a.toLowerCase() === opt.label.toLowerCase()
                  )
                )
                .map((opt) => (
                  <div key={opt.key} className="flex items-center justify-between p-2 rounded bg-muted/50">
                    <span className="text-sm">{opt.label}</span>
                    <div className="flex items-center gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6"
                        onClick={() => handleBonusChange(opt.key, -1)}
                        disabled={bonusDistribution[opt.key] === 0}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-6 text-center font-bold text-primary">
                        +{bonusDistribution[opt.key]}
                      </span>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6"
                        onClick={() => handleBonusChange(opt.key, 1)}
                        disabled={bonusDistribution[opt.key] >= 2 || totalBonuses >= maxBonuses}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Background Story */}
      <div className="space-y-2">
        <Label htmlFor="story" className="text-lg font-cinzel text-primary">
          História do Personagem
        </Label>
        <Textarea
          id="story"
          placeholder="Descreva a história e personalidade do seu personagem..."
          value={character.backgroundStory || ''}
          onChange={(e) => updateCharacter({ backgroundStory: e.target.value })}
          className="min-h-32 bg-background/50"
        />
      </div>
    </div>
  );
}
