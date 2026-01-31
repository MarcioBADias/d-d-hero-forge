export type AbilityScore = 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha';

export interface AbilityScores {
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
}

export interface AbilityBonuses {
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
}

export interface ClassLevel {
  className: string;
  level: number;
  subclass?: string;
}

export interface Coins {
  cp: number; // copper
  sp: number; // silver
  ep: number; // electrum
  gp: number; // gold
  pp: number; // platinum
}

export interface DeathSaves {
  successes: number;
  failures: number;
}

export interface SpellSlotState {
  [level: number]: { max: number; used: number };
}

export interface Character {
  id: string;
  name: string;
  level: number;
  imageUrl?: string;
  
  // Background
  backgroundName: string;
  backgroundStory: string;
  backgroundAbilityBonuses: AbilityBonuses;
  
  // Race
  raceName: string;
  raceOptions?: Record<string, string>;
  
  // Classes (support multiclass)
  classes: ClassLevel[];
  
  // Attributes
  attributeMethod: 'standard' | 'pointbuy';
  baseAbilities: AbilityScores;
  
  // Feats
  feats: string[];
  featAbilityBonuses: AbilityBonuses;
  // Map feat name -> selected ability for feats that grant a choice (e.g. "Str/Dex +1")
  featSelections?: Record<string, AbilityScore>;
  
  // Spells (for casters)
  spellsKnown?: string[];
  preparedSpells?: string[];
  spellSlots?: SpellSlotState;
  
  // Combat tracking
  currentHp?: number;
  tempHp?: number;
  deathSaves?: DeathSaves;
  
  // Inventory & Coins
  inventory?: string;
  coins?: Coins;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
  isPublic?: boolean;
}

export interface CharacterCreationState {
  step: number;
  character: Partial<Character>;
}

// Point Buy costs
export const pointBuyCosts: Record<number, number> = {
  8: 0,
  9: 1,
  10: 2,
  11: 3,
  12: 4,
  13: 5,
  14: 7,
  15: 9,
};

export const standardArray = [15, 14, 13, 12, 10, 8];

export const abilityLabels: Record<AbilityScore, string> = {
  str: 'Strength',
  dex: 'Dexterity',
  con: 'Constitution',
  int: 'Intelligence',
  wis: 'Wisdom',
  cha: 'Charisma',
};

export const abilityShortLabels: Record<AbilityScore, string> = {
  str: 'STR',
  dex: 'DEX',
  con: 'CON',
  int: 'INT',
  wis: 'WIS',
  cha: 'CHA',
};

export function calculateModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

export function formatModifier(mod: number): string {
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

export function getTotalAbilityScore(
  base: number,
  backgroundBonus: number,
  featBonus: number
): number {
  return Math.min(20, base + backgroundBonus + featBonus);
}

export function calculateProficiencyBonus(level: number): number {
  return Math.ceil(level / 4) + 1;
}

export function createEmptyCharacter(): Partial<Character> {
  return {
    name: '',
    level: 1,
    backgroundName: '',
    backgroundStory: '',
    backgroundAbilityBonuses: { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 },
    raceName: '',
    classes: [],
    attributeMethod: 'standard',
    baseAbilities: { str: 8, dex: 8, con: 8, int: 8, wis: 8, cha: 8 },
    feats: [],
    featAbilityBonuses: { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 },
    featSelections: {},
    spellsKnown: [],
    preparedSpells: [],
    currentHp: undefined,
    tempHp: 0,
    deathSaves: { successes: 0, failures: 0 },
    inventory: '',
    coins: { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 },
  };
}

// Spellcasting rules by class
export interface SpellcastingRules {
  type: 'prepared' | 'known';
  ability: AbilityScore;
  prepareFormula?: (level: number, mod: number) => number;
}

export const classSpellcastingRules: Record<string, SpellcastingRules> = {
  cleric: {
    type: 'prepared',
    ability: 'wis',
    prepareFormula: (level, mod) => Math.max(1, level + mod),
  },
  druid: {
    type: 'prepared',
    ability: 'wis',
    prepareFormula: (level, mod) => Math.max(1, level + mod),
  },
  paladin: {
    type: 'prepared',
    ability: 'cha',
    prepareFormula: (level, mod) => Math.max(1, Math.floor(level / 2) + mod),
  },
  ranger: {
    type: 'prepared',
    ability: 'wis',
    prepareFormula: (level, mod) => Math.max(1, Math.floor(level / 2) + mod),
  },
  wizard: {
    type: 'prepared',
    ability: 'int',
    prepareFormula: (level, mod) => Math.max(1, level + mod),
  },
  bard: { type: 'known', ability: 'cha' },
  sorcerer: { type: 'known', ability: 'cha' },
  warlock: { type: 'known', ability: 'cha' },
};
