export type MagicItemRarity = 'Common' | 'Uncommon' | 'Rare' | 'Very Rare' | 'Legendary' | 'Artifact' | 'Varies';
export type MagicItemType = 'Armor' | 'Weapon' | 'Wondrous Item' | 'Potion' | 'Ring' | 'Rod' | 'Scroll' | 'Staff' | 'Wand';

export interface MagicItem {
  name: string;
  type: MagicItemType;
  rarity: MagicItemRarity;
  attunement: boolean;
  description: string;
  subtype?: string;
}

export const magicItems: MagicItem[] = [
  // Armor
  {
    name: 'Adamantine Armor',
    type: 'Armor',
    rarity: 'Uncommon',
    attunement: false,
    subtype: 'Any Medium or Heavy, Except Hide',
    description: 'This suit of armor is reinforced with adamantine, one of the hardest substances in existence. While you\'re wearing it, any Critical Hit against you becomes a normal hit.'
  },
  {
    name: 'Armor, +1',
    type: 'Armor',
    rarity: 'Rare',
    attunement: false,
    subtype: 'Any Light, Medium, or Heavy',
    description: 'You have a +1 bonus to Armor Class while wearing this armor.'
  },
  {
    name: 'Armor, +2',
    type: 'Armor',
    rarity: 'Very Rare',
    attunement: false,
    subtype: 'Any Light, Medium, or Heavy',
    description: 'You have a +2 bonus to Armor Class while wearing this armor.'
  },
  {
    name: 'Armor, +3',
    type: 'Armor',
    rarity: 'Legendary',
    attunement: false,
    subtype: 'Any Light, Medium, or Heavy',
    description: 'You have a +3 bonus to Armor Class while wearing this armor.'
  },
  {
    name: 'Armor of Invulnerability',
    type: 'Armor',
    rarity: 'Legendary',
    attunement: true,
    subtype: 'Plate Armor',
    description: 'You have Resistance to Bludgeoning, Piercing, and Slashing damage while you wear this armor. Metal Shell: You can take a Magic action to give yourself Immunity to Bludgeoning, Piercing, and Slashing damage for 10 minutes or until you are no longer wearing the armor. Once this property is used, it can\'t be used again until the next dawn.'
  },
  {
    name: 'Armor of Resistance',
    type: 'Armor',
    rarity: 'Rare',
    attunement: true,
    subtype: 'Any Light, Medium, or Heavy',
    description: 'You have Resistance to one type of damage while you wear this armor. The DM chooses the type or determines it randomly (Acid, Cold, Fire, Force, Lightning, Necrotic, Poison, Psychic, Radiant, Thunder).'
  },
  {
    name: 'Animated Shield',
    type: 'Armor',
    rarity: 'Very Rare',
    attunement: true,
    subtype: 'Shield',
    description: 'While holding this Shield, you can take a Bonus Action to cause it to animate. The Shield leaps into the air and hovers in your space to protect you as if you were wielding it, leaving your hands free. The Shield remains animate for 1 minute, until you take a Bonus Action to end this effect, or until you die or have the Incapacitated condition.'
  },
  {
    name: 'Arrow-Catching Shield',
    type: 'Armor',
    rarity: 'Rare',
    attunement: true,
    subtype: 'Shield',
    description: 'You gain a +2 bonus to Armor Class against ranged attack rolls while you wield this Shield. Whenever an attacker makes a ranged attack roll against a target within 5 feet of you, you can take a Reaction to become the target of the attack instead.'
  },
  // Weapons
  {
    name: 'Ammunition, +1',
    type: 'Weapon',
    rarity: 'Uncommon',
    attunement: false,
    subtype: 'Any Ammunition',
    description: 'You have a +1 bonus to attack rolls and damage rolls made with this piece of magic ammunition. Once it hits a target, the ammunition is no longer magical.'
  },
  {
    name: 'Ammunition, +2',
    type: 'Weapon',
    rarity: 'Rare',
    attunement: false,
    subtype: 'Any Ammunition',
    description: 'You have a +2 bonus to attack rolls and damage rolls made with this piece of magic ammunition. Once it hits a target, the ammunition is no longer magical.'
  },
  {
    name: 'Ammunition, +3',
    type: 'Weapon',
    rarity: 'Very Rare',
    attunement: false,
    subtype: 'Any Ammunition',
    description: 'You have a +3 bonus to attack rolls and damage rolls made with this piece of magic ammunition. Once it hits a target, the ammunition is no longer magical.'
  },
  {
    name: 'Berserker Axe',
    type: 'Weapon',
    rarity: 'Rare',
    attunement: true,
    subtype: 'Any Axe',
    description: 'You gain a +1 bonus to attack and damage rolls made with this magic weapon. In addition, while you are attuned to this weapon, your Hit Point maximum increases by 1 for each level you have attained. Curse: This axe is cursed, and becoming attuned to it extends the curse to you. As long as you remain cursed, you are unwilling to part with the axe. Whenever a hostile creature damages you while the axe is in your possession, you must succeed on a DC 15 Wisdom saving throw or go berserk.'
  },
  {
    name: 'Dagger of Venom',
    type: 'Weapon',
    rarity: 'Rare',
    attunement: false,
    subtype: 'Dagger',
    description: 'You gain a +1 bonus to attack and damage rolls made with this magic weapon. You can take a Magic action to cause thick, black poison to coat the blade. The poison remains for 1 minute or until an attack using this weapon hits a creature. That creature must succeed on a DC 15 Constitution saving throw or take 2d10 Poison damage and have the Poisoned condition for 1 minute. The dagger can\'t be used this way again until the next dawn.'
  },
  {
    name: 'Dancing Sword',
    type: 'Weapon',
    rarity: 'Very Rare',
    attunement: true,
    subtype: 'Any Sword',
    description: 'You can take a Bonus Action to toss this magic sword into the air and speak a command word. When you do so, the sword begins to hover, flies up to 30 feet, and attacks one creature of your choice within 5 feet of it. The sword uses your attack roll and ability score modifier to damage rolls.'
  },
  {
    name: 'Dragon Slayer',
    type: 'Weapon',
    rarity: 'Rare',
    attunement: false,
    subtype: 'Any Sword',
    description: 'You gain a +1 bonus to attack and damage rolls made with this magic weapon. When you hit a Dragon with this weapon, the Dragon takes an extra 3d6 damage of the weapon\'s type.'
  },
  {
    name: 'Flame Tongue',
    type: 'Weapon',
    rarity: 'Rare',
    attunement: true,
    subtype: 'Any Sword',
    description: 'You can take a Bonus Action to cause flames to erupt from this magic sword. These flames shed Bright Light in a 40-foot radius and Dim Light for an additional 40 feet. While ablaze, the sword deals an extra 2d6 Fire damage to any target it hits. The flames last until you take a Bonus Action to extinguish them or until you drop or sheathe the sword.'
  },
  {
    name: 'Frost Brand',
    type: 'Weapon',
    rarity: 'Very Rare',
    attunement: true,
    subtype: 'Any Sword',
    description: 'When you hit with an attack using this magic sword, the target takes an extra 1d6 Cold damage. In addition, while you hold the sword, you have Resistance to Fire damage.'
  },
  {
    name: 'Giant Slayer',
    type: 'Weapon',
    rarity: 'Rare',
    attunement: false,
    subtype: 'Any Axe or Sword',
    description: 'You gain a +1 bonus to attack and damage rolls made with this magic weapon. When you hit a Giant with this weapon, the Giant takes an extra 2d6 damage of the weapon\'s type and must succeed on a DC 15 Strength saving throw or have the Prone condition.'
  },
  {
    name: 'Holy Avenger',
    type: 'Weapon',
    rarity: 'Legendary',
    attunement: true,
    subtype: 'Any Sword',
    description: 'You gain a +3 bonus to attack and damage rolls made with this magic weapon. When you hit a Fiend or an Undead with this weapon, that creature takes an extra 2d10 Radiant damage. While you hold the drawn sword, it creates an aura in a 10-foot Emanation. You and your allies in the aura have Advantage on saving throws against spells and other magical effects.'
  },
  {
    name: 'Luck Blade',
    type: 'Weapon',
    rarity: 'Legendary',
    attunement: true,
    subtype: 'Any Sword',
    description: 'You gain a +1 bonus to attack and damage rolls made with this magic weapon. While the sword is on your person, you gain a +1 bonus to saving throws. Luck: If the sword is on your person, you can call on its luck (no action required) to reroll one attack roll, ability check, or saving throw you dislike. You must use the second roll. This property can\'t be used again until the next dawn.'
  },
  {
    name: 'Mace of Disruption',
    type: 'Weapon',
    rarity: 'Rare',
    attunement: true,
    subtype: 'Mace',
    description: 'When you hit a Fiend or an Undead with this magic weapon, that creature takes an extra 2d6 Radiant damage. If the target has 25 Hit Points or fewer after taking this damage, it must succeed on a DC 15 Wisdom saving throw or be destroyed.'
  },
  {
    name: 'Mace of Smiting',
    type: 'Weapon',
    rarity: 'Rare',
    attunement: false,
    subtype: 'Mace',
    description: 'You gain a +1 bonus to attack and damage rolls made with this magic weapon. The bonus increases to +3 when you use the mace to attack a Construct. When you roll a 20 on an attack roll made with this weapon, the target takes an extra 7 (2d6) Bludgeoning damage, or 14 (4d6) Bludgeoning damage if it\'s a Construct.'
  },
  {
    name: 'Nine Lives Stealer',
    type: 'Weapon',
    rarity: 'Very Rare',
    attunement: true,
    subtype: 'Any Sword',
    description: 'You gain a +2 bonus to attack and damage rolls made with this magic weapon. The sword has 9 charges. When you attack a creature with this weapon and roll a 20 on the d20, the creature must make a DC 15 Constitution saving throw or be slain instantly if it has 100 Hit Points or fewer. If slain, the sword loses 1 charge.'
  },
  {
    name: 'Oathbow',
    type: 'Weapon',
    rarity: 'Very Rare',
    attunement: true,
    subtype: 'Longbow',
    description: 'When you nock an arrow on this bow, it whispers in Elvish: "Swift defeat to my enemies." When you use this weapon to make a ranged attack, you can, as a command phrase, say: "Swift death to you who have wronged me." The target of your attack becomes your sworn enemy until it dies or until dawn seven days later.'
  },
  {
    name: 'Scimitar of Speed',
    type: 'Weapon',
    rarity: 'Very Rare',
    attunement: true,
    subtype: 'Scimitar',
    description: 'You gain a +2 bonus to attack and damage rolls made with this magic weapon. In addition, you can make one attack with it as a Bonus Action on each of your turns.'
  },
  {
    name: 'Sun Blade',
    type: 'Weapon',
    rarity: 'Rare',
    attunement: true,
    subtype: 'Longsword',
    description: 'This item appears to be a Longsword hilt. While grasping the hilt, you can take a Bonus Action to cause a blade of pure radiance to spring into existence or make the blade disappear. While the blade exists, this magic Longsword has the Finesse property. You gain a +2 bonus to attack and damage rolls, and you deal Radiant damage instead of Slashing damage.'
  },
  {
    name: 'Sword of Life Stealing',
    type: 'Weapon',
    rarity: 'Rare',
    attunement: true,
    subtype: 'Any Sword',
    description: 'When you attack a creature with this magic weapon and roll a 20 on the d20, that target takes an extra 10 Necrotic damage if it isn\'t a Construct or an Undead. You also gain 10 Temporary Hit Points.'
  },
  {
    name: 'Sword of Sharpness',
    type: 'Weapon',
    rarity: 'Very Rare',
    attunement: true,
    subtype: 'Any Sword that Deals Slashing Damage',
    description: 'When you attack an object with this magic sword and hit, maximize your weapon damage dice against the target. When you attack a creature with this weapon and roll a 20 on the d20, that target takes an extra 14 (4d6) Slashing damage.'
  },
  {
    name: 'Sword of Wounding',
    type: 'Weapon',
    rarity: 'Rare',
    attunement: true,
    subtype: 'Any Sword',
    description: 'Hit Points lost to this weapon\'s damage can be regained only through a Short or Long Rest rather than by regeneration, magic, or any other means. Once per turn, when you hit a creature with an attack using this magic weapon, you can wound the target. It takes 1d4 Necrotic damage at the start of each of its turns.'
  },
  {
    name: 'Trident of Fish Command',
    type: 'Weapon',
    rarity: 'Uncommon',
    attunement: true,
    subtype: 'Trident',
    description: 'This trident is a magic weapon. It has 3 charges. While you carry it, you can take a Magic action and expend 1 charge to cast Dominate Beast (save DC 15) from it on a Beast that has an innate Swimming Speed. The trident regains 1d3 expended charges daily at dawn.'
  },
  {
    name: 'Vicious Weapon',
    type: 'Weapon',
    rarity: 'Rare',
    attunement: false,
    subtype: 'Any',
    description: 'When you roll a 20 on your attack roll with this magic weapon, your critical hit deals an extra 7 (2d6) damage of the weapon\'s type.'
  },
  {
    name: 'Vorpal Sword',
    type: 'Weapon',
    rarity: 'Legendary',
    attunement: true,
    subtype: 'Any Sword that Deals Slashing Damage',
    description: 'You gain a +3 bonus to attack and damage rolls made with this magic weapon. In addition, the weapon ignores Resistance to Slashing damage. When you attack a creature that has at least one head with this weapon and roll a 20 on the d20, you cut off one of the creature\'s heads.'
  },
  {
    name: 'Weapon, +1',
    type: 'Weapon',
    rarity: 'Uncommon',
    attunement: false,
    subtype: 'Any',
    description: 'You have a +1 bonus to attack and damage rolls made with this magic weapon.'
  },
  {
    name: 'Weapon, +2',
    type: 'Weapon',
    rarity: 'Rare',
    attunement: false,
    subtype: 'Any',
    description: 'You have a +2 bonus to attack and damage rolls made with this magic weapon.'
  },
  {
    name: 'Weapon, +3',
    type: 'Weapon',
    rarity: 'Very Rare',
    attunement: false,
    subtype: 'Any',
    description: 'You have a +3 bonus to attack and damage rolls made with this magic weapon.'
  },
  // Wondrous Items
  {
    name: 'Amulet of Health',
    type: 'Wondrous Item',
    rarity: 'Rare',
    attunement: true,
    description: 'Your Constitution is 19 while you wear this amulet. It has no effect on you if your Constitution is 19 or higher without it.'
  },
  {
    name: 'Amulet of Proof against Detection and Location',
    type: 'Wondrous Item',
    rarity: 'Uncommon',
    attunement: true,
    description: 'While wearing this amulet, you can\'t be targeted by Divination spells or perceived through magical scrying sensors unless you allow it.'
  },
  {
    name: 'Apparatus of Kwalish',
    type: 'Wondrous Item',
    rarity: 'Legendary',
    attunement: false,
    description: 'This item first appears to be a sealed iron barrel weighing 500 pounds. The barrel has a hidden catch, which can be found with a successful DC 20 Intelligence (Investigation) check. When certain levers are used, the apparatus transforms to resemble a giant lobster.'
  },
  {
    name: 'Bag of Devouring',
    type: 'Wondrous Item',
    rarity: 'Very Rare',
    attunement: false,
    description: 'This bag resembles a Bag of Holding but is a feeding orifice for a gigantic extradimensional creature. Animal or vegetable matter placed wholly in the bag is devoured and lost forever.'
  },
  {
    name: 'Bag of Holding',
    type: 'Wondrous Item',
    rarity: 'Uncommon',
    attunement: false,
    description: 'This bag has an interior space considerably larger than its outside dimensions—roughly 2 feet square and 4 feet deep on the inside. The bag can hold up to 500 pounds, not exceeding a volume of 64 cubic feet.'
  },
  {
    name: 'Bag of Tricks',
    type: 'Wondrous Item',
    rarity: 'Uncommon',
    attunement: false,
    description: 'This bag made from gray, rust, or tan cloth appears empty. Reaching inside the bag, however, reveals the presence of a small, fuzzy object. When thrown, it transforms into a creature.'
  },
  {
    name: 'Belt of Dwarvenkind',
    type: 'Wondrous Item',
    rarity: 'Rare',
    attunement: true,
    description: 'While wearing this belt, you gain Darkvision with a range of 60 feet, proficiency in speaking Dwarvish, Advantage on saving throws to avoid or end the Poisoned condition on yourself, Resistance to Poison damage, and a +2 bonus to Constitution (max 20).'
  },
  {
    name: 'Belt of Giant Strength',
    type: 'Wondrous Item',
    rarity: 'Varies',
    attunement: true,
    description: 'While wearing this belt, your Strength score changes to a score granted by the belt. Hill Giant (21), Stone/Frost Giant (23), Fire Giant (25), Cloud Giant (27), Storm Giant (29).'
  },
  {
    name: 'Boots of Elvenkind',
    type: 'Wondrous Item',
    rarity: 'Uncommon',
    attunement: false,
    description: 'While you wear these boots, your steps make no sound, regardless of the surface you are moving across. You also have Advantage on Dexterity (Stealth) checks that rely on moving quietly.'
  },
  {
    name: 'Boots of Levitation',
    type: 'Wondrous Item',
    rarity: 'Rare',
    attunement: true,
    description: 'While you wear these boots, you can take a Magic action to cast the Levitate spell on yourself at will.'
  },
  {
    name: 'Boots of Speed',
    type: 'Wondrous Item',
    rarity: 'Rare',
    attunement: true,
    description: 'While you wear these boots, you can take a Bonus Action to click the boots\' heels together. For 10 minutes, your Speed is doubled, and opportunity attacks against you have Disadvantage.'
  },
  {
    name: 'Boots of Striding and Springing',
    type: 'Wondrous Item',
    rarity: 'Uncommon',
    attunement: true,
    description: 'While you wear these boots, your Speed is 30 feet, unless your Speed is higher, and your Speed isn\'t reduced if you are encumbered. You can jump three times the normal distance.'
  },
  {
    name: 'Bracers of Archery',
    type: 'Wondrous Item',
    rarity: 'Uncommon',
    attunement: true,
    description: 'While wearing these bracers, you have proficiency with the Longbow and Shortbow, and you gain a +2 bonus to damage rolls on ranged attacks made with such weapons.'
  },
  {
    name: 'Bracers of Defense',
    type: 'Wondrous Item',
    rarity: 'Rare',
    attunement: true,
    description: 'While wearing these bracers, you gain a +2 bonus to AC if you are wearing no armor and using no Shield.'
  },
  {
    name: 'Brooch of Shielding',
    type: 'Wondrous Item',
    rarity: 'Uncommon',
    attunement: true,
    description: 'While wearing this brooch, you have Resistance to Force damage, and you have Immunity to damage from the Magic Missile spell.'
  },
  {
    name: 'Broom of Flying',
    type: 'Wondrous Item',
    rarity: 'Uncommon',
    attunement: false,
    description: 'This wooden broom functions as a mundane broom until you stand astride it and speak a command word. It then hovers beneath you and can be ridden in the air. It has a Flying Speed of 50 feet.'
  },
  {
    name: 'Cape of the Mountebank',
    type: 'Wondrous Item',
    rarity: 'Rare',
    attunement: false,
    description: 'While wearing this cape, you can take a Magic action to cast the Dimension Door spell from it. This property of the cape can\'t be used again until the next dawn.'
  },
  {
    name: 'Carpet of Flying',
    type: 'Wondrous Item',
    rarity: 'Very Rare',
    attunement: false,
    description: 'You can speak the carpet\'s command word as a Magic action to make the carpet hover and fly. It moves according to your spoken directions, provided that you are within 30 feet of it.'
  },
  {
    name: 'Cloak of Displacement',
    type: 'Wondrous Item',
    rarity: 'Rare',
    attunement: true,
    description: 'While you wear this cloak, creatures have Disadvantage on attack rolls against you. If you take damage, this property ceases to function until the start of your next turn.'
  },
  {
    name: 'Cloak of Elvenkind',
    type: 'Wondrous Item',
    rarity: 'Uncommon',
    attunement: true,
    description: 'While you wear this cloak with its hood up, Wisdom (Perception) checks made to see you have Disadvantage, and you have Advantage on Dexterity (Stealth) checks made to hide.'
  },
  {
    name: 'Cloak of Protection',
    type: 'Wondrous Item',
    rarity: 'Uncommon',
    attunement: true,
    description: 'You gain a +1 bonus to AC and saving throws while you wear this cloak.'
  },
  {
    name: 'Cloak of the Bat',
    type: 'Wondrous Item',
    rarity: 'Rare',
    attunement: true,
    description: 'While wearing this cloak, you have Advantage on Dexterity (Stealth) checks. In an area of Dim Light or Darkness, you can grip the edges of the cloak with both hands and use it to fly at a Speed of 40 feet.'
  },
  {
    name: 'Crystal Ball',
    type: 'Wondrous Item',
    rarity: 'Very Rare',
    attunement: true,
    description: 'This crystal ball is about 6 inches in diameter. While touching it, you can cast the Scrying spell (save DC 17) with it.'
  },
  {
    name: 'Cube of Force',
    type: 'Wondrous Item',
    rarity: 'Rare',
    attunement: true,
    description: 'This cube is about an inch across. Each face has a distinct marking. The cube starts with 36 charges, and it regains 1d20 expended charges daily at dawn.'
  },
  {
    name: 'Decanter of Endless Water',
    type: 'Wondrous Item',
    rarity: 'Uncommon',
    attunement: false,
    description: 'This stoppered flask sloshes when shaken, as if it contains water. You can take a Magic action to remove the stopper and speak one of three command words to produce water.'
  },
  {
    name: 'Deck of Illusions',
    type: 'Wondrous Item',
    rarity: 'Uncommon',
    attunement: false,
    description: 'This box contains a set of parchment cards. A full deck has 34 cards. When you draw a card and throw it to the ground, an illusion of a creature appears.'
  },
  {
    name: 'Deck of Many Things',
    type: 'Wondrous Item',
    rarity: 'Legendary',
    attunement: false,
    description: 'Usually found in a box or pouch, this deck contains a number of cards made of ivory or vellum. Before you draw a card, you must declare how many cards you intend to draw. Each has a powerful effect.'
  },
  {
    name: 'Dimensional Shackles',
    type: 'Wondrous Item',
    rarity: 'Rare',
    attunement: false,
    description: 'You can take a Magic action to place these shackles on an Incapacitated creature. The shackles adjust to fit a creature of Small to Large size. The creature is restrained until freed and can\'t teleport or travel to other planes.'
  },
  {
    name: 'Eversmoking Bottle',
    type: 'Wondrous Item',
    rarity: 'Uncommon',
    attunement: false,
    description: 'Smoke leaks from the lead-stoppered mouth of this brass bottle. When you take a Magic action to remove the stopper, a cloud of thick smoke pours out in a 60-foot radius from the bottle.'
  },
  {
    name: 'Eyes of Charming',
    type: 'Wondrous Item',
    rarity: 'Uncommon',
    attunement: true,
    description: 'These crystal lenses fit over the eyes. They have 3 charges. While wearing them, you can expend 1 charge as a Magic action to cast the Charm Person spell (save DC 13).'
  },
  {
    name: 'Eyes of the Eagle',
    type: 'Wondrous Item',
    rarity: 'Uncommon',
    attunement: true,
    description: 'These crystal lenses fit over the eyes. While wearing them, you have Advantage on Wisdom (Perception) checks that rely on sight. In conditions of clear visibility, you can make out details of even extremely distant creatures and objects as small as 2 feet across.'
  },
  {
    name: 'Figurine of Wondrous Power',
    type: 'Wondrous Item',
    rarity: 'Varies',
    attunement: false,
    description: 'A Figurine of Wondrous Power is a statuette of a beast small enough to fit in a pocket. If you use a Magic action to speak the command word and throw the figurine to a point on the ground within 60 feet of you, the figurine becomes a living creature.'
  },
  {
    name: 'Gauntlets of Ogre Power',
    type: 'Wondrous Item',
    rarity: 'Uncommon',
    attunement: true,
    description: 'Your Strength is 19 while you wear these gauntlets. They have no effect on you if your Strength is 19 or higher without them.'
  },
  {
    name: 'Gem of Brightness',
    type: 'Wondrous Item',
    rarity: 'Uncommon',
    attunement: false,
    description: 'This prism has 50 charges. While you are holding it, you can take a Magic action and speak one of three command words to cause one of various light effects.'
  },
  {
    name: 'Gem of Seeing',
    type: 'Wondrous Item',
    rarity: 'Rare',
    attunement: true,
    description: 'This gem has 3 charges. As a Magic action, you can speak the gem\'s command word and expend 1 charge. For the next 10 minutes, you have Truesight out to 120 feet.'
  },
  {
    name: 'Gloves of Missile Snaring',
    type: 'Wondrous Item',
    rarity: 'Uncommon',
    attunement: true,
    description: 'When a ranged weapon attack hits you while you\'re wearing these gloves, you can use your Reaction to reduce the damage by 1d10 + your Dexterity modifier, provided you have a free hand.'
  },
  {
    name: 'Gloves of Swimming and Climbing',
    type: 'Wondrous Item',
    rarity: 'Uncommon',
    attunement: true,
    description: 'While wearing these gloves, climbing and swimming don\'t cost you extra movement, and you gain a +5 bonus to Strength (Athletics) checks made to climb or swim.'
  },
  {
    name: 'Goggles of Night',
    type: 'Wondrous Item',
    rarity: 'Uncommon',
    attunement: false,
    description: 'While wearing these dark lenses, you have Darkvision out to a range of 60 feet. If you already have Darkvision, wearing the goggles increases its range by 60 feet.'
  },
  {
    name: 'Handy Haversack',
    type: 'Wondrous Item',
    rarity: 'Rare',
    attunement: false,
    description: 'This backpack has a central pouch and two side pouches, each of which is an extradimensional space. The side pouches hold up to 20 pounds; the central pouch holds up to 80 pounds.'
  },
  {
    name: 'Hat of Disguise',
    type: 'Wondrous Item',
    rarity: 'Uncommon',
    attunement: true,
    description: 'While wearing this hat, you can take a Magic action to cast the Disguise Self spell from it at will. The spell ends if the hat is removed.'
  },
  {
    name: 'Headband of Intellect',
    type: 'Wondrous Item',
    rarity: 'Uncommon',
    attunement: true,
    description: 'Your Intelligence is 19 while you wear this headband. It has no effect on you if your Intelligence is 19 or higher without it.'
  },
  {
    name: 'Helm of Comprehending Languages',
    type: 'Wondrous Item',
    rarity: 'Uncommon',
    attunement: false,
    description: 'While wearing this helm, you can take a Magic action to cast the Comprehend Languages spell from it at will.'
  },
  {
    name: 'Helm of Telepathy',
    type: 'Wondrous Item',
    rarity: 'Uncommon',
    attunement: true,
    description: 'While wearing this helm, you can take a Magic action to cast the Detect Thoughts spell (save DC 13) from it. You can also focus on one creature you can see within 30 feet of you to communicate telepathically.'
  },
  {
    name: 'Immovable Rod',
    type: 'Wondrous Item',
    rarity: 'Uncommon',
    attunement: false,
    description: 'This flat iron rod has a button on one end. You can take a Magic action to press the button, which causes the rod to become magically fixed in place. It can hold up to 8,000 pounds of weight.'
  },
  {
    name: 'Instant Fortress',
    type: 'Wondrous Item',
    rarity: 'Rare',
    attunement: false,
    description: 'You can take a Magic action to place this 1-inch metal cube on the ground and speak a command word. The cube rapidly grows into a fortress that remains until you take a Magic action to speak the command word that dismisses it.'
  },
  {
    name: 'Ioun Stone',
    type: 'Wondrous Item',
    rarity: 'Varies',
    attunement: true,
    description: 'An Ioun Stone is named after Ioun, a god of knowledge and prophecy revered on some worlds. When you take a Magic action to toss one of these stones into the air, the stone orbits your head at a distance of 1d3 feet.'
  },
  {
    name: 'Iron Bands of Bilarro',
    type: 'Wondrous Item',
    rarity: 'Rare',
    attunement: false,
    description: 'This rusty iron sphere measures 3 inches in diameter and weighs 1 pound. You can take a Magic action to throw it at a Huge or smaller creature within 60 feet of you. Bands of iron snap out and wrap around the target, restraining it.'
  },
  {
    name: 'Lantern of Revealing',
    type: 'Wondrous Item',
    rarity: 'Uncommon',
    attunement: false,
    description: 'While lit, this hooded lantern burns for 6 hours on 1 pint of oil. The lantern sheds Bright Light in a 30-foot radius and Dim Light for an additional 30 feet. Invisible creatures and objects are visible as long as they are in the lantern\'s Bright Light.'
  },
  {
    name: 'Mantle of Spell Resistance',
    type: 'Wondrous Item',
    rarity: 'Rare',
    attunement: true,
    description: 'You have Advantage on saving throws against spells while you wear this cloak.'
  },
  {
    name: 'Medallion of Thoughts',
    type: 'Wondrous Item',
    rarity: 'Uncommon',
    attunement: true,
    description: 'The medallion has 3 charges. While wearing it, you can take a Magic action and expend 1 charge to cast the Detect Thoughts spell (save DC 13) from it. The medallion regains 1d3 expended charges daily at dawn.'
  },
  {
    name: 'Mirror of Life Trapping',
    type: 'Wondrous Item',
    rarity: 'Very Rare',
    attunement: false,
    description: 'When this 4-foot-tall, 2-foot-wide mirror is viewed indirectly, its surface shows faint images of creatures. Any creature that sees its reflection in the activated mirror must succeed on a DC 15 Charisma saving throw or be trapped in one of the mirror\'s twelve extradimensional cells.'
  },
  {
    name: 'Necklace of Fireballs',
    type: 'Wondrous Item',
    rarity: 'Rare',
    attunement: false,
    description: 'This necklace has 1d6 + 3 beads hanging from it. You can take a Magic action to detach a bead and throw it up to 60 feet away. When it reaches the end of its trajectory, the bead detonates as a level 3 Fireball spell (save DC 15).'
  },
  {
    name: 'Periapt of Health',
    type: 'Wondrous Item',
    rarity: 'Uncommon',
    attunement: false,
    description: 'You are immune to contracting any disease while you wear this pendant. If you are already infected with a disease, the effects of the disease are suppressed while you wear the pendant.'
  },
  {
    name: 'Periapt of Proof against Poison',
    type: 'Wondrous Item',
    rarity: 'Rare',
    attunement: false,
    description: 'You have Immunity to Poison damage and the Poisoned condition while you wear this pendant.'
  },
  {
    name: 'Periapt of Wound Closure',
    type: 'Wondrous Item',
    rarity: 'Uncommon',
    attunement: true,
    description: 'While you wear this pendant, you automatically stabilize whenever you start your turn with 0 Hit Points. In addition, whenever you roll a Hit Point Die to regain Hit Points, double the number of Hit Points it restores.'
  },
  {
    name: 'Portable Hole',
    type: 'Wondrous Item',
    rarity: 'Rare',
    attunement: false,
    description: 'This fine black cloth, soft as silk, is folded up to the dimensions of a handkerchief. It unfolds into a circular sheet 6 feet in diameter. You can take a Magic action to unfold a Portable Hole and place it on or against a solid surface, whereupon the Portable Hole creates an extradimensional hole 10 feet deep.'
  },
  {
    name: 'Ring of Evasion',
    type: 'Ring',
    rarity: 'Rare',
    attunement: true,
    description: 'This ring has 3 charges, and it regains 1d3 expended charges daily at dawn. When you fail a Dexterity saving throw while wearing it, you can take a Reaction to expend 1 charge to succeed on that saving throw instead.'
  },
  {
    name: 'Ring of Feather Falling',
    type: 'Ring',
    rarity: 'Rare',
    attunement: true,
    description: 'When you fall while wearing this ring, you descend 60 feet per round and take no damage from falling.'
  },
  {
    name: 'Ring of Free Action',
    type: 'Ring',
    rarity: 'Rare',
    attunement: true,
    description: 'While you wear this ring, Difficult Terrain doesn\'t cost you extra movement. In addition, magic can neither reduce your Speed nor cause you to have the Paralyzed or Restrained condition.'
  },
  {
    name: 'Ring of Invisibility',
    type: 'Ring',
    rarity: 'Legendary',
    attunement: true,
    description: 'While wearing this ring, you can take a Magic action to become Invisible. You remain Invisible until the ring is removed, until you attack, cast a spell, or force a creature to make a saving throw, or until you take a Bonus Action to become visible again.'
  },
  {
    name: 'Ring of Protection',
    type: 'Ring',
    rarity: 'Rare',
    attunement: true,
    description: 'You gain a +1 bonus to AC and saving throws while wearing this ring.'
  },
  {
    name: 'Ring of Regeneration',
    type: 'Ring',
    rarity: 'Very Rare',
    attunement: true,
    description: 'While wearing this ring, you regain 1d6 Hit Points every 10 minutes, provided that you have at least 1 Hit Point. If you lose a body part, the ring causes the missing part to regrow and return to full functionality after 1d6 + 1 days.'
  },
  {
    name: 'Ring of Resistance',
    type: 'Ring',
    rarity: 'Rare',
    attunement: true,
    description: 'You have Resistance to one damage type while wearing this ring. The gem in the ring indicates the type, which the DM chooses or determines randomly.'
  },
  {
    name: 'Ring of Shooting Stars',
    type: 'Ring',
    rarity: 'Very Rare',
    attunement: true,
    description: 'While wearing this ring in Dim Light or Darkness, you can cast Dancing Lights and Light from the ring at will. The ring has 6 charges for other effects and regains 1d6 expended charges daily at dawn.'
  },
  {
    name: 'Ring of Spell Storing',
    type: 'Ring',
    rarity: 'Rare',
    attunement: true,
    description: 'This ring stores spells cast into it, holding them until the attuned wearer uses them. The ring can store up to 5 levels worth of spells at a time.'
  },
  {
    name: 'Ring of Spell Turning',
    type: 'Ring',
    rarity: 'Legendary',
    attunement: true,
    description: 'While wearing this ring, you have Advantage on saving throws against any spell that targets only you. If you roll a 20 for the save and the spell is level 7 or lower, the spell has no effect on you and instead targets the caster.'
  },
  {
    name: 'Ring of Swimming',
    type: 'Ring',
    rarity: 'Uncommon',
    attunement: false,
    description: 'You have a Swimming Speed of 40 feet while wearing this ring.'
  },
  {
    name: 'Ring of Telekinesis',
    type: 'Ring',
    rarity: 'Very Rare',
    attunement: true,
    description: 'While wearing this ring, you can cast the Telekinesis spell at will, but you can target only objects that aren\'t being worn or carried.'
  },
  {
    name: 'Ring of the Ram',
    type: 'Ring',
    rarity: 'Rare',
    attunement: true,
    description: 'This ring has 3 charges and regains 1d3 expended charges daily at dawn. While wearing the ring, you can take a Magic action to expend 1 to 3 of its charges to make a ranged spell attack.'
  },
  {
    name: 'Ring of Warmth',
    type: 'Ring',
    rarity: 'Uncommon',
    attunement: true,
    description: 'While wearing this ring, you have Resistance to Cold damage. In addition, you and everything you wear and carry are unharmed by temperatures as low as -50 degrees Fahrenheit.'
  },
  {
    name: 'Ring of Water Walking',
    type: 'Ring',
    rarity: 'Uncommon',
    attunement: false,
    description: 'While wearing this ring, you can stand on and move across any liquid surface as if it were solid ground.'
  },
  {
    name: 'Ring of X-Ray Vision',
    type: 'Ring',
    rarity: 'Rare',
    attunement: true,
    description: 'While wearing this ring, you can take a Magic action to gain the ability to see into and through solid matter for 1 minute. This vision has a range of 30 feet.'
  },
  {
    name: 'Robe of Eyes',
    type: 'Wondrous Item',
    rarity: 'Rare',
    attunement: true,
    description: 'This robe is adorned with eyelike patterns. While you wear the robe, you gain Darkvision out to a range of 120 feet and can see Invisible creatures and objects.'
  },
  {
    name: 'Robe of Scintillating Colors',
    type: 'Wondrous Item',
    rarity: 'Very Rare',
    attunement: true,
    description: 'This robe has 3 charges, and it regains 1d3 expended charges daily at dawn. While you wear it, you can take a Magic action and expend 1 charge to cause the garment to display a shifting pattern of dazzling hues.'
  },
  {
    name: 'Robe of Stars',
    type: 'Wondrous Item',
    rarity: 'Very Rare',
    attunement: true,
    description: 'This black or dark-blue robe is embroidered with small white or silver stars. While wearing the robe, you gain a +1 bonus to saving throws. The robe also has 6 stars that allow you to cast Magic Missile.'
  },
  {
    name: 'Robe of the Archmagi',
    type: 'Wondrous Item',
    rarity: 'Legendary',
    attunement: true,
    description: 'This elegant garment is made from exquisite cloth and adorned with arcane runes. While wearing this robe, your Armor Class is 15 + your Dexterity modifier, you have Advantage on saving throws against spells, and your spell save DC and spell attack bonus each increase by 2.'
  },
  {
    name: 'Robe of Useful Items',
    type: 'Wondrous Item',
    rarity: 'Uncommon',
    attunement: false,
    description: 'This robe has cloth patches of various shapes and colors covering it. While wearing the robe, you can take a Magic action to detach one of the patches, causing it to become the object or creature it represents.'
  },
  {
    name: 'Rope of Climbing',
    type: 'Wondrous Item',
    rarity: 'Uncommon',
    attunement: false,
    description: 'This 60-foot length of silk rope weighs 3 pounds and can hold up to 3,000 pounds. If you hold one end of the rope and take a Magic action to speak the command word, the rope animates.'
  },
  {
    name: 'Rope of Entanglement',
    type: 'Wondrous Item',
    rarity: 'Rare',
    attunement: false,
    description: 'This rope is 30 feet long and weighs 3 pounds. If you hold one end of the rope and take a Magic action to speak its command word, the other end darts forward to entangle a creature you can see within 20 feet.'
  },
  {
    name: 'Scarab of Protection',
    type: 'Wondrous Item',
    rarity: 'Legendary',
    attunement: true,
    description: 'If you hold this medallion and a creature you can see within 30 feet of you is reduced to 0 Hit Points, you can take a Reaction to expend 1 charge and cause that creature to drop to 1 Hit Point instead.'
  },
  {
    name: 'Sending Stones',
    type: 'Wondrous Item',
    rarity: 'Uncommon',
    attunement: false,
    description: 'Sending Stones come in pairs, with each smooth stone carved to match the other so the pairing is easily recognized. While you touch one stone, you can take a Magic action to cast the Sending spell from it.'
  },
  {
    name: 'Sphere of Annihilation',
    type: 'Wondrous Item',
    rarity: 'Legendary',
    attunement: false,
    description: 'This 2-foot-diameter black sphere is a hole in the multiverse, hovering in space and stabilized by a magical field surrounding it. The sphere obliterates all matter it passes through.'
  },
  {
    name: 'Stone of Good Luck',
    type: 'Wondrous Item',
    rarity: 'Uncommon',
    attunement: true,
    description: 'While this polished agate is on your person, you gain a +1 bonus to ability checks and saving throws.'
  },
  {
    name: 'Wings of Flying',
    type: 'Wondrous Item',
    rarity: 'Rare',
    attunement: true,
    description: 'While wearing this cloak, you can take a Magic action to speak a command word, turning the cloak into a pair of wings on your back for 1 hour or until you repeat the command word. The wings give you a Flying Speed of 60 feet.'
  },
  // Potions
  {
    name: 'Potion of Healing',
    type: 'Potion',
    rarity: 'Common',
    attunement: false,
    description: 'You regain 2d4 + 2 Hit Points when you drink this potion. Whatever its potency, the potion\'s red liquid glimmers when agitated.'
  },
  {
    name: 'Potion of Greater Healing',
    type: 'Potion',
    rarity: 'Uncommon',
    attunement: false,
    description: 'You regain 4d4 + 4 Hit Points when you drink this potion.'
  },
  {
    name: 'Potion of Superior Healing',
    type: 'Potion',
    rarity: 'Rare',
    attunement: false,
    description: 'You regain 8d4 + 8 Hit Points when you drink this potion.'
  },
  {
    name: 'Potion of Supreme Healing',
    type: 'Potion',
    rarity: 'Very Rare',
    attunement: false,
    description: 'You regain 10d4 + 20 Hit Points when you drink this potion.'
  },
  {
    name: 'Potion of Flying',
    type: 'Potion',
    rarity: 'Very Rare',
    attunement: false,
    description: 'When you drink this potion, you gain a Flying Speed equal to your Speed for 1 hour and can hover. If you\'re in the air when the potion wears off, you fall unless you have some other means of staying aloft.'
  },
  {
    name: 'Potion of Invisibility',
    type: 'Potion',
    rarity: 'Very Rare',
    attunement: false,
    description: 'This potion\'s container looks empty but feels as though it holds liquid. When you drink it, you become Invisible for 1 hour. Anything you wear or carry is Invisible with you. The effect ends early if you attack, cast a spell, or force a creature to make a saving throw.'
  },
  {
    name: 'Potion of Giant Strength',
    type: 'Potion',
    rarity: 'Varies',
    attunement: false,
    description: 'When you drink this potion, your Strength becomes that of the associated giant type for 1 hour. Hill Giant (21), Frost/Stone Giant (23), Fire Giant (25), Cloud Giant (27), Storm Giant (29).'
  },
  {
    name: 'Potion of Resistance',
    type: 'Potion',
    rarity: 'Uncommon',
    attunement: false,
    description: 'When you drink this potion, you gain Resistance to one type of damage for 1 hour. The type depends on the potion.'
  },
  {
    name: 'Potion of Speed',
    type: 'Potion',
    rarity: 'Very Rare',
    attunement: false,
    description: 'When you drink this potion, you gain the effect of the Haste spell for 1 minute (no concentration required). The potion\'s yellow fluid is streaked with black and swirls on its own.'
  },
  // Staffs
  {
    name: 'Staff of the Magi',
    type: 'Staff',
    rarity: 'Legendary',
    attunement: true,
    description: 'This staff can be wielded as a magic Quarterstaff that grants a +2 bonus to attack and damage rolls. While holding it, you gain a +2 bonus to spell attack rolls and Armor Class. The staff has 50 charges for its properties.'
  },
  {
    name: 'Staff of Power',
    type: 'Staff',
    rarity: 'Very Rare',
    attunement: true,
    description: 'This staff can be wielded as a magic Quarterstaff that grants a +2 bonus to attack and damage rolls. While holding it, you gain a +2 bonus to Armor Class, saving throws, and spell attack rolls. The staff has 20 charges.'
  },
  {
    name: 'Staff of Fire',
    type: 'Staff',
    rarity: 'Very Rare',
    attunement: true,
    description: 'You have Resistance to Fire damage while you hold this staff. The staff has 10 charges. While holding it, you can take a Magic action to expend charges and cast various fire spells.'
  },
  {
    name: 'Staff of Frost',
    type: 'Staff',
    rarity: 'Very Rare',
    attunement: true,
    description: 'You have Resistance to Cold damage while you hold this staff. The staff has 10 charges. While holding it, you can take a Magic action to expend charges and cast various cold spells.'
  },
  {
    name: 'Staff of Healing',
    type: 'Staff',
    rarity: 'Rare',
    attunement: true,
    description: 'This staff has 10 charges. While holding it, you can take a Magic action to expend charges and cast various healing spells. The staff regains 1d6 + 4 expended charges daily at dawn.'
  },
  {
    name: 'Staff of Striking',
    type: 'Staff',
    rarity: 'Very Rare',
    attunement: true,
    description: 'This staff can be wielded as a magic Quarterstaff that grants a +3 bonus to attack and damage rolls. The staff has 10 charges. When you hit with a melee attack, you can expend up to 3 charges for extra Force damage.'
  },
  {
    name: 'Staff of Thunder and Lightning',
    type: 'Staff',
    rarity: 'Very Rare',
    attunement: true,
    description: 'This staff can be wielded as a magic Quarterstaff that grants a +2 bonus to attack and damage rolls. It also has properties for Thunder and Lightning effects, each usable once per day.'
  },
  // Wands
  {
    name: 'Wand of Fireballs',
    type: 'Wand',
    rarity: 'Rare',
    attunement: true,
    description: 'This wand has 7 charges. While holding it, you can take a Magic action to expend 1 or more charges to cast the Fireball spell (save DC 15). The wand regains 1d6 + 1 expended charges daily at dawn.'
  },
  {
    name: 'Wand of Lightning Bolts',
    type: 'Wand',
    rarity: 'Rare',
    attunement: true,
    description: 'This wand has 7 charges. While holding it, you can take a Magic action to expend 1 or more charges to cast the Lightning Bolt spell (save DC 15). The wand regains 1d6 + 1 expended charges daily at dawn.'
  },
  {
    name: 'Wand of Magic Missiles',
    type: 'Wand',
    rarity: 'Uncommon',
    attunement: false,
    description: 'This wand has 7 charges. While holding it, you can take a Magic action to expend 1 or more charges to cast the Magic Missile spell. The wand regains 1d6 + 1 expended charges daily at dawn.'
  },
  {
    name: 'Wand of Polymorph',
    type: 'Wand',
    rarity: 'Very Rare',
    attunement: true,
    description: 'This wand has 7 charges. While holding it, you can take a Magic action to expend 1 charge to cast the Polymorph spell (save DC 15). The wand regains 1d6 + 1 expended charges daily at dawn.'
  },
  {
    name: 'Wand of Web',
    type: 'Wand',
    rarity: 'Uncommon',
    attunement: true,
    description: 'This wand has 7 charges. While holding it, you can take a Magic action to expend 1 charge to cast the Web spell (save DC 15). The wand regains 1d6 + 1 expended charges daily at dawn.'
  },
  {
    name: 'Wand of the War Mage, +1',
    type: 'Wand',
    rarity: 'Uncommon',
    attunement: true,
    description: 'While holding this wand, you gain a +1 bonus to spell attack rolls. In addition, you ignore half cover when making a spell attack.'
  },
  {
    name: 'Wand of the War Mage, +2',
    type: 'Wand',
    rarity: 'Rare',
    attunement: true,
    description: 'While holding this wand, you gain a +2 bonus to spell attack rolls. In addition, you ignore half cover when making a spell attack.'
  },
  {
    name: 'Wand of the War Mage, +3',
    type: 'Wand',
    rarity: 'Very Rare',
    attunement: true,
    description: 'While holding this wand, you gain a +3 bonus to spell attack rolls. In addition, you ignore half cover when making a spell attack.'
  },
  {
    name: 'Wand of Wonder',
    type: 'Wand',
    rarity: 'Rare',
    attunement: true,
    description: 'This wand has 7 charges. While holding it, you can take a Magic action to expend 1 charge and choose a target within 120 feet. Roll a d100 to determine a random magical effect. The wand regains 1d6 + 1 expended charges daily at dawn.'
  },
  // Rods
  {
    name: 'Rod of Absorption',
    type: 'Rod',
    rarity: 'Very Rare',
    attunement: true,
    description: 'While holding this rod, you can take a Reaction to absorb a spell that is targeting only you and not with an area of effect. The absorbed spell\'s effect is canceled, and the spell\'s energy is stored in the rod.'
  },
  {
    name: 'Rod of Alertness',
    type: 'Rod',
    rarity: 'Very Rare',
    attunement: true,
    description: 'This rod has a flanged head, and it functions as a magic Mace. While holding the rod, you gain a +1 bonus to Initiative and Wisdom (Perception) checks.'
  },
  {
    name: 'Rod of Lordly Might',
    type: 'Rod',
    rarity: 'Legendary',
    attunement: true,
    description: 'This rod has a flanged head, and it functions as a magic Mace that grants a +3 bonus to attack and damage rolls. The rod has various properties and can transform into different weapons.'
  },
  {
    name: 'Rod of Security',
    type: 'Rod',
    rarity: 'Very Rare',
    attunement: false,
    description: 'While holding this rod, you can take a Magic action to transport you and up to 199 other willing creatures to a paradisiacal demiplane for up to 200 days.'
  },
];

export const getMagicItemsByType = (type: MagicItemType): MagicItem[] => {
  return magicItems.filter(item => item.type === type);
};

export const getMagicItemsByRarity = (rarity: MagicItemRarity): MagicItem[] => {
  return magicItems.filter(item => item.rarity === rarity);
};
