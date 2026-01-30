import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Footer } from '@/components/layout/Footer';
import { 
  Search, 
  Sword, 
  Sparkles, 
  Users, 
  BookOpen, 
  ArrowLeft,
  Star,
  Shield,
  Heart,
  Zap
} from 'lucide-react';
import { characterClasses, CharacterClassData } from '@/data/classes';
import { races, Race } from '@/data/races';
import { backgrounds, Background } from '@/data/backgrounds';
import { feats, Feat } from '@/data/feats';

type TabType = 'classes' | 'races' | 'backgrounds' | 'feats';

const tabIcons: Record<TabType, React.ComponentType<{ className?: string }>> = {
  classes: Sword,
  races: Users,
  backgrounds: BookOpen,
  feats: Star,
};

export default function Compendium() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('classes');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<CharacterClassData | null>(null);
  const [selectedRace, setSelectedRace] = useState<Race | null>(null);
  const [selectedBackground, setSelectedBackground] = useState<Background | null>(null);
  const [selectedFeat, setSelectedFeat] = useState<Feat | null>(null);

  const classesArray = Object.values(characterClasses);
  
  const filteredClasses = classesArray.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredRaces = races.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredBackgrounds = backgrounds.filter(b => 
    b.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const featsArray = Object.values(feats);
  const filteredFeats = featsArray.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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

      <main className="container mx-auto px-4 py-6">
        {/* Search Bar */}
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

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabType)} className="w-full">
          <TabsList className="grid grid-cols-4 max-w-2xl mx-auto mb-6 bg-card/50">
            {(['classes', 'races', 'backgrounds', 'feats'] as TabType[]).map((tab) => {
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
                     tab === 'backgrounds' ? 'Backgrounds' : 'Feats'}
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
                  <motion.div
                    key={cls.name}
                    variants={itemVariants}
                    layout
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
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
                            <Heart className="w-3 h-3 mr-1" />
                            d{cls.hitDie}
                          </Badge>
                          <Badge variant="secondary">
                            {cls.primaryAbility.join(' / ')}
                          </Badge>
                          {cls.spellcasting && (
                            <Badge className="bg-arcane/20 text-arcane border-arcane/30">
                              <Sparkles className="w-3 h-3 mr-1" />
                              Conjurador
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
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              <AnimatePresence mode="popLayout">
                {filteredRaces.map((race) => (
                  <motion.div
                    key={race.name}
                    variants={itemVariants}
                    layout
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card 
                      className="parchment cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all"
                      onClick={() => setSelectedRace(race)}
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="font-cinzel text-lg flex items-center gap-2">
                          <Users className="w-5 h-5 text-primary" />
                          {race.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge variant="secondary">{race.size.split(' ')[0]}</Badge>
                          <Badge className="bg-nature/20 text-nature border-nature/30">
                            <Zap className="w-3 h-3 mr-1" />
                            {race.speed}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {race.traits[0]?.split(':')[0]}...
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </TabsContent>

          {/* Backgrounds Tab */}
          <TabsContent value="backgrounds">
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              <AnimatePresence mode="popLayout">
                {filteredBackgrounds.map((bg) => (
                  <motion.div
                    key={bg.name}
                    variants={itemVariants}
                    layout
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card 
                      className="parchment cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all"
                      onClick={() => setSelectedBackground(bg)}
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="font-cinzel text-lg flex items-center gap-2">
                          <BookOpen className="w-5 h-5 text-primary" />
                          {bg.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge className="bg-primary/20 text-primary border-primary/30">
                            <Star className="w-3 h-3 mr-1" />
                            {bg.feat}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Perícias: {bg.skillProficiencies.join(', ')}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </TabsContent>

          {/* Feats Tab */}
          <TabsContent value="feats">
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              <AnimatePresence mode="popLayout">
                {filteredFeats.map((feat) => (
                  <motion.div
                    key={feat.name}
                    variants={itemVariants}
                    layout
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card 
                      className="parchment cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all"
                      onClick={() => setSelectedFeat(feat)}
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="font-cinzel text-lg flex items-center gap-2">
                          <Star className="w-5 h-5 text-primary" />
                          {feat.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge variant="secondary">{feat.type}</Badge>
                          {feat.abilityScoreIncrease && (
                            <Badge className="bg-nature/20 text-nature border-nature/30">
                              {feat.abilityScoreIncrease}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {feat.description.split('\n')[0]}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Class Detail Dialog */}
      <Dialog open={!!selectedClass} onOpenChange={() => setSelectedClass(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] parchment">
          <DialogHeader>
            <DialogTitle className="font-cinzel text-2xl text-primary flex items-center gap-2">
              <Sword className="w-6 h-6" />
              {selectedClass?.name}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            {selectedClass && (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-blood/20 text-blood border-blood/30">
                    <Heart className="w-3 h-3 mr-1" />
                    Hit Die: d{selectedClass.hitDie}
                  </Badge>
                  <Badge variant="secondary">
                    <Shield className="w-3 h-3 mr-1" />
                    Salvaguardas: {selectedClass.savingThrows.join(', ')}
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

      {/* Race Detail Dialog */}
      <Dialog open={!!selectedRace} onOpenChange={() => setSelectedRace(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] parchment">
          <DialogHeader>
            <DialogTitle className="font-cinzel text-2xl text-primary flex items-center gap-2">
              <Users className="w-6 h-6" />
              {selectedRace?.name}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            {selectedRace && (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{selectedRace.creatureType}</Badge>
                  <Badge variant="secondary">{selectedRace.size.split('(')[0].trim()}</Badge>
                  <Badge className="bg-nature/20 text-nature border-nature/30">
                    <Zap className="w-3 h-3 mr-1" />
                    {selectedRace.speed}
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground italic">
                  Fonte: {selectedRace.source}
                </p>

                <div>
                  <h4 className="font-semibold text-primary mb-2">Traits</h4>
                  <div className="space-y-2">
                    {selectedRace.traits.map((trait, i) => {
                      const [title, ...desc] = trait.split(': ');
                      return (
                        <div key={i} className="p-3 rounded bg-muted/30 border border-border">
                          <span className="font-medium">{title}</span>
                          {desc.length > 0 && (
                            <p className="text-sm text-muted-foreground mt-1">{desc.join(': ')}</p>
                          )}
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

      {/* Background Detail Dialog */}
      <Dialog open={!!selectedBackground} onOpenChange={() => setSelectedBackground(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] parchment">
          <DialogHeader>
            <DialogTitle className="font-cinzel text-2xl text-primary flex items-center gap-2">
              <BookOpen className="w-6 h-6" />
              {selectedBackground?.name}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            {selectedBackground && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground italic">
                  Fonte: {selectedBackground.source}
                </p>
                
                <p className="text-muted-foreground">{selectedBackground.info}</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-primary mb-2">Feat</h4>
                    <Badge className="bg-primary/20 text-primary border-primary/30">
                      {selectedBackground.feat}
                    </Badge>
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

      {/* Feat Detail Dialog */}
      <Dialog open={!!selectedFeat} onOpenChange={() => setSelectedFeat(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] parchment">
          <DialogHeader>
            <DialogTitle className="font-cinzel text-2xl text-primary flex items-center gap-2">
              <Star className="w-6 h-6" />
              {selectedFeat?.name}
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
                    <Badge className="bg-nature/20 text-nature border-nature/30">
                      {selectedFeat.abilityScoreIncrease}
                    </Badge>
                  )}
                </div>
                
                <p className="text-sm text-muted-foreground italic">
                  Fonte: {selectedFeat.source}
                </p>
                
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
