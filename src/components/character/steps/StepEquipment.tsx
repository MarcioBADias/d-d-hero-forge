import { useState, useMemo } from 'react';
import { Character } from '@/types/character';
import { equipment, armors, shields, hasArmorOrShield, calculateArmorAC } from '@/data/equipment';
import { backgrounds } from '@/data/backgrounds';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, AlertCircle, Shield } from 'lucide-react';
import { calculateModifier, getTotalAbilityScore } from '@/types/character';

interface StepEquipmentProps {
  character: Partial<Character>;
  updateCharacter: (updates: Partial<Character>) => void;
}

export function StepEquipment({ character, updateCharacter }: StepEquipmentProps) {
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number>(0);
  const selectedEquipment = character.selectedEquipment || [];
  
  // Get background data
  const bgData = backgrounds.find(b => b.name === character.backgroundName);
  const bgEquipmentOptions = bgData?.equipment || [];

  // Calculate DEX modifier for armor AC
  const dexMod = calculateModifier(getTotalAbilityScore(character.baseAbilities?.dex || 10, character.backgroundAbilityBonuses?.dex || 0, character.featAbilityBonuses?.dex || 0));

  // Get items that should be pre-selected based on background option
  const preselectedItems = useMemo(() => {
    const items: Set<string> = new Set();
    if (!bgData) return items;
    
    // Add items from selected background option
    if (bgEquipmentOptions[selectedOptionIndex]) {
      bgEquipmentOptions[selectedOptionIndex].items.forEach(item => {
        items.add(item);
      });
    }

    return items;
  }, [bgData, bgEquipmentOptions, selectedOptionIndex]);

  // Categories for display
  const categories = useMemo(() => {
    const cats = new Map<string, typeof equipment>();
    equipment.forEach(item => {
      if (!cats.has(item.Category)) {
        cats.set(item.Category, []);
      }
      cats.get(item.Category)!.push(item);
    });
    return cats;
  }, []);

  const toggleEquipment = (itemName: string, isSelected: boolean, isArmor: boolean = false, isShield: boolean = false) => {
    let newEquipment = [...selectedEquipment];
    
    if (isSelected) {
      newEquipment = newEquipment.filter(e => e !== itemName);
    } else {
      newEquipment.push(itemName);
    }

    // Update armor/shield AC if applicable
    let armorAC = character.armorAC;
    let shieldAC = character.shieldAC;
    let equippedArmor = character.equippedArmor;
    let equippedShield = character.equippedShield;

    if (isSelected) {
      // Removing item
      if (itemName === equippedArmor) {
        armorAC = 10 + dexMod; // Reset to base AC when armor is removed
        equippedArmor = undefined;
      }
      if (itemName === equippedShield) {
        shieldAC = undefined;
        equippedShield = undefined;
      }
    } else {
      // Adding item - only one armor and one shield can be equipped at a time
      if (isArmor) {
        const armorData = armors.find(a => a.name === itemName);
        if (armorData) {
          // Unequip previous armor if one was equipped
          if (equippedArmor && equippedArmor !== itemName) {
            // Remove the previous armor from equipped list but keep it in inventory
            equippedArmor = undefined;
            armorAC = undefined;
          }
          armorAC = calculateArmorAC(armorData, dexMod);
          equippedArmor = itemName;
        }
      } else if (isShield) {
        const shieldData = shields.find(s => s.name === itemName);
        if (shieldData) {
          // Unequip previous shield if one was equipped
          if (equippedShield && equippedShield !== itemName) {
            equippedShield = undefined;
            shieldAC = undefined;
          }
          shieldAC = shieldData.acBonus;
          equippedShield = itemName;
        }
      }
    }

    updateCharacter({
      selectedEquipment: newEquipment,
      armorAC,
      shieldAC,
      equippedArmor,
      equippedShield,
    });
  };

  const handleOptionChange = (optionIdx: number) => {
    setSelectedOptionIndex(optionIdx);
    
    // Auto-add items from the selected option
    const newEquipment = new Set<string>();
    
    if (bgEquipmentOptions[optionIdx]) {
      bgEquipmentOptions[optionIdx].items.forEach(item => {
        newEquipment.add(item);
      });
    }

    // Process armor/shield from selected option
    let newArmorAC = character.armorAC;
    let equippedArmor = character.equippedArmor;
    let newShieldAC = character.shieldAC;
    let equippedShield = character.equippedShield;

    // Check for armor in the new equipment
    for (const itemName of newEquipment) {
      const armor = armors.find(a => a.name === itemName);
      if (armor) {
        newArmorAC = calculateArmorAC(armor, dexMod);
        equippedArmor = itemName;
        break;
      }
    }

    // Check for shield in the new equipment
    for (const itemName of newEquipment) {
      const shield = shields.find(s => s.name === itemName);
      if (shield) {
        newShieldAC = shield.acBonus;
        equippedShield = itemName;
        break;
      }
    }

    updateCharacter({ 
      selectedEquipment: Array.from(newEquipment),
      armorAC: newArmorAC,
      equippedArmor,
      shieldAC: newShieldAC,
      equippedShield,
    });
  };

  const totalAC = 10 + (character.armorAC ? character.armorAC - 10 : 0) + (character.shieldAC || 0);

  return (
    <div className="space-y-6">
      {/* Background Option Selection */}
      {bgEquipmentOptions.length > 0 && (
        <Card className="parchment border-primary/30">
          <CardHeader>
            <CardTitle className="text-lg font-cinzel text-primary">Escolha de Equipamentos do Background</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <RadioGroup value={selectedOptionIndex.toString()} onValueChange={(v) => handleOptionChange(parseInt(v))}>
              <div className="space-y-3">
                {bgEquipmentOptions.map((option, idx) => (
                  <div key={idx} className="flex items-start space-x-2 p-3 rounded border border-border hover:border-primary/50 cursor-pointer">
                    <RadioGroupItem value={idx.toString()} id={`option-${idx}`} className="mt-1" />
                    <Label htmlFor={`option-${idx}`} className="flex-1 cursor-pointer">
                      <span className="font-semibold text-primary">{option.option}:</span>
                      <div className="text-sm text-muted-foreground mt-1">
                        {option.items.join(', ')}
                      </div>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
      )}

      {/* Equipment Selection */}
      <Card className="parchment">
        <CardHeader>
          <CardTitle className="font-cinzel text-primary flex items-center gap-2">
            <Package className="w-5 h-5" />
            Equipamentos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="Adventuring Gear">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="Armor" className="text-xs">Armors</TabsTrigger>
              <TabsTrigger value="Shield" className="text-xs">Shields</TabsTrigger>
              {Array.from(categories.keys()).map(cat => (
                <TabsTrigger key={cat} value={cat} className="text-xs">
                  {cat === 'Adventuring Gear' ? 'Gear' : cat}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Armor Tab */}
            <TabsContent value="Armor">
              <ScrollArea className="h-96">
                <div className="space-y-2 pr-4">
                  {armors.map(armor => {
                    const isSelected = selectedEquipment.includes(armor.name);
                    const acValue = calculateArmorAC(armor, dexMod);
                    
                    return (
                      <div
                        key={armor.name}
                        className={`p-3 rounded border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-primary/10 border-primary'
                            : 'bg-background/30 border-border hover:border-primary/50'
                        }`}
                        onClick={() => toggleEquipment(armor.name, isSelected, true, false)}
                      >
                        <div className="flex items-start gap-2">
                          <Checkbox checked={isSelected} className="mt-1" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-semibold">{armor.name}</span>
                              <Badge variant="outline" className="text-xs">
                                {armor.category}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                AC {armor.ac === 'dex' ? '11+DEX' : armor.ac === 'dex_max_2' ? `${armor.acBase}+DEX(max 2)` : acValue}
                              </Badge>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1 space-y-1">
                              <p>Peso: {armor.weight} | Custo: {armor.cost}</p>
                              {armor.strengthRequired && (
                                <p className="text-destructive">Força requisitada: {armor.strengthRequired}</p>
                              )}
                              {armor.stealthDisadvantage && (
                                <p className="text-destructive">Desvantagem em Furtividade</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Shield Tab */}
            <TabsContent value="Shield">
              <ScrollArea className="h-96">
                <div className="space-y-2 pr-4">
                  {shields.map(shield => {
                    const isSelected = selectedEquipment.includes(shield.name);
                    
                    return (
                      <div
                        key={shield.name}
                        className={`p-3 rounded border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-primary/10 border-primary'
                            : 'bg-background/30 border-border hover:border-primary/50'
                        }`}
                        onClick={() => toggleEquipment(shield.name, isSelected, false, true)}
                      >
                        <div className="flex items-start gap-2">
                          <Checkbox checked={isSelected} className="mt-1" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-semibold">{shield.name}</span>
                              <Badge variant="secondary" className="text-xs">
                                +{shield.acBonus} AC
                              </Badge>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              Peso: {shield.weight} | Custo: {shield.cost}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Gear Tabs */}
            {Array.from(categories.entries()).map(([category, items]) => (
              <TabsContent key={category} value={category}>
                <ScrollArea className="h-96">
                  <div className="space-y-2 pr-4">
                    {items.map(item => {
                      const isSelected = selectedEquipment.includes(item.Item);
                      const isPreselected = preselectedItems.has(item.Item);
                      
                      return (
                        <div
                          key={item.Item}
                          className={`p-3 rounded border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-primary/10 border-primary'
                              : isPreselected
                              ? 'bg-nature/5 border-nature/30'
                              : 'bg-background/30 border-border hover:border-primary/50'
                          }`}
                          onClick={() => toggleEquipment(item.Item, isSelected, false, false)}
                        >
                          <div className="flex items-start gap-2">
                            <Checkbox checked={isSelected} className="mt-1" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-semibold">{item.Item}</span>
                                {isPreselected && !isSelected && (
                                  <Badge variant="outline" className="text-xs bg-nature/10 text-nature">
                                    Background
                                  </Badge>
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1 space-y-1">
                                <p>Peso: {item.Weight} | Custo: {item.Cost}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </TabsContent>
            ))}
          </Tabs>

          {/* AC Summary */}
          <div className="mt-4 p-3 rounded bg-muted/30 border border-border flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-primary" />
            <div className="text-sm">
              <p className="font-semibold">AC Total: {totalAC}</p>
              {character.equippedArmor && <p className="text-xs text-muted-foreground">Armor: {character.equippedArmor}</p>}
              {character.equippedShield && <p className="text-xs text-muted-foreground">Shield: {character.equippedShield}</p>}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
