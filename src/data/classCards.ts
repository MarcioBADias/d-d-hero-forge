export interface ClassCard {
  id: string;
  url: string;
  label: string;
  type: 'trait' | 'table' | 'feature' | 'multiclass';
  level?: number;
  index?: string;
}

// Auto-discover every PNG under src/assets/classCards/<folder>/*.png at build time.
// Vite returns a map of { absolutePath: hashedUrl }. Adding a new class is as
// simple as dropping a new folder (e.g. `03_Cleric/`) with correctly-named
// PNGs — no code changes required.
const modules = import.meta.glob('@/assets/classCards/**/*.png', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

interface ClassBundle {
  cards: ClassCard[];
  backUrl: string | null;
}

// Strip leading numeric prefix like "01_Bard" -> "Bard"
function folderToClassName(folder: string): string {
  return folder.replace(/^\d+_/, '');
}

function naturalCompare(a: string, b: string): number {
  const pa = a.split('.').map((n) => parseInt(n, 10));
  const pb = b.split('.').map((n) => parseInt(n, 10));
  const len = Math.max(pa.length, pb.length);
  for (let i = 0; i < len; i++) {
    const na = pa[i] ?? 0;
    const nb = pb[i] ?? 0;
    if (na !== nb) return na - nb;
  }
  return 0;
}

function buildAllClassBundles(): Record<string, ClassBundle> {
  const grouped: Record<string, { folder: string; files: Array<{ path: string; url: string; name: string }> }> = {};

  for (const [absPath, url] of Object.entries(modules)) {
    // absPath looks like: /src/assets/classCards/02_Barbarian/Barbarian_nv_1.1.png
    const match = absPath.match(/\/classCards\/([^/]+)\/([^/]+)\.png$/i);
    if (!match) continue;
    const folder = match[1];
    const fileName = match[2];
    const className = folderToClassName(folder).toLowerCase();

    if (!grouped[className]) grouped[className] = { folder, files: [] };
    grouped[className].files.push({ path: absPath, url, name: fileName });
  }

  const bundles: Record<string, ClassBundle> = {};

  for (const [classKey, { files }] of Object.entries(grouped)) {
    const displayName = classKey.charAt(0).toUpperCase() + classKey.slice(1);
    const cards: ClassCard[] = [];
    let traitsCard: ClassCard | null = null;
    let tableCard: ClassCard | null = null;
    let multiclassCard: ClassCard | null = null;
    let backUrl: string | null = null;
    const featureCards: ClassCard[] = [];

    for (const { url, name } of files) {
      const lower = name.toLowerCase();

      if (lower.endsWith('_traits')) {
        traitsCard = { id: `${classKey}_traits`, url, label: `${displayName} Traits`, type: 'trait' };
        continue;
      }
      if (lower.endsWith('_table')) {
        tableCard = { id: `${classKey}_table`, url, label: `${displayName} Table`, type: 'table' };
        continue;
      }
      if (lower.endsWith('_back')) {
        backUrl = url;
        continue;
      }
      if (lower.endsWith('_multiclass')) {
        multiclassCard = {
          id: `${classKey}_multiclass`,
          url,
          label: `${displayName} Multiclass`,
          type: 'multiclass',
        };
        continue;
      }

      // Feature: {class}_nv_{level}.{idx}[.{sub}...]
      const feat = lower.match(/_nv_(\d+)\.(.+)$/);
      if (feat) {
        const level = parseInt(feat[1], 10);
        const idx = feat[2]; // e.g. "1", "3.1", "3.2"
        featureCards.push({
          id: `${classKey}_nv_${level}.${idx}`,
          url,
          label: `${displayName} Nv. ${level} — Habilidade ${idx}`,
          type: 'feature',
          level,
          index: idx,
        });
      }
      // Any other file (e.g. Front.png) is ignored.
    }

    // Sort features by level, then by natural numeric index
    featureCards.sort((a, b) => {
      if ((a.level ?? 0) !== (b.level ?? 0)) return (a.level ?? 0) - (b.level ?? 0);
      return naturalCompare(a.index ?? '', b.index ?? '');
    });

    if (traitsCard) cards.push(traitsCard);
    if (tableCard) cards.push(tableCard);
    if (multiclassCard) cards.push(multiclassCard);
    cards.push(...featureCards);

    bundles[classKey] = { cards, backUrl };
  }

  return bundles;
}

const bundles = buildAllClassBundles();

export const classCards: Record<string, ClassCard[]> = Object.fromEntries(
  Object.entries(bundles).map(([k, v]) => [k, v.cards]),
);

export function getClassCards(className: string): ClassCard[] {
  return bundles[className.toLowerCase()]?.cards || [];
}

export function getClassCardsForLevel(className: string, level: number): ClassCard[] {
  return getClassCards(className).filter(
    (c) => c.type !== 'feature' || (c.level ?? 0) <= level,
  );
}

export function getClassBackUrl(className: string): string | null {
  return bundles[className.toLowerCase()]?.backUrl ?? null;
}

export function hasClassCards(className: string): boolean {
  return (bundles[className.toLowerCase()]?.cards.length ?? 0) > 0;
}