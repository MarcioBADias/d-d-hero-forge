import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Shield, Skull, Plus, Minus, RotateCcw } from 'lucide-react';
import { DeathSaves } from '@/types/character';
import { cn } from '@/lib/utils';

interface HpTrackerProps {
  maxHp: number;
  currentHp: number;
  tempHp: number;
  deathSaves: DeathSaves;
  onHpChange: (current: number, temp: number) => void;
  onDeathSavesChange: (saves: DeathSaves) => void;
  readOnly?: boolean;
}

export function HpTracker({
  maxHp,
  currentHp,
  tempHp,
  deathSaves,
  onHpChange,
  onDeathSavesChange,
  readOnly = false,
}: HpTrackerProps) {
  const [damageInput, setDamageInput] = useState('');
  const [healInput, setHealInput] = useState('');
  const [tempInput, setTempInput] = useState('');

  const hpPercentage = Math.max(0, (currentHp / maxHp) * 100);
  const isDying = currentHp <= 0 && deathSaves.failures < 3;
  const isDead = deathSaves.failures >= 3;
  const isStabilized = currentHp === 0 && deathSaves.successes >= 3;

  const applyDamage = () => {
    const damage = parseInt(damageInput) || 0;
    if (damage <= 0) return;

    let remainingDamage = damage;
    let newTempHp = tempHp;
    let newCurrentHp = currentHp;

    // First, reduce temp HP
    if (newTempHp > 0) {
      if (remainingDamage >= newTempHp) {
        remainingDamage -= newTempHp;
        newTempHp = 0;
      } else {
        newTempHp -= remainingDamage;
        remainingDamage = 0;
      }
    }

    // Then, reduce current HP
    newCurrentHp = Math.max(0, newCurrentHp - remainingDamage);

    onHpChange(newCurrentHp, newTempHp);
    setDamageInput('');
  };

  const applyHeal = () => {
    const heal = parseInt(healInput) || 0;
    if (heal <= 0) return;

    const newHp = Math.min(maxHp, currentHp + heal);
    onHpChange(newHp, tempHp);
    
    // Reset death saves if healed from 0
    if (currentHp === 0 && newHp > 0) {
      onDeathSavesChange({ successes: 0, failures: 0 });
    }
    
    setHealInput('');
  };

  const addTempHp = () => {
    const temp = parseInt(tempInput) || 0;
    if (temp <= 0) return;
    // Temp HP doesn't stack, take the higher value
    onHpChange(currentHp, Math.max(tempHp, temp));
    setTempInput('');
  };

  const toggleDeathSave = (type: 'successes' | 'failures', index: number) => {
    if (readOnly || currentHp > 0) return;
    
    const currentValue = deathSaves[type];
    const newValue = index < currentValue ? index : index + 1;
    
    onDeathSavesChange({
      ...deathSaves,
      [type]: Math.min(3, newValue),
    });
  };

  const resetDeathSaves = () => {
    onDeathSavesChange({ successes: 0, failures: 0 });
  };

  return (
    <Card className={cn(
      "parchment transition-all duration-500",
      isDying && !isDead && "border-destructive/50 bg-destructive/10",
      isDead && "grayscale border-muted",
      isStabilized && "border-primary/50"
    )}>
      <CardHeader className="pb-2">
        <CardTitle className="font-cinzel text-primary flex items-center gap-2">
          <Heart className={cn("w-5 h-5", isDead && "text-muted-foreground")} />
          Pontos de Vida
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* HP Display */}
        <div className="flex items-center justify-center gap-4">
          <div className="text-center">
            <div className={cn(
              "text-5xl font-bold",
              currentHp > maxHp * 0.5 && "text-nature",
              currentHp <= maxHp * 0.5 && currentHp > maxHp * 0.25 && "text-accent-foreground",
              currentHp <= maxHp * 0.25 && currentHp > 0 && "text-blood",
              currentHp <= 0 && "text-destructive"
            )}>
              {currentHp}
            </div>
            <div className="text-muted-foreground text-sm">/ {maxHp}</div>
          </div>
          
          {tempHp > 0 && (
            <div className="text-center p-2 rounded bg-arcane/20 border border-arcane/30">
              <Shield className="w-4 h-4 mx-auto text-arcane" />
              <div className="text-xl font-bold text-arcane">+{tempHp}</div>
              <div className="text-xs text-muted-foreground">Temp</div>
            </div>
          )}
        </div>

        {/* HP Bar */}
        <div className="w-full h-4 bg-muted rounded-full overflow-hidden">
          <motion.div
            className={cn(
              "h-full",
              hpPercentage > 50 && "bg-nature",
              hpPercentage <= 50 && hpPercentage > 25 && "bg-accent",
              hpPercentage <= 25 && "bg-blood"
            )}
            initial={{ width: 0 }}
            animate={{ width: `${hpPercentage}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* HP Controls */}
        {!readOnly && currentHp > 0 && (
          <div className="grid grid-cols-3 gap-2">
            <div className="flex gap-1">
              <Input
                type="number"
                placeholder="Dano"
                value={damageInput}
                onChange={(e) => setDamageInput(e.target.value)}
                className="text-center"
              />
              <Button size="icon" variant="destructive" onClick={applyDamage}>
                <Minus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex gap-1">
              <Input
                type="number"
                placeholder="Cura"
                value={healInput}
                onChange={(e) => setHealInput(e.target.value)}
                className="text-center"
              />
              <Button size="icon" className="bg-nature hover:bg-nature/80" onClick={applyHeal}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex gap-1">
              <Input
                type="number"
                placeholder="Temp"
                value={tempInput}
                onChange={(e) => setTempInput(e.target.value)}
                className="text-center"
              />
              <Button size="icon" variant="secondary" onClick={addTempHp}>
                <Shield className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Death Saves - Only show when at 0 HP */}
        {currentHp <= 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-lg bg-muted/50 border border-border"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Skull className="w-5 h-5 text-destructive" />
                <span className="font-semibold">Testes de Morte</span>
              </div>
              {!readOnly && (
                <Button size="sm" variant="ghost" onClick={resetDeathSaves}>
                  <RotateCcw className="w-4 h-4" />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Successes */}
              <div>
                <p className="text-sm text-nature mb-2">Sucessos</p>
                <div className="flex gap-2">
                  {[0, 1, 2].map((i) => (
                    <button
                      key={`success-${i}`}
                      onClick={() => toggleDeathSave('successes', i)}
                      disabled={readOnly}
                      className={cn(
                        "w-8 h-8 rounded-full border-2 transition-all",
                        i < deathSaves.successes
                          ? "bg-nature border-nature"
                          : "border-nature/50 hover:border-nature"
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* Failures */}
              <div>
                <p className="text-sm text-destructive mb-2">Falhas</p>
                <div className="flex gap-2">
                  {[0, 1, 2].map((i) => (
                    <button
                      key={`failure-${i}`}
                      onClick={() => toggleDeathSave('failures', i)}
                      disabled={readOnly}
                      className={cn(
                        "w-8 h-8 rounded-full border-2 transition-all",
                        i < deathSaves.failures
                          ? "bg-destructive border-destructive"
                          : "border-destructive/50 hover:border-destructive"
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>

            {isDead && (
              <p className="text-center text-destructive font-bold mt-4">
                ☠️ MORTO ☠️
              </p>
            )}
            {isStabilized && (
              <p className="text-center text-primary font-bold mt-4">
                💫 Estabilizado
              </p>
            )}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
