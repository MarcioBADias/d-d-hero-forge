import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { allWeapons, Weapon } from '@/data/weapons';
import { Character } from '@/types/character';
import { Check } from 'lucide-react';

interface StepWeaponsProps {
  character: Partial<Character>;
  onUpdateCharacter: (character: Partial<Character>) => void;
}

export const StepWeapons = ({ character, onUpdateCharacter }: StepWeaponsProps) => {
  const [selectedWeapon, setSelectedWeapon] = useState<string | undefined>(character.equippedWeapon);

  const simpleWeapons = allWeapons.filter((w) => w.category === 'Simple');
  const martialWeapons = allWeapons.filter((w) => w.category === 'Martial');

  const meleeWeapons = (weapons: Weapon[]) => weapons.filter((w) => w.type === 'Melee');
  const rangedWeapons = (weapons: Weapon[]) => weapons.filter((w) => w.type === 'Ranged');

  const handleSelectWeapon = (weaponName: string) => {
    setSelectedWeapon(weaponName);
    onUpdateCharacter({
      ...character,
      equippedWeapon: weaponName,
    });
  };

  const renderWeaponCard = (weapon: Weapon) => {
    const isSelected = selectedWeapon === weapon.name;
    return (
      <Card
        key={weapon.name}
        className={`p-4 cursor-pointer transition ${
          isSelected ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' : 'hover:border-gray-400'
        }`}
        onClick={() => handleSelectWeapon(weapon.name)}
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold">{weapon.name}</h4>
            {isSelected && <Check className="w-4 h-4 text-blue-600" />}
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
        <h2 className="text-2xl font-bold mb-2">Weapons</h2>
        <p className="text-gray-600 dark:text-gray-400">Select a weapon for your character</p>
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
            <div className="grid grid-cols-1 md:grid-coords-2 gap-4 pr-4">
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

      {selectedWeapon && (
        <Card className="p-4 bg-blue-50 dark:bg-blue-950 border-blue-200">
          <p className="text-sm">
            <span className="font-semibold">Selected:</span> {selectedWeapon}
          </p>
        </Card>
      )}
    </div>
  );
};
