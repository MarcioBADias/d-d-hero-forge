import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Search, 
  Sparkles, 
  Book, 
  Clock, 
  Target,
  Check,
  X,
  ChevronDown,
  Zap
} from 'lucide-react';
import { Character } from '@/types/character';
import { characterClasses } from '@/data/classes';
import { srdSpells, SRDSpell, schoolColors, spellSlotsTable, cantripsKnown, getMaxSpellLevel } from '@/data/srdSpells';

interface StepSpellsProps {
  character: Partial<Character>;
  updateCharacter: (updates: Partial<Character>) => void;
}

export function StepSpells({ character, updateCharacter }: StepSpellsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [expandedSpell, setExpandedSpell] = useState<string | null>(null);

  // Get spellcasting info from class
  const primaryClass = character.classes?.[0];
  const classData = primaryClass ? characterClasses[primaryClass.className.toLowerCase()] : null;
  const spellcasting = classData?.spellcasting;
  
  const isSpellcaster = !!spellcasting;
  const maxSpellLevel = spellcasting ? getMaxSpellLevel(character.level || 1, spellcasting.type) : 0;
  const classLevel = primaryClass?.level || 1;
  const className = primaryClass?.className.toLowerCase() || '';
  
  // Get spell slots
  const spellSlots = spellSlotsTable[classLevel] || [];
  
  // Get cantrips known count
  const cantripsCount = cantripsKnown[className]?.[classLevel - 1] || 0;

  // Get available spells for this class
  const availableSpells = useMemo(() => {
    if (!primaryClass) return srdSpells;
    return srdSpells.filter(s => 
      s.classes.includes(className) &&
      s.level <= maxSpellLevel
    );
  }, [primaryClass, maxSpellLevel, className]);

  // Filter by search, level, and class
  const filteredSpells = useMemo(() => {
    return availableSpells.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.school.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLevel = selectedLevel === 'all' || s.level === parseInt(selectedLevel);
      const matchesClass = selectedClass === 'all' || s.classes.includes(selectedClass);
      return matchesSearch && matchesLevel && matchesClass;
    });
  }, [availableSpells, searchQuery, selectedLevel, selectedClass]);

  // Currently selected spells
  const selectedSpells = character.spellsKnown || [];

  const toggleSpell = (spellName: string) => {
    const current = [...selectedSpells];
    const index = current.indexOf(spellName);
    
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(spellName);
    }
    
    updateCharacter({ spellsKnown: current });
  };

  const isSpellSelected = (spellName: string) => selectedSpells.includes(spellName);

  // Count selected by level
  const selectedCantrips = selectedSpells.filter(name => {
    const spell = srdSpells.find(s => s.name === name);
    return spell?.level === 0;
  }).length;

  const getComponentsDisplay = (components: string[]) => {
    return components.map(c => c.toUpperCase()).join(', ');
  };

  if (!isSpellcaster) {
    return (
      <div className="text-center py-12">
        <Sparkles className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-xl font-cinzel text-primary mb-2">Classe não conjuradora</h3>
        <p className="text-muted-foreground">
          {primaryClass?.className || 'Sua classe'} não possui habilidade de conjuração.
        </p>
      </div>
    );
  }

  // Get all unique classes from spells for filter
  const allClasses = Array.from(new Set(srdSpells.flatMap(s => s.classes))).sort();

  return (
    <div className="space-y-6">
      {/* Spell Slots Display */}
      <Card className="bg-card/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-cinzel flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-arcane" />
            Slots de Magia - {primaryClass?.className} Nível {classLevel}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <div className="text-center p-2 rounded bg-muted/30 min-w-[70px]">
              <p className="text-xs text-muted-foreground">Cantrips</p>
              <p className="text-lg font-bold text-primary">{cantripsCount}</p>
              <p className="text-xs text-muted-foreground">{selectedCantrips} sel.</p>
            </div>
            {spellSlots.map((slots, idx) => (
              slots > 0 && (
                <div key={idx} className="text-center p-2 rounded bg-muted/30 min-w-[70px]">
                  <p className="text-xs text-muted-foreground">Nível {idx + 1}</p>
                  <p className="text-lg font-bold text-primary">{slots}</p>
                  <p className="text-xs text-muted-foreground">slots</p>
                </div>
              )
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input 
            placeholder="Buscar magia..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedLevel} onValueChange={setSelectedLevel}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="Nível" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos níveis</SelectItem>
            <SelectItem value="0">Cantrips</SelectItem>
            {Array.from({ length: maxSpellLevel }, (_, i) => i + 1).map(level => (
              <SelectItem key={level} value={level.toString()}>Nível {level}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedClass} onValueChange={setSelectedClass}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="Classe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas classes</SelectItem>
            {allClasses.map(cls => (
              <SelectItem key={cls} value={cls} className="capitalize">{cls}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Spell List */}
      <ScrollArea className="h-[400px]">
        <div className="space-y-2 pr-4">
          <AnimatePresence mode="popLayout">
            {filteredSpells.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Nenhuma magia encontrada
              </p>
            ) : (
              filteredSpells.map((spell) => (
                <motion.div
                  key={spell.name}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <Collapsible 
                    open={expandedSpell === spell.name}
                    onOpenChange={(open) => setExpandedSpell(open ? spell.name : null)}
                  >
                    <div className={`rounded-lg border transition-all ${
                      isSpellSelected(spell.name) 
                        ? 'border-primary bg-primary/10' 
                        : 'hover:border-primary/50 bg-background/50'
                    }`}>
                      <CollapsibleTrigger className="w-full">
                        <div className="p-3 flex items-center gap-3">
                          <Button
                            size="icon"
                            variant={isSpellSelected(spell.name) ? 'default' : 'outline'}
                            className="shrink-0 w-8 h-8"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSpell(spell.name);
                            }}
                          >
                            {isSpellSelected(spell.name) ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              <Sparkles className="w-4 h-4" />
                            )}
                          </Button>
                          
                          <div className="flex-1 min-w-0 text-left">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-medium">{spell.name}</span>
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${schoolColors[spell.school] || ''}`}
                              >
                                {spell.school}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {spell.level === 0 ? 'Cantrip' : `Nv. ${spell.level}`}
                              </Badge>
                              {spell.concentration && (
                                <Badge variant="outline" className="text-xs">C</Badge>
                              )}
                              {spell.ritual && (
                                <Badge variant="outline" className="text-xs">R</Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {spell.castingTime || spell.actionType}
                              </span>
                              <span className="flex items-center gap-1">
                                <Target className="w-3 h-3" />
                                {spell.range}
                              </span>
                            </div>
                          </div>
                          
                          <ChevronDown className={`w-4 h-4 transition-transform ${expandedSpell === spell.name ? 'rotate-180' : ''}`} />
                        </div>
                      </CollapsibleTrigger>
                      
                      <CollapsibleContent>
                        <div className="px-3 pb-3 pt-0 border-t border-border mt-0">
                          <div className="pt-3 space-y-3">
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="text-muted-foreground">Componentes: </span>
                                <span>{getComponentsDisplay(spell.components)}</span>
                                {spell.material && <span className="text-xs text-muted-foreground"> ({spell.material})</span>}
                              </div>
                              <div>
                                <span className="text-muted-foreground">Duração: </span>
                                <span>{spell.duration}</span>
                              </div>
                            </div>
                            <p className="text-sm">{spell.description}</p>
                            {spell.cantripUpgrade && (
                              <p className="text-sm text-arcane">
                                <Zap className="w-3 h-3 inline mr-1" />
                                {spell.cantripUpgrade}
                              </p>
                            )}
                            {spell.upcast && (
                              <p className="text-sm text-primary">
                                <strong>Níveis superiores:</strong> {spell.upcast}
                              </p>
                            )}
                            <div className="flex flex-wrap gap-1">
                              {spell.classes.map(cls => (
                                <Badge key={cls} variant="secondary" className="text-xs capitalize">
                                  {cls}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>

      {/* Selected Spells Summary */}
      {selectedSpells.length > 0 && (
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Book className="w-4 h-4" />
              Magias Selecionadas ({selectedSpells.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {selectedSpells.map(name => {
                const spell = srdSpells.find(s => s.name === name);
                return (
                  <Badge 
                    key={name} 
                    variant="secondary"
                    className="cursor-pointer hover:bg-destructive/20"
                    onClick={() => toggleSpell(name)}
                  >
                    {name}
                    {spell?.level === 0 ? ' (C)' : ` (${spell?.level})`}
                    <X className="w-3 h-3 ml-1" />
                  </Badge>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
