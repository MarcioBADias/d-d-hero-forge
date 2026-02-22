import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Character, abilityShortLabels, calculateModifier, formatModifier, getTotalAbilityScore, calculateProficiencyBonus, AbilityScore, DeathSaves, Coins, SpellSlotState } from '@/types/character';
import { characterClasses } from '@/data/classes';
import { races } from '@/data/races';
import { backgrounds } from '@/data/backgrounds';
import { feats } from '@/data/feats';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ExportDropdown } from '@/components/character/ExportDropdown';
import { HpTracker } from './HpTracker';
import { InventoryCoins } from './InventoryCoins';
import { SpellManager } from './SpellManager';
import { AttackSection } from './AttackSection';
import { EquipmentSection } from './EquipmentSection';
import { ArrowUp, Edit, Shield, Footprints, Star, Sword, Sparkles, User, Wrench, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CharacterSheetProps {
  character: Character;
  onEdit: () => void;
  onUpdateCharacter: (updates: Partial<Character>) => void;
  onSaveChanges?: (changes: Partial<Character>) => Promise<void>;
  readOnly?: boolean;
}

const abilityKeys: AbilityScore[] = ['str', 'dex', 'con', 'int', 'wis', 'cha'];

export function CharacterSheet({ character, onEdit, onUpdateCharacter, onSaveChanges, readOnly = false }: CharacterSheetProps) {
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<Partial<Character>>({});
  const [isSaving, setIsSaving] = useState(false);

  const hasPendingChanges = Object.keys(pendingChanges).length > 0;
  const effectiveReadOnly = readOnly || !isEditable;

  // Merge character with pending changes for display
  const displayCharacter = { ...character, ...pendingChanges } as Character;

  const handleUpdateCharacter = (updates: Partial<Character>) => {
    setPendingChanges(prev => ({ ...prev, ...updates }));
    onUpdateCharacter(updates);
  };

  const handleSaveChanges = async () => {
    if (!hasPendingChanges || !onSaveChanges) return;
    
    setIsSaving(true);
    try {
      await onSaveChanges(pendingChanges);
      setPendingChanges({});
      setIsEditable(false);
    } catch (error) {
      console.error('Error saving changes:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleEditMode = () => {
    if (isEditable && hasPendingChanges && onSaveChanges) {
      handleSaveChanges();
    } else {
      setIsEditable(!isEditable);
      if (isEditable) {
        setPendingChanges({});
      }
    }
  };

  const proficiencyBonus = calculateProficiencyBonus(character.level);
  const primaryClass = character.classes[0];
  const classData = primaryClass ? characterClasses[primaryClass.className.toLowerCase()] : null;
  
  const conMod = calculateModifier(getTotalAbilityScore(character.baseAbilities.con, character.backgroundAbilityBonuses.con, character.featAbilityBonuses.con));
  
  const calculateHP = () => {
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
  };

  const maxHp = calculateHP();
  const currentHp = displayCharacter.currentHp ?? maxHp;
  const tempHp = displayCharacter.tempHp ?? 0;
  const deathSaves = displayCharacter.deathSaves ?? { successes: 0, failures: 0 };
  const inventory = displayCharacter.inventory ?? '';
  const coins = displayCharacter.coins ?? { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 };
  const spellSlots = character.spellSlots ?? {};
  const adventureNotes = character.adventureNotes ?? '';
  
  const dexMod = calculateModifier(getTotalAbilityScore(character.baseAbilities.dex, character.backgroundAbilityBonuses.dex, character.featAbilityBonuses.dex));
  const baseAC = 10 + dexMod;
  
  // Calculate AC: if armor is equipped, use its AC value, otherwise base AC (10 + dex)
  // Then add shield bonus if equipped
  const armorAC = character.armorAC ?? baseAC;
  const shieldBonus = character.shieldAC ?? 0;
  const displayAC = armorAC + shieldBonus;
  
  const raceData = races.find(r => r.name === character.raceName);
  const bgData = backgrounds.find(b => b.name === character.backgroundName);

  // Skills mapping to abilities
  const skillsList: { name: string; ability: AbilityScore }[] = [
    { name: 'Acrobatics', ability: 'dex' },
    { name: 'Animal Handling', ability: 'wis' },
    { name: 'Arcana', ability: 'int' },
    { name: 'Athletics', ability: 'str' },
    { name: 'Deception', ability: 'cha' },
    { name: 'History', ability: 'int' },
    { name: 'Insight', ability: 'wis' },
    { name: 'Intimidation', ability: 'cha' },
    { name: 'Investigation', ability: 'int' },
    { name: 'Medicine', ability: 'wis' },
    { name: 'Nature', ability: 'int' },
    { name: 'Perception', ability: 'wis' },
    { name: 'Performance', ability: 'cha' },
    { name: 'Persuasion', ability: 'cha' },
    { name: 'Religion', ability: 'int' },
    { name: 'Sleight of Hand', ability: 'dex' },
    { name: 'Stealth', ability: 'dex' },
    { name: 'Survival', ability: 'wis' },
  ];

  const handleLevelUp = () => {
    if (character.level >= 20) return;
    handleUpdateCharacter({
      level: character.level + 1,
      classes: character.classes.map((c, i) => i === 0 ? { ...c, level: c.level + 1 } : c),
    });
    setShowLevelUp(false);
  };

  const isDying = currentHp <= 0 && deathSaves.failures < 3;
  const isDead = deathSaves.failures >= 3;

  return (
    <motion.div 
      className={cn(
        "min-h-screen bg-background pb-20 transition-all duration-500",
        isDying && !isDead && "bg-destructive/5",
        isDead && "grayscale"
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {!readOnly ? (
                <Button variant="ghost" onClick={onEdit} className="gap-2">
                  <Edit className="w-4 h-4" />Editar
                </Button>
              ) : <div />}
              <Button
                variant={isEditable ? 'default' : 'ghost'}
                onClick={toggleEditMode}
                className="gap-2"
                aria-pressed={isEditable}
                disabled={isSaving}
              >
                <Wrench className="w-4 h-4" /> 
                {isEditable && hasPendingChanges 
                  ? 'Salvar Edição' 
                  : isEditable 
                  ? 'Cancelar' 
                  : 'Ativar Edição'}
              </Button>
            </div>
            <h1 className="text-xl md:text-2xl font-cinzel text-primary">Ficha do Personagem</h1>
            <ExportDropdown character={character} />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Character Header */}
          <Card className="parchment overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-32 h-32 rounded-lg border-2 border-primary bg-muted flex items-center justify-center overflow-hidden flex-shrink-0 mx-auto md:mx-0">
                  {character.imageUrl ? (
                    <img src={character.imageUrl} alt={character.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-16 h-16 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                    {!effectiveReadOnly ? (
                      <Input
                        value={displayCharacter.name || ''}
                        onChange={(e) => handleUpdateCharacter({ name: e.target.value })}
                        className="text-3xl font-cinzel text-primary p-0 bg-transparent border-0 focus-visible:ring-0"
                        placeholder="Sem Nome"
                        type="text"
                        autoCapitalize="words"
                        inputMode="text"
                      />
                    ) : (
                      <h2 className="text-3xl font-cinzel text-primary">{displayCharacter.name || 'Sem Nome'}</h2>
                    )}
                    {!readOnly && (
                      <Dialog open={showLevelUp} onOpenChange={setShowLevelUp}>
                        <DialogTrigger asChild>
                          <Button size="sm" className="btn-d20 gap-1" disabled={character.level >= 20}>
                            Nv. {character.level}<ArrowUp className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle className="font-cinzel text-primary">⬆️ Level Up para Nível {character.level + 1}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <p>Ao subir de nível você ganhará:</p>
                            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                              <li>+{Math.floor((classData?.hitDie || 8) / 2) + 1 + conMod} HP</li>
                            </ul>
                            <Button onClick={handleLevelUp} className="w-full btn-d20">Confirmar Level Up</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-3">
                    {character.raceName && <Badge variant="secondary">{character.raceName}</Badge>}
                    {character.classes.map((c, i) => (
                      <Badge key={i} className="bg-primary/20 text-primary border-primary">{c.className} {c.level}</Badge>
                    ))}
                    {character.backgroundName && <Badge variant="outline">{character.backgroundName}</Badge>}
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-2 rounded bg-primary/20 border border-primary/30">
                      <Shield className="w-5 h-5 mx-auto text-primary mb-1" />
                      <p className="text-2xl font-bold text-primary">{displayAC}</p>
                      <p className="text-xs text-muted-foreground">CA</p>
                      {character.equippedArmor && <p className="text-xs text-muted-foreground">{character.equippedArmor}</p>}
                      {character.equippedShield && <p className="text-xs text-muted-foreground">+{character.shieldAC}</p>}
                    </div>
                    <div className="p-2 rounded bg-nature/20 border border-nature/30">
                      <Footprints className="w-5 h-5 mx-auto text-nature mb-1" />
                      <p className="text-2xl font-bold">{raceData?.speed.split(' ')[0] || '30'}</p>
                      <p className="text-xs text-muted-foreground">Velocidade</p>
                    </div>
                    <div className="p-2 rounded bg-arcane/20 border border-arcane/30">
                      <Star className="w-5 h-5 mx-auto text-arcane mb-1" />
                      <p className="text-2xl font-bold">+{proficiencyBonus}</p>
                      <p className="text-xs text-muted-foreground">Proficiência</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* HP Tracker */}
          <HpTracker
            maxHp={maxHp}
            currentHp={currentHp}
            tempHp={tempHp}
            deathSaves={deathSaves}
            onHpChange={(hp, temp) => handleUpdateCharacter({ currentHp: hp, tempHp: temp })}
            onDeathSavesChange={(saves) => handleUpdateCharacter({ deathSaves: saves })}
            readOnly={effectiveReadOnly}
          />

          {/* Attack Section */}
          <AttackSection
            equippedWeapons={displayCharacter.equippedWeapons || []}
            weaponEquipStates={displayCharacter.weaponEquipStates || {}}
            baseAbilities={displayCharacter.baseAbilities}
            backgroundBonuses={displayCharacter.backgroundAbilityBonuses}
            featBonuses={displayCharacter.featAbilityBonuses}
            proficiencyBonus={proficiencyBonus}
            characterClass={primaryClass?.className || ''}
            onToggleWeapon={(weaponName, equipped) => {
              handleUpdateCharacter({
                weaponEquipStates: {
                  ...displayCharacter.weaponEquipStates,
                  [weaponName]: equipped,
                },
              });
            }}
            onAddWeapon={(weaponName) => {
              const current = displayCharacter.equippedWeapons || [];
              if (!current.includes(weaponName)) {
                handleUpdateCharacter({
                  equippedWeapons: [...current, weaponName],
                  weaponEquipStates: {
                    ...displayCharacter.weaponEquipStates,
                    [weaponName]: true,
                  },
                });
              }
            }}
            onRemoveWeapon={(weaponName) => {
              const current = displayCharacter.equippedWeapons || [];
              const newStates = { ...displayCharacter.weaponEquipStates };
              delete newStates[weaponName];
              handleUpdateCharacter({
                equippedWeapons: current.filter(w => w !== weaponName),
                weaponEquipStates: newStates,
              });
            }}
            readOnly={effectiveReadOnly}
          />

          {/* Equipment Section */}
          <EquipmentSection
            selectedEquipment={displayCharacter.selectedEquipment || []}
            customEquipment={displayCharacter.customEquipment || []}
            armorEquipStates={displayCharacter.armorEquipStates || {}}
            equippedArmor={displayCharacter.equippedArmor}
            equippedShield={displayCharacter.equippedShield}
            dexModifier={dexMod}
            onAddEquipment={(name, type, description) => {
              const current = displayCharacter.selectedEquipment || [];
              if (!current.includes(name)) {
                if (type === 'custom' && description) {
                  const customItems = displayCharacter.customEquipment || [];
                  handleUpdateCharacter({
                    selectedEquipment: [...current, name],
                    customEquipment: [...customItems, { name, description, type }],
                  });
                } else {
                  handleUpdateCharacter({ selectedEquipment: [...current, name] });
                }
              }
            }}
            onRemoveEquipment={(name) => {
              const current = displayCharacter.selectedEquipment || [];
              const customItems = displayCharacter.customEquipment || [];
              const newArmorStates = { ...displayCharacter.armorEquipStates };
              delete newArmorStates[name];
              
              // If removing equipped armor, reset armor AC and set it to undefined
              const isEquippedArmor = displayCharacter.equippedArmor === name;
              const isEquippedShield = displayCharacter.equippedShield === name;
              
              handleUpdateCharacter({
                selectedEquipment: current.filter(e => e !== name),
                customEquipment: customItems.filter(c => c.name !== name),
                armorEquipStates: newArmorStates,
                equippedArmor: isEquippedArmor ? undefined : displayCharacter.equippedArmor,
                armorAC: isEquippedArmor ? undefined : displayCharacter.armorAC,
                equippedShield: isEquippedShield ? undefined : displayCharacter.equippedShield,
                shieldAC: isEquippedShield ? undefined : displayCharacter.shieldAC,
              });
            }}
            onToggleArmor={(name, equipped) => {
              handleUpdateCharacter({
                armorEquipStates: {
                  ...displayCharacter.armorEquipStates,
                  [name]: equipped,
                },
              });
            }}
            onEquipArmor={(armorName, ac) => {
              handleUpdateCharacter({
                equippedArmor: armorName,
                armorAC: armorName ? ac : undefined,
              });
            }}
            onEquipShield={(shieldName, ac) => {
              handleUpdateCharacter({
                equippedShield: shieldName,
                shieldAC: shieldName ? ac : undefined,
              });
            }}
            readOnly={effectiveReadOnly}
          />

          {/* Ability Scores */}
          <Card className="parchment">
            <CardHeader><CardTitle className="font-cinzel text-primary flex items-center gap-2"><Sword className="w-5 h-5" />Atributos</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {abilityKeys.map(key => {
                  const baseValue = displayCharacter.baseAbilities[key];
                  const total = getTotalAbilityScore(baseValue, displayCharacter.backgroundAbilityBonuses[key], displayCharacter.featAbilityBonuses[key]);
                  const mod = calculateModifier(total);
                  const saveProficient = classData?.savingThrows.some(s => s.toLowerCase().startsWith(key));
                  return (
                    <div key={key} className="text-center p-3 rounded-lg bg-background/30 border border-border">
                      <p className="text-xs text-muted-foreground uppercase font-semibold">{abilityShortLabels[key]}</p>
                      {!effectiveReadOnly ? (
                        <Input
                          type="number"
                          value={baseValue}
                          onChange={(e) => {
                            const newAbilities = { ...character.baseAbilities };
                            newAbilities[key] = Math.max(1, Math.min(20, parseInt(e.target.value) || 0));
                            handleUpdateCharacter({ baseAbilities: newAbilities });
                          }}
                          className="text-center text-2xl font-bold p-0 bg-transparent border-0 text-primary h-auto mb-1 focus-visible:ring-0"
                          min="1"
                          max="20"
                          inputMode="numeric"
                        />
                      ) : (
                        <p className="text-3xl font-bold text-primary">{total}</p>
                      )}
                      <p className={`text-lg font-semibold ${mod >= 0 ? 'text-nature' : 'text-destructive'}`}>{formatModifier(mod)}</p>
                      <p className="text-xs text-muted-foreground mt-1">Save: {formatModifier(mod + (saveProficient ? proficiencyBonus : 0))}{saveProficient && ' ●'}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card className="parchment">
            <CardHeader><CardTitle className="font-cinzel text-primary flex items-center gap-2"><Shield className="w-5 h-5" />Perícias</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {skillsList.map((s) => {
                  const abilityTotal = getTotalAbilityScore(character.baseAbilities[s.ability], character.backgroundAbilityBonuses[s.ability], character.featAbilityBonuses[s.ability]);
                  const mod = calculateModifier(abilityTotal);
                  const proficient = (displayCharacter.skills || []).includes(s.name);
                  const total = mod + (proficient ? proficiencyBonus : 0);
                  return (
                    <div key={s.name} className="flex items-center justify-between p-2 rounded bg-background/30 border border-border">
                      <div>
                        <p className="font-medium">{s.name}{proficient && ' ●'}</p>
                        <p className="text-xs text-muted-foreground">{abilityShortLabels[s.ability]}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-semibold ${total >= 0 ? 'text-nature' : 'text-destructive'}`}>{formatModifier(total)}</p>
                        {!effectiveReadOnly ? (
                          <Button size="sm" variant={proficient ? 'default' : 'outline'} onClick={() => {
                            const current = displayCharacter.skills || [];
                            if (proficient) {
                              handleUpdateCharacter({ skills: current.filter(sk => sk !== s.name) });
                            } else {
                              handleUpdateCharacter({ skills: Array.from(new Set([...current, s.name])) });
                            }
                          }}>Toggle</Button>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Spells (if caster) */}
          {classData?.spellcasting && primaryClass && (
            <SpellManager
              className={primaryClass.className}
              classLevel={primaryClass.level}
              baseAbilities={displayCharacter.baseAbilities}
              backgroundBonuses={displayCharacter.backgroundAbilityBonuses}
              featBonuses={displayCharacter.featAbilityBonuses}
              spellsKnown={displayCharacter.spellsKnown || []}
              preparedSpells={displayCharacter.preparedSpells || []}
              spellSlots={spellSlots}
              onSpellsKnownChange={(spells) => handleUpdateCharacter({ spellsKnown: spells })}
              onPreparedSpellsChange={(spells) => handleUpdateCharacter({ preparedSpells: spells })}
              onSpellSlotsChange={(slots) => handleUpdateCharacter({ spellSlots: slots })}
              readOnly={effectiveReadOnly}
            />
          )}

          {/* Adventure Notes */}
          <Card className="parchment">
            <CardHeader><CardTitle className="font-cinzel text-primary flex items-center gap-2"><BookOpen className="w-5 h-5" />Detalhes da Aventura</CardTitle></CardHeader>
            <CardContent>
              {!effectiveReadOnly ? (
                <Textarea
                  value={displayCharacter.adventureNotes || ''}
                  onChange={(e) => handleUpdateCharacter({ adventureNotes: e.target.value })}
                  placeholder="Anote rascunhos, observações sobre a campanha, NPCs importantes..."
                  className="min-h-[120px] md:min-h-[100px] resize-none p-4 md:p-3"
                />
              ) : (
                <p className="text-muted-foreground whitespace-pre-wrap">{adventureNotes || 'Nenhuma anotação'}</p>
              )}
            </CardContent>
          </Card>

          {/* Inventory & Coins */}
          <InventoryCoins
            inventory={inventory}
            coins={coins}
            onInventoryChange={(inv) => handleUpdateCharacter({ inventory: inv })}
            onCoinsChange={(c) => handleUpdateCharacter({ coins: c })}
            readOnly={effectiveReadOnly}
          />

          {/* Features */}
          <Card className="parchment">
            <CardHeader><CardTitle className="font-cinzel text-primary flex items-center gap-2"><Sparkles className="w-5 h-5" />Habilidades & Traits</CardTitle></CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-4 pr-4">
                  {raceData && (
                    <div>
                      <h4 className="font-semibold text-primary mb-2">{raceData.name} Traits</h4>
                      <div className="space-y-2">
                        {raceData.traits.map((trait, i) => {
                          const [title, ...desc] = trait.split(': ');
                          return (
                            <div key={i} className="p-2 rounded bg-muted/30">
                              <p className="font-medium text-sm">{title}</p>
                              {desc.length > 0 && <p className="text-xs text-muted-foreground">{desc.join(': ')}</p>}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  {character.classes.map((cl, idx) => {
                    const clData = characterClasses[cl.className.toLowerCase()];
                    if (!clData) return null;
                    return (
                      <div key={idx}>
                        <h4 className="font-semibold text-primary mb-2">{clData.name} Features</h4>
                        <div className="space-y-2">
                          {clData.features.filter(f => f.level <= cl.level).map((feature, i) => (
                            <div key={i} className="p-2 rounded bg-muted/30">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">Nv. {feature.level}</Badge>
                                <p className="font-medium text-sm">{feature.title}</p>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">{feature.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                  {(displayCharacter.feats.length > 0 || bgData?.feat) && (
                    <div>
                      <h4 className="font-semibold text-primary mb-2">Feats</h4>
                      <div className="space-y-2">
                        {bgData?.feat && (
                          <div className="p-2 rounded bg-primary/10 border border-primary/30">
                            <p className="font-medium text-sm">{bgData.feat}</p>
                          </div>
                        )}
                        {displayCharacter.feats.map((featName, i) => (
                          <div key={i} className="p-2 rounded bg-muted/30">
                            <p className="font-medium text-sm">{featName}</p>
                            <p className="text-xs text-muted-foreground">{feats[featName]?.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {character.backgroundStory !== undefined && (
            <Card className="parchment">
              <CardHeader><CardTitle className="font-cinzel text-primary">História</CardTitle></CardHeader>
              <CardContent>
                {!effectiveReadOnly ? (
                  <Textarea
                  value={displayCharacter.backgroundStory || ''}
                  onChange={(e) => handleUpdateCharacter({ backgroundStory: e.target.value })}
                    className="min-h-[150px] md:min-h-[120px] resize-none p-4 md:p-3"
                  />
                ) : (
                  <p className="text-muted-foreground whitespace-pre-wrap">{character.backgroundStory}</p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </motion.div>
  );
}
