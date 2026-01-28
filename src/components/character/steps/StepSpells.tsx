import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Search, 
  Sparkles, 
  Book, 
  Clock, 
  Target,
  Zap,
  Check,
  X
} from 'lucide-react';
import { Character } from '@/types/character';
import { characterClasses } from '@/data/classes';
import { spells, Spell, schoolColors, spellSlotsTable, cantripsKnown, getMaxSpellLevel } from '@/data/spells';

interface StepSpellsProps {
  character: Partial<Character>;
  updateCharacter: (updates: Partial<Character>) => void;
}

export function StepSpells({ character, updateCharacter }: StepSpellsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<number>(0);
  const [selectedSpell, setSelectedSpell] = useState<Spell | null>(null);

  // Get spellcasting info from class
  const primaryClass = character.classes?.[0];
  const classData = primaryClass ? characterClasses[primaryClass.className.toLowerCase()] : null;
  const spellcasting = classData?.spellcasting;
  
  const isSpellcaster = !!spellcasting;
  const maxSpellLevel = spellcasting ? getMaxSpellLevel(character.level || 1, spellcasting.type) : 0;
  const classLevel = primaryClass?.level || 1;
  
  // Get spell slots
  const spellSlots = spellSlotsTable[classLevel] || [];
  
  // Get cantrips known count
  const cantripsCount = spellcasting && cantripsKnown[primaryClass?.className.toLowerCase() || ''] 
    ? cantripsKnown[primaryClass?.className.toLowerCase() || ''][classLevel - 1] 
    : 0;

  // Get available spells for this class
  const availableSpells = useMemo(() => {
    if (!primaryClass) return [];
    const className = primaryClass.className;
    return spells.filter(s => 
      s.classes.some(c => c.toLowerCase() === className.toLowerCase()) &&
      s.level <= maxSpellLevel
    );
  }, [primaryClass, maxSpellLevel]);

  // Filter by search and level
  const filteredSpells = useMemo(() => {
    return availableSpells.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.school.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLevel = s.level === selectedLevel;
      return matchesSearch && matchesLevel;
    });
  }, [availableSpells, searchQuery, selectedLevel]);

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
    const spell = spells.find(s => s.name === name);
    return spell?.level === 0;
  }).length;

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

  return (
    <div className="space-y-6">
      {/* Spell Slots Display */}
      <Card className="bg-card/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-cinzel flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-arcane" />
            Slots de Magia - Nível {classLevel}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <div className="text-center p-2 rounded bg-muted/30 min-w-[60px]">
              <p className="text-xs text-muted-foreground">Cantrips</p>
              <p className="text-lg font-bold text-primary">{cantripsCount}</p>
              <p className="text-xs text-muted-foreground">{selectedCantrips} sel.</p>
            </div>
            {spellSlots.map((slots, idx) => (
              slots > 0 && (
                <div key={idx} className="text-center p-2 rounded bg-muted/30 min-w-[60px]">
                  <p className="text-xs text-muted-foreground">Nível {idx + 1}</p>
                  <p className="text-lg font-bold text-primary">{slots}</p>
                  <p className="text-xs text-muted-foreground">slots</p>
                </div>
              )
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Search and Level Filter */}
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
      </div>

      {/* Level Tabs */}
      <Tabs value={selectedLevel.toString()} onValueChange={(v) => setSelectedLevel(parseInt(v))}>
        <TabsList className="flex flex-wrap h-auto gap-1 bg-transparent">
          <TabsTrigger 
            value="0" 
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Cantrips
          </TabsTrigger>
          {Array.from({ length: maxSpellLevel }, (_, i) => i + 1).map(level => (
            <TabsTrigger 
              key={level} 
              value={level.toString()}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Nv. {level}
            </TabsTrigger>
          ))}
        </TabsList>

        {Array.from({ length: maxSpellLevel + 1 }, (_, i) => i).map(level => (
          <TabsContent key={level} value={level.toString()}>
            <ScrollArea className="h-[400px]">
              <motion.div 
                className="grid gap-2 pr-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
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
                        <Card 
                          className={`cursor-pointer transition-all ${
                            isSpellSelected(spell.name) 
                              ? 'border-primary bg-primary/10' 
                              : 'hover:border-primary/50'
                          }`}
                          onClick={() => setSelectedSpell(spell)}
                        >
                          <CardContent className="p-3 flex items-center gap-3">
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
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-medium">{spell.name}</span>
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs ${schoolColors[spell.school]}`}
                                >
                                  {spell.school}
                                </Badge>
                                {spell.concentration && (
                                  <Badge variant="secondary" className="text-xs">
                                    Concentração
                                  </Badge>
                                )}
                                {spell.ritual && (
                                  <Badge variant="secondary" className="text-xs">
                                    Ritual
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {spell.castingTime}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Target className="w-3 h-3" />
                                  {spell.range}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </motion.div>
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>

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
                const spell = spells.find(s => s.name === name);
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

      {/* Spell Detail Dialog */}
      <Dialog open={!!selectedSpell} onOpenChange={() => setSelectedSpell(null)}>
        <DialogContent className="max-w-lg parchment">
          <DialogHeader>
            <DialogTitle className="font-cinzel text-xl text-primary flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              {selectedSpell?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedSpell && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge className={schoolColors[selectedSpell.school]}>
                  {selectedSpell.school}
                </Badge>
                <Badge variant="secondary">
                  {selectedSpell.level === 0 ? 'Cantrip' : `Nível ${selectedSpell.level}`}
                </Badge>
                {selectedSpell.concentration && (
                  <Badge variant="outline">Concentração</Badge>
                )}
                {selectedSpell.ritual && (
                  <Badge variant="outline">Ritual</Badge>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Tempo de Conjuração</p>
                  <p className="font-medium">{selectedSpell.castingTime}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Alcance</p>
                  <p className="font-medium">{selectedSpell.range}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Componentes</p>
                  <p className="font-medium">{selectedSpell.components}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Duração</p>
                  <p className="font-medium">{selectedSpell.duration}</p>
                </div>
              </div>
              
              <div>
                <p className="text-muted-foreground mb-1">Descrição</p>
                <p className="text-sm">{selectedSpell.description}</p>
              </div>
              
              {selectedSpell.atHigherLevels && (
                <div>
                  <p className="text-muted-foreground mb-1">Em Níveis Superiores</p>
                  <p className="text-sm">{selectedSpell.atHigherLevels}</p>
                </div>
              )}
              
              <div className="flex justify-end">
                <Button
                  onClick={() => {
                    toggleSpell(selectedSpell.name);
                    setSelectedSpell(null);
                  }}
                  className={isSpellSelected(selectedSpell.name) ? 'bg-destructive' : 'btn-d20'}
                >
                  {isSpellSelected(selectedSpell.name) ? (
                    <>
                      <X className="w-4 h-4 mr-2" />
                      Remover
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Adicionar
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
