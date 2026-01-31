import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { armors, shields, equipment, Armor, Equipment } from '@/data/equipment';
import { Plus, X } from 'lucide-react';

interface EquipmentModalProps {
  selectedEquipment: string[];
  onAddEquipment: (equipmentName: string) => void;
  onRemoveEquipment: (equipmentName: string) => void;
}

type Shield = typeof shields[0];
type EquipmentItem = Armor | Equipment | Shield;

export function EquipmentModal({ selectedEquipment, onAddEquipment, onRemoveEquipment }: EquipmentModalProps) {
  const [open, setOpen] = useState(false);

  const isSelected = (name: string) => selectedEquipment.includes(name);

  const handleToggle = (name: string) => {
    if (isSelected(name)) {
      onRemoveEquipment(name);
    } else {
      onAddEquipment(name);
    }
  };

  const getItemName = (item: EquipmentItem): string => {
    if ('Item' in item) {
      return item.Item;
    }
    return item.name;
  };

  const renderEquipmentCard = (item: EquipmentItem, type: string) => {
    const itemName = getItemName(item);
    const selected = isSelected(itemName);
    return (
      <Card
        key={itemName}
        className={`p-4 cursor-pointer transition ${
          selected ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' : 'hover:border-gray-400'
        }`}
        onClick={() => handleToggle(itemName)}
      >
        <div className="flex items-start justify-between mb-2">
          <div>
            <h4 className="font-semibold">{itemName}</h4>
            <Badge variant="outline" className="text-xs mt-1">{type}</Badge>
          </div>
          {selected && <X className="w-5 h-5 text-blue-600" />}
        </div>

        <div className="space-y-1 text-sm text-muted-foreground">
          {('weight' in item) && item.weight && <p><span className="font-medium">Weight:</span> {item.weight}</p>}
          {('Weight' in item) && item.Weight && <p><span className="font-medium">Weight:</span> {item.Weight}</p>}
          {('cost' in item) && item.cost && <p><span className="font-medium">Cost:</span> {item.cost}</p>}
          {('Cost' in item) && item.Cost && <p><span className="font-medium">Cost:</span> {item.Cost}</p>}
          {('acBonus' in item) && <p><span className="font-medium">AC Bonus:</span> +{item.acBonus}</p>}
          {('acBase' in item) && <p><span className="font-medium">AC:</span> {item.acBase}</p>}
        </div>
      </Card>
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Adicionar Equipamento
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="font-cinzel">Selecionar Equipamento</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="armor" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="armor">Armaduras</TabsTrigger>
            <TabsTrigger value="shield">Escudos</TabsTrigger>
            <TabsTrigger value="gear">Equipamento</TabsTrigger>
          </TabsList>

          <TabsContent value="armor">
            <ScrollArea className="h-[400px] w-full rounded-md border p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-4">
                {armors.map((armor) => renderEquipmentCard(armor, armor.category))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="shield">
            <ScrollArea className="h-[400px] w-full rounded-md border p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-4">
                {shields.map((shield) => renderEquipmentCard(shield as EquipmentItem, 'Shield'))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="gear">
            <ScrollArea className="h-[400px] w-full rounded-md border p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-4">
                {equipment.map((item) => renderEquipmentCard(item, item.Category))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        {selectedEquipment.length > 0 && (
          <div className="mt-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200">
            <p className="text-sm font-medium mb-2">Selecionado ({selectedEquipment.length}):</p>
            <div className="flex flex-wrap gap-2">
              {selectedEquipment.map((item) => (
                <Badge key={item} variant="default" className="cursor-pointer" onClick={() => handleToggle(item)}>
                  {item}
                  <X className="w-3 h-3 ml-1" />
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
