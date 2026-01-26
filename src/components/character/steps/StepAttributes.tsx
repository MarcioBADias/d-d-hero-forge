import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Character, AbilityScore, AbilityScores, pointBuyCosts, standardArray, abilityLabels, calculateModifier, formatModifier, getTotalAbilityScore } from '@/types/character';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Minus, RotateCcw } from 'lucide-react';

interface StepAttributesProps {
  character: Partial<Character>;
  updateCharacter: (updates: Partial<Character>) => void;
}

const abilityKeys: AbilityScore[] = ['str', 'dex', 'con', 'int', 'wis', 'cha'];

export function StepAttributes({ character, updateCharacter }: StepAttributesProps) {
  const [method, setMethod] = useState<'standard' | 'pointbuy'>(character.attributeMethod || 'standard');
  const [standardAssignments, setStandardAssignments] = useState<Record<AbilityScore, number | null>>(() => {
    const initial: Record<AbilityScore, number | null> = { str: null, dex: null, con: null, int: null, wis: null, cha: null };
    if (character.baseAbilities && character.attributeMethod === 'standard') {
      abilityKeys.forEach(key => {
        if (standardArray.includes(character.baseAbilities![key])) {
          initial[key] = character.baseAbilities![key];
        }
      });
    }
    return initial;
  });

  const baseAbilities = character.baseAbilities || { str: 8, dex: 8, con: 8, int: 8, wis: 8, cha: 8 };
  const bgBonuses = character.backgroundAbilityBonuses || { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 };
  const featBonuses = character.featAbilityBonuses || { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 };

  const getUsedPointBuyPoints = () => {
    return abilityKeys.reduce((total, key) => total + (pointBuyCosts[baseAbilities[key]] || 0), 0);
  };

  const handleMethodChange = (newMethod: 'standard' | 'pointbuy') => {
    setMethod(newMethod);
    const resetAbilities = { str: 8, dex: 8, con: 8, int: 8, wis: 8, cha: 8 };
    setStandardAssignments({ str: null, dex: null, con: null, int: null, wis: null, cha: null });
    updateCharacter({ attributeMethod: newMethod, baseAbilities: resetAbilities });
  };

  const handlePointBuyChange = (ability: AbilityScore, delta: number) => {
    const currentValue = baseAbilities[ability];
    const newValue = currentValue + delta;
    
    if (newValue < 8 || newValue > 15) return;
    
    const newCost = pointBuyCosts[newValue];
    const oldCost = pointBuyCosts[currentValue];
    const usedPoints = getUsedPointBuyPoints();
    
    if (usedPoints - oldCost + newCost > 27) return;
    
    updateCharacter({
      baseAbilities: { ...baseAbilities, [ability]: newValue },
    });
  };

  const handleStandardAssign = (ability: AbilityScore, value: string) => {
    const numValue = value ? parseInt(value) : null;
    
    // Find if this value was assigned elsewhere and swap
    const newAssignments = { ...standardAssignments };
    
    // Clear this ability first
    const oldValue = newAssignments[ability];
    newAssignments[ability] = numValue;
    
    // If this value was used elsewhere, swap it
    if (numValue !== null) {
      abilityKeys.forEach(key => {
        if (key !== ability && newAssignments[key] === numValue) {
          newAssignments[key] = oldValue;
        }
      });
    }
    
    setStandardAssignments(newAssignments);
    
    // Update base abilities
    const newAbilities: AbilityScores = { str: 8, dex: 8, con: 8, int: 8, wis: 8, cha: 8 };
    abilityKeys.forEach(key => {
      if (newAssignments[key] !== null) {
        newAbilities[key] = newAssignments[key]!;
      }
    });
    updateCharacter({ baseAbilities: newAbilities });
  };

  const getAvailableStandardValues = (currentAbility: AbilityScore) => {
    const usedValues = Object.entries(standardAssignments)
      .filter(([key, val]) => key !== currentAbility && val !== null)
      .map(([_, val]) => val);
    
    return standardArray.filter(v => !usedValues.includes(v));
  };

  const resetAbilities = () => {
    const resetAbilities = { str: 8, dex: 8, con: 8, int: 8, wis: 8, cha: 8 };
    setStandardAssignments({ str: null, dex: null, con: null, int: null, wis: null, cha: null });
    updateCharacter({ baseAbilities: resetAbilities });
  };

  return (
    <div className="space-y-6">
      {/* Method Selector */}
      <Tabs value={method} onValueChange={(v) => handleMethodChange(v as 'standard' | 'pointbuy')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="standard">Standard Array</TabsTrigger>
          <TabsTrigger value="pointbuy">Point Buy</TabsTrigger>
        </TabsList>

        <TabsContent value="standard" className="mt-4">
          <div className="p-3 rounded bg-muted/50 mb-4">
            <p className="text-sm text-muted-foreground">
              Distribua os valores <strong>8, 10, 12, 13, 14, 15</strong> entre seus atributos.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="pointbuy" className="mt-4">
          <div className="p-3 rounded bg-muted/50 mb-4">
            <p className="text-sm text-muted-foreground">
              Pontos: <strong className="text-primary">{getUsedPointBuyPoints()}/27</strong> usados
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Custo: 8(0), 9(1), 10(2), 11(3), 12(4), 13(5), 14(7), 15(9)
            </p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Reset Button */}
      <div className="flex justify-end">
        <Button variant="ghost" size="sm" onClick={resetAbilities} className="gap-1">
          <RotateCcw className="w-4 h-4" />
          Resetar
        </Button>
      </div>

      {/* Ability Scores Grid */}
      <div className="grid gap-3">
        {abilityKeys.map((key) => {
          const base = baseAbilities[key];
          const bgBonus = bgBonuses[key];
          const featBonus = featBonuses[key];
          const total = getTotalAbilityScore(base, bgBonus, featBonus);
          const modifier = calculateModifier(total);

          return (
            <div key={key} className="flex items-center gap-3 p-3 rounded-lg bg-background/30 border border-border">
              {/* Ability Name */}
              <div className="w-28">
                <p className="font-semibold">{abilityLabels[key]}</p>
                <p className="text-xs text-muted-foreground uppercase">{key}</p>
              </div>

              {/* Base Score Input */}
              <div className="flex-1 flex items-center gap-2">
                {method === 'pointbuy' ? (
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handlePointBuyChange(key, -1)}
                      disabled={base <= 8}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-8 text-center font-bold">{base}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handlePointBuyChange(key, 1)}
                      disabled={base >= 15 || getUsedPointBuyPoints() + (pointBuyCosts[base + 1] - pointBuyCosts[base]) > 27}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <Select
                    value={standardAssignments[key]?.toString() || ''}
                    onValueChange={(v) => handleStandardAssign(key, v)}
                  >
                    <SelectTrigger className="w-20 bg-background/50">
                      <SelectValue placeholder="—" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">—</SelectItem>
                      {getAvailableStandardValues(key).map((v) => (
                        <SelectItem key={v} value={v.toString()}>{v}</SelectItem>
                      ))}
                      {standardAssignments[key] !== null && (
                        <SelectItem value={standardAssignments[key]!.toString()}>
                          {standardAssignments[key]}
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                )}

                {/* Bonuses */}
                {(bgBonus > 0 || featBonus > 0) && (
                  <div className="flex gap-1">
                    {bgBonus > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        BG +{bgBonus}
                      </Badge>
                    )}
                    {featBonus > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        Feat +{featBonus}
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              {/* Total and Modifier */}
              <div className="text-center min-w-16">
                <p className="text-2xl font-bold text-primary">{total}</p>
                <p className="text-sm text-muted-foreground">{formatModifier(modifier)}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
        <h4 className="font-cinzel text-primary mb-2">Resumo dos Modificadores</h4>
        <div className="flex flex-wrap gap-4">
          {abilityKeys.map((key) => {
            const total = getTotalAbilityScore(
              baseAbilities[key],
              bgBonuses[key],
              featBonuses[key]
            );
            const mod = calculateModifier(total);
            return (
              <div key={key} className="text-center">
                <p className="text-xs text-muted-foreground uppercase">{key}</p>
                <p className={`font-bold ${mod >= 0 ? 'text-nature' : 'text-destructive'}`}>
                  {formatModifier(mod)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
