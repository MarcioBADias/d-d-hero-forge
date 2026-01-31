export type WeaponCategory = 'Simple' | 'Martial';
export type WeaponType = 'Melee' | 'Ranged';
export type DamageType = 'Bludgeoning' | 'Piercing' | 'Slashing';
export type AbilityModifier = 'str' | 'dex' | 'finesse';

export interface Weapon {
  name: string;
  category: WeaponCategory;
  type: WeaponType;
  damage: string;
  damageType: DamageType;
  abilityModifier: AbilityModifier;
  properties: string[];
  mastery: string;
  weight: string;
  cost: string;
}

// Simple Melee Weapons
export const simpleWeapons: Weapon[] = [
  {
    name: 'Club',
    category: 'Simple',
    type: 'Melee',
    damage: '1d4',
    damageType: 'Bludgeoning',
    abilityModifier: 'str',
    properties: ['Light'],
    mastery: 'Slow',
    weight: '2 lb.',
    cost: '1 SP',
  },
  {
    name: 'Dagger',
    category: 'Simple',
    type: 'Melee',
    damage: '1d4',
    damageType: 'Piercing',
    abilityModifier: 'finesse',
    properties: ['Finesse', 'Light', 'Thrown (Range 20/60)'],
    mastery: 'Nick',
    weight: '1 lb.',
    cost: '2 GP',
  },
  {
    name: 'Greatclub',
    category: 'Simple',
    type: 'Melee',
    damage: '1d8',
    damageType: 'Bludgeoning',
    abilityModifier: 'str',
    properties: ['Two-Handed'],
    mastery: 'Push',
    weight: '10 lb.',
    cost: '2 SP',
  },
  {
    name: 'Handaxe',
    category: 'Simple',
    type: 'Melee',
    damage: '1d6',
    damageType: 'Slashing',
    abilityModifier: 'str',
    properties: ['Light', 'Thrown (Range 20/60)'],
    mastery: 'Vex',
    weight: '2 lb.',
    cost: '5 GP',
  },
  {
    name: 'Javelin',
    category: 'Simple',
    type: 'Melee',
    damage: '1d6',
    damageType: 'Piercing',
    abilityModifier: 'str',
    properties: ['Thrown (Range 30/120)'],
    mastery: 'Slow',
    weight: '2 lb.',
    cost: '5 SP',
  },
  {
    name: 'Light Hammer',
    category: 'Simple',
    type: 'Melee',
    damage: '1d4',
    damageType: 'Bludgeoning',
    abilityModifier: 'str',
    properties: ['Light', 'Thrown (Range 20/60)'],
    mastery: 'Nick',
    weight: '2 lb.',
    cost: '2 GP',
  },
  {
    name: 'Mace',
    category: 'Simple',
    type: 'Melee',
    damage: '1d6',
    damageType: 'Bludgeoning',
    abilityModifier: 'str',
    properties: [],
    mastery: 'Sap',
    weight: '4 lb.',
    cost: '5 GP',
  },
  {
    name: 'Quarterstaff',
    category: 'Simple',
    type: 'Melee',
    damage: '1d6',
    damageType: 'Bludgeoning',
    abilityModifier: 'str',
    properties: ['Versatile (1d8)'],
    mastery: 'Topple',
    weight: '4 lb.',
    cost: '2 SP',
  },
  {
    name: 'Sickle',
    category: 'Simple',
    type: 'Melee',
    damage: '1d4',
    damageType: 'Slashing',
    abilityModifier: 'str',
    properties: ['Light'],
    mastery: 'Nick',
    weight: '2 lb.',
    cost: '1 GP',
  },
  {
    name: 'Spear',
    category: 'Simple',
    type: 'Melee',
    damage: '1d6',
    damageType: 'Piercing',
    abilityModifier: 'str',
    properties: ['Thrown (Range 20/60)', 'Versatile (1d8)'],
    mastery: 'Sap',
    weight: '3 lb.',
    cost: '1 GP',
  },
  // Simple Ranged Weapons
  {
    name: 'Dart',
    category: 'Simple',
    type: 'Ranged',
    damage: '1d4',
    damageType: 'Piercing',
    abilityModifier: 'finesse',
    properties: ['Finesse', 'Thrown (Range 20/60)'],
    mastery: 'Vex',
    weight: '1/4 lb.',
    cost: '5 CP',
  },
  {
    name: 'Light Crossbow',
    category: 'Simple',
    type: 'Ranged',
    damage: '1d8',
    damageType: 'Piercing',
    abilityModifier: 'dex',
    properties: ['Ammunition (Range 80/320; Bolt)', 'Loading', 'Two-Handed'],
    mastery: 'Slow',
    weight: '5 lb.',
    cost: '25 GP',
  },
  {
    name: 'Shortbow',
    category: 'Simple',
    type: 'Ranged',
    damage: '1d6',
    damageType: 'Piercing',
    abilityModifier: 'dex',
    properties: ['Ammunition (Range 80/320; Arrow)', 'Two-Handed'],
    mastery: 'Vex',
    weight: '2 lb.',
    cost: '25 GP',
  },
  {
    name: 'Sling',
    category: 'Simple',
    type: 'Ranged',
    damage: '1d4',
    damageType: 'Bludgeoning',
    abilityModifier: 'dex',
    properties: ['Ammunition (Range 30/120; Bullet)'],
    mastery: 'Slow',
    weight: '—',
    cost: '1 SP',
  },
];

// Martial Melee Weapons
const martialMeleeWeapons: Weapon[] = [
  {
    name: 'Battleaxe',
    category: 'Martial',
    type: 'Melee',
    damage: '1d8',
    damageType: 'Slashing',
    abilityModifier: 'str',
    properties: ['Versatile (1d10)'],
    mastery: 'Topple',
    weight: '4 lb.',
    cost: '10 GP',
  },
  {
    name: 'Flail',
    category: 'Martial',
    type: 'Melee',
    damage: '1d8',
    damageType: 'Bludgeoning',
    abilityModifier: 'str',
    properties: [],
    mastery: 'Sap',
    weight: '2 lb.',
    cost: '10 GP',
  },
  {
    name: 'Glaive',
    category: 'Martial',
    type: 'Melee',
    damage: '1d10',
    damageType: 'Slashing',
    abilityModifier: 'str',
    properties: ['Heavy', 'Reach', 'Two-Handed'],
    mastery: 'Graze',
    weight: '6 lb.',
    cost: '20 GP',
  },
  {
    name: 'Greataxe',
    category: 'Martial',
    type: 'Melee',
    damage: '1d12',
    damageType: 'Slashing',
    abilityModifier: 'str',
    properties: ['Heavy', 'Two-Handed'],
    mastery: 'Cleave',
    weight: '7 lb.',
    cost: '30 GP',
  },
  {
    name: 'Greatsword',
    category: 'Martial',
    type: 'Melee',
    damage: '2d6',
    damageType: 'Slashing',
    abilityModifier: 'str',
    properties: ['Heavy', 'Two-Handed'],
    mastery: 'Graze',
    weight: '6 lb.',
    cost: '50 GP',
  },
  {
    name: 'Halberd',
    category: 'Martial',
    type: 'Melee',
    damage: '1d10',
    damageType: 'Slashing',
    abilityModifier: 'str',
    properties: ['Heavy', 'Reach', 'Two-Handed'],
    mastery: 'Cleave',
    weight: '6 lb.',
    cost: '20 GP',
  },
  {
    name: 'Lance',
    category: 'Martial',
    type: 'Melee',
    damage: '1d10',
    damageType: 'Piercing',
    abilityModifier: 'str',
    properties: ['Heavy', 'Reach', 'Two-Handed (unless mounted)'],
    mastery: 'Topple',
    weight: '6 lb.',
    cost: '10 GP',
  },
  {
    name: 'Longsword',
    category: 'Martial',
    type: 'Melee',
    damage: '1d8',
    damageType: 'Slashing',
    abilityModifier: 'str',
    properties: ['Versatile (1d10)'],
    mastery: 'Sap',
    weight: '3 lb.',
    cost: '15 GP',
  },
  {
    name: 'Maul',
    category: 'Martial',
    type: 'Melee',
    damage: '2d6',
    damageType: 'Bludgeoning',
    abilityModifier: 'str',
    properties: ['Heavy', 'Two-Handed'],
    mastery: 'Topple',
    weight: '10 lb.',
    cost: '10 GP',
  },
  {
    name: 'Morningstar',
    category: 'Martial',
    type: 'Melee',
    damage: '1d8',
    damageType: 'Piercing',
    abilityModifier: 'str',
    properties: [],
    mastery: 'Sap',
    weight: '4 lb.',
    cost: '15 GP',
  },
  {
    name: 'Pike',
    category: 'Martial',
    type: 'Melee',
    damage: '1d10',
    damageType: 'Piercing',
    abilityModifier: 'str',
    properties: ['Heavy', 'Reach', 'Two-Handed'],
    mastery: 'Push',
    weight: '18 lb.',
    cost: '5 GP',
  },
  {
    name: 'Rapier',
    category: 'Martial',
    type: 'Melee',
    damage: '1d8',
    damageType: 'Piercing',
    abilityModifier: 'finesse',
    properties: ['Finesse'],
    mastery: 'Vex',
    weight: '2 lb.',
    cost: '25 GP',
  },
  {
    name: 'Scimitar',
    category: 'Martial',
    type: 'Melee',
    damage: '1d6',
    damageType: 'Slashing',
    abilityModifier: 'finesse',
    properties: ['Finesse', 'Light'],
    mastery: 'Nick',
    weight: '3 lb.',
    cost: '25 GP',
  },
  {
    name: 'Shortsword',
    category: 'Martial',
    type: 'Melee',
    damage: '1d6',
    damageType: 'Piercing',
    abilityModifier: 'finesse',
    properties: ['Finesse', 'Light'],
    mastery: 'Vex',
    weight: '2 lb.',
    cost: '10 GP',
  },
  {
    name: 'Trident',
    category: 'Martial',
    type: 'Melee',
    damage: '1d8',
    damageType: 'Piercing',
    abilityModifier: 'str',
    properties: ['Thrown (Range 20/60)', 'Versatile (1d10)'],
    mastery: 'Topple',
    weight: '4 lb.',
    cost: '5 GP',
  },
  {
    name: 'Warhammer',
    category: 'Martial',
    type: 'Melee',
    damage: '1d8',
    damageType: 'Bludgeoning',
    abilityModifier: 'str',
    properties: ['Versatile (1d10)'],
    mastery: 'Push',
    weight: '5 lb.',
    cost: '15 GP',
  },
  {
    name: 'War Pick',
    category: 'Martial',
    type: 'Melee',
    damage: '1d8',
    damageType: 'Piercing',
    abilityModifier: 'str',
    properties: ['Versatile (1d10)'],
    mastery: 'Sap',
    weight: '2 lb.',
    cost: '5 GP',
  },
  {
    name: 'Whip',
    category: 'Martial',
    type: 'Melee',
    damage: '1d4',
    damageType: 'Slashing',
    abilityModifier: 'finesse',
    properties: ['Finesse', 'Reach'],
    mastery: 'Slow',
    weight: '3 lb.',
    cost: '2 GP',
  },
];

// Martial Ranged Weapons
const martialRangedWeapons: Weapon[] = [
  {
    name: 'Blowgun',
    category: 'Martial',
    type: 'Ranged',
    damage: '1',
    damageType: 'Piercing',
    abilityModifier: 'dex',
    properties: ['Ammunition (Range 25/100; Needle)', 'Loading'],
    mastery: 'Vex',
    weight: '1 lb.',
    cost: '10 GP',
  },
  {
    name: 'Hand Crossbow',
    category: 'Martial',
    type: 'Ranged',
    damage: '1d6',
    damageType: 'Piercing',
    abilityModifier: 'dex',
    properties: ['Ammunition (Range 30/120; Bolt)', 'Light', 'Loading'],
    mastery: 'Vex',
    weight: '3 lb.',
    cost: '75 GP',
  },
  {
    name: 'Heavy Crossbow',
    category: 'Martial',
    type: 'Ranged',
    damage: '1d10',
    damageType: 'Piercing',
    abilityModifier: 'dex',
    properties: ['Ammunition (Range 100/400; Bolt)', 'Heavy', 'Loading', 'Two-Handed'],
    mastery: 'Push',
    weight: '18 lb.',
    cost: '50 GP',
  },
  {
    name: 'Longbow',
    category: 'Martial',
    type: 'Ranged',
    damage: '1d8',
    damageType: 'Piercing',
    abilityModifier: 'dex',
    properties: ['Ammunition (Range 150/600; Arrow)', 'Heavy', 'Two-Handed'],
    mastery: 'Slow',
    weight: '2 lb.',
    cost: '50 GP',
  },
  {
    name: 'Musket',
    category: 'Martial',
    type: 'Ranged',
    damage: '1d12',
    damageType: 'Piercing',
    abilityModifier: 'dex',
    properties: ['Ammunition (Range 40/120; Bullet)', 'Loading', 'Two-Handed'],
    mastery: 'Slow',
    weight: '10 lb.',
    cost: '500 GP',
  },
  {
    name: 'Pistol',
    category: 'Martial',
    type: 'Ranged',
    damage: '1d10',
    damageType: 'Piercing',
    abilityModifier: 'dex',
    properties: ['Ammunition (Range 30/90; Bullet)', 'Loading'],
    mastery: 'Vex',
    weight: '3 lb.',
    cost: '250 GP',
  },
];

export const allWeapons: Weapon[] = [
  ...simpleWeapons,
  ...martialMeleeWeapons,
  ...martialRangedWeapons,
];

// Utility function to get attack bonus
export const calculateAttackBonus = (
  weapon: Weapon,
  strModifier: number,
  dexModifier: number,
  proficiencyBonus: number,
  hasWeaponProficiency: boolean
): number => {
  let abilityModifier = 0;

  if (weapon.abilityModifier === 'finesse') {
    abilityModifier = Math.max(strModifier, dexModifier);
  } else if (weapon.abilityModifier === 'str') {
    abilityModifier = strModifier;
  } else if (weapon.abilityModifier === 'dex') {
    abilityModifier = dexModifier;
  }

  const bonus = hasWeaponProficiency ? proficiencyBonus : 0;
  return abilityModifier + bonus;
};

// Utility function to calculate damage
export const calculateDamage = (
  weapon: Weapon,
  strModifier: number,
  dexModifier: number
): string => {
  let abilityModifier = 0;

  if (weapon.abilityModifier === 'finesse') {
    abilityModifier = Math.max(strModifier, dexModifier);
  } else if (weapon.abilityModifier === 'str') {
    abilityModifier = strModifier;
  } else if (weapon.abilityModifier === 'dex') {
    abilityModifier = dexModifier;
  }

  const modifier = abilityModifier > 0 ? `+${abilityModifier}` : abilityModifier < 0 ? `${abilityModifier}` : '';
  return `${weapon.damage} ${modifier}`.trim();
};
