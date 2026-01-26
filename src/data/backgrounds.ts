export interface Background {
  name: string;
  source: string;
  abilityScores: string[];
  feat: string;
  skillProficiencies: string[];
  toolProficiency: string;
  equipment: {
    option: string;
    items: string[];
  }[];
  info: string;
}

export const backgrounds: Background[] = [
  {
    name: 'Acolyte',
    source: "PHB'24, page 178",
    abilityScores: ['Intelligence', 'Wisdom', 'Charisma'],
    feat: 'Magic Initiate (Cleric)',
    skillProficiencies: ['Insight', 'Religion'],
    toolProficiency: "Calligrapher's Supplies",
    equipment: [
      {
        option: 'Kit inicial',
        items: ["Calligrapher's Supplies", 'Book (prayers)', 'Holy Symbol', 'Parchment (10 sheets)', 'Robe', '8 GP'],
      },
      { option: 'Valor para comprar tudo', items: ['50 GP'] },
    ],
    info: "You have spent your life in the service of a temple to a specific god or pantheon of gods. You act as an intermediary between the mortal world and the realm of the divine."
  },
  {
    name: 'Artisan',
    source: "PHB'24, page 179",
    abilityScores: ['Strength', 'Dexterity', 'Intelligence'],
    feat: 'Crafter',
    skillProficiencies: ['Investigation', 'Persuasion'],
    toolProficiency: "Choose one kind of Artisan's Tools",
    equipment: [
      { option: 'Kit inicial', items: ["Artisan's Tools", '2 Pouches', "Traveler's Clothes", '32 GP'] },
      { option: 'Valor para comprar tudo', items: ['50 GP'] },
    ],
    info: "You are a member of a guild of artisans, skilled in a particular craft. Your expertise allows you to create and repair items."
  },
  {
    name: 'Charlatan',
    source: "PHB'24, page 180",
    abilityScores: ['Dexterity', 'Constitution', 'Charisma'],
    feat: 'Skilled',
    skillProficiencies: ['Deception', 'Sleight of Hand'],
    toolProficiency: 'Forgery Kit',
    equipment: [
      { option: 'Kit inicial', items: ['Forgery Kit', 'Costume', 'Fine Clothes', '15 GP'] },
      { option: 'Valor para comprar tudo', items: ['50 GP'] },
    ],
    info: "You have a knack for deception and trickery, using your charm and cunning to manipulate others for personal gain."
  },
  {
    name: 'Criminal',
    source: "PHB'24, page 180",
    abilityScores: ['Dexterity', 'Constitution', 'Intelligence'],
    feat: 'Alert',
    skillProficiencies: ['Sleight of Hand', 'Stealth'],
    toolProficiency: "Thieves' Tools",
    equipment: [
      { option: 'Kit inicial', items: ['2 Daggers', "Thieves' Tools", 'Crowbar', '2 Pouches', "Traveler's Clothes", '16 GP'] },
      { option: 'Valor para comprar tudo', items: ['50 GP'] },
    ],
    info: "You have a history of breaking the law, whether as a petty thief, a smuggler, or a fence for stolen goods."
  },
  {
    name: 'Entertainer',
    source: "PHB'24, page 180",
    abilityScores: ['Strength', 'Dexterity', 'Charisma'],
    feat: 'Musician',
    skillProficiencies: ['Acrobatics', 'Performance'],
    toolProficiency: 'Choose one kind of Musical Instrument',
    equipment: [
      { option: 'Kit inicial', items: ['Musical Instrument', '2 Costumes', 'Mirror', 'Perfume', "Traveler's Clothes", '11 GP'] },
      { option: 'Valor para comprar tudo', items: ['50 GP'] },
    ],
    info: "You have spent your life entertaining others through music, dance, storytelling, or other performances."
  },
  {
    name: 'Farmer',
    source: "PHB'24, page 180",
    abilityScores: ['Strength', 'Constitution', 'Wisdom'],
    feat: 'Tough',
    skillProficiencies: ['Animal Handling', 'Nature'],
    toolProficiency: "Carpenter's Tools",
    equipment: [
      { option: 'Kit inicial', items: ['Sickle', "Carpenter's Tools", "Healer's Kit", 'Iron Pot', 'Shovel', '30 GP'] },
      { option: 'Valor para comprar tudo', items: ['50 GP'] },
    ],
    info: "You have spent your life working the land, cultivating crops, and raising livestock."
  },
  {
    name: 'Guard',
    source: "PHB'24, page 181",
    abilityScores: ['Strength', 'Intelligence', 'Wisdom'],
    feat: 'Alert',
    skillProficiencies: ['Athletics', 'Perception'],
    toolProficiency: 'Choose one kind of Gaming Set',
    equipment: [
      { option: 'Kit inicial', items: ['Spear', 'Light Crossbow', '20 Bolts', 'Gaming Set', 'Hooded Lantern', 'Manacles', 'Quiver', "Traveler's Clothes", '12 GP'] },
      { option: 'Valor para comprar tudo', items: ['50 GP'] },
    ],
    info: "You have served as a city watchman, a castle guard, or a personal bodyguard."
  },
  {
    name: 'Guide',
    source: "PHB'24, page 181",
    abilityScores: ['Dexterity', 'Constitution', 'Wisdom'],
    feat: 'Magic Initiate (Druid)',
    skillProficiencies: ['Stealth', 'Survival'],
    toolProficiency: "Cartographer's Tools",
    equipment: [
      { option: 'Kit inicial', items: ['Shortbow', '20 Arrows', "Cartographer's Tools", 'Bedroll', 'Quiver', 'Tent', "Traveler's Clothes", '3 GP'] },
      { option: 'Valor para comprar tudo', items: ['50 GP'] },
    ],
    info: "You have experience leading others through wilderness areas."
  },
  {
    name: 'Hermit',
    source: "PHB'24, page 182",
    abilityScores: ['Constitution', 'Wisdom', 'Charisma'],
    feat: 'Healer',
    skillProficiencies: ['Medicine', 'Religion'],
    toolProficiency: 'Herbalism Kit',
    equipment: [
      { option: 'Kit inicial', items: ['Quarterstaff', 'Herbalism Kit', 'Bedroll', 'Book (philosophy)', 'Lamp', 'Oil (3 flasks)', "Traveler's Clothes", '16 GP'] },
      { option: 'Valor para comprar tudo', items: ['50 GP'] },
    ],
    info: "You lived in seclusion, gaining profound insights into existence."
  },
  {
    name: 'Merchant',
    source: "PHB'24, page 182",
    abilityScores: ['Constitution', 'Intelligence', 'Charisma'],
    feat: 'Lucky',
    skillProficiencies: ['Animal Handling', 'Persuasion'],
    toolProficiency: "Navigator's Tools",
    equipment: [
      { option: 'Kit inicial', items: ["Navigator's Tools", '2 Pouches', "Traveler's Clothes", '22 GP'] },
      { option: 'Valor para comprar tudo', items: ['50 GP'] },
    ],
    info: "You have experience in buying and selling goods."
  },
  {
    name: 'Noble',
    source: "PHB'24, page 182",
    abilityScores: ['Strength', 'Intelligence', 'Charisma'],
    feat: 'Skilled',
    skillProficiencies: ['History', 'Persuasion'],
    toolProficiency: 'Choose one kind of Gaming Set',
    equipment: [
      { option: 'Kit inicial', items: ['Gaming Set', 'Fine Clothes', 'Perfume', '29 GP'] },
      { option: 'Valor para comprar tudo', items: ['50 GP'] },
    ],
    info: "You were raised in luxury and privilege, with a family name that commands respect."
  },
  {
    name: 'Sage',
    source: "PHB'24, page 183",
    abilityScores: ['Constitution', 'Intelligence', 'Wisdom'],
    feat: 'Magic Initiate (Wizard)',
    skillProficiencies: ['Arcana', 'History'],
    toolProficiency: "Calligrapher's Supplies",
    equipment: [
      { option: 'Kit inicial', items: ['Quarterstaff', "Calligrapher's Supplies", 'Book (history)', 'Parchment (8 sheets)', 'Robe', '8 GP'] },
      { option: 'Valor para comprar tudo', items: ['50 GP'] },
    ],
    info: "You have spent years learning the lore of the multiverse."
  },
  {
    name: 'Sailor',
    source: "PHB'24, page 183",
    abilityScores: ['Strength', 'Dexterity', 'Wisdom'],
    feat: 'Tavern Brawler',
    skillProficiencies: ['Acrobatics', 'Perception'],
    toolProficiency: "Navigator's Tools",
    equipment: [
      { option: 'Kit inicial', items: ['Dagger', "Navigator's Tools", 'Rope', "Traveler's Clothes", '20 GP'] },
      { option: 'Valor para comprar tudo', items: ['50 GP'] },
    ],
    info: "You spent years on a ship, learning the ways of the sea."
  },
  {
    name: 'Scribe',
    source: "PHB'24, page 183",
    abilityScores: ['Dexterity', 'Intelligence', 'Wisdom'],
    feat: 'Skilled',
    skillProficiencies: ['Investigation', 'Perception'],
    toolProficiency: "Calligrapher's Supplies",
    equipment: [
      { option: 'Kit inicial', items: ["Calligrapher's Supplies", 'Fine Clothes', 'Lamp', 'Oil (3 flasks)', 'Parchment (12 sheets)', '23 GP'] },
      { option: 'Valor para comprar tudo', items: ['50 GP'] },
    ],
    info: "You have a talent for transcription and a deep understanding of written language."
  },
  {
    name: 'Soldier',
    source: "PHB'24, page 183",
    abilityScores: ['Strength', 'Dexterity', 'Constitution'],
    feat: 'Savage Attacker',
    skillProficiencies: ['Athletics', 'Intimidation'],
    toolProficiency: 'Choose one kind of Gaming Set',
    equipment: [
      { option: 'Kit inicial', items: ['Spear', 'Shortbow', '20 Arrows', 'Gaming Set', "Healer's Kit", 'Quiver', "Traveler's Clothes", '14 GP'] },
      { option: 'Valor para comprar tudo', items: ['50 GP'] },
    ],
    info: "You have served in an army, trained in warfare and combat."
  },
  {
    name: 'Wayfarer',
    source: "PHB'24, page 184",
    abilityScores: ['Dexterity', 'Wisdom', 'Charisma'],
    feat: 'Lucky',
    skillProficiencies: ['Insight', 'Stealth'],
    toolProficiency: "Thieves' Tools",
    equipment: [
      { option: 'Kit inicial', items: ['2 Daggers', "Thieves' Tools", 'Gaming Set', 'Bedroll', '2 Pouches', "Traveler's Clothes", '16 GP'] },
      { option: 'Valor para comprar tudo', items: ['50 GP'] },
    ],
    info: "You have spent your life on the road, never staying in one place for long."
  },
];

export const abilityNames = {
  str: 'Strength',
  dex: 'Dexterity',
  con: 'Constitution',
  int: 'Intelligence',
  wis: 'Wisdom',
  cha: 'Charisma',
};
