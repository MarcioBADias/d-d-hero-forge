import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Character, abilityShortLabels, calculateModifier, formatModifier, getTotalAbilityScore, calculateProficiencyBonus, AbilityScore } from '@/types/character';
import { characterClasses } from '@/data/classes';
import { races } from '@/data/races';
import { backgrounds } from '@/data/backgrounds';
import { feats } from '@/data/feats';
import { spells } from '@/data/spells';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ExportDropdown } from '@/components/character/ExportDropdown';
import { ArrowUp, Edit, Heart, Shield, Footprints, Star, Sword, Sparkles, User, Book } from 'lucide-react';

interface CharacterSheetProps {
  character: Character;
  onEdit: () => void;
  onUpdateCharacter: (updates: Partial<Character>) => void;
  readOnly?: boolean;
}

const abilityKeys: AbilityScore[] = ['str', 'dex', 'con', 'int', 'wis', 'cha'];

export function CharacterSheet({ character, onEdit, onUpdateCharacter, readOnly = false }: CharacterSheetProps) {
  const [showLevelUp, setShowLevelUp] = useState(false);

  const proficiencyBonus = calculateProficiencyBonus(character.level);
  
  // Get class info
  const primaryClass = character.classes[0];
  const classData = primaryClass ? characterClasses[primaryClass.className.toLowerCase()] : null;
  
  // Calculate HP
  const conMod = calculateModifier(
    getTotalAbilityScore(
      character.baseAbilities.con,
      character.backgroundAbilityBonuses.con,
      character.featAbilityBonuses.con
    )
  );
  
  const calculateHP = () => {
    let hp = 0;
    character.classes.forEach((cl, index) => {
      const clData = characterClasses[cl.className.toLowerCase()];
      if (!clData) return;
      
      for (let lvl = 1; lvl <= cl.level; lvl++) {
        if (index === 0 && lvl === 1) {
          // First level of first class = max hit die
          hp += clData.hitDie + conMod;
        } else {
          // Average for other levels
          hp += Math.floor(clData.hitDie / 2) + 1 + conMod;
        }
      }
    });
    return Math.max(hp, 1);
  };

  // Calculate AC (simple base calculation)
  const dexMod = calculateModifier(
    getTotalAbilityScore(
      character.baseAbilities.dex,
      character.backgroundAbilityBonuses.dex,
      character.featAbilityBonuses.dex
    )
  );
  const baseAC = 10 + dexMod;

  // Get race info
  const raceData = races.find(r => r.name === character.raceName);

  // Get background info
  const bgData = backgrounds.find(b => b.name === character.backgroundName);

  const handleLevelUp = () => {
    if (character.level >= 20) return;
    
    onUpdateCharacter({
      level: character.level + 1,
      classes: character.classes.map((c, i) => 
        i === 0 ? { ...c, level: c.level + 1 } : c
      ),
    });
    setShowLevelUp(false);
  };

  // Get known spells info
  const knownSpells = character.spellsKnown || [];
  const hasSpells = classData?.spellcasting && knownSpells.length > 0;

  return (
    <motion.div 
      className="min-h-screen bg-background pb-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {!readOnly ? (
              <Button variant="ghost" onClick={onEdit} className="gap-2">
                <Edit className="w-4 h-4" />
                Editar
              </Button>
            ) : (
              <div />
            )}
            <h1 className="text-xl md:text-2xl font-cinzel text-primary">
              Ficha do Personagem
            </h1>
            <ExportDropdown character={character} />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Character Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="parchment overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-arcane/5 pointer-events-none" />
              <CardContent className="p-6 relative">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Portrait */}
                <div className="w-32 h-32 rounded-lg border-2 border-primary bg-muted flex items-center justify-center overflow-hidden flex-shrink-0 mx-auto md:mx-0">
                  {character.imageUrl ? (
                    <img src={character.imageUrl} alt={character.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-16 h-16 text-muted-foreground" />
                  )}
                </div>

                {/* Basic Info */}
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                    <h2 className="text-3xl font-cinzel text-primary">{character.name || 'Sem Nome'}</h2>
                    {!readOnly ? (
                      <Dialog open={showLevelUp} onOpenChange={setShowLevelUp}>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm" 
                            className="btn-d20 gap-1"
                            disabled={character.level >= 20}
                          >
                            Nv. {character.level}
                            <ArrowUp className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle className="font-cinzel text-primary">
                              ⬆️ Level Up para Nível {character.level + 1}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <p>Ao subir de nível você ganhará:</p>
                            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                              <li>+{Math.floor((classData?.hitDie || 8) / 2) + 1 + conMod} HP</li>
                              {classData?.features
                                .filter(f => f.level === character.level + 1)
                                .map((f, i) => (
                                  <li key={i}>{f.title}</li>
                                ))
                              }
                            </ul>
                            <Button onClick={handleLevelUp} className="w-full btn-d20">
                              Confirmar Level Up
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    ) : (
                      <Badge className="bg-primary/20 text-primary">Nv. {character.level}</Badge>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-3">
                    {character.raceName && <Badge variant="secondary">{character.raceName}</Badge>}
                    {character.classes.map((c, i) => (
                      <Badge key={i} className="bg-primary/20 text-primary border-primary">
                        {c.className} {c.level}
                      </Badge>
                    ))}
                    {character.backgroundName && <Badge variant="outline">{character.backgroundName}</Badge>}
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div className="p-2 rounded bg-blood/20 border border-blood/30">
                      <Heart className="w-5 h-5 mx-auto text-blood mb-1" />
                      <p className="text-2xl font-bold">{calculateHP()}</p>
                      <p className="text-xs text-muted-foreground">HP</p>
                    </div>
                    <div className="p-2 rounded bg-primary/20 border border-primary/30">
                      <Shield className="w-5 h-5 mx-auto text-primary mb-1" />
                      <p className="text-2xl font-bold">{baseAC}</p>
                      <p className="text-xs text-muted-foreground">CA</p>
                    </div>
                    <div className="p-2 rounded bg-nature/20 border border-nature/30">
                      <Footprints className="w-5 h-5 mx-auto text-nature mb-1" />
                      <p className="text-2xl font-bold">{raceData?.speed.split(' ')[0] || '30'}</p>
                      <p className="text-xs text-muted-foreground">Velocidade</p>
                    </div>
                    <div className="p-2 rounded bg-arcane/20 border border-arcane/30">
                      <Star className="w-5 h-5 mx-auto text-arcane mb-1" />
                      <p className="text-2xl font-bold">+{proficiencyBonus}</p>
                      <p className="text-xs text-muted-foreground">Proficiência</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          </motion.div>

          {/* Ability Scores */}
          <Card className="parchment">
            <CardHeader>
              <CardTitle className="font-cinzel text-primary flex items-center gap-2">
                <Sword className="w-5 h-5" />
                Atributos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {abilityKeys.map(key => {
                  const total = getTotalAbilityScore(
                    character.baseAbilities[key],
                    character.backgroundAbilityBonuses[key],
                    character.featAbilityBonuses[key]
                  );
                  const mod = calculateModifier(total);
                  const saveProficient = classData?.savingThrows.some(
                    s => s.toLowerCase().startsWith(key)
                  );

                  return (
                    <div key={key} className="text-center p-3 rounded-lg bg-background/30 border border-border">
                      <p className="text-xs text-muted-foreground uppercase font-semibold">
                        {abilityShortLabels[key]}
                      </p>
                      <p className="text-3xl font-bold text-primary">{total}</p>
                      <p className={`text-lg font-semibold ${mod >= 0 ? 'text-nature' : 'text-destructive'}`}>
                        {formatModifier(mod)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Save: {formatModifier(mod + (saveProficient ? proficiencyBonus : 0))}
                        {saveProficient && ' ●'}
                      </p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card className="parchment">
            <CardHeader>
              <CardTitle className="font-cinzel text-primary flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Habilidades & Traits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-4 pr-4">
                  {/* Race Traits */}
                  {raceData && (
                    <div>
                      <h4 className="font-semibold text-primary mb-2">{raceData.name} Traits</h4>
                      <div className="space-y-2">
                        {raceData.traits.map((trait, i) => {
                          const [title, ...desc] = trait.split(': ');
                          return (
                            <div key={i} className="p-2 rounded bg-muted/30">
                              <p className="font-medium text-sm">{title}</p>
                              {desc.length > 0 && (
                                <p className="text-xs text-muted-foreground">{desc.join(': ')}</p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Class Features */}
                  {character.classes.map((cl, idx) => {
                    const clData = characterClasses[cl.className.toLowerCase()];
                    if (!clData) return null;
                    
                    return (
                      <div key={idx}>
                        <h4 className="font-semibold text-primary mb-2">{clData.name} Features</h4>
                        <div className="space-y-2">
                          {clData.features
                            .filter(f => f.level <= cl.level)
                            .map((feature, i) => (
                              <div key={i} className="p-2 rounded bg-muted/30">
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-xs">Nv. {feature.level}</Badge>
                                  <p className="font-medium text-sm">{feature.title}</p>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">{feature.description}</p>
                              </div>
                            ))
                          }
                        </div>
                      </div>
                    );
                  })}

                  {/* Feats */}
                  {(character.feats.length > 0 || bgData?.feat) && (
                    <div>
                      <h4 className="font-semibold text-primary mb-2">Feats</h4>
                      <div className="space-y-2">
                        {bgData?.feat && (
                          <div className="p-2 rounded bg-primary/10 border border-primary/30">
                            <p className="font-medium text-sm">{bgData.feat}</p>
                            <p className="text-xs text-muted-foreground">
                              {feats[bgData.feat]?.description || 'Feat do background'}
                            </p>
                          </div>
                        )}
                        {character.feats.map((featName, i) => (
                          <div key={i} className="p-2 rounded bg-muted/30">
                            <p className="font-medium text-sm">{featName}</p>
                            <p className="text-xs text-muted-foreground">
                              {feats[featName]?.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Background Story */}
          {character.backgroundStory && (
            <Card className="parchment">
              <CardHeader>
                <CardTitle className="font-cinzel text-primary">História</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">{character.backgroundStory}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </motion.div>
  );
}
