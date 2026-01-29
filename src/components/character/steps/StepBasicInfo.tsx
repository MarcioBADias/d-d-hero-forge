import { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Character } from '@/types/character';
import { Upload, User, Link, ImagePlus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface StepBasicInfoProps {
  character: Partial<Character>;
  updateCharacter: (updates: Partial<Character>) => void;
}

export function StepBasicInfo({ character, updateCharacter }: StepBasicInfoProps) {
  const levels = Array.from({ length: 20 }, (_, i) => i + 1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imageMode, setImageMode] = useState<'upload' | 'url'>(character.imageUrl?.startsWith('data:') ? 'upload' : 'url');

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione uma imagem válida');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('A imagem deve ter no máximo 5MB');
      return;
    }

    setIsUploading(true);

    try {
      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        updateCharacter({ imageUrl: base64 });
        setIsUploading(false);
        toast.success('Imagem carregada com sucesso!');
      };
      reader.onerror = () => {
        setIsUploading(false);
        toast.error('Erro ao carregar imagem');
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setIsUploading(false);
      toast.error('Erro ao processar imagem');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const input = fileInputRef.current;
      if (input) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        input.files = dataTransfer.files;
        handleImageUpload({ target: input } as any);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

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
        
        <Tabs value={imageMode} onValueChange={(v) => setImageMode(v as 'upload' | 'url')} className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-xs">
            <TabsTrigger value="upload" className="gap-2">
              <Upload className="w-4 h-4" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="url" className="gap-2">
              <Link className="w-4 h-4" />
              URL
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="mt-4">
            <div className="flex flex-col md:flex-row gap-4 items-start">
              <div 
                className={`
                  w-32 h-32 rounded-lg border-2 border-dashed transition-colors cursor-pointer
                  flex items-center justify-center overflow-hidden
                  ${isUploading ? 'border-primary bg-primary/10' : 'border-border bg-muted/30 hover:border-primary/50'}
                `}
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                {isUploading ? (
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                ) : character.imageUrl ? (
                  <img
                    src={character.imageUrl}
                    alt="Character"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-2">
                    <ImagePlus className="w-8 h-8 text-muted-foreground mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground">Clique ou arraste</p>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
              <div className="flex-1 space-y-2">
                <Button 
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="w-full md:w-auto"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Escolher Imagem
                </Button>
                <p className="text-xs text-muted-foreground">
                  Formatos aceitos: JPG, PNG, GIF, WebP. Máximo 5MB.
                </p>
                {character.imageUrl && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => updateCharacter({ imageUrl: '' })}
                    className="text-destructive hover:text-destructive"
                  >
                    Remover imagem
                  </Button>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="url" className="mt-4">
            <div className="flex flex-col md:flex-row gap-4 items-start">
              <div className="w-32 h-32 rounded-lg border-2 border-dashed border-border bg-muted/30 flex items-center justify-center overflow-hidden">
                {character.imageUrl && !character.imageUrl.startsWith('data:') ? (
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
                  value={character.imageUrl?.startsWith('data:') ? '' : (character.imageUrl || '')}
                  onChange={(e) => updateCharacter({ imageUrl: e.target.value })}
                  className="bg-background/50"
                />
                <p className="text-xs text-muted-foreground">
                  Cole a URL de uma imagem para usar como retrato do personagem
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
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
