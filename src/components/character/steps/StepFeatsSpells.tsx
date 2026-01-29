import { useState } from 'react';
import { Character } from '@/types/character';
import { feats, originFeats, generalFeats } from '@/data/feats';
import { backgrounds } from '@/data/backgrounds';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Sparkles, Gift, Star } from 'lucide-react';

interface StepFeatsSpellsProps {
  character: Partial<Character>;
  updateCharacter: (updates: Partial<Character>) => void;
}

export function StepFeatsSpells({ character, updateCharacter }: StepFeatsSpellsProps) {
  const [openSections, setOpenSections] = useState<string[]>(['origin', 'background']);
  
  const selectedFeats = character.feats || [];
  const level = character.level || 1;

  // Get background feat
  const backgroundFeat = backgrounds.find(b => b.name === character.backgroundName)?.feat;

  // Calculate ASI levels based on class
  const asiLevels = [4, 8, 12, 16, 19];
  const availableASIs = asiLevels.filter(l => l <= level).length;

  const toggleFeat = (featName: string) => {
    const newFeats = selectedFeats.includes(featName)
      ? selectedFeats.filter(f => f !== featName)
      : [...selectedFeats, featName];
    
    updateCharacter({ feats: newFeats });
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
    </div>
  );
}
