import { Badge } from '@/components/ui/badge';

interface MonsterData {
  name: string;
  size: string;
  type: string;
  alignment: string;
  armor_class: { value: number; description?: string };
  hit_points: { average: number; formula: string };
  speed: string;
  initiative?: number;
  stats: {
    str: { value: number; mod: number; save: number };
    dex: { value: number; mod: number; save: number };
    con: { value: number; mod: number; save: number };
    int: { value: number; mod: number; save: number };
    wis: { value: number; mod: number; save: number };
    cha: { value: number; mod: number; save: number };
  };
  skills?: Record<string, number>;
  senses?: Record<string, string | number>;
  languages?: string[];
  damage_resistances?: string[];
  damage_immunities?: string[];
  condition_immunities?: string[];
  challenge_rating: string;
  proficiency_bonus?: number;
  traits?: Array<{ name: string; description: string }>;
  actions?: Array<{ name: string; description?: string; type?: string; to_hit?: number; reach?: string; range?: string; damage?: string; effect?: string }>;
  bonus_actions?: Array<{ name: string; description: string }>;
  reactions?: Array<{ name: string; description: string }>;
  legendary_actions?: Array<{ name: string; description: string }>;
}

function formatMod(mod: number) {
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

export default function MonsterStatBlock({ data }: { data: MonsterData }) {
  const m = data;

  return (
    <div className="parchment p-4 space-y-3 border-l-4 border-primary font-crimson text-sm">
      {/* Header */}
      <div className="border-b-2 border-primary pb-2">
        <div className="flex justify-between items-start">
          <h3 className="font-cinzel text-xl font-bold text-primary uppercase tracking-wide">{m.name}</h3>
          <Badge variant="outline" className="border-primary text-primary font-cinzel text-xs">CR {m.challenge_rating}</Badge>
        </div>
        <p className="text-muted-foreground italic">{m.size} {m.type}, {m.alignment}</p>
      </div>

      {/* Basic info */}
      <div className="space-y-1 border-b border-border pb-2">
        <p><span className="font-semibold text-primary">AC</span> {m.armor_class.value}{m.armor_class.description ? ` (${m.armor_class.description})` : ''}</p>
        <p><span className="font-semibold text-primary">HP</span> {m.hit_points.average} ({m.hit_points.formula})</p>
        <p><span className="font-semibold text-primary">Speed</span> {m.speed}</p>
        {m.initiative !== undefined && <p><span className="font-semibold text-primary">Initiative</span> {m.initiative}</p>}
      </div>

      {/* Stats table */}
      <div className="overflow-x-auto border-b border-border pb-2">
        <table className="w-full text-center text-xs">
          <thead>
            <tr className="font-cinzel text-primary uppercase">
              <th className="px-1">STR</th><th className="px-1">DEX</th><th className="px-1">CON</th>
              <th className="px-1">INT</th><th className="px-1">WIS</th><th className="px-1">CHA</th>
            </tr>
          </thead>
          <tbody>
            <tr className="font-bold">
              {(['str','dex','con','int','wis','cha'] as const).map(stat => (
                <td key={stat} className="px-1">{m.stats[stat].value}</td>
              ))}
            </tr>
            <tr className="text-muted-foreground">
              {(['str','dex','con','int','wis','cha'] as const).map(stat => (
                <td key={stat} className="px-1">{formatMod(m.stats[stat].mod)}</td>
              ))}
            </tr>
            <tr className="text-xs text-muted-foreground">
              {(['str','dex','con','int','wis','cha'] as const).map(stat => (
                <td key={stat} className="px-1">Save {formatMod(m.stats[stat].save)}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Skills, Senses, Languages */}
      <div className="space-y-1 border-b border-border pb-2 text-xs">
        {m.skills && Object.keys(m.skills).length > 0 && (
          <p><span className="font-semibold text-primary">Skills</span> {Object.entries(m.skills).map(([k, v]) => `${k.charAt(0).toUpperCase() + k.slice(1)} +${v}`).join(', ')}</p>
        )}
        {m.senses && (
          <p><span className="font-semibold text-primary">Senses</span> {Object.entries(m.senses).map(([k, v]) => `${k.replace(/_/g, ' ')} ${v}`).join(', ')}</p>
        )}
        {m.languages && m.languages.length > 0 && (
          <p><span className="font-semibold text-primary">Languages</span> {m.languages.join(', ')}</p>
        )}
        {m.damage_resistances && m.damage_resistances.length > 0 && (
          <p><span className="font-semibold text-primary">Damage Resistances</span> {m.damage_resistances.join(', ')}</p>
        )}
        {m.damage_immunities && m.damage_immunities.length > 0 && (
          <p><span className="font-semibold text-primary">Damage Immunities</span> {m.damage_immunities.join(', ')}</p>
        )}
        {m.condition_immunities && m.condition_immunities.length > 0 && (
          <p><span className="font-semibold text-primary">Condition Immunities</span> {m.condition_immunities.join(', ')}</p>
        )}
        {m.proficiency_bonus !== undefined && (
          <p><span className="font-semibold text-primary">Proficiency Bonus</span> +{m.proficiency_bonus}</p>
        )}
      </div>

      {/* Traits */}
      {m.traits && m.traits.length > 0 && (
        <div className="space-y-2 border-b border-border pb-2">
          <h4 className="font-cinzel text-primary text-sm uppercase tracking-wider border-b border-primary/30 pb-1">Traits</h4>
          {m.traits.map((t, i) => (
            <p key={i}><span className="font-bold">{t.name}.</span> {t.description}</p>
          ))}
        </div>
      )}

      {/* Actions */}
      {m.actions && m.actions.length > 0 && (
        <div className="space-y-2 border-b border-border pb-2">
          <h4 className="font-cinzel text-primary text-sm uppercase tracking-wider border-b border-primary/30 pb-1">Actions</h4>
          {m.actions.map((a, i) => (
            <div key={i}>
              <span className="font-bold">{a.name}.</span>{' '}
              {a.type && <span className="italic">{a.type}: </span>}
              {a.to_hit !== undefined && <span>+{a.to_hit} to hit, </span>}
              {a.reach && <span>reach {a.reach}, </span>}
              {a.range && <span>range {a.range}, </span>}
              {a.damage && <span>{a.damage}</span>}
              {a.description && <span>{a.description}</span>}
              {a.effect && <span className="block text-xs text-muted-foreground mt-0.5">{a.effect}</span>}
            </div>
          ))}
        </div>
      )}

      {/* Bonus Actions */}
      {m.bonus_actions && m.bonus_actions.length > 0 && (
        <div className="space-y-2 border-b border-border pb-2">
          <h4 className="font-cinzel text-primary text-sm uppercase tracking-wider border-b border-primary/30 pb-1">Bonus Actions</h4>
          {m.bonus_actions.map((a, i) => (
            <p key={i}><span className="font-bold">{a.name}.</span> {a.description}</p>
          ))}
        </div>
      )}

      {/* Reactions */}
      {m.reactions && m.reactions.length > 0 && (
        <div className="space-y-2 border-b border-border pb-2">
          <h4 className="font-cinzel text-primary text-sm uppercase tracking-wider border-b border-primary/30 pb-1">Reactions</h4>
          {m.reactions.map((a, i) => (
            <p key={i}><span className="font-bold">{a.name}.</span> {a.description}</p>
          ))}
        </div>
      )}

      {/* Legendary Actions */}
      {m.legendary_actions && m.legendary_actions.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-cinzel text-primary text-sm uppercase tracking-wider border-b border-primary/30 pb-1">Legendary Actions</h4>
          {m.legendary_actions.map((a, i) => (
            <p key={i}><span className="font-bold">{a.name}.</span> {a.description}</p>
          ))}
        </div>
      )}
    </div>
  );
}
