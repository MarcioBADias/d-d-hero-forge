import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Character } from '@/types/character';
import { Upload, User } from 'lucide-react';

interface StepBasicInfoProps {
  character: Partial<Character>;
  updateCharacter: (updates: Partial<Character>) => void;
}

export function StepBasicInfo({ character, updateCharacter }: StepBasicInfoProps) {
  const levels = Array.from({ length: 20 }, (_, i) => i + 1);

  return (
    <div className="space-y-6">
      {/* Character Name */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-lg font-cinzel text-primary">
          Nome do Personagem
        </Label>
        <Input
          id="name"
          placeholder="Digite o nome do seu herói..."
          value={character.name || ''}
          onChange={(e) => updateCharacter({ name: e.target.value })}
          className="text-lg bg-background/50"
        />
      </div>

      {/* Level Selector */}
      <div className="space-y-2">
        <Label htmlFor="level" className="text-lg font-cinzel text-primary">
          Nível Inicial
        </Label>
        <Select
          value={character.level?.toString() || '1'}
          onValueChange={(value) => updateCharacter({ level: parseInt(value) })}
        >
          <SelectTrigger className="w-full md:w-48 bg-background/50">
            <SelectValue placeholder="Selecione o nível" />
          </SelectTrigger>
          <SelectContent>
            {levels.map((level) => (
              <SelectItem key={level} value={level.toString()}>
                Nível {level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">
          Bônus de Proficiência: +{Math.ceil((character.level || 1) / 4) + 1}
        </p>
      </div>

      {/* Character Image */}
      <div className="space-y-2">
        <Label className="text-lg font-cinzel text-primary">
          Imagem do Personagem (opcional)
        </Label>
        <div className="flex flex-col md:flex-row gap-4 items-start">
          <div className="w-32 h-32 rounded-lg border-2 border-dashed border-border bg-muted/30 flex items-center justify-center overflow-hidden">
            {character.imageUrl ? (
              <img
                src={character.imageUrl}
                alt="Character"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-12 h-12 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1 space-y-2">
            <Input
              type="url"
              placeholder="Cole a URL da imagem..."
              value={character.imageUrl || ''}
              onChange={(e) => updateCharacter({ imageUrl: e.target.value })}
              className="bg-background/50"
            />
            <p className="text-xs text-muted-foreground">
              Cole a URL de uma imagem para usar como retrato do personagem
            </p>
          </div>
        </div>
      </div>

      {/* Preview Card */}
      {character.name && (
        <div className="mt-8 p-4 rounded-lg bg-background/30 border border-border">
          <h3 className="font-cinzel text-primary text-xl mb-2">Prévia</h3>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
              {character.imageUrl ? (
                <img src={character.imageUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <User className="w-8 h-8 text-muted-foreground" />
              )}
            </div>
            <div>
              <p className="text-lg font-semibold">{character.name}</p>
              <p className="text-muted-foreground">Nível {character.level || 1}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
