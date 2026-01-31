import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Character, AbilityScore } from '@/types/character';
import { feats, originFeats, generalFeats } from '@/data/feats';
import { backgrounds } from '@/data/backgrounds';
import { characterClasses } from '@/data/classes';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Sparkles, Gift, Star } from 'lucide-react';

interface StepFeatsSpellsProps {
  character: Partial<Character>;
  updateCharacter: (updates: Partial<Character>) => void;
}

export function StepFeatsSpells({ character, updateCharacter }: StepFeatsSpellsProps) {
  const [openSections, setOpenSections] = useState<string[]>(['origin', 'background']);
  const [pendingFeat, setPendingFeat] = useState<string | null>(null);
  const [showChoiceDialog, setShowChoiceDialog] = useState(false);
  const [choiceValue, setChoiceValue] = useState<string>('');
  
  const selectedFeats = character.feats || [];
  const level = character.level || 1;

  // Get background feat
  const backgroundFeat = backgrounds.find(b => b.name === character.backgroundName)?.feat;

  // Calculate ASI levels based on class
  const asiLevels = [4, 8, 12, 16, 19];
  const availableASIs = asiLevels.filter(l => l <= level).length;

  const toggleFeat = (featName: string) => {
    const feat = feats[featName];
    const isRemoving = selectedFeats.includes(featName);

    if (isRemoving) {
      // Remove feat and revert any applied ability bonus if we have a recorded selection
      const newFeats = selectedFeats.filter(f => f !== featName);
      const newFeatBonuses = { ...(character.featAbilityBonuses || { str:0,dex:0,con:0,int:0,wis:0,cha:0 }) };
      const newSelections = { ...(character.featSelections || {}) };
      const selectedAbility = newSelections[featName];
      if (selectedAbility && feat?.abilityScoreIncrease) {
        // parse amount
        const m = feat.abilityScoreIncrease.match(/\+([0-9]+)/);
        const amount = m ? parseInt(m[1], 10) : 1;
        newFeatBonuses[selectedAbility as any] = Math.max(0, (newFeatBonuses[selectedAbility as any] || 0) - amount);
        delete newSelections[featName];
      }
      updateCharacter({ feats: newFeats, featAbilityBonuses: newFeatBonuses, featSelections: newSelections });
      return;
    }

    // Adding a feat
    if (!feat || !feat.abilityScoreIncrease) {
      updateCharacter({ feats: [...selectedFeats, featName] });
      return;
    }

    // Parse ability choices and amount
    const parseAbilityIncrease = (s: string) => {
      const parts = s.split(' ');
      const last = parts[parts.length - 1];
      const m = last.match(/\+([0-9]+)/);
      const amount = m ? parseInt(m[1], 10) : 1;
      const abilitiesPart = parts.slice(0, parts.length - 1).join(' ');
      const raw = abilitiesPart.split('/').map(r => r.trim());
      const map: Record<string, string> = { Str: 'str', Dex: 'dex', Con: 'con', Int: 'int', Wis: 'wis', Cha: 'cha', Any: 'any' };
      const choices = raw.flatMap(r => r === 'Any' ? ['str','dex','con','int','wis','cha'] : (r.split('/').map(x => map[x] || x))).filter(Boolean) as string[];
      return { choices, amount };
    };

    const { choices, amount } = parseAbilityIncrease(feat.abilityScoreIncrease);

    if (choices.length === 1) {
      const chosen = choices[0] as AbilityScore;
      const newFeatBonuses = { ...(character.featAbilityBonuses || { str:0,dex:0,con:0,int:0,wis:0,cha:0 }) };
      newFeatBonuses[chosen] = (newFeatBonuses[chosen] || 0) + amount;
      const newSelections = { ...(character.featSelections || {}) };
      newSelections[featName] = chosen;
      updateCharacter({ feats: [...selectedFeats, featName], featAbilityBonuses: newFeatBonuses, featSelections: newSelections });
      return;
    }

    // Multiple choices - open dialog to choose
    setPendingFeat(featName);
    setChoiceValue(choices[0]);
    setShowChoiceDialog(true);
  };

  const confirmChoice = () => {
    if (!pendingFeat) return;
    const feat = feats[pendingFeat];
    if (!feat || !feat.abilityScoreIncrease) return;
    const m = feat.abilityScoreIncrease.match(/\+([0-9]+)/);
    const amount = m ? parseInt(m[1], 10) : 1;
    const chosen = choiceValue as AbilityScore;
    const newFeatBonuses = { ...(character.featAbilityBonuses || { str:0,dex:0,con:0,int:0,wis:0,cha:0 }) };
    newFeatBonuses[chosen] = (newFeatBonuses[chosen] || 0) + amount;
    const newSelections = { ...(character.featSelections || {}) };
    newSelections[pendingFeat] = chosen;
    updateCharacter({ feats: [...selectedFeats, pendingFeat], featAbilityBonuses: newFeatBonuses, featSelections: newSelections });
    setPendingFeat(null);
    setShowChoiceDialog(false);
  };

  const toggleSection = (section: string) => {
    setOpenSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const canSelectFeat = (featName: string) => {
    const feat = feats[featName];
    if (!feat) return false;

    // Check if already selected
    if (selectedFeats.includes(featName)) return true;

    // Check prerequisites
    if (feat.prerequisites) {
      if (feat.prerequisites.includes('Level 4+') && level < 4) return false;
    }

    return true;
  };

  return (
    <div className="space-y-6">
      <Dialog open={showChoiceDialog} onOpenChange={setShowChoiceDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Escolha o Atributo</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p>Selecione o atributo que receberá o bônus deste talento.</p>
            <div className="grid grid-cols-3 gap-2">
              {['str','dex','con','int','wis','cha'].map(a => (
                <button
                  key={a}
                  onClick={() => setChoiceValue(a)}
                  className={`p-2 rounded border ${choiceValue===a ? 'bg-primary/20 border-primary' : 'bg-background/30'}`}>
                  {a.toUpperCase()}
                </button>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => { setPendingFeat(null); setShowChoiceDialog(false); }}>Cancelar</Button>
              <Button onClick={confirmChoice}>Confirmar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* Summary */}
      <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
        <h4 className="font-cinzel text-primary mb-2">Feats Selecionados</h4>
        <div className="flex flex-wrap gap-2">
          {backgroundFeat && (
            <Badge className="bg-primary/20 text-primary border-primary">
              <Gift className="w-3 h-3 mr-1" />
              {backgroundFeat} (Background)
            </Badge>
          )}
          {selectedFeats.map(feat => (
            <Badge key={feat} variant="secondary">
              {feat}
            </Badge>
          ))}
          {selectedFeats.length === 0 && !backgroundFeat && (
            <span className="text-sm text-muted-foreground">Nenhum feat selecionado</span>
          )}
        </div>
        {availableASIs > 0 && (
          <p className="text-sm text-muted-foreground mt-2">
            <Star className="w-4 h-4 inline mr-1" />
            {availableASIs} Ability Score Improvement disponível(is)
          </p>
        )}
      </div>

      {/* Background Feat (locked) */}
      {backgroundFeat && (
        <Collapsible open={openSections.includes('background')} onOpenChange={() => toggleSection('background')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
            <div className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-primary" />
              <span className="font-semibold">Feat do Background</span>
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform ${openSections.includes('background') ? 'rotate-180' : ''}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2">
            <div className="p-3 rounded-lg bg-background/30 border border-border">
              <div className="flex items-start gap-2">
                <Checkbox checked disabled className="mt-1" />
                <div>
                  <p className="font-semibold">{backgroundFeat}</p>
                  <p className="text-sm text-muted-foreground">
                    {feats[backgroundFeat]?.description || 'Feat concedido pelo seu background.'}
                  </p>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Origin Feats */}
      <Collapsible open={openSections.includes('origin')} onOpenChange={() => toggleSection('origin')}>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="font-semibold">Origin Feats</span>
            <Badge variant="outline" className="text-xs">Nível 1</Badge>
          </div>
          <ChevronDown className={`w-4 h-4 transition-transform ${openSections.includes('origin') ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2">
          <ScrollArea className="h-64">
            <div className="space-y-2 pr-4">
              {originFeats.map(feat => (
                <div 
                  key={feat.name}
                  className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                    selectedFeats.includes(feat.name) 
                      ? 'bg-primary/10 border-primary' 
                      : 'bg-background/30 border-border hover:border-primary/50'
                  }`}
                  onClick={() => toggleFeat(feat.name)}
                >
                  <div className="flex items-start gap-2">
                    <Checkbox 
                      checked={selectedFeats.includes(feat.name)} 
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <p className="font-semibold">{feat.name}</p>
                      {feat.abilityScoreIncrease && (
                        <Badge variant="secondary" className="text-xs mt-1">
                          {feat.abilityScoreIncrease}
                        </Badge>
                      )}
                      <p className="text-sm text-muted-foreground mt-1">
                        {feat.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CollapsibleContent>
      </Collapsible>

      {/* General Feats */}
      {level >= 4 && (
        <Collapsible open={openSections.includes('general')} onOpenChange={() => toggleSection('general')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-primary" />
              <span className="font-semibold">General Feats</span>
              <Badge variant="outline" className="text-xs">Nível 4+</Badge>
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform ${openSections.includes('general') ? 'rotate-180' : ''}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2">
            <ScrollArea className="h-64">
              <div className="space-y-2 pr-4">
                {generalFeats.map(feat => {
                  const canSelect = canSelectFeat(feat.name);
                  return (
                    <div 
                      key={feat.name}
                      className={`p-3 rounded-lg border transition-colors ${
                        !canSelect ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                      } ${
                        selectedFeats.includes(feat.name) 
                          ? 'bg-primary/10 border-primary' 
                          : 'bg-background/30 border-border hover:border-primary/50'
                      }`}
                      onClick={() => canSelect && toggleFeat(feat.name)}
                    >
                      <div className="flex items-start gap-2">
                        <Checkbox 
                          checked={selectedFeats.includes(feat.name)} 
                          disabled={!canSelect}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold">{feat.name}</p>
                            {feat.prerequisites && (
                              <Badge variant="outline" className="text-xs">
                                {feat.prerequisites}
                              </Badge>
                            )}
                          </div>
                          {feat.abilityScoreIncrease && (
                            <Badge variant="secondary" className="text-xs mt-1">
                              {feat.abilityScoreIncrease}
                            </Badge>
                          )}
                          <p className="text-sm text-muted-foreground mt-1">
                            {feat.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Spells Section Placeholder */}
      {character.classes?.some(c => {
        const classData = characterClasses[c.className.toLowerCase()];
        return classData?.spellcasting;
      }) && (
        <div className="p-4 rounded-lg bg-arcane/10 border border-arcane/30">
          <h4 className="font-cinzel text-arcane mb-2 flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Sistema de Magias
          </h4>
          <p className="text-sm text-muted-foreground">
            O sistema completo de seleção de magias será implementado em breve!
            Suas classes conjuradoras terão acesso a cantrips e spells baseados no nível.
          </p>
        </div>
      )}
    </div>
  );
}
