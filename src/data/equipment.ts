export interface Equipment {
  Category: string;
  'Sub-Category': string;
  Item: string;
  Weight: string;
  Cost: string;
  Cheap: string;
  Expensive: string;
  Source: string;
  Availability: string[];
}

export interface Armor {
  name: string;
  category: 'Light' | 'Medium' | 'Heavy';
  ac: number | 'dex' | 'dex_max_2' | 'dex_max_2_fixed'; // dex = 10 + dex, dex_max_2 = base + dex (max 2), dex_max_2_fixed = fixed base (e.g. 14)
  acBase?: number; // base AC for medium/heavy without dex
  maxDexBonus?: number; // max dex modifier for medium armor
  strengthRequired?: number;
  stealthDisadvantage: boolean;
  weight: string;
  cost: string;
}

export const equipment: Equipment[] = [
  {
    "Category": "Adventuring Gear",
    "Sub-Category": "-",
    "Item": "Acid (vial)",
    "Weight": "1 lb.",
    "Cost": "25.00 GP",
    "Cheap": "18.75 GP",
    "Expensive": "37.50 GP",
    "Source": "PHB 2024",
    "Availability": ["Village", "Town", "City", "Blacksmith"]
  },
  {
    "Category": "Adventuring Gear",
    "Sub-Category": "-",
    "Item": "Alchemist's Fire",
    "Weight": "1 lb.",
    "Cost": "50.00 GP",
    "Cheap": "37.50 GP",
    "Expensive": "75.00 GP",
    "Source": "PHB 2024",
    "Availability": ["Village", "Town", "City"]
  },
  {
    "Category": "Adventuring Gear",
    "Sub-Category": "Ammunition",
    "Item": "Arrows (20)",
    "Weight": "1 lb.",
    "Cost": "1.00 GP",
    "Cheap": "0.75 GP",
    "Expensive": "1.50 GP",
    "Source": "PHB 2024",
    "Availability": ["Village", "Town", "City", "Blacksmith", "Fletcher"]
  },
  {
    "Category": "Adventuring Gear",
    "Sub-Category": "Ammunition",
    "Item": "Crossbow, Bolts (20)",
    "Weight": "1 1/2 lb.",
    "Cost": "1.00 GP",
    "Cheap": "0.75 GP",
    "Expensive": "1.50 GP",
    "Source": "PHB 2024",
    "Availability": ["Village", "Town", "City", "Blacksmith", "Fletcher"]
  },
  {
    "Category": "Adventuring Gear",
    "Sub-Category": "Ammunition",
    "Item": "Bullets, Firearm (10)",
    "Weight": "2 lb.",
    "Cost": "3.00 GP",
    "Cheap": "2.25 GP",
    "Expensive": "4.50 GP",
    "Source": "PHB 2024",
    "Availability": ["Village", "Town"]
  },
  {
    "Category": "Adventuring Gear",
    "Sub-Category": "Ammunition",
    "Item": "Bullets, Sling (20)",
    "Weight": "1 1/2 lb.",
    "Cost": "0.04 GP",
    "Cheap": "0.03 GP",
    "Expensive": "0.06 GP",
    "Source": "PHB 2024",
    "Availability": ["Village", "Town", "City", "Blacksmith"]
  },
  {
    "Category": "Adventuring Gear",
    "Sub-Category": "Arcane Focuses",
    "Item": "Crystal",
    "Weight": "1 lb.",
    "Cost": "10.00 GP",
    "Cheap": "7.50 GP",
    "Expensive": "15.00 GP",
    "Source": "PHB 2024",
    "Availability": ["Village", "Town", "City", "Blacksmith", "Fletcher"]
  },
  {
    "Category": "Adventuring Gear",
    "Sub-Category": "Arcane Focuses",
    "Item": "Staff (also a Quarterstaff)",
    "Weight": "4 lb.",
    "Cost": "5.00 GP",
    "Cheap": "3.75 GP",
    "Expensive": "7.50 GP",
    "Source": "PHB 2024",
    "Availability": ["Village", "Town", "City", "Blacksmith"]
  },
  {
    "Category": "Adventuring Gear",
    "Sub-Category": "-",
    "Item": "Backpack",
    "Weight": "5 lb.",
    "Cost": "2.00 GP",
    "Cheap": "1.50 GP",
    "Expensive": "3.00 GP",
    "Source": "PHB 2024",
    "Availability": ["Village", "Town", "City", "Blacksmith"]
  },
  {
    "Category": "Adventuring Gear",
    "Sub-Category": "Holy Symbol",
    "Item": "Amulet (worn or held)",
    "Weight": "1 lb.",
    "Cost": "5.00 GP",
    "Cheap": "3.75 GP",
    "Expensive": "7.50 GP",
    "Source": "PHB 2024",
    "Availability": ["Village", "Town", "City", "Blacksmith", "Fletcher"]
  }
];

// Armor with detailed properties
export const armors: Armor[] = [
  // Light Armor
  {
    name: 'Padded Armor',
    category: 'Light',
    ac: 'dex',
    acBase: 11,
    stealthDisadvantage: true,
    weight: '8 lb.',
    cost: '5 GP',
  },
  {
    name: 'Leather Armor',
    category: 'Light',
    ac: 'dex',
    acBase: 11,
    stealthDisadvantage: false,
    weight: '10 lb.',
    cost: '10 GP',
  },
  {
    name: 'Studded Leather Armor',
    category: 'Light',
    ac: 'dex',
    acBase: 12,
    stealthDisadvantage: false,
    weight: '13 lb.',
    cost: '45 GP',
  },
  // Medium Armor
  {
    name: 'Hide Armor',
    category: 'Medium',
    ac: 'dex_max_2',
    acBase: 12,
    maxDexBonus: 2,
    stealthDisadvantage: false,
    weight: '12 lb.',
    cost: '10 GP',
  },
  {
    name: 'Chain Shirt',
    category: 'Medium',
    ac: 'dex_max_2',
    acBase: 13,
    maxDexBonus: 2,
    stealthDisadvantage: false,
    weight: '20 lb.',
    cost: '50 GP',
  },
  {
    name: 'Scale Mail',
    category: 'Medium',
    ac: 'dex_max_2',
    acBase: 14,
    maxDexBonus: 2,
    stealthDisadvantage: true,
    weight: '45 lb.',
    cost: '50 GP',
  },
  {
    name: 'Breastplate',
    category: 'Medium',
    ac: 'dex_max_2',
    acBase: 14,
    maxDexBonus: 2,
    stealthDisadvantage: false,
    weight: '20 lb.',
    cost: '400 GP',
  },
  {
    name: 'Half Plate Armor',
    category: 'Medium',
    ac: 'dex_max_2',
    acBase: 15,
    maxDexBonus: 2,
    stealthDisadvantage: true,
    weight: '40 lb.',
    cost: '750 GP',
  },
  // Heavy Armor
  {
    name: 'Ring Mail',
    category: 'Heavy',
    ac: 'dex_max_2_fixed',
    acBase: 14,
    stealthDisadvantage: true,
    weight: '40 lb.',
    cost: '30 GP',
  },
  {
    name: 'Chain Mail',
    category: 'Heavy',
    ac: 'dex_max_2_fixed',
    acBase: 16,
    strengthRequired: 13,
    stealthDisadvantage: true,
    weight: '55 lb.',
    cost: '75 GP',
  },
  {
    name: 'Splint Armor',
    category: 'Heavy',
    ac: 'dex_max_2_fixed',
    acBase: 17,
    strengthRequired: 15,
    stealthDisadvantage: true,
    weight: '60 lb.',
    cost: '200 GP',
  },
  {
    name: 'Plate Armor',
    category: 'Heavy',
    ac: 'dex_max_2_fixed',
    acBase: 18,
    strengthRequired: 15,
    stealthDisadvantage: true,
    weight: '65 lb.',
    cost: '1,500 GP',
  },
];

export const shields = [
  {
    name: 'Shield',
    acBonus: 2,
    weight: '6 lb.',
    cost: '10 GP',
  },
];

export const hasArmorOrShield = (item: string): { type: 'armor' | 'shield' | null; data?: Armor | typeof shields[0] } => {
  const armor = armors.find(a => a.name === item);
  if (armor) return { type: 'armor', data: armor };
  
  const shield = shields.find(s => s.name === item);
  if (shield) return { type: 'shield', data: shield };
  
  return { type: null };
};

export const calculateArmorAC = (armor: Armor, dexModifier: number): number => {
  if (armor.ac === 'dex') {
    return (armor.acBase || 10) + dexModifier;
  } else if (armor.ac === 'dex_max_2') {
    const dexBonus = Math.min(dexModifier, armor.maxDexBonus || 2);
    return (armor.acBase || 10) + dexBonus;
  } else if (armor.ac === 'dex_max_2_fixed') {
    // Heavy armor with fixed AC
    return armor.acBase || 10;
  }
  return armor.acBase || 10;
};
