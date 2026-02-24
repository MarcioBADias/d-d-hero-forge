import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { allWeapons, Weapon, calculateAttackBonus, calculateDamage } from '@/data/weapons';
import { calculateModifier, formatModifier, getTotalAbilityScore, AbilityScores, AbilityBonuses, CustomAttack } from '@/types/character';
import { Sword, Plus, X } from 'lucide-react';

interface AttackSectionProps {
  equippedWeapons: string[];
  weaponEquipStates: Record<string, boolean>;
  baseAbilities: AbilityScores;
  backgroundBonuses: AbilityBonuses;
  featBonuses: AbilityBonuses;
  proficiencyBonus: number;
  characterClass: string;
  customAttacks?: CustomAttack[];
  onToggleWeapon: (weaponName: string, equipped: boolean) => void;
  onAddWeapon: (weaponName: string) => void;
  onRemoveWeapon: (weaponName: string) => void;
  onCustomAttacksChange?: (attacks: CustomAttack[]) => void;
  readOnly?: boolean;
}

export function AttackSection({
  equippedWeapons,
  weaponEquipStates,
  baseAbilities,
  backgroundBonuses,
  featBonuses,
  proficiencyBonus,
  characterClass,
  customAttacks = [],
  onToggleWeapon,
  onAddWeapon,
  onRemoveWeapon,
  onCustomAttacksChange,
  readOnly = false,
}: AttackSectionProps) {
  const [addWeaponOpen, setAddWeaponOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [addTab, setAddTab] = useState('weapon');
  const [customName, setCustomName] = useState('');
  const [customBonus, setCustomBonus] = useState('');
  const [customDamage, setCustomDamage] = useState('');
  const [customDamageType, setCustomDamageType] = useState('');
  const [customNotes, setCustomNotes] = useState('');

  const strMod = calculateModifier(getTotalAbilityScore(baseAbilities.str, backgroundBonuses.str, featBonuses.str));
  const dexMod = calculateModifier(getTotalAbilityScore(baseAbilities.dex, backgroundBonuses.dex, featBonuses.dex));

  const hasMartialProficiency = !['wizard', 'sorcerer'].includes(characterClass.toLowerCase());

  const getWeaponData = (weaponName: string) => allWeapons.find(w => w.name === weaponName);

  const hasWeaponProficiency = (weapon: Weapon) => {
    return weapon.category === 'Simple' || (hasMartialProficiency && weapon.category === 'Martial');
  };

  const filteredWeapons = allWeapons.filter(w => 
    w.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !equippedWeapons.includes(w.name)
  );

  const addCustomAttack = () => {
    if (!customName.trim()) return;
    const attack: CustomAttack = {
      name: customName.trim(),
      attackBonus: parseInt(customBonus) || 0,
      damage: customDamage.trim() || '1d4',
      damageType: customDamageType.trim() || 'slashing',
      notes: customNotes.trim() || undefined,
    };
    onCustomAttacksChange?.([...customAttacks, attack]);
    setCustomName('');
    setCustomBonus('');
    setCustomDamage('');
    setCustomDamageType('');
    setCustomNotes('');
    setAddWeaponOpen(false);
  };

  const removeCustomAttack = (index: number) => {
    onCustomAttacksChange?.(customAttacks.filter((_, i) => i !== index));
  };

  return (
    <Card className="parchment bg-gradient-to-r from-destructive/5 to-orange-500/5">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-cinzel text-primary flex items-center gap-2">
            <Sword className="w-5 h-5" />
            Ataques
          </CardTitle>
          {!readOnly && (
            <Dialog open={addWeaponOpen} onOpenChange={setAddWeaponOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Adicionar Ataque
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="font-cinzel">Adicionar Ataque</DialogTitle>
                </DialogHeader>
                <Tabs value={addTab} onValueChange={setAddTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="weapon">Arma do SRD</TabsTrigger>
                    <TabsTrigger value="custom">Ataque Personalizado</TabsTrigger>
                  </TabsList>
                  <TabsContent value="weapon" className="space-y-4">
                    <input
                      type="text"
                      placeholder="Buscar arma..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                    <ScrollArea className="h-[400px]">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pr-4">
                        {filteredWeapons.map((weapon) => {
                          const hasProficiency = hasWeaponProficiency(weapon);
                          const attackBonus = calculateAttackBonus(weapon, strMod, dexMod, proficiencyBonus, hasProficiency);
                          const damage = calculateDamage(weapon, strMod, dexMod);
                          
                          return (
                            <div
                              key={weapon.name}
                              className="p-3 rounded-lg border border-border hover:border-primary cursor-pointer transition"
                              onClick={() => {
                                onAddWeapon(weapon.name);
                                setAddWeaponOpen(false);
                              }}
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium">{weapon.name}</p>
                                  <div className="flex gap-2 mt-1">
                                    <Badge variant="outline" className="text-xs">{weapon.category}</Badge>
                                    <Badge variant="outline" className="text-xs">{weapon.type}</Badge>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-semibold text-destructive">{formatModifier(attackBonus)}</p>
                                  <p className="text-xs text-muted-foreground">{damage}</p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                  <TabsContent value="custom" className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Nome do Ataque</label>
                      <Input value={customName} onChange={(e) => setCustomName(e.target.value)} placeholder="Ex: Sopro de Fogo, Mordida..." />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Bônus de Ataque</label>
                        <Input type="number" value={customBonus} onChange={(e) => setCustomBonus(e.target.value)} placeholder="Ex: 5" />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Dano</label>
                        <Input value={customDamage} onChange={(e) => setCustomDamage(e.target.value)} placeholder="Ex: 2d6+3" />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Tipo de Dano</label>
                      <Input value={customDamageType} onChange={(e) => setCustomDamageType(e.target.value)} placeholder="Ex: fire, slashing..." />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Notas (opcional)</label>
                      <Input value={customNotes} onChange={(e) => setCustomNotes(e.target.value)} placeholder="Ex: CD 15 Dex save, metade do dano..." />
                    </div>
                    <DialogFooter>
                      <Button onClick={addCustomAttack} disabled={!customName.trim()}>Adicionar Ataque</Button>
                    </DialogFooter>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {equippedWeapons.length === 0 && customAttacks.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">Nenhuma arma equipada</p>
        ) : (
          <div className="space-y-3">
            {/* Standard Weapons */}
            {equippedWeapons.map((weaponName) => {
              const weapon = getWeaponData(weaponName);
              if (!weapon) return null;

              const isEquipped = weaponEquipStates[weaponName] ?? true;
              const hasProficiency = hasWeaponProficiency(weapon);
              const attackBonus = calculateAttackBonus(weapon, strMod, dexMod, proficiencyBonus, hasProficiency);
              const damage = calculateDamage(weapon, strMod, dexMod);

              return (
                <div
                  key={weaponName}
                  className={`p-4 rounded-lg border transition ${
                    isEquipped 
                      ? 'bg-destructive/10 border-destructive/30' 
                      : 'bg-muted/30 border-border opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Switch
                          id={`equip-${weaponName}`}
                          checked={isEquipped}
                          onCheckedChange={(checked) => onToggleWeapon(weaponName, checked)}
                          disabled={readOnly}
                        />
                        <Label htmlFor={`equip-${weaponName}`} className="text-xs text-muted-foreground">
                          {isEquipped ? 'Equipada' : 'Guardada'}
                        </Label>
                      </div>
                      <h4 className="font-semibold">{weapon.name}</h4>
                      <Badge variant="outline" className="text-xs">{weapon.type}</Badge>
                    </div>
                    {!readOnly && (
                      <Button variant="ghost" size="sm" onClick={() => onRemoveWeapon(weaponName)}>
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  {isEquipped && (
                    <div className="grid grid-cols-3 gap-3 mt-3">
                      <div className="p-2 rounded bg-background/50 text-center">
                        <p className="text-xs text-muted-foreground mb-1">Ataque</p>
                        <p className="text-xl font-bold text-destructive">{formatModifier(attackBonus)}</p>
                        <p className="text-xs text-muted-foreground">
                          {weapon.abilityModifier === 'finesse' 
                            ? `${formatModifier(Math.max(strMod, dexMod))}` 
                            : weapon.abilityModifier === 'str'
                            ? `FOR ${formatModifier(strMod)}`
                            : `DEX ${formatModifier(dexMod)}`}
                          {hasProficiency && ` + ${proficiencyBonus}`}
                        </p>
                      </div>
                      <div className="p-2 rounded bg-background/50 text-center">
                        <p className="text-xs text-muted-foreground mb-1">Dano</p>
                        <p className="text-lg font-bold text-orange-600 dark:text-orange-400">{damage}</p>
                        <p className="text-xs text-muted-foreground">{weapon.damageType}</p>
                      </div>
                      <div className="p-2 rounded bg-background/50 text-center">
                        <p className="text-xs text-muted-foreground mb-1">Mestria</p>
                        <p className="text-sm font-medium">{weapon.mastery}</p>
                      </div>
                    </div>
                  )}

                  {weapon.properties.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {weapon.properties.map((prop) => (
                        <Badge key={prop} variant="secondary" className="text-xs">{prop}</Badge>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Custom Attacks */}
            {customAttacks.map((attack, idx) => (
              <div
                key={`custom-${idx}`}
                className="p-4 rounded-lg border bg-arcane/10 border-arcane/30"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{attack.name}</h4>
                    <Badge variant="outline" className="text-xs bg-arcane/20">Personalizado</Badge>
                  </div>
                  {!readOnly && (
                    <Button variant="ghost" size="sm" onClick={() => removeCustomAttack(idx)}>
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-2 rounded bg-background/50 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Ataque</p>
                    <p className="text-xl font-bold text-destructive">{formatModifier(attack.attackBonus)}</p>
                  </div>
                  <div className="p-2 rounded bg-background/50 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Dano</p>
                    <p className="text-lg font-bold text-orange-600 dark:text-orange-400">{attack.damage}</p>
                    <p className="text-xs text-muted-foreground">{attack.damageType}</p>
                  </div>
                  {attack.notes && (
                    <div className="p-2 rounded bg-background/50 text-center">
                      <p className="text-xs text-muted-foreground mb-1">Notas</p>
                      <p className="text-xs">{attack.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
