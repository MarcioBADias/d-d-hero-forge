import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Character, createEmptyCharacter } from '@/types/character';
import { StepBasicInfo } from './steps/StepBasicInfo';
import { StepBackground } from './steps/StepBackground';
import { StepRace } from './steps/StepRace';
import { StepClass } from './steps/StepClass';
import { StepAttributes } from './steps/StepAttributes';
import { StepFeatsSpells } from './steps/StepFeatsSpells';
import { CharacterSheet } from './sheet/CharacterSheet';
import { ChevronLeft, ChevronRight, Scroll, Sword, Shield, Sparkles, Dices, BookOpen } from 'lucide-react';

const steps = [
  { id: 1, name: 'Básico', icon: Scroll },
  { id: 2, name: 'Background', icon: BookOpen },
  { id: 3, name: 'Raça', icon: Sparkles },
  { id: 4, name: 'Classe', icon: Sword },
  { id: 5, name: 'Atributos', icon: Dices },
  { id: 6, name: 'Feats & Magias', icon: Shield },
];

export function CharacterCreator() {
  const [currentStep, setCurrentStep] = useState(1);
  const [character, setCharacter] = useState<Partial<Character>>(createEmptyCharacter());
  const [showSheet, setShowSheet] = useState(false);

  const updateCharacter = (updates: Partial<Character>) => {
    setCharacter((prev) => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowSheet(true);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (showSheet) {
    return (
      <CharacterSheet 
        character={character as Character} 
        onEdit={() => setShowSheet(false)}
        onUpdateCharacter={updateCharacter}
      />
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepBasicInfo character={character} updateCharacter={updateCharacter} />;
      case 2:
        return <StepBackground character={character} updateCharacter={updateCharacter} />;
      case 3:
        return <StepRace character={character} updateCharacter={updateCharacter} />;
      case 4:
        return <StepClass character={character} updateCharacter={updateCharacter} />;
      case 5:
        return <StepAttributes character={character} updateCharacter={updateCharacter} />;
      case 6:
        return <StepFeatsSpells character={character} updateCharacter={updateCharacter} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl md:text-3xl font-cinzel text-primary text-center">
            ⚔️ Criador de Personagem D&D 5e
          </h1>
          <p className="text-muted-foreground text-center text-sm mt-1">Regras 2024</p>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-center mb-8 overflow-x-auto pb-2">
          <div className="flex gap-2 md:gap-4">
            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(step.id)}
                  className={`
                    flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all
                    ${isActive ? 'bg-primary text-primary-foreground scale-105' : ''}
                    ${isCompleted ? 'bg-accent text-accent-foreground' : ''}
                    ${!isActive && !isCompleted ? 'bg-muted text-muted-foreground hover:bg-muted/80' : ''}
                  `}
                >
                  <Icon className="w-5 h-5 md:w-6 md:h-6" />
                  <span className="text-xs font-medium hidden md:block">{step.name}</span>
                  <span className="text-xs font-medium md:hidden">{step.id}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <Card className="parchment max-w-4xl mx-auto animate-fade-in">
          <CardHeader className="border-b border-border">
            <CardTitle className="font-cinzel text-primary flex items-center gap-2">
              {(() => {
                const StepIcon = steps[currentStep - 1].icon;
                return <StepIcon className="w-6 h-6" />;
              })()}
              Etapa {currentStep}: {steps[currentStep - 1].name}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {renderStep()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between max-w-4xl mx-auto mt-6 px-4">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </Button>
          
          <Button
            onClick={nextStep}
            className="btn-d20 gap-2"
          >
            {currentStep === 6 ? 'Ver Ficha' : 'Próximo'}
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
