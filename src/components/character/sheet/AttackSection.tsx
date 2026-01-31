import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { allWeapons, Weapon, calculateAttackBonus, calculateDamage } from '@/data/weapons';
import { calculateModifier, formatModifier, getTotalAbilityScore, AbilityScores, AbilityBonuses } from '@/types/character';
import { Sword, Plus, X, Shield } from 'lucide-react';

interface EquippedItem {
  name: string;
  type: 'weapon' | 'armor' | 'shield';
  equipped: boolean;
}

interface AttackSectionProps {
  equippedWeapons: string[];
  weaponEquipStates: Record<string, boolean>;
  baseAbilities: AbilityScores;
  backgroundBonuses: AbilityBonuses;
  featBonuses: AbilityBonuses;
  proficiencyBonus: number;
  characterClass: string;
  onToggleWeapon: (weaponName: string, equipped: boolean) => void;
  onAddWeapon: (weaponName: string) => void;
  onRemoveWeapon: (weaponName: string) => void;
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
  onToggleWeapon,
  onAddWeapon,
  onRemoveWeapon,
  readOnly = false,
}: AttackSectionProps) {
  const [addWeaponOpen, setAddWeaponOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const strMod = calculateModifier(getTotalAbilityScore(baseAbilities.str, backgroundBonuses.str, featBonuses.str));
  const dexMod = calculateModifier(getTotalAbilityScore(baseAbilities.dex, backgroundBonuses.dex, featBonuses.dex));

  // Simplified proficiency check
  const hasMartialProficiency = !['wizard', 'sorcerer'].includes(characterClass.toLowerCase());

  const getWeaponData = (weaponName: string) => allWeapons.find(w => w.name === weaponName);

  const hasWeaponProficiency = (weapon: Weapon) => {
    return weapon.category === 'Simple' || (hasMartialProficiency && weapon.category === 'Martial');
  };

  const filteredWeapons = allWeapons.filter(w => 
    w.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !equippedWeapons.includes(w.name)
  );

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
                  Adicionar Arma
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="font-cinzel">Selecionar Arma</DialogTitle>
                </DialogHeader>
                <input
                  type="text"
                  placeholder="Buscar arma..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md mb-4"
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
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {equippedWeapons.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">Nenhuma arma equipada</p>
        ) : (
          <div className="space-y-3">
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
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveWeapon(weaponName)}
                      >
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
                        <Badge key={prop} variant="secondary" className="text-xs">
                          {prop}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
