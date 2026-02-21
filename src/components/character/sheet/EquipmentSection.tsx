import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { armors, shields, equipment, Armor, hasArmorOrShield, calculateArmorAC } from '@/data/equipment';
import { magicItems, MagicItem } from '@/data/magicItems';
import { Package, Plus, X, ChevronDown, Shield as ShieldIcon, Sparkles, Wand2 } from 'lucide-react';

interface CustomEquipment {
  name: string;
  description: string;
  type: 'mundane' | 'magic' | 'custom';
}

interface EquipmentSectionProps {
  selectedEquipment: string[];
  customEquipment: CustomEquipment[];
  armorEquipStates: Record<string, boolean>;
  equippedArmor?: string;
  equippedShield?: string;
  dexModifier: number;
  onAddEquipment: (name: string, type: 'mundane' | 'magic' | 'custom', description?: string) => void;
  onRemoveEquipment: (name: string) => void;
  onToggleArmor: (name: string, equipped: boolean) => void;
  onEquipArmor: (armorName: string | undefined, ac: number) => void;
  onEquipShield: (shieldName: string | undefined, ac: number) => void;
  readOnly?: boolean;
}

export function EquipmentSection({
  selectedEquipment,
  customEquipment,
  armorEquipStates,
  equippedArmor,
  equippedShield,
  dexModifier,
  onAddEquipment,
  onRemoveEquipment,
  onToggleArmor,
  onEquipArmor,
  onEquipShield,
  readOnly = false,
}: EquipmentSectionProps) {
  const [addOpen, setAddOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('mundane');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  
  // Custom equipment form
  const [customName, setCustomName] = useState('');
  const [customDescription, setCustomDescription] = useState('');

  const toggleExpanded = (name: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  const handleAddCustom = () => {
    if (customName.trim()) {
      onAddEquipment(customName.trim(), 'custom', customDescription.trim());
      setCustomName('');
      setCustomDescription('');
      setAddOpen(false);
    }
  };

  const filteredMundane = [
    ...armors.map(a => ({ name: a.name, type: 'armor' as const, data: a })),
    ...shields.map(s => ({ name: s.name, type: 'shield' as const, data: s })),
    ...equipment.map(e => ({ name: e.Item, type: 'gear' as const, data: e })),
  ].filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedEquipment.includes(item.name)
  );

  const filteredMagic = magicItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedEquipment.includes(item.name)
  );

  const getItemInfo = (itemName: string): { type: 'armor' | 'shield' | 'magic' | 'mundane' | 'custom'; data?: any; custom?: CustomEquipment } => {
    const armor = armors.find(a => a.name === itemName);
    if (armor) return { type: 'armor', data: armor };
    
    const shield = shields.find(s => s.name === itemName);
    if (shield) return { type: 'shield', data: shield };
    
    const magic = magicItems.find(m => m.name === itemName);
    if (magic) return { type: 'magic', data: magic };

    const custom = customEquipment.find(c => c.name === itemName);
    if (custom) return { type: 'custom', custom };
    
    return { type: 'mundane' };
  };

  return (
    <Card className="parchment">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-cinzel text-primary flex items-center gap-2">
            <Package className="w-5 h-5" />
            Equipamento
          </CardTitle>
          {!readOnly && (
            <Dialog open={addOpen} onOpenChange={setAddOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Adicionar
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[80vh]">
                <DialogHeader>
                  <DialogTitle className="font-cinzel">Adicionar Equipamento</DialogTitle>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="mundane" className="gap-2">
                      <Package className="w-4 h-4" />
                      Mundano
                    </TabsTrigger>
                    <TabsTrigger value="magic" className="gap-2">
                      <Sparkles className="w-4 h-4" />
                      Mágico
                    </TabsTrigger>
                    <TabsTrigger value="custom" className="gap-2">
                      <Wand2 className="w-4 h-4" />
                      Criar
                    </TabsTrigger>
                  </TabsList>

                  <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md my-4"
                  />

                  <TabsContent value="mundane">
                    <ScrollArea className="h-[400px]">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pr-4">
                        {filteredMundane.map((item) => (
                          <div
                            key={item.name}
                            className="p-3 rounded-lg border border-border hover:border-primary cursor-pointer transition"
                            onClick={() => {
                              onAddEquipment(item.name, 'mundane');
                              setAddOpen(false);
                            }}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">{item.name}</p>
                                <Badge variant="outline" className="text-xs mt-1">
                                  {item.type === 'armor' ? (item.data as Armor).category : item.type}
                                </Badge>
                              </div>
                              {item.type === 'armor' && (
                                <p className="text-sm text-muted-foreground">CA {(item.data as Armor).acBase}</p>
                              )}
                              {item.type === 'shield' && (
                                <p className="text-sm text-muted-foreground">+{item.data.acBonus} CA</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="magic">
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-2 pr-4">
                        {filteredMagic.map((item) => (
                          <Collapsible key={item.name}>
                            <div className="p-3 rounded-lg border border-border hover:border-primary transition">
                              <div className="flex justify-between items-start">
                                <CollapsibleTrigger className="flex items-center gap-2 text-left flex-1">
                                  <ChevronDown className="w-4 h-4 transition-transform" />
                                  <div>
                                    <p className="font-medium">{item.name}</p>
                                    <div className="flex gap-2 mt-1">
                                      <Badge variant="outline" className="text-xs">{item.type}</Badge>
                                      <Badge 
                                        variant="secondary" 
                                        className={`text-xs ${
                                          item.rarity === 'Legendary' ? 'bg-orange-500/20 text-orange-600' :
                                          item.rarity === 'Very Rare' ? 'bg-purple-500/20 text-purple-600' :
                                          item.rarity === 'Rare' ? 'bg-blue-500/20 text-blue-600' :
                                          item.rarity === 'Uncommon' ? 'bg-green-500/20 text-green-600' :
                                          ''
                                        }`}
                                      >
                                        {item.rarity}
                                      </Badge>
                                      {item.attunement && (
                                        <Badge variant="outline" className="text-xs">Sintonia</Badge>
                                      )}
                                    </div>
                                  </div>
                                </CollapsibleTrigger>
                                <Button
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onAddEquipment(item.name, 'magic');
                                    setAddOpen(false);
                                  }}
                                >
                                  <Plus className="w-4 h-4" />
                                </Button>
                              </div>
                              <CollapsibleContent className="mt-2 pt-2 border-t text-sm text-muted-foreground">
                                {item.description}
                              </CollapsibleContent>
                            </div>
                          </Collapsible>
                        ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="custom">
                    <div className="space-y-4 p-4">
                      <div>
                        <Label htmlFor="custom-name">Nome do Item</Label>
                        <Input
                          id="custom-name"
                          value={customName}
                          onChange={(e) => setCustomName(e.target.value)}
                          placeholder="Ex: Espada do Rei Antigo"
                        />
                      </div>
                      <div>
                        <Label htmlFor="custom-desc">Descrição</Label>
                        <Textarea
                          id="custom-desc"
                          value={customDescription}
                          onChange={(e) => setCustomDescription(e.target.value)}
                          placeholder="Descreva as propriedades e efeitos do item..."
                          className="min-h-[150px]"
                        />
                      </div>
                      <Button onClick={handleAddCustom} className="w-full" disabled={!customName.trim()}>
                        Adicionar Item Personalizado
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {selectedEquipment.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">Nenhum equipamento</p>
        ) : (
          <div className="space-y-3">
            {selectedEquipment.map((itemName) => {
              const itemInfo = getItemInfo(itemName);
              const isExpanded = expandedItems.has(itemName);
              const isEquipped = armorEquipStates[itemName] ?? false;

              return (
                <div
                  key={itemName}
                  className={`p-3 rounded-lg border transition ${
                    (itemInfo.type === 'armor' || itemInfo.type === 'shield') && isEquipped
                      ? 'bg-primary/10 border-primary/30'
                      : itemInfo.type === 'magic'
                      ? 'bg-purple-500/5 border-purple-500/20'
                      : 'bg-background/30 border-border'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      {(itemInfo.type === 'armor' || itemInfo.type === 'shield') && (
                        <div className="flex items-center gap-2">
                          <Switch
                            id={`equip-armor-${itemName}`}
                            checked={isEquipped}
                            onCheckedChange={(checked) => {
                              if (itemInfo.type === 'armor') {
                                if (checked) {
                                  const ac = calculateArmorAC(itemInfo.data as Armor, dexModifier);
                                  onEquipArmor(itemName, ac);
                                } else {
                                  onEquipArmor(undefined, 10 + dexModifier);
                                }
                              } else if (itemInfo.type === 'shield') {
                                if (checked) {
                                  onEquipShield(itemName, itemInfo.data.acBonus);
                                } else {
                                  onEquipShield(undefined, 0);
                                }
                              }
                              onToggleArmor(itemName, checked);
                            }}
                            disabled={readOnly}
                          />
                          <Label htmlFor={`equip-armor-${itemName}`} className="text-xs text-muted-foreground font-medium">
                            {isEquipped ? '✓ Equipado' : 'Equipar'}
                          </Label>
                        </div>
                      )}
                      
                      <div 
                        className="flex-1 cursor-pointer"
                        onClick={() => (itemInfo.type === 'magic' || itemInfo.type === 'custom') && toggleExpanded(itemName)}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{itemName}</span>
                          {itemInfo.type === 'magic' && (
                            <Sparkles className="w-4 h-4 text-purple-500" />
                          )}
                          {itemInfo.type === 'armor' && (
                            <ShieldIcon className="w-4 h-4 text-primary" />
                          )}
                        </div>
                        {itemInfo.type === 'armor' && isEquipped && (
                          <p className="text-xs text-muted-foreground mt-1">
                            CA {calculateArmorAC(itemInfo.data as Armor, dexModifier)}
                          </p>
                        )}
                        {itemInfo.type === 'shield' && isEquipped && (
                          <p className="text-xs text-muted-foreground mt-1">
                            +{itemInfo.data.acBonus} CA
                          </p>
                        )}
                        {itemInfo.type === 'magic' && (
                          <div className="flex gap-2 mt-1">
                            <Badge 
                              variant="secondary" 
                              className={`text-xs ${
                                (itemInfo.data as MagicItem).rarity === 'Legendary' ? 'bg-orange-500/20 text-orange-600' :
                                (itemInfo.data as MagicItem).rarity === 'Very Rare' ? 'bg-purple-500/20 text-purple-600' :
                                (itemInfo.data as MagicItem).rarity === 'Rare' ? 'bg-blue-500/20 text-blue-600' :
                                (itemInfo.data as MagicItem).rarity === 'Uncommon' ? 'bg-green-500/20 text-green-600' :
                                ''
                              }`}
                            >
                              {(itemInfo.data as MagicItem).rarity}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {!readOnly && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveEquipment(itemName)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  {isExpanded && itemInfo.type === 'magic' && itemInfo.data && (
                    <div className="mt-3 pt-3 border-t text-sm text-muted-foreground">
                      {(itemInfo.data as MagicItem).description}
                    </div>
                  )}
                  {isExpanded && itemInfo.type === 'custom' && itemInfo.custom && (
                    <div className="mt-3 pt-3 border-t text-sm text-muted-foreground">
                      {itemInfo.custom.description || 'Sem descrição'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
