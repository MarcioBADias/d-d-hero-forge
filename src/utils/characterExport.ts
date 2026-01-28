import { jsPDF } from 'jspdf';
import { Character, getTotalAbilityScore, calculateModifier, formatModifier, calculateProficiencyBonus, AbilityScore } from '@/types/character';
import { characterClasses } from '@/data/classes';
import { races } from '@/data/races';
import { backgrounds } from '@/data/backgrounds';

const abilityKeys: AbilityScore[] = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
const abilityNames: Record<AbilityScore, string> = {
  str: 'Strength',
  dex: 'Dexterity',
  con: 'Constitution',
  int: 'Intelligence',
  wis: 'Wisdom',
  cha: 'Charisma',
};

function getAbilityScores(character: Character) {
  return abilityKeys.reduce((acc, key) => {
    acc[key] = getTotalAbilityScore(
      character.baseAbilities[key],
      character.backgroundAbilityBonuses[key],
      character.featAbilityBonuses[key]
    );
    return acc;
  }, {} as Record<AbilityScore, number>);
}

function calculateHP(character: Character): number {
  const abilities = getAbilityScores(character);
  const conMod = calculateModifier(abilities.con);
  
  let hp = 0;
  character.classes.forEach((cl, index) => {
    const clData = characterClasses[cl.className.toLowerCase()];
    if (!clData) return;
    
    for (let lvl = 1; lvl <= cl.level; lvl++) {
      if (index === 0 && lvl === 1) {
        hp += clData.hitDie + conMod;
      } else {
        hp += Math.floor(clData.hitDie / 2) + 1 + conMod;
      }
    }
  });
  return Math.max(hp, 1);
}

export function exportToPDF(character: Character): void {
  const doc = new jsPDF();
  const abilities = getAbilityScores(character);
  const profBonus = calculateProficiencyBonus(character.level);
  const primaryClass = character.classes[0];
  const classData = primaryClass ? characterClasses[primaryClass.className.toLowerCase()] : null;
  const raceData = races.find(r => r.name === character.raceName);
  const bgData = backgrounds.find(b => b.name === character.backgroundName);
  
  // Title
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(character.name || 'Unnamed Character', 105, 20, { align: 'center' });
  
  // Subtitle
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  const subtitle = [
    `Level ${character.level}`,
    character.raceName,
    character.classes.map(c => `${c.className} ${c.level}`).join(' / '),
    character.backgroundName,
  ].filter(Boolean).join(' • ');
  doc.text(subtitle, 105, 28, { align: 'center' });
  
  // Divider
  doc.setDrawColor(200, 170, 100);
  doc.setLineWidth(0.5);
  doc.line(20, 32, 190, 32);
  
  // Stats box
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  let y = 40;
  
  // Quick Stats Row
  const hp = calculateHP(character);
  const dexMod = calculateModifier(abilities.dex);
  const ac = 10 + dexMod;
  
  doc.setFillColor(245, 240, 230);
  doc.roundedRect(20, y - 5, 170, 20, 3, 3, 'F');
  
  doc.text(`HP: ${hp}`, 30, y + 5);
  doc.text(`AC: ${ac}`, 65, y + 5);
  doc.text(`Speed: ${raceData?.speed.split(' ')[0] || '30'} ft`, 95, y + 5);
  doc.text(`Proficiency: +${profBonus}`, 140, y + 5);
  
  y += 25;
  
  // Ability Scores
  doc.setFontSize(11);
  doc.text('ABILITY SCORES', 20, y);
  y += 8;
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  
  const colWidth = 28;
  abilityKeys.forEach((key, index) => {
    const score = abilities[key];
    const mod = calculateModifier(score);
    const saveProficient = classData?.savingThrows.some(s => s.toLowerCase().startsWith(key));
    const saveBonus = mod + (saveProficient ? profBonus : 0);
    
    const x = 20 + (index * colWidth);
    
    doc.setFillColor(240, 235, 225);
    doc.roundedRect(x, y - 2, colWidth - 2, 28, 2, 2, 'F');
    
    doc.setFont('helvetica', 'bold');
    doc.text(key.toUpperCase(), x + (colWidth - 2) / 2, y + 4, { align: 'center' });
    
    doc.setFontSize(14);
    doc.text(score.toString(), x + (colWidth - 2) / 2, y + 12, { align: 'center' });
    
    doc.setFontSize(10);
    doc.text(formatModifier(mod), x + (colWidth - 2) / 2, y + 18, { align: 'center' });
    
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text(`Save: ${formatModifier(saveBonus)}${saveProficient ? ' ●' : ''}`, x + (colWidth - 2) / 2, y + 24, { align: 'center' });
    
    doc.setFontSize(9);
  });
  
  y += 35;
  
  // Class Features
  if (classData) {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('CLASS FEATURES', 20, y);
    y += 6;
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    
    const features = classData.features.filter(f => f.level <= (primaryClass?.level || 1));
    features.forEach(feature => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.setFont('helvetica', 'bold');
      doc.text(`• ${feature.title} (Lv. ${feature.level})`, 20, y);
      y += 4;
      doc.setFont('helvetica', 'normal');
      const lines = doc.splitTextToSize(feature.description, 165);
      doc.text(lines, 25, y);
      y += lines.length * 3.5 + 2;
    });
  }
  
  // Race Traits
  if (raceData && y < 250) {
    y += 5;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('RACIAL TRAITS', 20, y);
    y += 6;
    
    doc.setFontSize(8);
    raceData.traits.forEach(trait => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      const [title, ...desc] = trait.split(': ');
      doc.setFont('helvetica', 'bold');
      doc.text(`• ${title}`, 20, y);
      if (desc.length > 0) {
        y += 4;
        doc.setFont('helvetica', 'normal');
        const lines = doc.splitTextToSize(desc.join(': '), 165);
        doc.text(lines, 25, y);
        y += lines.length * 3.5;
      }
      y += 2;
    });
  }
  
  // Feats
  if (character.feats.length > 0 || bgData?.feat) {
    if (y > 250) {
      doc.addPage();
      y = 20;
    }
    y += 5;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('FEATS', 20, y);
    y += 6;
    
    doc.setFontSize(8);
    if (bgData?.feat) {
      doc.text(`• ${bgData.feat} (Background)`, 20, y);
      y += 4;
    }
    character.feats.forEach(feat => {
      doc.text(`• ${feat}`, 20, y);
      y += 4;
    });
  }
  
  // Background Story
  if (character.backgroundStory) {
    if (y > 230) {
      doc.addPage();
      y = 20;
    }
    y += 5;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('BACKGROUND STORY', 20, y);
    y += 6;
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(character.backgroundStory, 170);
    doc.text(lines, 20, y);
  }
  
  // Footer
  doc.setFontSize(7);
  doc.setTextColor(150);
  doc.text('Generated by D&D 5e Character Creator', 105, 290, { align: 'center' });
  
  doc.save(`${character.name || 'character'}_sheet.pdf`);
}

export function exportToFoundryJSON(character: Character): void {
  const abilities = getAbilityScores(character);
  const primaryClass = character.classes[0];
  const classData = primaryClass ? characterClasses[primaryClass.className.toLowerCase()] : null;
  
  const foundryData = {
    name: character.name,
    type: 'character',
    system: {
      abilities: abilityKeys.reduce((acc, key) => {
        acc[key] = {
          value: abilities[key],
          proficient: classData?.savingThrows.some(s => s.toLowerCase().startsWith(key)) ? 1 : 0,
        };
        return acc;
      }, {} as Record<string, { value: number; proficient: number }>),
      attributes: {
        hp: { value: calculateHP(character), max: calculateHP(character) },
        ac: { value: 10 + calculateModifier(abilities.dex) },
        init: { value: calculateModifier(abilities.dex) },
        movement: { walk: 30 },
        prof: calculateProficiencyBonus(character.level),
      },
      details: {
        level: character.level,
        race: character.raceName,
        background: character.backgroundName,
        biography: { value: character.backgroundStory || '' },
        xp: { value: 0 },
      },
      classes: character.classes.reduce((acc, cl) => {
        acc[cl.className.toLowerCase()] = {
          levels: cl.level,
          subclass: cl.subclass || '',
        };
        return acc;
      }, {} as Record<string, { levels: number; subclass: string }>),
    },
    items: [
      // Add feats as items
      ...character.feats.map(feat => ({
        name: feat,
        type: 'feat',
      })),
    ],
    flags: {
      'dnd5e-character-creator': {
        version: '1.0',
        exportedAt: new Date().toISOString(),
      },
    },
  };

  const blob = new Blob([JSON.stringify(foundryData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${character.name || 'character'}_foundry.json`;
  a.click();
  URL.revokeObjectURL(url);
}
