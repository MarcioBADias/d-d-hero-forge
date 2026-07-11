import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Footer } from '@/components/layout/Footer';
import { 
  Search, Sword, Sparkles, Users, BookOpen, ArrowLeft,
  Star, Shield, Heart, Zap, Wand2, ChevronDown, Clock, Target, Printer
} from 'lucide-react';
import { characterClasses, CharacterClassData } from '@/data/classes';
import { races, Race } from '@/data/races';
import { backgrounds, Background } from '@/data/backgrounds';
import { feats, Feat } from '@/data/feats';
import { srdSpells, SRDSpell } from '@/data/srdSpells';
import { getClassCards, getClassBackUrl } from '@/data/classCards';
import { printClassCardsToPdf } from '@/utils/classCardsPdf';
import { toast } from 'sonner';

type TabType = 'classes' | 'races' | 'backgrounds' | 'feats' | 'spells';

const tabIcons: Record<TabType, React.ComponentType<{ className?: string }>> = {
  classes: Sword,
  races: Users,
  backgrounds: BookOpen,
  feats: Star,
  spells: Wand2,
};

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

export default function Compendium() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('classes');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<CharacterClassData | null>(null);
  const [selectedRace, setSelectedRace] = useState<Race | null>(null);
  const [selectedBackground, setSelectedBackground] = useState<Background | null>(null);
  const [selectedFeat, setSelectedFeat] = useState<Feat | null>(null);
  const [spellLevelFilter, setSpellLevelFilter] = useState<number | null>(null);
  const [spellClassFilter, setSpellClassFilter] = useState<string>('');
  const [expandedSpell, setExpandedSpell] = useState<string | null>(null);

  const classesArray = Object.values(characterClasses);
  const featsArray = Object.values(feats);
  
  const filteredClasses = classesArray.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredRaces = races.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredBackgrounds = backgrounds.filter(b => 
    b.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredFeats = featsArray.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSpells = useMemo(() => {
    return srdSpells.filter(spell => {
      const matchesSearch = spell.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        spell.school.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLevel = spellLevelFilter === null || spell.level === spellLevelFilter;
      const matchesClass = !spellClassFilter || 
        spell.classes.some(c => c.toLowerCase() === spellClassFilter.toLowerCase());
      return matchesSearch && matchesLevel && matchesClass;
    });
  }, [searchQuery, spellLevelFilter, spellClassFilter]);

  const spellClasses = useMemo(() => {
    const classes = new Set<string>();
    srdSpells.forEach(spell => spell.classes.forEach(c => classes.add(c)));
    return Array.from(classes).sort();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate('/')} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden md:inline">Voltar</span>
            </Button>
            <h1 className="text-xl md:text-2xl font-cinzel text-primary flex items-center gap-2">
              <BookOpen className="w-6 h-6" />
              Compêndio
            </h1>
            <div className="w-20" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 flex-1">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative max-w-md mx-auto mb-6"
        >
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input 
            placeholder="Buscar no compêndio..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card/50 border-primary/20 focus:border-primary"
          />
        </motion.div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabType)} className="w-full">
          <TabsList className="grid grid-cols-5 max-w-3xl mx-auto mb-6 bg-card/50">
            {(['classes', 'races', 'backgrounds', 'feats', 'spells'] as TabType[]).map((tab) => {
              const Icon = tabIcons[tab];
              return (
                <TabsTrigger 
                  key={tab} 
                  value={tab}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2"
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline capitalize">
                    {tab === 'classes' ? 'Classes' : 
                     tab === 'races' ? 'Raças' : 
                     tab === 'backgrounds' ? 'Backgrounds' : 
                     tab === 'feats' ? 'Feats' : 'Magias'}
                  </span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Classes Tab */}
          <TabsContent value="classes">
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              <AnimatePresence mode="popLayout">
                {filteredClasses.map((cls) => (
                  <motion.div key={cls.name} variants={itemVariants} layout whileHover={{ scale: 1.02 }}>
                    <Card 
                      className="parchment cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all"
                      onClick={() => setSelectedClass(cls)}
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="font-cinzel text-lg flex items-center gap-2">
                          <Sword className="w-5 h-5 text-primary" />
                          {cls.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge className="bg-blood/20 text-blood border-blood/30">
                            <Heart className="w-3 h-3 mr-1" />d{cls.hitDie}
                          </Badge>
                          <Badge variant="secondary">{cls.primaryAbility.join(' / ')}</Badge>
                          {cls.spellcasting && (
                            <Badge className="bg-arcane/20 text-arcane border-arcane/30">
                              <Sparkles className="w-3 h-3 mr-1" />Conjurador
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Salvaguardas: {cls.savingThrows.join(', ')}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </TabsContent>

          {/* Races Tab */}
          <TabsContent value="races">
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence mode="popLayout">
                {filteredRaces.map((race) => (
                  <motion.div key={race.name} variants={itemVariants} layout whileHover={{ scale: 1.02 }}>
                    <Card className="parchment cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all" onClick={() => setSelectedRace(race)}>
                      <CardHeader className="pb-2">
                        <CardTitle className="font-cinzel text-lg flex items-center gap-2">
                          <Users className="w-5 h-5 text-primary" />{race.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge variant="secondary">{race.size.split(' ')[0]}</Badge>
                          <Badge className="bg-nature/20 text-nature border-nature/30">
                            <Zap className="w-3 h-3 mr-1" />{race.speed}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </TabsContent>

          {/* Backgrounds Tab */}
          <TabsContent value="backgrounds">
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence mode="popLayout">
                {filteredBackgrounds.map((bg) => (
                  <motion.div key={bg.name} variants={itemVariants} layout whileHover={{ scale: 1.02 }}>
                    <Card className="parchment cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all" onClick={() => setSelectedBackground(bg)}>
                      <CardHeader className="pb-2">
                        <CardTitle className="font-cinzel text-lg flex items-center gap-2">
                          <BookOpen className="w-5 h-5 text-primary" />{bg.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Badge className="bg-primary/20 text-primary border-primary/30">
                          <Star className="w-3 h-3 mr-1" />{bg.feat}
                        </Badge>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </TabsContent>

          {/* Feats Tab */}
          <TabsContent value="feats">
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence mode="popLayout">
                {filteredFeats.map((feat) => (
                  <motion.div key={feat.name} variants={itemVariants} layout whileHover={{ scale: 1.02 }}>
                    <Card className="parchment cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all" onClick={() => setSelectedFeat(feat)}>
                      <CardHeader className="pb-2">
                        <CardTitle className="font-cinzel text-lg flex items-center gap-2">
                          <Star className="w-5 h-5 text-primary" />{feat.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary">{feat.type}</Badge>
                          {feat.abilityScoreIncrease && (
                            <Badge className="bg-nature/20 text-nature border-nature/30">{feat.abilityScoreIncrease}</Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </TabsContent>

          {/* Spells Tab */}
          <TabsContent value="spells">
            <div className="space-y-4">
              {/* Filters */}
              <div className="flex flex-wrap gap-2 justify-center">
                <select
                  value={spellLevelFilter ?? ''}
                  onChange={(e) => setSpellLevelFilter(e.target.value === '' ? null : parseInt(e.target.value))}
                  className="border rounded px-3 py-2 bg-background text-sm"
                >
                  <option value="">Todos os níveis</option>
                  <option value="0">Cantrips</option>
                  {[1,2,3,4,5,6,7,8,9].map(lvl => (
                    <option key={lvl} value={lvl}>Nível {lvl}</option>
                  ))}
                </select>
                <select
                  value={spellClassFilter}
                  onChange={(e) => setSpellClassFilter(e.target.value)}
                  className="border rounded px-3 py-2 bg-background text-sm"
                >
                  <option value="">Todas as classes</option>
                  {spellClasses.map(c => (
                    <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                  ))}
                </select>
              </div>

              {/* Spell Count */}
              <p className="text-center text-muted-foreground text-sm">
                {filteredSpells.length} magias encontradas
              </p>

              {/* Spell List */}
              <ScrollArea className="h-[60vh]">
                <div className="space-y-2 pr-4">
                  {filteredSpells.map((spell) => {
                    const isExpanded = expandedSpell === spell.name;
                    return (
                      <Collapsible
                        key={spell.name}
                        open={isExpanded}
                        onOpenChange={() => setExpandedSpell(isExpanded ? null : spell.name)}
                      >
                        <Card className="parchment">
                          <CollapsibleTrigger className="w-full p-4 text-left">
                            <div className="flex items-center gap-2">
                              <Wand2 className="w-4 h-4 text-arcane" />
                              <span className="font-medium flex-1">{spell.name}</span>
                              <Badge className={schoolColors[spell.school]}>{spell.school}</Badge>
                              <Badge variant="secondary">
                                {spell.level === 0 ? 'Cantrip' : `Nv. ${spell.level}`}
                              </Badge>
                              {spell.concentration && <Badge variant="outline">C</Badge>}
                              {spell.ritual && <Badge variant="outline">R</Badge>}
                              <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                            </div>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <div className="px-4 pb-4 space-y-2 text-sm">
                              <div className="flex flex-wrap gap-4 text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {spell.castingTime || spell.actionType}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Target className="w-3 h-3" />
                                  {spell.range}
                                </span>
                                <span>Componentes: {spell.components.join(', ').toUpperCase()}</span>
                                <span>Duração: {spell.duration}</span>
                              </div>
                              {spell.material && (
                                <p className="text-muted-foreground italic">Material: {spell.material}</p>
                              )}
                              <p>{spell.description}</p>
                              {spell.upcast && (
                                <p className="text-primary">
                                  <strong>Em níveis superiores:</strong> {spell.upcast}
                                </p>
                              )}
                              {spell.cantripUpgrade && (
                                <p className="text-primary">
                                  <strong>Níveis superiores:</strong> {spell.cantripUpgrade}
                                </p>
                              )}
                              <p className="text-xs text-muted-foreground">
                                Classes: {spell.classes.join(', ')}
                              </p>
                            </div>
                          </CollapsibleContent>
                        </Card>
                      </Collapsible>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Dialogs */}
      <Dialog open={!!selectedClass} onOpenChange={() => setSelectedClass(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] parchment">
          <DialogHeader>
            <DialogTitle className="font-cinzel text-2xl text-primary flex items-center gap-2">
              <Sword className="w-6 h-6" />{selectedClass?.name}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            {selectedClass && (
              <div className="space-y-4">
                {getClassCards(selectedClass.name).length > 0 && (
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={async () => {
                        const all = getClassCards(selectedClass.name);
                        try {
                          await printClassCardsToPdf(
                            all,
                            `${selectedClass.name.toLowerCase()}_cards.pdf`,
                            getClassBackUrl(selectedClass.name),
                          );
                          toast.success('PDF de cards gerado!');
                        } catch (e) {
                          console.error(e);
                          toast.error('Erro ao gerar PDF');
                        }
                      }}
                    >
                      <Printer className="w-4 h-4" />
                      Imprimir Cards (A4, 3x3, frente e verso)
                    </Button>
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-blood/20 text-blood border-blood/30">
                    <Heart className="w-3 h-3 mr-1" />Hit Die: d{selectedClass.hitDie}
                  </Badge>
                  <Badge variant="secondary">
                    <Shield className="w-3 h-3 mr-1" />Salvaguardas: {selectedClass.savingThrows.join(', ')}
                  </Badge>
                </div>
                <div>
                  <h4 className="font-semibold text-primary mb-2">Proficiências</h4>
                  <p className="text-sm text-muted-foreground">
                    <strong>Armaduras:</strong> {selectedClass.armorProficiencies.join(', ') || 'Nenhuma'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Armas:</strong> {selectedClass.weaponProficiencies.join(', ')}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Perícias ({selectedClass.numSkills}):</strong> {selectedClass.skillChoices.join(', ')}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-primary mb-2">Habilidades por Nível</h4>
                  <div className="space-y-2">
                    {selectedClass.features.map((feature, i) => (
                      <div key={i} className="p-3 rounded bg-muted/30 border border-border">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">Nv. {feature.level}</Badge>
                          <span className="font-medium">{feature.title}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedRace} onOpenChange={() => setSelectedRace(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] parchment">
          <DialogHeader>
            <DialogTitle className="font-cinzel text-2xl text-primary flex items-center gap-2">
              <Users className="w-6 h-6" />{selectedRace?.name}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            {selectedRace && (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{selectedRace.creatureType}</Badge>
                  <Badge variant="secondary">{selectedRace.size.split('(')[0].trim()}</Badge>
                  <Badge className="bg-nature/20 text-nature border-nature/30">
                    <Zap className="w-3 h-3 mr-1" />{selectedRace.speed}
                  </Badge>
                </div>
                <div>
                  <h4 className="font-semibold text-primary mb-2">Traits</h4>
                  <div className="space-y-2">
                    {selectedRace.traits.map((trait, i) => {
                      const [title, ...desc] = trait.split(': ');
                      return (
                        <div key={i} className="p-3 rounded bg-muted/30 border border-border">
                          <span className="font-medium">{title}</span>
                          {desc.length > 0 && <p className="text-sm text-muted-foreground mt-1">{desc.join(': ')}</p>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedBackground} onOpenChange={() => setSelectedBackground(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] parchment">
          <DialogHeader>
            <DialogTitle className="font-cinzel text-2xl text-primary flex items-center gap-2">
              <BookOpen className="w-6 h-6" />{selectedBackground?.name}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            {selectedBackground && (
              <div className="space-y-4">
                <p className="text-muted-foreground">{selectedBackground.info}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-primary mb-2">Feat</h4>
                    <Badge className="bg-primary/20 text-primary border-primary/30">{selectedBackground.feat}</Badge>
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary mb-2">Atributos</h4>
                    <p className="text-sm">{selectedBackground.abilityScores.join(', ')}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-primary mb-2">Perícias</h4>
                  <p className="text-sm">{selectedBackground.skillProficiencies.join(', ')}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-primary mb-2">Ferramenta</h4>
                  <p className="text-sm">{selectedBackground.toolProficiency}</p>
                </div>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedFeat} onOpenChange={() => setSelectedFeat(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] parchment">
          <DialogHeader>
            <DialogTitle className="font-cinzel text-2xl text-primary flex items-center gap-2">
              <Star className="w-6 h-6" />{selectedFeat?.name}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            {selectedFeat && (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{selectedFeat.type}</Badge>
                  {selectedFeat.prerequisites && (
                    <Badge variant="outline">Pré-req: {selectedFeat.prerequisites}</Badge>
                  )}
                  {selectedFeat.abilityScoreIncrease && (
                    <Badge className="bg-nature/20 text-nature border-nature/30">{selectedFeat.abilityScoreIncrease}</Badge>
                  )}
                </div>
                <div className="prose prose-sm prose-invert max-w-none">
                  {selectedFeat.description.split('\n').map((line, i) => (
                    <p key={i} className="text-muted-foreground">{line}</p>
                  ))}
                </div>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
