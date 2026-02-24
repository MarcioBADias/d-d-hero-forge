import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Sparkles, Plus, Check, ChevronDown, Search, Clock, Target, Book, Zap, X } from 'lucide-react';
import { SpellSlotState, classSpellcastingRules, calculateModifier, getTotalAbilityScore, AbilityScores, AbilityBonuses } from '@/types/character';
import { srdSpells, SRDSpell, spellSlotsTable, getMaxSpellLevel, getAutoPopulateSpells } from '@/data/srdSpells';
import { cn } from '@/lib/utils';

interface SpellManagerProps {
  className: string;
  classLevel: number;
  baseAbilities: AbilityScores;
  backgroundBonuses: AbilityBonuses;
  featBonuses: AbilityBonuses;
  spellsKnown: string[];
  preparedSpells: string[];
  spellSlots: SpellSlotState;
  onSpellsKnownChange: (spells: string[]) => void;
  onPreparedSpellsChange: (spells: string[]) => void;
  onSpellSlotsChange: (slots: SpellSlotState) => void;
  readOnly?: boolean;
}

const schoolColors: Record<string, string> = {
  abjuration: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  conjuration: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  divination: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  enchantment: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
  evocation: 'bg-red-500/20 text-red-300 border-red-500/30',
  illusion: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  necromancy: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
  transmutation: 'bg-green-500/20 text-green-300 border-green-500/30',
};

export function SpellManager({
  className,
  classLevel,
  baseAbilities,
  backgroundBonuses,
  featBonuses,
  spellsKnown,
  preparedSpells,
  spellSlots,
  onSpellsKnownChange,
  onPreparedSpellsChange,
  onSpellSlotsChange,
  readOnly = false,
}: SpellManagerProps) {
  const [showAddSpell, setShowAddSpell] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState<number | null>(null);
  const [expandedSpell, setExpandedSpell] = useState<string | null>(null);

  const rules = classSpellcastingRules[className.toLowerCase()];
  const isPreparedCaster = rules?.type === 'prepared';
  
  const spellcastingMod = rules ? calculateModifier(
    getTotalAbilityScore(
      baseAbilities[rules.ability],
      backgroundBonuses[rules.ability],
      featBonuses[rules.ability]
    )
  ) : 0;

  const maxPrepared = rules?.prepareFormula 
    ? rules.prepareFormula(classLevel, spellcastingMod)
    : 0;

  const maxSpellLevel = getMaxSpellLevel(classLevel, className.toLowerCase());
  const slots = spellSlotsTable[classLevel] || [];

  // Get available spells for this class
  const availableSpells = useMemo(() => {
    return srdSpells.filter(s => 
      s.classes.some(c => c.toLowerCase() === className.toLowerCase()) &&
      s.level <= maxSpellLevel
    );
  }, [className, maxSpellLevel]);

  // Filter spells for the add dialog
  const filteredSpells = useMemo(() => {
    return availableSpells.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLevel = filterLevel === null || s.level === filterLevel;
      const notKnown = !spellsKnown.includes(s.name);
      return matchesSearch && matchesLevel && notKnown;
    });
  }, [availableSpells, searchQuery, filterLevel, spellsKnown]);

  // Get known spell objects
  const knownSpellObjects = useMemo(() => {
    return srdSpells.filter(s => spellsKnown.includes(s.name));
  }, [spellsKnown]);

  // Group known spells by level
  const spellsByLevel = useMemo(() => {
    const grouped: Record<number, SRDSpell[]> = {};
    knownSpellObjects.forEach(spell => {
      if (!grouped[spell.level]) grouped[spell.level] = [];
      grouped[spell.level].push(spell);
    });
    return grouped;
  }, [knownSpellObjects]);

  const addSpell = (spellName: string) => {
    onSpellsKnownChange([...spellsKnown, spellName]);
  };

  const removeSpell = (spellName: string) => {
    onSpellsKnownChange(spellsKnown.filter(s => s !== spellName));
    onPreparedSpellsChange(preparedSpells.filter(s => s !== spellName));
  };

  const handleAutoPopulate = () => {
    const autoSpells = getAutoPopulateSpells(className, classLevel, maxSpellLevel);
    onSpellsKnownChange([...new Set([...spellsKnown, ...autoSpells])]);
  };

  const togglePrepared = (spellName: string) => {
    if (preparedSpells.includes(spellName)) {
      onPreparedSpellsChange(preparedSpells.filter(s => s !== spellName));
    } else if (preparedSpells.length < maxPrepared || !isPreparedCaster) {
      onPreparedSpellsChange([...preparedSpells, spellName]);
    }
  };

  const toggleSlotUsed = (level: number) => {
    const currentSlot = spellSlots[level] || { max: slots[level - 1] || 0, used: 0 };
    const newUsed = currentSlot.used >= currentSlot.max ? 0 : currentSlot.used + 1;
    onSpellSlotsChange({
      ...spellSlots,
      [level]: { ...currentSlot, used: newUsed },
    });
  };

  return (
    <Card className="parchment">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="font-cinzel text-primary flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Magias
          </CardTitle>
          <div className="flex gap-2">
            {!readOnly && getAutoPopulateSpells(className, classLevel, maxSpellLevel).length > 0 && (
              <Button 
                size="sm" 
                variant="outline"
                className="gap-1"
                onClick={handleAutoPopulate}
                title="Adicionar todas as magias conhecidas para esta classe"
              >
                <Zap className="w-4 h-4" />
                Auto-popular
              </Button>
            )}
            {!readOnly && (
              <Dialog open={showAddSpell} onOpenChange={setShowAddSpell}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-1">
                    <Plus className="w-4 h-4" />
                    Adicionar Magia
                  </Button>
                </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] parchment">
                <DialogHeader>
                  <DialogTitle className="font-cinzel text-primary">Adicionar Magia</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar magia..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <select
                      value={filterLevel ?? ''}
                      onChange={(e) => setFilterLevel(e.target.value === '' ? null : parseInt(e.target.value))}
                      className="border rounded px-3 py-2 bg-background"
                    >
                      <option value="">Todos níveis</option>
                      <option value="0">Cantrips</option>
                      {Array.from({ length: maxSpellLevel }, (_, i) => (
                        <option key={i + 1} value={i + 1}>Nível {i + 1}</option>
                      ))}
                    </select>
                  </div>
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-2 pr-4">
                      {filteredSpells.map(spell => (
                        <div
                          key={spell.name}
                          className="p-3 rounded border hover:border-primary/50 cursor-pointer transition-all"
                          onClick={() => {
                            addSpell(spell.name);
                            setShowAddSpell(false);
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{spell.name}</span>
                              <Badge className={schoolColors[spell.school]}>{spell.school}</Badge>
                              <Badge variant="secondary">
                                {spell.level === 0 ? 'Cantrip' : `Nível ${spell.level}`}
                              </Badge>
                            </div>
                            <Plus className="w-4 h-4 text-primary" />
                          </div>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{spell.description}</p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </DialogContent>
            </Dialog>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Spell Slots */}
        {slots.some(s => s > 0) && (
          <div className="p-3 rounded bg-muted/30 border border-border">
            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <Book className="w-4 h-4" />
              Slots de Magia
            </h4>
            <div className="flex flex-wrap gap-3">
              {slots.map((maxSlot, idx) => {
                if (maxSlot === 0) return null;
                const level = idx + 1;
                const current = spellSlots[level] || { max: maxSlot, used: 0 };
                return (
                  <div key={level} className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">Nv. {level}</p>
                    <div className="flex gap-1">
                      {Array.from({ length: maxSlot }, (_, i) => (
                        <button
                          key={i}
                          onClick={() => toggleSlotUsed(level)}
                          className={cn(
                            "w-6 h-6 rounded border-2 transition-all cursor-pointer",
                            i < current.used
                              ? "bg-primary/50 border-primary"
                              : "border-primary/30 hover:border-primary"
                          )}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Prepared vs Known indicator */}
        {isPreparedCaster && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Magias Preparadas:</span>
            <Badge variant={preparedSpells.length >= maxPrepared ? 'default' : 'secondary'}>
              {preparedSpells.length} / {maxPrepared}
            </Badge>
          </div>
        )}

        {/* Spells by Level */}
        <ScrollArea className="h-[300px]">
          <div className="space-y-3 pr-4">
            {Object.entries(spellsByLevel)
              .sort(([a], [b]) => parseInt(a) - parseInt(b))
              .map(([level, spells]) => (
                <div key={level}>
                  <h4 className="text-sm font-semibold text-primary mb-2">
                    {level === '0' ? 'Cantrips' : `Nível ${level}`}
                  </h4>
                  <div className="space-y-1">
                    {spells.map(spell => {
                      const isPrepared = preparedSpells.includes(spell.name);
                      const isExpanded = expandedSpell === spell.name;
                      
                      return (
                        <Collapsible
                          key={spell.name}
                          open={isExpanded}
                          onOpenChange={() => setExpandedSpell(isExpanded ? null : spell.name)}
                        >
                          <div className={cn(
                            "rounded border transition-all",
                            isPrepared && "border-primary/50 bg-primary/5"
                          )}>
                            <CollapsibleTrigger className="w-full p-2 flex items-center gap-2 text-left">
                              {!readOnly && spell.level > 0 && isPreparedCaster && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    togglePrepared(spell.name);
                                  }}
                                  className={cn(
                                    "w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all",
                                    isPrepared ? "bg-primary border-primary" : "border-muted-foreground hover:border-primary"
                                  )}
                                  title={isPrepared ? 'Preparada' : 'Clique para preparar'}
                                >
                                  {isPrepared && <Check className="w-3 h-3 text-primary-foreground" />}
                                </button>
                              )}
                              <span className="font-medium flex-1 flex items-center gap-2">
                                {spell.name}
                                {isPrepared && isPreparedCaster && (
                                  <Badge variant="default" className="text-xs bg-primary/80">Prep.</Badge>
                                )}
                              </span>
                              <Badge className={cn("text-xs", schoolColors[spell.school])}>
                                {spell.school}
                              </Badge>
                              {spell.concentration && (
                                <Badge variant="outline" className="text-xs">C</Badge>
                              )}
                              {!readOnly && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeSpell(spell.name);
                                  }}
                                  className="text-muted-foreground hover:text-destructive transition-colors"
                                  title="Remover magia"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              )}
                              <ChevronDown className={cn(
                                "w-4 h-4 transition-transform",
                                isExpanded && "rotate-180"
                              )} />
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <AnimatePresence>
                                {isExpanded && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="px-2 pb-2"
                                  >
                                    <div className="text-xs text-muted-foreground space-y-1">
                                      <div className="flex gap-4">
                                        <span className="flex items-center gap-1">
                                          <Clock className="w-3 h-3" />
                                          {spell.castingTime || spell.actionType}
                                        </span>
                                        <span className="flex items-center gap-1">
                                          <Target className="w-3 h-3" />
                                          {spell.range}
                                        </span>
                                      </div>
                                      <p className="mt-2">{spell.description}</p>
                                      {spell.upcast && (
                                        <p className="text-primary/80 mt-1">
                                          <strong>Em níveis superiores:</strong> {spell.upcast}
                                        </p>
                                      )}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </CollapsibleContent>
                          </div>
                        </Collapsible>
                      );
                    })}
                  </div>
                </div>
              ))}
            {spellsKnown.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                Nenhuma magia conhecida
              </p>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
