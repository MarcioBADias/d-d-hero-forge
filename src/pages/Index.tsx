import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sword, Shield, BookOpen, Users, Sparkles, LogIn, User, Scroll, Wand2 } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  const features = [
    { icon: BookOpen, color: 'text-primary', title: 'Regras 2024', desc: 'Todas as classes, raças e backgrounds atualizados para as novas regras de D&D 5e 2024.' },
    { icon: Sparkles, color: 'text-arcane', title: 'Atributos Automáticos', desc: 'Bônus de atributos de backgrounds e feats são aplicados automaticamente.' },
    { icon: Sword, color: 'text-blood', title: 'Multiclasse', desc: 'Suporte completo para multiclasse com validação de pré-requisitos.' },
    { icon: Shield, color: 'text-nature', title: 'Exportação PDF/JSON', desc: 'Exporte sua ficha como PDF oficial ou JSON para Foundry VTT.' },
    { icon: Wand2, color: 'text-arcane', title: 'Sistema de Magias', desc: 'Seleção completa de magias por classe com slots e descrições.' },
    { icon: Users, color: 'text-primary', title: 'Compartilhamento', desc: 'Salve seus personagens e compartilhe com outros jogadores.' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-cinzel text-primary">⚔️ D&D 5e Creator</h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => navigate('/compendium')} className="hidden sm:flex gap-2">
              <BookOpen className="w-4 h-4" />
              Compêndio
            </Button>
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
            ) : user ? (
              <Button variant="outline" onClick={() => navigate('/dashboard')}>
                <Scroll className="w-4 h-4 mr-2" />
                Meus Personagens
              </Button>
            ) : (
              <Button variant="outline" onClick={() => setShowAuth(true)}>
                <LogIn className="w-4 h-4 mr-2" />
                Entrar
              </Button>
            )}
          </div>
        </div>
      </header>

      <section className="container mx-auto px-4 py-16 text-center">
        <motion.div className="max-w-3xl mx-auto" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-4xl md:text-6xl font-cinzel text-primary mb-4">Crie seu Aventureiro</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Criador de personagens D&D 5e com as regras de 2024. Crie, salve e compartilhe suas fichas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="btn-d20 text-lg px-8" onClick={() => navigate('/create')}>
              <Sword className="w-5 h-5 mr-2" />
              Criar Personagem
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/compendium')}>
              <BookOpen className="w-5 h-5 mr-2" />
              Explorar Compêndio
            </Button>
          </div>
        </motion.div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((feature) => (
            <Card key={feature.title} className="parchment h-full hover:shadow-lg transition-all group">
              <CardHeader>
                <feature.icon className={`w-10 h-10 ${feature.color} mb-2 group-hover:scale-110 transition-transform`} />
                <CardTitle className="font-cinzel">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.desc}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 text-center">
        <Card className="parchment max-w-2xl mx-auto">
          <CardContent className="p-8">
            <h3 className="text-2xl font-cinzel text-primary mb-4">Pronto para sua aventura?</h3>
            <p className="text-muted-foreground mb-6">Comece criando seu personagem agora!</p>
            <Button size="lg" className="btn-d20" onClick={() => navigate('/create')}>
              <Sword className="w-5 h-5 mr-2" />
              Começar Agora
            </Button>
          </CardContent>
        </Card>
      </section>

      <AuthModal open={showAuth} onOpenChange={setShowAuth} />
    </div>
  );
};

export default Index;
