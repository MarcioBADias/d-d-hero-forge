export interface ClassCard {
  id: string;
  url: string;
  label: string;
  type: 'trait' | 'table' | 'feature';
  level?: number;
  index?: number;
}

function buildBardCards(): ClassCard[] {
  const base = '/classCards/01_Bard';
  const featureFiles: Array<[number, number]> = [
    [1, 1], [1, 2], [1, 3],
    [2, 1], [2, 2],
    [3, 1], [3, 2], [3, 3], [3, 4],
    [4, 1],
    [5, 1],
    [6, 1],
    [7, 1],
    [10, 1],
    [14, 1],
    [18, 1],
    [19, 1],
    [20, 1],
  ];
  const cards: ClassCard[] = [
    { id: 'bard_traits', url: `${base}/bard_traits.png`, label: 'Bard Traits', type: 'trait' },
    { id: 'bard_table', url: `${base}/bard_table.png`, label: 'Bard Table', type: 'table' },
  ];
  featureFiles.forEach(([lvl, idx]) => {
    cards.push({
      id: `bard_nv_${lvl}.${idx}`,
      url: `${base}/bard_nv_${lvl}.${idx}.png`,
      label: `Bard Nv. ${lvl} — Habilidade ${idx}`,
      type: 'feature',
      level: lvl,
      index: idx,
    });
  });
  return cards;
}

export const classCards: Record<string, ClassCard[]> = {
  bard: buildBardCards(),
};

export function getClassCards(className: string): ClassCard[] {
  return classCards[className.toLowerCase()] || [];
}

export function getClassCardsForLevel(className: string, level: number): ClassCard[] {
  return getClassCards(className).filter(
    (c) => c.type !== 'feature' || (c.level ?? 0) <= level
  );
}

const classFolders: Record<string, string> = {
  bard: '01_Bard',
};

export function getClassBackUrl(className: string): string | null {
  const key = className.toLowerCase();
  const folder = classFolders[key];
  if (!folder) return null;
  return `/classCards/${folder}/${key}_back.png`;
}