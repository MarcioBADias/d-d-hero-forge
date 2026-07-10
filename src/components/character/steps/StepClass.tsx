import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Character, ClassLevel } from '@/types/character';
import { characterClasses, classNames } from '@/data/classes';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Sword, Heart, Sparkles, Shield, Printer } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { getClassCards, getClassCardsForLevel } from '@/data/classCards';
import { printClassCardsToPdf } from '@/utils/classCardsPdf';
import { toast } from 'sonner';

interface StepClassProps {
  character: Partial<Character>;
  updateCharacter: (updates: Partial<Character>) => void;
}

export function StepClass({ character, updateCharacter }: StepClassProps) {
  const totalLevel = character.level || 1;
  const classes = character.classes || [];
  const usedLevels = classes.reduce((sum, c) => sum + c.level, 0);
  const remainingLevels = totalLevel - usedLevels;

  const addClass = () => {
    if (remainingLevels <= 0) return;
    
    const availableClasses = classNames.filter(
      (cn) => !classes.some((c) => c.className === cn)
    );
    
    if (availableClasses.length === 0) return;

    const newClass: ClassLevel = {
      className: availableClasses[0],
      level: Math.min(1, remainingLevels),
    };
    
    updateCharacter({ classes: [...classes, newClass] });
  };

  const removeClass = (index: number) => {
    const newClasses = classes.filter((_, i) => i !== index);
    updateCharacter({ classes: newClasses });
  };

  const updateClass = (index: number, updates: Partial<ClassLevel>) => {
    const newClasses = classes.map((c, i) => 
      i === index ? { ...c, ...updates } : c
    );
    updateCharacter({ classes: newClasses });
  };

  const getClassDetails = (className: string) => {
    return characterClasses[className.toLowerCase()];
  };

  const getLevelOptions = (currentClassLevel: number) => {
    const otherLevels = classes.reduce((sum, c, i) => 
      c.className === classes[classes.findIndex(cl => cl.level === currentClassLevel)]?.className ? sum : sum + c.level, 0
    );
    const maxForThis = totalLevel - otherLevels;
    return Array.from({ length: maxForThis }, (_, i) => i + 1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-lg font-cinzel text-primary">Classes</Label>
          <p className="text-sm text-muted-foreground">
            Nível total: {usedLevels}/{totalLevel} 
            {remainingLevels > 0 && ` (${remainingLevels} restante${remainingLevels > 1 ? 's' : ''})`}
          </p>
        </div>
        {classes.length > 0 && remainingLevels > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={addClass}
            className="gap-1"
          >
            <Plus className="w-4 h-4" />
            Multiclasse
          </Button>
        )}
      </div>

      {/* No class selected */}
      {classes.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
          <Sword className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">Nenhuma classe selecionada</p>
          <Button onClick={addClass} className="btn-d20">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Classe
          </Button>
        </div>
      )}

      {/* Class List */}
      <div className="space-y-4">
        {classes.map((classLevel, index) => {
          const classData = getClassDetails(classLevel.className);
          const availableClasses = classNames.filter(
            (cn) => cn === classLevel.className || !classes.some((c) => c.className === cn)
          );

          return (
            <div key={index} className="p-4 rounded-lg bg-background/30 border border-border animate-fade-in">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <Select
                    value={classLevel.className}
                    onValueChange={(v) => updateClass(index, { className: v })}
                  >
                    <SelectTrigger className="bg-background/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableClasses.map((cn) => (
                        <SelectItem key={cn} value={cn}>
                          {characterClasses[cn.toLowerCase()]?.name || cn}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={classLevel.level.toString()}
                    onValueChange={(v) => updateClass(index, { level: parseInt(v) })}
                  >
                    <SelectTrigger className="bg-background/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: totalLevel - usedLevels + classLevel.level }, (_, i) => i + 1).map((lvl) => (
                        <SelectItem key={lvl} value={lvl.toString()}>
                          Nível {lvl}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {classes.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeClass(index)}
                    className="text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {/* Class Details */}
              {classData && (
                <div className="space-y-3">
                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4 text-blood" />
                      <span>d{classData.hitDie} Hit Die</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Shield className="w-4 h-4 text-primary" />
                      <span>{classData.armorProficiencies.join(', ') || 'Nenhuma'}</span>
                    </div>
                    {classData.spellcasting && (
                      <div className="flex items-center gap-1">
                        <Sparkles className="w-4 h-4 text-arcane" />
                        <span>Conjurador ({classData.spellcasting.ability})</span>
                      </div>
                    )}
                  </div>

                  {/* Class Skill Selection */}
                  {classData.skillChoices && classData.skillChoices.length > 0 && (
                    <div className="pt-3">
                      <h5 className="text-sm font-semibold text-primary mb-2">Escolher Perícias ({classData.numSkills})</h5>
                      <div className="flex flex-wrap gap-2">
                        {(classData.skillChoices || []).map((skill) => {
                          const selected = (character.skills || []).includes(skill);
                          const canSelectMore = (character.skills || []).filter(s => (classData.skillChoices || []).includes(s)).length < classData.numSkills || selected;
                          return (
                            <Button
                              key={skill}
                              variant={selected ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => {
                                const current = character.skills || [];
                                if (selected) {
                                  updateCharacter({ skills: current.filter(s => s !== skill) });
                                } else if (canSelectMore) {
                                  updateCharacter({ skills: Array.from(new Set([...current, skill])) });
                                }
                              }}
                              className="gap-2"
                            >
                              {skill}
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Features */}
                  <Accordion type="single" collapsible>
                    <AccordionItem value="features" className="border-none">
                      <AccordionTrigger className="text-sm text-primary hover:no-underline py-2">
                        Ver Habilidades até Nível {classLevel.level}
                      </AccordionTrigger>
                      <AccordionContent>
                        {(() => {
                          const cards = getClassCardsForLevel(classLevel.className, classLevel.level);
                          if (cards.length === 0) {
                            return (
                              <ScrollArea className="h-48">
                                <div className="space-y-2 pr-4">
                                  {classData.features
                                    .filter((f) => f.level <= classLevel.level)
                                    .map((feature, idx) => (
                                      <div key={idx} className="p-2 rounded bg-muted/30">
                                        <div className="flex items-center gap-2">
                                          <Badge variant="outline" className="text-xs">
                                            Nv. {feature.level}
                                          </Badge>
                                          <span className="font-semibold text-sm">{feature.title}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1">
                                          {feature.description}
                                        </p>
                                      </div>
                                    ))}
                                </div>
                              </ScrollArea>
                            );
                          }
                          return (
                            <div className="space-y-3">
                              <div className="flex justify-end">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="gap-2"
                                  onClick={async () => {
                                    const all = getClassCards(classLevel.className);
                                    try {
                                      await printClassCardsToPdf(
                                        all,
                                        `${classLevel.className.toLowerCase()}_cards.pdf`
                                      );
                                      toast.success('PDF de cards gerado!');
                                    } catch (e) {
                                      console.error(e);
                                      toast.error('Erro ao gerar PDF');
                                    }
                                  }}
                                >
                                  <Printer className="w-4 h-4" />
                                  Imprimir Cards (A4, 3x3)
                                </Button>
                              </div>
                              <ScrollArea className="h-96">
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pr-4">
                                  {cards.map((card) => (
                                    <div
                                      key={card.id}
                                      className="rounded-lg overflow-hidden border border-border bg-background/40 hover:border-primary transition-colors"
                                      title={card.label}
                                    >
                                      <img
                                        src={card.url}
                                        alt={card.label}
                                        loading="lazy"
                                        className="w-full h-auto block"
                                      />
                                    </div>
                                  ))}
                                </div>
                              </ScrollArea>
                            </div>
                          );
                        })()}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
