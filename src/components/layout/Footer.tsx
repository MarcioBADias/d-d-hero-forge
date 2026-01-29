import { Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/30 backdrop-blur-sm mt-auto">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
          <p className="flex items-center gap-1">
            Feito com <Heart className="w-4 h-4 text-blood fill-blood" /> por{' '}
            <span className="font-semibold text-primary">Mario Dias</span>
          </p>
          <p className="text-xs">
            D&D 5e Character Creator • Regras 2024
          </p>
        </div>
      </div>
    </footer>
  );
}
