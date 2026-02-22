import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Coins, Package } from 'lucide-react';
import { Coins as CoinsType } from '@/types/character';

interface InventoryCoinsProps {
  inventory: string;
  coins: CoinsType;
  onInventoryChange: (inventory: string) => void;
  onCoinsChange: (coins: CoinsType) => void;
  readOnly?: boolean;
}

const coinLabels: { key: keyof CoinsType; label: string; color: string }[] = [
  { key: 'pp', label: 'PP', color: 'text-slate-300' },
  { key: 'gp', label: 'GP', color: 'text-yellow-500' },
  { key: 'ep', label: 'EP', color: 'text-blue-300' },
  { key: 'sp', label: 'SP', color: 'text-gray-400' },
  { key: 'cp', label: 'CP', color: 'text-orange-600' },
];

export function InventoryCoins({
  inventory,
  coins,
  onInventoryChange,
  onCoinsChange,
  readOnly = false,
}: InventoryCoinsProps) {
  const handleCoinChange = (key: keyof CoinsType, value: string) => {
    const numValue = parseInt(value) || 0;
    onCoinsChange({
      ...coins,
      [key]: Math.max(0, numValue),
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Coins */}
      <Card className="parchment">
        <CardHeader className="pb-2">
          <CardTitle className="font-cinzel text-primary flex items-center gap-2 text-lg">
            <Coins className="w-5 h-5" />
            Moedas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-2">
            {coinLabels.map(({ key, label, color }) => (
              <div key={key} className="text-center">
                <Label className={`text-xs font-bold ${color}`}>{label}</Label>
                {!readOnly ? (
                  <Input
                    type="number"
                    value={coins[key]}
                    onChange={(e) => handleCoinChange(key, e.target.value)}
                    className="text-center text-sm h-8 mt-1"
                    min={0}
                    inputMode="numeric"
                  />
                ) : (
                  <p className="text-center text-sm h-8 mt-1 flex items-center justify-center">{coins[key]}</p>
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground text-center mt-2">
            Total: {(coins.pp * 10 + coins.gp + coins.ep * 0.5 + coins.sp * 0.1 + coins.cp * 0.01).toFixed(2)} GP
          </p>
        </CardContent>
      </Card>

      {/* Inventory */}
      <Card className="parchment">
        <CardHeader className="pb-2">
          <CardTitle className="font-cinzel text-primary flex items-center gap-2 text-lg">
            <Package className="w-5 h-5" />
            Inventário
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!readOnly ? (
            <Textarea
              value={inventory}
              onChange={(e) => onInventoryChange(e.target.value)}
              placeholder="Liste seus itens aqui...&#10;- Espada Longa&#10;- Cota de Malha&#10;- Mochila"
              className="min-h-[150px] md:min-h-[120px] resize-none p-4 md:p-3"
              autoFocus={false}
            />
          ) : (
            <p className="text-muted-foreground whitespace-pre-wrap text-sm">{inventory || 'Nenhum item no inventário'}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
