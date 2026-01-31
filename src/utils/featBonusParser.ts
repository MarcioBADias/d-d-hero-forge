import { AbilityScore, AbilityBonuses } from '@/types/character';

// Parse feat's abilityScoreIncrease field and extract bonuses
// Examples: "Cha +1", "Str/Dex +1", "Any +1", "Int/Wis/Cha +1"
export function parseFeatAbilityBonus(
  abilityScoreIncrease: string | undefined,
  selectedAbility?: AbilityScore
): AbilityBonuses {
  const bonuses: AbilityBonuses = { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 };
  
  if (!abilityScoreIncrease) return bonuses;

  const match = abilityScoreIncrease.match(/([A-Za-z\/]+)\s*\+(\d+)/);
  if (!match) return bonuses;

  const abilities = match[1].toLowerCase();
  const bonus = parseInt(match[2], 10);

  // If "Any", use the selected ability
  if (abilities === 'any') {
    if (selectedAbility) {
      bonuses[selectedAbility] = bonus;
    }
    return bonuses;
  }

  // Parse abilities like "Str/Dex" or "Int/Wis/Cha"
  const abilityList = abilities.split('/');
  
  // If multiple options and a selection is made, use only the selected one
  if (abilityList.length > 1 && selectedAbility) {
    bonuses[selectedAbility] = bonus;
    return bonuses;
  }

  // If single ability, apply directly
  if (abilityList.length === 1) {
    const ability = abilityList[0] as AbilityScore;
    if (ability in bonuses) {
      bonuses[ability] = bonus;
    }
  }

  return bonuses;
}

// Get the list of choosable abilities from a feat
export function getFeatAbilityChoices(abilityScoreIncrease: string | undefined): AbilityScore[] {
  if (!abilityScoreIncrease) return [];

  const match = abilityScoreIncrease.match(/([A-Za-z\/]+)\s*\+(\d+)/);
  if (!match) return [];

  const abilities = match[1].toLowerCase();

  if (abilities === 'any') {
    return ['str', 'dex', 'con', 'int', 'wis', 'cha'];
  }

  const abilityList = abilities.split('/');
  
  if (abilityList.length > 1) {
    return abilityList.filter(a => ['str', 'dex', 'con', 'int', 'wis', 'cha'].includes(a)) as AbilityScore[];
  }

  return [];
}

// Check if a feat requires a choice for ability bonus
export function featRequiresAbilityChoice(abilityScoreIncrease: string | undefined): boolean {
  return getFeatAbilityChoices(abilityScoreIncrease).length > 1;
}

// Calculate total feat bonuses from all feats
export function calculateTotalFeatBonuses(
  feats: string[],
  featsData: Record<string, { abilityScoreIncrease?: string }>,
  featSelections: Record<string, AbilityScore>
): AbilityBonuses {
  const totalBonuses: AbilityBonuses = { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 };

  feats.forEach(featName => {
    const feat = featsData[featName];
    if (feat?.abilityScoreIncrease) {
      const selectedAbility = featSelections[featName];
      const bonuses = parseFeatAbilityBonus(feat.abilityScoreIncrease, selectedAbility);
      
      Object.keys(bonuses).forEach(key => {
        totalBonuses[key as AbilityScore] += bonuses[key as AbilityScore];
      });
    }
  });

  return totalBonuses;
}
