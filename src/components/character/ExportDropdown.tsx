import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Download, FileText, FileJson, Loader2, Sparkles } from 'lucide-react';
import { Character } from '@/types/character';
import { exportToPDF, exportToFoundryJSON } from '@/utils/characterExport';
import { toast } from 'sonner';

interface ExportDropdownProps {
  character: Character;
  variant?: 'default' | 'icon';
}

export function ExportDropdown({ character, variant = 'default' }: ExportDropdownProps) {
  const [isExporting, setIsExporting] = useState<'pdf' | 'json' | null>(null);

  const handleExportPDF = async () => {
    setIsExporting('pdf');
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Small delay for animation
      exportToPDF(character);
      toast.success('PDF exportado com sucesso!', {
        description: `${character.name}_sheet.pdf`,
      });
    } catch (error) {
      toast.error('Erro ao exportar PDF');
      console.error(error);
    } finally {
      setIsExporting(null);
    }
  };

  const handleExportJSON = async () => {
    setIsExporting('json');
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      exportToFoundryJSON(character);
      toast.success('JSON exportado com sucesso!', {
        description: `${character.name}_foundry.json`,
      });
    } catch (error) {
      toast.error('Erro ao exportar JSON');
      console.error(error);
    } finally {
      setIsExporting(null);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size={variant === 'icon' ? 'icon' : 'default'}
          className="group relative overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary/20 to-arcane/20 opacity-0 group-hover:opacity-100 transition-opacity"
            initial={false}
          />
          <Download className="w-4 h-4" />
          {variant === 'default' && <span className="ml-2">Exportar</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-56 bg-card/95 backdrop-blur-sm border-primary/20"
      >
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <DropdownMenuItem 
              onClick={handleExportPDF}
              disabled={!!isExporting}
              className="cursor-pointer group"
            >
              <motion.div 
                className="flex items-center gap-3 w-full"
                whileHover={{ x: 4 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {isExporting === 'pdf' ? (
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                ) : (
                  <div className="relative">
                    <FileText className="w-5 h-5 text-red-400" />
                    <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-medium">Exportar PDF</p>
                  <p className="text-xs text-muted-foreground">Ficha oficial D&D 5e</p>
                </div>
              </motion.div>
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              onClick={handleExportJSON}
              disabled={!!isExporting}
              className="cursor-pointer group"
            >
              <motion.div 
                className="flex items-center gap-3 w-full"
                whileHover={{ x: 4 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {isExporting === 'json' ? (
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                ) : (
                  <div className="relative">
                    <FileJson className="w-5 h-5 text-yellow-400" />
                    <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-medium">Exportar Foundry</p>
                  <p className="text-xs text-muted-foreground">JSON compatível com Foundry VTT</p>
                </div>
              </motion.div>
            </DropdownMenuItem>
          </motion.div>
        </AnimatePresence>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
