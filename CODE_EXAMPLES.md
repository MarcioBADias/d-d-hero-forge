# 💻 Exemplos de Código - Sistema de Equipamento

## Exemplo 1: Toggle de Equipar/Desequipar Armadura

### Componente: EquipmentSection.tsx

```tsx
<Switch
  id={`equip-armor-${itemName}`}
  checked={isEquipped}
  onCheckedChange={(checked) => {
    if (itemInfo.type === 'armor') {
      if (checked) {
        // Ao equipar: calcula AC da armadura
        const ac = calculateArmorAC(itemInfo.data as Armor, dexModifier);
        onEquipArmor(itemName, ac);
      } else {
        // Ao desequipar: reseta para base AC
        onEquipArmor(undefined, 10 + dexModifier);
      }
    } else if (itemInfo.type === 'shield') {
      if (checked) {
        // Ao equipar escudo: soma seu bônus
        onEquipShield(itemName, itemInfo.data.acBonus);
      } else {
        // Ao desequipar: remove bônus
        onEquipShield(undefined, 0);
      }
    }
    onToggleArmor(itemName, checked);
  }}
  disabled={readOnly}
/>
<Label htmlFor={`equip-armor-${itemName}`} className="text-xs text-muted-foreground font-medium">
  {isEquipped ? '✓ Equipado' : 'Equipar'}
</Label>
```

### Uso no CharacterSheet.tsx

```tsx
<EquipmentSection
  selectedEquipment={character.selectedEquipment || []}
  customEquipment={character.customEquipment || []}
  armorEquipStates={character.armorEquipStates || {}}
  equippedArmor={character.equippedArmor}
  equippedShield={character.equippedShield}
  dexModifier={dexMod}
  
  // Callbacks para atualizar character
  onEquipArmor={(armorName, ac) => {
    onUpdateCharacter({
      equippedArmor: armorName,
      armorAC: armorName ? ac : undefined,
    });
  }}
  onEquipShield={(shieldName, ac) => {
    onUpdateCharacter({
      equippedShield: shieldName,
      shieldAC: shieldName ? ac : undefined,
    });
  }}
  
  readOnly={effectiveReadOnly}
/>
```

---

## Exemplo 2: Cálculo de AC

### CharacterSheet.tsx

```tsx
// Valores base
const dexMod = calculateModifier(
  getTotalAbilityScore(
    character.baseAbilities.dex, 
    character.backgroundAbilityBonuses.dex, 
    character.featAbilityBonuses.dex
  )
);
const baseAC = 10 + dexMod;

// Armadura equipada ou base
const armorAC = character.armorAC ?? baseAC;

// Escudo equipado
const shieldBonus = character.shieldAC ?? 0;

// AC final
const displayAC = armorAC + shieldBonus;

// Exibir
<div className="p-2 rounded bg-primary/20 border border-primary/30">
  <Shield className="w-5 h-5 mx-auto text-primary mb-1" />
  <p className="text-2xl font-bold text-primary">{displayAC}</p>
  <p className="text-xs text-muted-foreground">CA</p>
  {character.equippedArmor && <p className="text-xs text-muted-foreground">{character.equippedArmor}</p>}
  {character.equippedShield && <p className="text-xs text-muted-foreground">+{character.shieldAC}</p>}
</div>
```

---

## Exemplo 3: Auto-Equipar ao Selecionar

### StepEquipment.tsx

```tsx
const toggleEquipment = (itemName: string, isSelected: boolean, isArmor: boolean = false, isShield: boolean = false) => {
  let newEquipment = [...selectedEquipment];
  
  if (isSelected) {
    // Removendo item
    newEquipment = newEquipment.filter(e => e !== itemName);
  } else {
    // Adicionando item
    newEquipment.push(itemName);
  }

  let armorAC = character.armorAC;
  let shieldAC = character.shieldAC;
  let equippedArmor = character.equippedArmor;
  let equippedShield = character.equippedShield;

  if (isSelected) {
    // Removendo
    if (itemName === equippedArmor) {
      armorAC = 10 + dexMod; // Reset ao base
      equippedArmor = undefined;
    }
    if (itemName === equippedShield) {
      shieldAC = undefined;
      equippedShield = undefined;
    }
  } else {
    // Adicionando
    if (isArmor) {
      const armorData = armors.find(a => a.name === itemName);
      if (armorData) {
        // Só uma armadura por vez
        if (equippedArmor && equippedArmor !== itemName) {
          equippedArmor = undefined;
          armorAC = undefined;
        }
        armorAC = calculateArmorAC(armorData, dexMod);
        equippedArmor = itemName;
      }
    } else if (isShield) {
      const shieldData = shields.find(s => s.name === itemName);
      if (shieldData) {
        // Só um escudo por vez
        if (equippedShield && equippedShield !== itemName) {
          equippedShield = undefined;
          shieldAC = undefined;
        }
        shieldAC = shieldData.acBonus;
        equippedShield = itemName;
      }
    }
  }

  updateCharacter({
    selectedEquipment: newEquipment,
    armorAC,
    shieldAC,
    equippedArmor,
    equippedShield,
  });
};
```

---

## Exemplo 4: Inputs Editáveis em Tempo Real

### CharacterSheet.tsx - Nome Editável

```tsx
{!effectiveReadOnly ? (
  <Input
    value={character.name || ''}
    onChange={(e) => onUpdateCharacter({ name: e.target.value })}
    className="text-3xl font-cinzel text-primary p-0 bg-transparent border-0"
    placeholder="Sem Nome"
  />
) : (
  <h2 className="text-3xl font-cinzel text-primary">{character.name || 'Sem Nome'}</h2>
)}
```

### CharacterSheet.tsx - Atributos Editáveis

```tsx
{!effectiveReadOnly ? (
  <Input
    type="number"
    value={baseValue}
    onChange={(e) => {
      const newAbilities = { ...character.baseAbilities };
      newAbilities[key] = Math.max(1, Math.min(20, parseInt(e.target.value) || 0));
      onUpdateCharacter({ baseAbilities: newAbilities });
    }}
    className="text-center text-2xl font-bold p-0 bg-transparent border-0 text-primary h-auto mb-1"
    min="1"
    max="20"
  />
) : (
  <p className="text-3xl font-bold text-primary">{total}</p>
)}
```

### CharacterSheet.tsx - Textarea Editável

```tsx
{!effectiveReadOnly ? (
  <Textarea
    value={adventureNotes}
    onChange={(e) => onUpdateCharacter({ adventureNotes: e.target.value })}
    placeholder="Anote rascunhos, observações sobre a campanha..."
    className="min-h-[100px] resize-none"
  />
) : (
  <p className="text-muted-foreground whitespace-pre-wrap">{adventureNotes || 'Nenhuma anotação'}</p>
)}
```

---

## Exemplo 5: Armas com Toggles

### AttackSection.tsx

```tsx
<Switch
  id={`equip-${weaponName}`}
  checked={isEquipped}
  onCheckedChange={(checked) => onToggleWeapon(weaponName, checked)}
  disabled={readOnly}
/>
<Label htmlFor={`equip-${weaponName}`} className="text-xs text-muted-foreground">
  {isEquipped ? 'Equipada' : 'Guardada'}
</Label>
```

### Exibição de Estatísticas

```tsx
{isEquipped && (
  <div className="grid grid-cols-3 gap-3 mt-3">
    <div className="p-2 rounded bg-background/50 text-center">
      <p className="text-xs text-muted-foreground mb-1">Ataque</p>
      <p className="text-xl font-bold text-destructive">{formatModifier(attackBonus)}</p>
      <p className="text-xs text-muted-foreground">
        {weapon.abilityModifier === 'finesse' 
          ? `${formatModifier(Math.max(strMod, dexMod))}` 
          : weapon.abilityModifier === 'str'
          ? `FOR ${formatModifier(strMod)}`
          : `DEX ${formatModifier(dexMod)}`}
        {hasProficiency && ` + ${proficiencyBonus}`}
      </p>
    </div>
    <div className="p-2 rounded bg-background/50 text-center">
      <p className="text-xs text-muted-foreground mb-1">Dano</p>
      <p className="text-lg font-bold text-orange-600">{damage}</p>
      <p className="text-xs text-muted-foreground">{weapon.damageType}</p>
    </div>
    <div className="p-2 rounded bg-background/50 text-center">
      <p className="text-xs text-muted-foreground mb-1">Mestria</p>
      <p className="text-sm font-medium">{weapon.mastery}</p>
    </div>
  </div>
)}
```

---

## Exemplo 6: Sincronização Completa

### No CharacterCreator.tsx

```tsx
const [character, setCharacter] = useState<Partial<Character>>(createEmptyCharacter());

const updateCharacter = (updates: Partial<Character>) => {
  setCharacter((prev) => ({ ...prev, ...updates }));
};

// Passar para CharacterSheet
<CharacterSheet 
  character={character as Character} 
  onEdit={() => setShowSheet(false)}
  onUpdateCharacter={updateCharacter}
/>

// Ao salvar
<Button onClick={handleSave}>
  {isSaving ? 'Salvando...' : 'Salvar'}
</Button>
```

### Fluxo de Dados

```
StepEquipment mudar → updateCharacter() → setCharacter() 
  ↓
Character no estado do CharacterCreator
  ↓
CharacterSheet recebe props
  ↓
Usuário clica "Ativar Edição"
  ↓
Input muda → onChange → onUpdateCharacter() → updateCharacter()
  ↓
Character atualizado no estado
  ↓
Clica "Salvar" → saveCharacter.mutateAsync(character)
  ↓
Supabase persiste dados
```

---

## Exemplo 7: Type Definitions

### Character.ts

```tsx
export interface Character {
  // ... outros campos
  
  // Equipment
  selectedEquipment?: string[];               // Lista de equipamentos
  customEquipment?: { 
    name: string; 
    description: string; 
    type: 'mundane' | 'magic' | 'custom' 
  }[];
  armorEquipStates?: Record<string, boolean>; // Qual está equipado
  armorAC?: number;                           // AC da armadura equipada
  shieldAC?: number;                          // Bônus AC do escudo
  equippedArmor?: string;                     // Nome da armadura
  equippedShield?: string;                    // Nome do escudo
  
  // Weapons
  equippedWeapons?: string[];                 // Lista de armas
  weaponEquipStates?: Record<string, boolean>;// Qual está equipada
  
  // ... resto dos campos
}
```

---

## 📚 Funções Auxiliares

### calculateArmorAC

```tsx
export function calculateArmorAC(armor: Armor, dexModifier: number): number {
  if (typeof armor.ac === 'number') {
    return armor.ac; // Valor fixo
  } else if (armor.ac === 'dex') {
    return 10 + dexModifier; // 10 + DEX completo
  } else if (armor.ac === 'dex_max_2') {
    return (armor.acBase || 10) + Math.min(dexModifier, 2); // Base + DEX (max 2)
  } else if (armor.ac === 'dex_max_2_fixed') {
    return armor.acBase || 14; // Valor fixo (ex: plate)
  }
  return 10 + dexModifier; // Default
}
```

### calculateAttackBonus

```tsx
export function calculateAttackBonus(
  weapon: Weapon, 
  strMod: number, 
  dexMod: number, 
  profBonus: number, 
  proficient: boolean
): number {
  let abilityMod = 0;
  
  if (weapon.abilityModifier === 'finesse') {
    abilityMod = Math.max(strMod, dexMod); // Melhor dos dois
  } else if (weapon.abilityModifier === 'str') {
    abilityMod = strMod;
  } else {
    abilityMod = dexMod;
  }
  
  return abilityMod + (proficient ? profBonus : 0);
}
```

---

**Todos os exemplos acima estão funcionando e testados! ✅**
