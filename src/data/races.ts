export interface Race {
  name: string;
  source: string;
  creatureType: string;
  size: string;
  speed: string;
  traits: string[];
}

export const races: Race[] = [
  { 
    name: 'Aasimar',
    source: "PHB'24, p186",
    creatureType: 'Humanoid',
    size: 'Medium (about 4-7 feet tall) or Small (about 2-4 feet tall), chosen when you select this species',
    speed: '30 feet',
    traits: [
      'Celestial Resistance: Resistance to Necrotic and Radiant damage.',
      'Darkvision: 60 feet.',
      "Healing Hands: As a Magic action, you touch a creature and roll a number of d4s equal to your Proficiency Bonus. The creature regains hit points equal to the total rolled. Once used, can't use again until a Long Rest.",
      'Light Bearer: You know the Light cantrip. Charisma is your spellcasting ability for it.',
      'Celestial Revelation: Transformation at level 3; choose one of three options: Heavenly Wings, Inner Radiance, or Necrotic Shroud.',
    ],
  },
  { 
    name: 'Dragonborn',
    source: "PHB'24, p187",
    creatureType: 'Humanoid',
    size: 'Medium (about 5-7 feet tall)',
    speed: '30 feet',
    traits: [
      'Draconic Ancestry: Choose from Dragon types (Black, Blue, Brass, etc.). Affects Breath Weapon and Damage Resistance.',
      'Breath Weapon: A magical energy exhalation in either a 15-foot Cone or a 30-foot Line.',
      'Damage Resistance: Resistance to the damage type determined by Draconic Ancestry.',
      'Darkvision: 60 feet.',
      'Draconic Flight: At level 5, use Bonus Action to sprout spectral wings for flight for 10 minutes.',
    ],
  },
  { 
    name: 'Dwarf',
    source: "PHB'24, p188",
    creatureType: 'Humanoid',
    size: 'Medium (about 4-5 feet tall)',
    speed: '30 feet',
    traits: [
      'Darkvision: 120 feet.',
      'Dwarven Resilience: Resistance to Poison damage and Advantage on saving throws to avoid or end the Poisoned condition.',
      'Dwarven Toughness: Increase HP maximum by 1, and increase it by 1 every level.',
      'Stonecunning: Gain Tremorsense for 10 minutes as a Bonus Action when on stone surfaces.',
    ],
  },
  { 
    name: 'Elf',
    source: "PHB'24, p189",
    creatureType: 'Humanoid',
    size: 'Medium (about 5-6 feet tall)',
    speed: '30 feet',
    traits: [
      'Darkvision: 60 feet.',
      'Elven Lineage: Choose from Drow, High Elf, or Wood Elf with specific benefits at levels 1, 3, and 5.',
      'Fey Ancestry: Advantage on saving throws to avoid or end the Charmed condition.',
      'Keen Senses: Proficiency in Insight, Perception, or Survival.',
      'Trance: No need to sleep; you can complete a Long Rest in 4 hours of meditation.',
    ],
  },
  { 
    name: 'Gnome',
    source: "PHB'24, p191",
    creatureType: 'Humanoid',
    size: 'Small (about 3-4 feet tall)',
    speed: '30 feet',
    traits: [
      'Darkvision: 60 feet.',
      'Gnomish Cunning: Advantage on Intelligence, Wisdom, and Charisma saving throws.',
      'Gnomish Lineage: Choose between Forest Gnome or Rock Gnome with specific abilities and spellcasting traits.',
    ],
  },
  { 
    name: 'Goliath',
    source: "PHB'24, p192",
    creatureType: 'Humanoid',
    size: 'Medium (about 7-8 feet tall)',
    speed: '35 feet',
    traits: [
      'Giant Ancestry: Choose from Cloud, Fire, Frost, Hill, Stone, or Storm Giant for unique abilities.',
      'Large Form: At level 5, become Large for 10 minutes as a Bonus Action.',
      'Powerful Build: Advantage on Grappling checks and count as one size larger for carrying capacity.',
    ],
  },
  { 
    name: 'Halfling',
    source: "PHB'24, p193",
    creatureType: 'Humanoid',
    size: 'Small (about 2-3 feet tall)',
    speed: '30 feet',
    traits: [
      'Brave: Advantage on saving throws to avoid or end the Frightened condition.',
      'Halfling Nimbleness: Move through the space of creatures one size larger than you.',
      'Luck: Reroll any 1 rolled on a d20 for D20 Tests.',
      'Naturally Stealthy: Take the Hide action even when only obscured by a creature at least one size larger than you.',
    ],
  },
  { 
    name: 'Human',
    source: "PHB'24, p194",
    creatureType: 'Humanoid',
    size: 'Medium (about 4-7 feet tall) or Small (about 2-4 feet tall), chosen when you select this species',
    speed: '30 feet',
    traits: [
      'Resourceful: Gain Heroic Inspiration after a Long Rest.',
      'Skillful: Gain proficiency in one skill of your choice.',
      'Versatile: Gain an Origin feat of your choice.',
    ],
  },
  { 
    name: 'Orc',
    source: "PHB'24, p195",
    creatureType: 'Humanoid',
    size: 'Medium (about 6-7 feet tall)',
    speed: '30 feet',
    traits: [
      'Adrenaline Rush: Dash as a Bonus Action and gain Temporary Hit Points equal to your Proficiency Bonus.',
      'Darkvision: 120 feet.',
      'Relentless Endurance: Drop to 1 HP instead of 0 once per Long Rest.',
    ],
  },
  { 
    name: 'Tiefling',
    source: "PHB'24, p197",
    creatureType: 'Humanoid',
    size: 'Medium (about 4-7 feet tall) or Small (about 3-4 feet tall), chosen when you select this species',
    speed: '30 feet',
    traits: [
      'Darkvision: 60 feet.',
      'Fiendish Legacy: Choose a legacy (Abyssal, Chthonic, or Infernal) and gain related abilities at levels 1, 3, and 5.',
      'Otherworldly Presence: You know the Thaumaturgy cantrip.',
    ],
  },
];

export const dragonAncestries = [
  { type: 'Black', damageType: 'Acid', shape: '30-foot Line' },
  { type: 'Blue', damageType: 'Lightning', shape: '30-foot Line' },
  { type: 'Brass', damageType: 'Fire', shape: '30-foot Line' },
  { type: 'Bronze', damageType: 'Lightning', shape: '30-foot Line' },
  { type: 'Copper', damageType: 'Acid', shape: '30-foot Line' },
  { type: 'Gold', damageType: 'Fire', shape: '15-foot Cone' },
  { type: 'Green', damageType: 'Poison', shape: '15-foot Cone' },
  { type: 'Red', damageType: 'Fire', shape: '15-foot Cone' },
  { type: 'Silver', damageType: 'Cold', shape: '15-foot Cone' },
  { type: 'White', damageType: 'Cold', shape: '15-foot Cone' },
];

export const elvenLineages = ['Drow', 'High Elf', 'Wood Elf'];
export const gnomeLineages = ['Forest Gnome', 'Rock Gnome'];
export const giantAncestries = ['Cloud', 'Fire', 'Frost', 'Hill', 'Stone', 'Storm'];
export const tieflingLegacies = ['Abyssal', 'Chthonic', 'Infernal'];
export const aasimarRevelations = ['Heavenly Wings', 'Inner Radiance', 'Necrotic Shroud'];
