import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { allWeapons, Weapon } from '@/data/weapons';
import { Character } from '@/types/character';
import { Check } from 'lucide-react';

interface StepWeaponsProps {
  character: Partial<Character>;
  onUpdateCharacter: (updates: Partial<Character>) => void;
}

export const StepWeapons = ({ character, onUpdateCharacter }: StepWeaponsProps) => {
  const equippedWeapons = character.equippedWeapons || [];

  const simpleWeapons = allWeapons.filter((w) => w.category === 'Simple');
  const martialWeapons = allWeapons.filter((w) => w.category === 'Martial');

  const meleeWeapons = (weapons: Weapon[]) => weapons.filter((w) => w.type === 'Melee');
  const rangedWeapons = (weapons: Weapon[]) => weapons.filter((w) => w.type === 'Ranged');

  const toggleWeapon = (weaponName: string) => {
    const current = [...equippedWeapons];
    const index = current.indexOf(weaponName);
    if (index > -1) {
      current.splice(index, 1);
      const newStates = { ...(character.weaponEquipStates || {}) };
      delete newStates[weaponName];
      onUpdateCharacter({ equippedWeapons: current, weaponEquipStates: newStates });
    } else {
      current.push(weaponName);
      onUpdateCharacter({
        equippedWeapons: current,
        weaponEquipStates: { ...(character.weaponEquipStates || {}), [weaponName]: true },
      });
    }
  };

  const renderWeaponCard = (weapon: Weapon) => {
    const isSelected = equippedWeapons.includes(weapon.name);
    return (
      <Card
        key={weapon.name}
        className={`p-4 cursor-pointer transition ${
          isSelected ? 'border-primary bg-primary/10' : 'hover:border-primary/50'
        }`}
        onClick={() => toggleWeapon(weapon.name)}
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <Checkbox checked={isSelected} className="mt-0.5" />
            <h4 className="font-semibold">{weapon.name}</h4>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="font-medium">Damage:</span>
              <p>{weapon.damage} {weapon.damageType}</p>
            </div>
            <div>
              <span className="font-medium">Ability:</span>
              <p className="capitalize">{weapon.abilityModifier === 'finesse' ? 'Str or Dex' : weapon.abilityModifier}</p>
            </div>
            <div>
              <span className="font-medium">Cost:</span>
              <p>{weapon.cost}</p>
            </div>
            <div>
              <span className="font-medium">Weight:</span>
              <p>{weapon.weight}</p>
            </div>
          </div>

          {weapon.properties.length > 0 && (
            <div>
              <span className="font-medium text-xs">Properties:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {weapon.properties.map((prop) => (
                  <Badge key={prop} variant="secondary" className="text-xs">
                    {prop}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div>
            <span className="font-medium text-xs">Mastery:</span>
            <p className="text-xs">{weapon.mastery}</p>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Armas</h2>
        <p className="text-muted-foreground">Selecione as armas do seu personagem (pode selecionar múltiplas)</p>
      </div>

      <Tabs defaultValue="simple-melee" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="simple-melee">Simple Melee</TabsTrigger>
          <TabsTrigger value="simple-ranged">Simple Ranged</TabsTrigger>
          <TabsTrigger value="martial-melee">Martial Melee</TabsTrigger>
          <TabsTrigger value="martial-ranged">Martial Ranged</TabsTrigger>
        </TabsList>

        <TabsContent value="simple-melee">
          <ScrollArea className="h-[500px] w-full rounded-md border p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-4">
              {meleeWeapons(simpleWeapons).map((weapon) => renderWeaponCard(weapon))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="simple-ranged">
          <ScrollArea className="h-[500px] w-full rounded-md border p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-4">
              {rangedWeapons(simpleWeapons).map((weapon) => renderWeaponCard(weapon))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="martial-melee">
          <ScrollArea className="h-[500px] w-full rounded-md border p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-4">
              {meleeWeapons(martialWeapons).map((weapon) => renderWeaponCard(weapon))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="martial-ranged">
          <ScrollArea className="h-[500px] w-full rounded-md border p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-4">
              {rangedWeapons(martialWeapons).map((weapon) => renderWeaponCard(weapon))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {equippedWeapons.length > 0 && (
        <Card className="p-4 bg-primary/5 border-primary/20">
          <p className="text-sm font-semibold mb-2">Armas Selecionadas ({equippedWeapons.length}):</p>
          <div className="flex flex-wrap gap-2">
            {equippedWeapons.map(name => (
              <Badge key={name} variant="secondary" className="cursor-pointer hover:bg-destructive/20" onClick={() => toggleWeapon(name)}>
                {name} ✕
              </Badge>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};