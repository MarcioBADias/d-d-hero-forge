import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { useAuth } from '@/contexts/AuthContext';
import { useCharacters } from '@/hooks/useCharacters';
import { AuthModal } from '@/components/auth/AuthModal';
import { ChevronLeft, ChevronRight, Scroll, Sword, Shield, Sparkles, Dices, BookOpen, Save, Home, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const steps = [
  { id: 1, name: 'Básico', icon: Scroll },
  { id: 2, name: 'Background', icon: BookOpen },
  { id: 3, name: 'Raça', icon: Sparkles },
  { id: 4, name: 'Classe', icon: Sword },
  { id: 5, name: 'Atributos', icon: Dices },
  { id: 6, name: 'Feats & Magias', icon: Shield },
];

export function CharacterCreator() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { saveCharacter } = useCharacters();
  const [currentStep, setCurrentStep] = useState(1);
  const [character, setCharacter] = useState<Partial<Character>>(createEmptyCharacter());
  const [showSheet, setShowSheet] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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

  const handleSave = async () => {
    if (!user) {
      setShowAuth(true);
      return;
    }

    if (!character.name) {
      toast.error('Por favor, dê um nome ao seu personagem');
      return;
    }

    setIsSaving(true);
    try {
      await saveCharacter.mutateAsync(character);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (showSheet) {
    return (
      <div>
        <CharacterSheet 
          character={character as Character} 
          onEdit={() => setShowSheet(false)}
          onUpdateCharacter={updateCharacter}
        />
        {/* Save Button Floating */}
        <div className="fixed bottom-4 right-4 flex gap-2">
          <Button variant="outline" onClick={() => navigate('/')}>
            <Home className="w-4 h-4 mr-2" />
            Início
          </Button>
          <Button className="btn-d20" onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {user ? 'Salvar' : 'Salvar (criar conta)'}
          </Button>
        </div>
        <AuthModal open={showAuth} onOpenChange={setShowAuth} />
      </div>
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
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate('/')} className="gap-2">
              <Home className="w-4 h-4" />
              <span className="hidden md:inline">Início</span>
            </Button>
            <h1 className="text-xl md:text-2xl font-cinzel text-primary text-center flex-1">
              ⚔️ Criador de Personagem
            </h1>
            <Button 
              variant="outline" 
              onClick={handleSave} 
              disabled={isSaving || !character.name}
              className="gap-2"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span className="hidden md:inline">Salvar</span>
            </Button>
          </div>
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

      <AuthModal open={showAuth} onOpenChange={setShowAuth} />
    </div>
  );
}
