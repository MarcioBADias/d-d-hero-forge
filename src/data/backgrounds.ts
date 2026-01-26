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
        items: [
          "Calligrapher's Supplies",
          'Book (prayers)',
          'Holy Symbol',
          'Parchment (10 sheets)',
          'Robe',
          '8 GP',
        ],
      },
      {
        option: 'Valor para comprar tudo',
        items: ['50 GP'],
      },
    ],
    info: "You have spent your life in the service of a temple to a specific god or pantheon of gods. You act as an intermediary between the mortal world and the realm of the divine. You are familiar with the rituals and traditions of your faith, and you strive to uphold its teachings in your daily life."
  },
  {
    name: 'Artisan',
    source: "PHB'24, page 179",
    abilityScores: ['Strength', 'Dexterity', 'Intelligence'],
    feat: 'Crafter',
    skillProficiencies: ['Investigation', 'Persuasion'],
    toolProficiency: "Choose one kind of Artisan's Tools",
    equipment: [
      {
        option: 'Kit inicial',
        items: ["Artisan's Tools", '2 Pouches', "Traveler's Clothes", '32 GP'],
      },
      {
        option: 'Valor para comprar tudo',
        items: ['50 GP'],
      },
    ],
    info: "You are a member of a guild of artisans, skilled in a particular craft. Your expertise allows you to create and repair items, and you take pride in your workmanship. You have a network of fellow artisans and patrons who can provide support and opportunities related to your trade."
  },
  {
    name: 'Charlatan',
    source: "PHB'24, page 180",
    abilityScores: ['Dexterity', 'Constitution', 'Charisma'],
    feat: 'Skilled',
    skillProficiencies: ['Deception', 'Sleight of Hand'],
    toolProficiency: 'Forgery Kit',
    equipment: [
      {
        option: 'Kit inicial',
        items: ['Forgery Kit', 'Costume', 'Fine Clothes', '15 GP'],
      },
      {
        option: 'Valor para comprar tudo',
        items: ['50 GP'],
      },
    ],
    info: "You have a knack for deception and trickery, using your charm and cunning to manipulate others for personal gain. Whether through elaborate scams or simple cons, you thrive on outwitting your targets. Your skills in forgery and disguise make you a master of deception."
  },
  {
    name: 'Chondathan Freebooter',
    source: "FRHoF, page 28",
    abilityScores: ['Strength', 'Dexterity', 'Wisdom'],
    feat: 'Skilled',
    skillProficiencies: ['Athletics', 'Sleight of Hand'],
    toolProficiency: "Weaver's Tools",
    equipment: [
      {
        option: 'Kit inicial',
        items: ['Dagger', "Weaver's Tools", 'Backpack', 'Ball Bearings', 'Basket', 'Bedroll', 'Bucket', 'Rations (3 days\' worth)', 'Rope', 'Signal Whistle', "Traveler's Clothes", '15 GP'],
      },
      {
        option: 'Valor para comprar tudo',
        items: ['50 GP'],
      },
    ],
    info: "Though most youths in Chondath accept their four-year term of compulsory military service, you bristled at that authoritarian attempt to control your life. You forsook your nationhood, discarded your given name, and worked as a freebooter with the first ship that would have you. Since then, you've traveled the Vilhon Reach. Though you've never sailed more than a few dozen leagues from land, you make up for it with deep local connections and the breadth of your experiences."
  },
  {
    name: 'Criminal',
    source: "PHB'24, page 180",
    abilityScores: ['Dexterity', 'Constitution', 'Intelligence'],
    feat: 'Alert',
    skillProficiencies: ['Sleight of Hand', 'Stealth'],
    toolProficiency: "Thieves' Tools",
    equipment: [
      {
        option: 'Kit inicial',
        items: [
          '2 Daggers',
          "Thieves' Tools",
          'Crowbar',
          '2 Pouches',
          "Traveler's Clothes",
          '16 GP',
        ],
      },
      {
        option: 'Valor para comprar tudo',
        items: ['50 GP'],
      },
    ],
    info: "You have a history of breaking the law, whether as a petty thief, a smuggler, or a fence for stolen goods. Your criminal activities have given you a network of contacts in the underworld, and you know how to navigate the shadows to avoid detection. You are skilled in stealth and deception, using these talents to further your illicit endeavors."
  },
  {
    name: 'Dead Magic Dweller',
    source: "FRHoF, page 28",
    abilityScores: ['Strength', 'Constitution', 'Wisdom'],
    feat: 'Healer',
    skillProficiencies: ['Medicine', 'Survival'],
    toolProficiency: "Leatherworker's Tools",
    equipment: [
      {
        option: 'Kit inicial',
        items: [
          'Greatclub',
          "Leatherworker's Tools",
          'Bedroll',
          'Blanket',
          "Healer's Kit",
          'Pole',
          "Rations (3 days' worth)",
          'Tent',
          'Tinderbox',
          '5 Torches',
          "Traveler's Clothes",
          'Waterskin',
          '32 GP'
        ],
      },
      {
        option: 'Valor para comprar tudo',
        items: ['50 GP'],
      },
    ],
    info: "The dead magic zones of the Anauroch desert are anathema to spellcasters and monsters that rely on magic—which is exactly why you made your life there. Perhaps you're on the run from Red Wizards, or you ran afoul of a powerful djinni in Calimshan. Whatever the case, you decided that living in Anauroch was your best option. After long months or years, you're stronger, wiser, and armed with hard-earned knowledge of desert medicine and wasteland survival."
  },
  {
    name: 'Dragon Cultist',
    source: "FRHoF, page 29",
    abilityScores: ['Dexterity', 'Constitution', 'Intelligence'],
    feat: 'Cult of the Dragon Initiate',
    skillProficiencies: ['Deception', 'Stealth'],
    toolProficiency: "Calligrapher's Supplies",
    equipment: [
      {
        option: 'Kit inicial',
        items: [
          "Calligrapher's Supplies",
          'Dagger',
          'Glass Bottle',
          'Lamp',
          'Manacles',
          'Oil (5 flasks)',
          '2 Pouches',
          'Robe',
          'Rope',
          '30 GP'
        ],
      },
      {
        option: 'Valor para comprar tudo',
        items: ['50 GP'],
      },
    ],
    info: "You are an initiate of the Cult of the Dragon. You discovered or were brought to a cell cult, where you exemplified the values honored by dragon cultists: duplicity, secrecy, and determination. In exchange for your oath to serve the cult, the cult offered you the company of fellow dragon worshipers, plus access to resources that might help further your studies in the realms of arcana and occultism."
  },
  {
    name: 'Emerald Enclave Caretaker',
    source: "FRHoF, page 29",
    abilityScores: ['Constitution', 'Intelligence', 'Wisdom'],
    feat: 'Emerald Enclave Fledgling',
    skillProficiencies: ['Nature', 'Survival'],
    toolProficiency: "Herbalism Kit",
    equipment: [
      {
        option: 'Kit inicial',
        items: [
          'Shortbow', '20 Arrows', 'Herbalism Kit', 'Bedroll', 'Blanket', 'Pouch', 'Tent', "Traveler's Clothes", '13 GP'
        ],
      },
      {
        option: 'Valor para comprar tudo',
        items: ['50 GP'],
      },
    ],
    info:"As a Caretaker with the Emerald Enclave, you take care of those who care for the world. Either alongside your fellow Emerald Enclave members or by yourself, you've learned essential skills for living with the land: how to track game, where to forage for useful herbs, and even how to forecast the weather. You use these talents to maintain the balance between civilization and the wilds and to rid the world of unnatural creatures."
  },
  {
    name: 'Entertainer',
    source: "PHB'24, page 180",
    abilityScores: ['Strength', 'Dexterity', 'Charisma'],
    feat: 'Musician',
    skillProficiencies: ['Acrobatics', 'Performance'],
    toolProficiency: 'Choose one kind of Musical Instrument',
    equipment: [
      {
        option: 'Kit inicial',
        items: [
          'Musical Instrument',
          '2 Costumes',
          'Mirror',
          'Perfume',
          "Traveler's Clothes",
          '11 GP',
        ],
      },
      {
        option: 'Valor para comprar tudo',
        items: ['50 GP'],
      },
    ],
    info: "You have spent your life entertaining others through music, dance, storytelling, or other performances. You are skilled at captivating an audience and bringing joy to those around you. Your talents have taken you to various places, allowing you to experience different cultures and meet a wide range of people."
  },
  {
    name: 'Farmer',
    source: "PHB'24, page 180",
    abilityScores: ['Strength', 'Constitution', 'Wisdom'],
    feat: 'Tough',
    skillProficiencies: ['Animal Handling', 'Nature'],
    toolProficiency: "Carpenter's Tools",
    equipment: [
      {
        option: 'Kit inicial',
        items: [
          'Sickle',
          "Carpenter's Tools",
          "Healer's Kit",
          'Iron Pot',
          'Shovel',
          '30 GP',
        ],
      },
      {
        option: 'Valor para comprar tudo',
        items: ['50 GP'],
      },
    ],
    info: "You have spent your life working the land, cultivating crops, and raising livestock. You are familiar with the rhythms of nature and the hard work required to sustain a farm. Your skills in animal handling and carpentry make you adept at managing a rural lifestyle."
  },
  {
    name: 'Flaming Fist Mercenary',
    source: "FRHoF, page 30",
    abilityScores: ['Strength', 'Constitution', 'Charisma'],
    feat: 'Tough',
    skillProficiencies: ['Intimidation', 'Deception'],
    toolProficiency: "Smith's Tools",
    equipment: [
      {
        option: 'Kit inicial',
        items: [
          'Mace', "Smith's Tools", 'Fine Clothes', 'Manacles', 'Portable Ram', '4 GP'
        ],
      },
      {
        option: 'Valor para comprar tudo',
        items: ['50 GP'],
      },
    ],
    info: "The chief law enforcement branch of Baldur's Gate is the Flaming Fist, a brawny mercenary guild led by the city's grand duke. You once served as a Flaming Fist, where you learned how to preempt trouble with your intimidating stare and, when necessary, absorb deadly blows. Flaming Fist mercenaries, active or retired, are known as some of the toughest, most resilient warriors along the Sword Coast, and you seek to maintain that reputation."
  },
  {
    name: 'Genie Touched',
    source: "FRHoF, page 30",
    abilityScores: ['Dexterity', 'Wisdom', 'Charisma'],
    feat: 'Magic Initiate (Wizard)',
    skillProficiencies: ['Perception', 'Persuasion'],
    toolProficiency: "Glassblower's Tools",
    equipment: [
      {
        option: 'Kit inicial',
        items: [
          'Light Hammer', "Glassblower's Tools", 'Fine Clothes', 'Lamp', 'Oil (3 flasks)', 'Waterskin', '2 GP'
        ],
      },
      {
        option: 'Valor para comprar tudo',
        items: ['50 GP'],
      },
    ],
    info: "Although genies no longer rule Calimshan, genie magic is still common in your homeland. Perhaps you inadvertently summoned a djinni from a magic lamp, or maybe you came upon an oasis guarded by a marid. A dao might have saved you from a landslide, or you bargained with an efreeti for fleeting wealth. However your fate intersected with that of a genie, the experience left you with a keen eye, a silver tongue, and more than a touch of magic."
  },
  {
    name: 'Guard',
    source: "PHB'24, page 181",
    abilityScores: ['Strength', 'Intelligence', 'Wisdom'],
    feat: 'Alert',
    skillProficiencies: ['Athletics', 'Perception'],
    toolProficiency: 'Choose one kind of Gaming Set',
    equipment: [
      {
        option: 'Kit inicial',
        items: [
          'Spear',
          'Light Crossbow',
          '20 Bolts',
          'Gaming Set',
          'Hooded Lantern',
          'Manacles',
          'Quiver',
          "Traveler's Clothes",
          '12 GP',
        ],
      },
      {
        option: 'Valor para comprar tudo',
        items: ['50 GP'],
      },
    ],
    info: "You have served as a city watchman, a castle guard, or a personal bodyguard. Your duty was to protect others, and you took that responsibility seriously. You are trained in combat and vigilance, always ready to respond to threats. Your experience in guarding others has made you disciplined and reliable."
  },
  {
    name: 'Guide',
    source: "PHB'24, page 181",
    abilityScores: ['Dexterity', 'Constitution', 'Wisdom'],
    feat: 'Magic Initiate (Druid)',
    skillProficiencies: ['Stealth', 'Survival'],
    toolProficiency: "Cartographer's Tools",
    equipment: [
      {
        option: 'Kit inicial',
        items: [
          'Shortbow',
          '20 Arrows',
          "Cartographer's Tools",
          'Bedroll',
          'Quiver',
          'Tent',
          "Traveler's Clothes",
          '3 GP',
        ],
      },
      {
        option: 'Valor para comprar tudo',
        items: ['50 GP'],
      },
    ],
    info: "You have experience leading others through wilderness areas, whether as a scout for a military unit, a guide for a merchant caravan, or a pathfinder for adventurers. You are skilled in navigation and survival, able to find safe routes and avoid dangers. Your knowledge of the wilderness makes you a valuable companion for those venturing into the unknown."
  },
  {
    name: 'Harper',
    source: "FRHoF, page 30",
    abilityScores: ['Dexterity', 'Intelligence', 'Charisma'],
    feat: 'Harper Agent',
    skillProficiencies: ['Performance', 'Sleight of Hand'],
    toolProficiency: 'Disguise Kit',
    equipment: [
      {
        option: 'Kit inicial',
        items: [
          'Disguise Kit', 'Bedroll', 'Costume', 'Grappling Hook', 'Rope', "Traveler's Clothes", '14 GP'
        ],
      },
      {
        option: 'Valor para comprar tudo',
        items: ['50 GP'],
      },
    ],
    info: "You accepted an invitation to join the Harpers, pledging an oath to uphold the Harper code and act in service to the common good. Like all Harpers, you understand the value of teamwork as well as when it's best to go it alone. Harper veterans have taught you the order's secrets—magical melodies, special watchwords, and legerdemain—and have entrusted you to use such knowledge to surveil and undermine the forces of evil."
  },
  {
    name: 'Hermit',
    source: "PHB'24, page 182",
    abilityScores: ['Constitution', 'Wisdom', 'Charisma'],
    feat: 'Healer',
    skillProficiencies: ['Medicine', 'Religion'],
    toolProficiency: 'Herbalism Kit',
    equipment: [
      {
        option: 'Kit inicial',
        items: [
          'Quarterstaff',
          'Herbalism Kit',
          'Bedroll',
          'Book (philosophy)',
          'Lamp',
          'Oil (3 flasks)',
          "Traveler's Clothes",
          '16 GP',
        ],
      },
      {
        option: 'Valor para comprar tudo',
        items: ['50 GP'],
      },
    ],
    info: "You lived in seclusion—either in a sheltered community such as a monastery, or entirely alone—away from the bustle of civilization. Your time in isolation allowed you to gain profound insights into the nature of existence, the universe, or perhaps even magic itself. You are skilled in self-discipline and contemplation, and you have a deep understanding of the world around you."
  },
  {
    name: 'Merchant',
    source: "PHB'24, page 182",
    abilityScores: ['Constitution', 'Intelligence', 'Charisma'],
    feat: 'Lucky',
    skillProficiencies: ['Animal Handling', 'Persuasion'],
    toolProficiency: "Navigator's Tools",
    equipment: [
      {
        option: 'Kit inicial',
        items: [
          "Navigator's Tools",
          '2 Pouches',
          "Traveler's Clothes",
          '22 GP',
        ],
      },
      {
        option: 'Valor para comprar tudo',
        items: ['50 GP'],
      },
    ],
    info: "You have experience in buying and selling goods, whether as a traveling merchant, a shopkeeper, or a trader. You are skilled in negotiation and persuasion, able to strike favorable deals and build relationships with customers. Your knowledge of commerce and trade makes you adept at navigating the complexities of the market."
  },
  {
    name: 'Ice Fisher',
    source: "FRHoF, page 31",
    abilityScores: ['Strength', 'Dexterity', 'Constitution'],
    feat: 'Alert',
    skillProficiencies: ['Animal Handling', 'Athletics'],
    toolProficiency: "Woodcarver's Tools",
    equipment: [
      {
        option: 'Kit inicial',
        items: [
          "Woodcarver's Tools", 'Basket', 'Block and Tackle', 'Chain', 'Hunting Trap', 'Net', 'Pole', "Rations (3 days' worth)", "Traveler's Clothes", '32 GP'
        ],
      },
      {
        option: 'Valor para comprar tudo',
        items: ['50 GP'],
      },
    ],
    info: "You come from a proud line of ice fishers out of Ten-Towns in Icewind Dale. Catching knucklehead trout isn't the most glorious trade in the North, but it's an honest living. You've trained your senses for the slightest tug on the line, wrestled big trout out of ice-covered lakes, and gutted enough knucklehead trout to feed your village many times over. These experiences have toughened your body and mind for a life of adventuring."
  },
  {
    name: 'Knight of the Gauntlet',
    source: "FRHoF, page 32",
    abilityScores: ['Strength', 'Intelligence', 'Wisdom'],
    feat: 'Tyro of the Gauntlet',
    skillProficiencies: ['Athletics', 'Medicine'],
    toolProficiency: "Smith's Tools",
    equipment: [
      {
        option: 'Kit inicial',
        items: ['Spear', "Smith's Tools", 'Bullseye Lantern', 'Holy Symbol', 'Manacles', 'Oil (5 flasks)', 'Tinderbox', "Traveler's Clothes", '9 GP'],
      },
      {
        option: 'Valor para comprar tudo',
        items: ['50 GP'],
      },
    ],
    info: "Not all who answer the call of a higher power are content to pore over scripture in a stuffy temple apse. You chose the path of the holy warrior by joining the Order of the Gauntlet. As a knight of the Gauntlet, you exercise righteous scorn for the forces of evil, unswerving camaraderie for your siblings in arms, and heartfelt compassion for the survivors of war. With weapon and holy symbol in hand, you've sworn not to rest until the light of justice has vanquished the shadow of chaos across Faerûn."
  },
  {
    name: "Lords' Alliance Vassal",
    source: "FRHoF, page 32",
    abilityScores: ['Strength', 'Intelligence', 'Charisma'],
    feat: "Lords' Alliance Agent",
    skillProficiencies: ['Insight', 'Persuasion'],
    toolProficiency: "Calligrapher's Supplies",
    equipment: [
      {
        option: 'Kit inicial',
        items: ['2 Javelins', "Calligrapher's Supplies", 'Fine Clothes', 'Ink', '5 Ink Pens', 'Parchment (9 sheets)', '13 GP'],
      },
      {
        option: 'Valor para comprar tudo',
        items: ['50 GP'],
      },
    ],
    info: "You've pledged your loyalty to a member-city of the Lords' Alliance. As an Alliance agent, you must uphold the tenets of the Alliance and seek to increase safety and prosperity along the Sword Coast. You're sworn to bring honor and glory to your lord's house, whether that means securing trade roads for a merchant-lord of Waterdeep or vanquishing monsters upriver of Daggerford. You've trained in the arts of swordplay and statecraft and are as deft with a blade as you are with a quill."
  },
  {
    name: 'Moonwell Pilgrim',
    source: "FRHoF, page 33",
    abilityScores: ['Constitution', 'Wisdom', 'Charisma'],
    feat: "Magic Initiate (Druid)",
    skillProficiencies: ['Nature', 'Performance'],
    toolProficiency: "Painter's Supplies",
    equipment: [
      {
        option: 'Kit inicial',
        items: ['Quarterstaff', "Painter's Supplies", 'Bedroll', 'Bell', 'Pouch', 'Robe', 'String', "Traveler's Clothes", 'Waterskin', '38 GP'],
      },
      {
        option: 'Valor para comprar tudo',
        items: ['50 GP'],
      },
    ],
    info: "Like many who hail from the Moonshae Isles, you grew up revering the blessed land, its unique gods, and the mysterious shrines called the moonwells. As a moonwell pilgrim, you undertook a quest to visit and commune with every moonwell on (or off) the map. Along your idyllic journeys, you collected a repertoire of Moonshavian folk songs, painted landscapes of enchanting vistas, and even learned how to wield a bit of primal magic."
  },
  {
    name: 'Mulhorandi Tomb Raider',
    source: "FRHoF, page 33",
    abilityScores: ['Dexterity', 'Constitution', 'Intelligence'],
    feat: "Lucky",
    skillProficiencies: ['Investigation', 'Religion'],
    toolProficiency: "Mason's Tools",
    equipment: [
      {
        option: 'Kit inicial',
        items: ['Dagger', 'Light Hammer', "Mason's Tools", 'Backpack', 'Bedroll', 'Crowbar', 'Ladder', 'Pole', '2 Pouches', 'Rope', 'String', 'Tinderbox', '5 Torches', "Traveler's Clothes", 'Waterskin', '26 GP'],
      },
      {
        option: 'Valor para comprar tudo',
        items: ['50 GP'],
      },
    ],
    info: "You grew up in a land of living god-kings, and as a child you were told countless stories of ancient empires and buried cities. In these tales, Mulhorand was a land overflowing with forgotten riches—priceless treasures awaiting anyone cunning and brave enough to seek them out. You've taken it upon yourself to explore your homeland's crypts, tombs, and pyramids to reclaim your people's relics."
  },
  {
    name: 'Mythalkeeper',
    source: "FRHoF, page 34",
    abilityScores: ['Intelligence', 'Wisdom', 'Charisma'],
    feat: "Crafter",
    skillProficiencies: ['Arcana', 'History'],
    toolProficiency: "Jeweler's Tools",
    equipment: [
      {
        option: 'Kit inicial',
        items: ['Quarterstaff', "Jeweler's Tools", 'Perfume', 'Pouch', 'Robe', 'Shovel', 'String', 'Waterskin', '16 GP'],
      },
      {
        option: 'Valor para comprar tudo',
        items: ['50 GP'],
      },
    ],
    info: "Mythals are sources of great magical power that can alter the Weave or even the very nature of reality. Most were constructed in antiquity, and many have since been damaged or gone dormant. As a mythalkeeper from the Dalelands, your first experience with a mythal was likely in the ruins of Myth Drannor. You roam Faerûn in search of other ruined places of power, hoping to learn more about the history and powers of mythals—or even restore a malfunctioning one."
  },
  {
    name: 'Noble',
    source: "PHB'24, page 183",
    abilityScores: ['Strength', 'Intelligence', 'Charisma'],
    feat: 'Skilled',
    skillProficiencies: ['History', 'Persuasion'],
    toolProficiency: 'Choose one kind of Gaming Set',
    equipment: [
      {
        option: 'Kit inicial',
        items: ['Gaming Set', 'Fine Clothes', 'Perfume', '29 GP'],
      },
      {
        option: 'Valor para comprar tudo',
        items: ['50 GP'],
      },
    ],
    info: "You come from a family of high social standing, whether as minor nobility or wealthy landowners. Your upbringing has provided you with a refined education and an understanding of etiquette and diplomacy. You are skilled in persuasion and history, able to navigate the complexities of social interactions and draw upon your knowledge of the past."
  },
  {
    name: 'Purple Dragon Squire',
    source: "FRHoF, page 34",
    abilityScores: ['Strength', 'Wisdom', 'Charisma'],
    feat: "Purple Dragon Rook",
    skillProficiencies: ['Animal Handling', 'Insight'],
    toolProficiency: "Navigator's Tools",
    equipment: [
      {
        option: 'Kit inicial',
        items: ['Spear', "Navigator's Tools", "Fine Clothes", '9 GP'],
      },
      {
        option: 'Valor para comprar tudo',
        items: ['50 GP'],
      },
    ],
    info: "You've pledged your life to the safety of Cormyr and sought admission to that realm's order of elite warriors: the Purple Dragon Knights. But before you have the chance to join the ranks officially, you must first serve as a knight's squire. You've found a liege willing to take you on and teach you the order's ways. Will you uphold the Purple Dragon Knights' ideals of glory, honor, and strength and prove yourself worthy of knighthood?"
  },
  {
    name: 'Rashemi Wanderer',
    source: "FRHoF, page 35",
    abilityScores: ['Strength', 'Constitution', 'Charisma'],
    feat: "Tough",
    skillProficiencies: ['Intimidation', 'Perception'],
    toolProficiency: "Cartographer's Tools",
    equipment: [
      {
        option: 'Kit inicial',
        items: ["Cartographer's Tools", 'Backpack', 'Bedroll', 'Hooded Lantern', 'Oil (3 flasks)', 'Rope', 'Tinderbox', "Traveler's Clothes", 'Waterskin', '23 GP'],
      },
      {
        option: 'Valor para comprar tudo',
        items: ['50 GP'],
      },
    ],
    info: "You come from the harsh steppes of Rashemen, where your people revere the traditions of old and the magic-using women known as the Wychlaran. You have the hardy constitution of a steppe nomad and the pragmatism of someone who survives by their wits and grit. You're accustomed to ranging far from civilization and making do with little, which makes you well-suited to adventuring."
  },
  {
    name: 'Sage',
    source: "PHB'24, page 183",
    abilityScores: ['Constitution', 'Intelligence', 'Wisdom'],
    feat: 'Magic Initiate (Wizard)',
    skillProficiencies: ['Arcana', 'History'],
    toolProficiency: "Calligrapher's Supplies",
    equipment: [
      {
        option: 'Kit inicial',
        items: [
          'Quarterstaff',
          "Calligrapher's Supplies",
          'Book (history)',
          'Parchment (8 sheets)',
          'Robe',
          '8 GP',
        ],
      },
      {
        option: 'Valor para comprar tudo',
        items: ['50 GP'],
      },
    ],
    info: "You have spent years studying the arcane arts, delving into ancient tomes and scrolls to uncover forgotten knowledge. Your thirst for understanding has led you to become an expert in various fields of magic and lore. You are skilled in research and analysis, able to decipher complex texts and unravel mysteries."
  },
  {
    name: 'Sailor',
    source: "PHB'24, page 184",
    abilityScores: ['Strength', 'Dexterity', 'Wisdom'],
    feat: 'Tavern Brawler',
    skillProficiencies: ['Acrobatics', 'Perception'],
    toolProficiency: "Navigator's Tools",
    equipment: [
      {
        option: 'Kit inicial',
        items: [
          'Dagger',
          "Navigator's Tools",
          'Rope',
          "Traveler's Clothes",
          '20 GP',
        ],
      },
      {
        option: 'Valor para comprar tudo',
        items: ['50 GP'],
      },
    ],
    info: "You have spent your life at sea, whether as a merchant sailor, a naval officer, or a pirate. You are familiar with the workings of ships and the challenges of life on the open ocean. Your skills in navigation and seamanship make you adept at handling a vessel and surviving the perils of the sea."
  },
  {
    name: 'Scribe',
    source: "PHB'24, page 184",
    abilityScores: ['Dexterity', 'Intelligence', 'Wisdom'],
    feat: 'Skilled',
    skillProficiencies: ['Investigation', 'Perception'],
    toolProficiency: "Calligrapher's Supplies",
    equipment: [
      {
        option: 'Kit inicial',
        items: [
          "Calligrapher's Supplies",
          'Fine Clothes',
          'Lamp',
          'Oil (3 flasks)',
          'Parchment (12 sheets)',
          '23 GP',
        ],
      },
      {
        option: 'Valor para comprar tudo',
        items: ['50 GP'],
      },
    ],
    info: "You have dedicated your life to the art of writing and record-keeping. Whether as a scribe for a noble house, a scholar in a library, or a clerk in a guild, you are skilled in the meticulous craft of transcription. Your attention to detail and knowledge of various scripts make you adept at preserving important information."
  },
  {
    name: 'Shadowmasters Exile',
    source: "FRHoF, page 35",
    abilityScores: ['Dexterity', 'Intelligence', 'Charisma'],
    feat: "Savage Attacker",
    skillProficiencies: ['Acrobatics', 'Stealth'],
    toolProficiency: "Thieves' Tools",
    equipment: [
      {
        option: 'Kit inicial',
        items: ['2 Daggers', "Thieves' Tools", 'Caltrops', 'Costume', 'Grappling Hook', 'Iron Spikes', 'Mirror', '2 Pouches', 'Rope', "Traveler's Clothes", '3 GP'],
      },
      {
        option: 'Valor para comprar tudo',
        items: ['50 GP'],
      },
    ],
    info: "You trained your whole life to become a member of the Shadowmasters, the mysterious thieves' guild that controls the realm of Thesk from behind the scenes. Stealth and quick reflexes were just the start of your Shadowmaster education; you also needed to hone your ruthlessness to ensure the safety of the guild's secrets. But one wrong move led to your expulsion from the order. Now you must walk your own path."
  },
  {
    name: 'Spellfire Initiate',
    source: "FRHoF, page 36",
    abilityScores: ['Constitution', 'Intelligence', 'Charisma'],
    feat: "Spellfire Spark",
    skillProficiencies: ['Arcana', 'Perception'],
    toolProficiency: "Choose one kind of Gaming Set",
    equipment: [
      {
        option: 'Kit inicial',
        items: ['Gaming Set', 'Arcane Focus (Crystal or Wand)', '2 Pouches', "Traveler's Clothes", '36 GP'],
      },
      {
        option: 'Valor para comprar tudo',
        items: ['50 GP'],
      },
    ],
    info: "You bear the gift of spellfire: a rare form of magic that channels the raw power of the Weave. Wielding spellfire takes a heavy toll on the body. You've trained both mind and body to efficiently wield this sacred power."
  },
  {
    name: 'Soldier',
    source: "PHB'24, page 185",
    abilityScores: ['Strength', 'Dexterity', 'Constitution'],
    feat: 'Savage Attacker',
    skillProficiencies: ['Athletics', 'Intimidation'],
    toolProficiency: 'Choose one kind of Gaming Set',
    equipment: [
      {
        option: 'Kit inicial',
        items: [
          'Spear',
          'Shortbow',
          '20 Arrows',
          'Gaming Set',
          "Healer's Kit",
          'Quiver',
          "Traveler's Clothes",
          '14 GP',
        ],
      },
      {
        option: 'Valor para comprar tudo',
        items: ['50 GP'],
      },
    ],
    info: "You have served in a military organization, whether as a rank-and-file soldier, a mercenary, or an officer. Your experience in the military has taught you discipline, teamwork, and the skills necessary for combat. You are skilled in tactics and strategy, able to lead others in battle and adapt to changing situations."
  },
  {
    name: 'Wayfarer',
    source: "PHB'24, page 185",
    abilityScores: ['Dexterity', 'Wisdom', 'Charisma'],
    feat: 'Lucky',
    skillProficiencies: ['Insight', 'Stealth'],
    toolProficiency: "Thieves' Tools",
    equipment: [
      {
        option: 'Kit inicial',
        items: [
          '2 Daggers',
          "Thieves' Tools",
          'Gaming Set',
          'Bedroll',
          '2 Pouches',
          "Traveler's Clothes",
          '16 GP',
        ],
      },
      {
        option: 'Valor para comprar tudo',
        items: ['50 GP'],
      },
    ],
    info: "You have spent your life traveling from place to place, exploring new lands and experiencing different cultures. You are skilled in navigation and survival, able to find your way through unfamiliar terrain and adapt to new environments. Your experiences on the road have made you resourceful and independent."
  },
  {
    name: 'Zhentarim Mercenary',
    source: "FRHoF, page 36",
    abilityScores: ['Strength', 'Dexterity', 'Charisma'],
    feat: "Zhentarim Ruffian",
    skillProficiencies: ['Intimidation', 'Perception'],
    toolProficiency: "Forgery Kit",
    equipment: [
      {
        option: 'Kit inicial',
        items: ['Club', 'Dagger', 'Forgery Kit', 'Fine Clothes', 'Hooded Lantern', 'Oil (3 flasks)', '2 Pouches', 'String', 'Tinderbox', '11 GP'],
      },
      {
        option: 'Valor para comprar tudo',
        items: ['50 GP'],
      },
    ],
    info: "Maybe you needed the money. Maybe you longed for a family, no matter how dubious. Or maybe you're just good at getting the job done by any means necessary. Whatever your reason, you enlisted with the Zhentarim, the most notorious mercenary guild in the Realms. Though the Zhentarim's leaders insist the organization is more like a family than a shadowy syndicate, few families exhibit as much dishonesty, nepotism, and corruption as this one. You've honed your cunning, reflexes, and blade to climb the guild's ranks."
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
