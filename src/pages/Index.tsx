import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sword, Shield, BookOpen, Users, Sparkles, LogIn, User, Scroll } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  const handleCreateCharacter = () => {
    navigate('/create');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-cinzel text-primary">
            ⚔️ D&D 5e Creator
          </h1>
          
          <div className="flex items-center gap-2">
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
            ) : user ? (
              <>
                <Button variant="outline" onClick={() => navigate('/dashboard')}>
                  <Scroll className="w-4 h-4 mr-2" />
                  Meus Personagens
                </Button>
                <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
                  <User className="w-5 h-5" />
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={() => setShowAuth(true)}>
                <LogIn className="w-4 h-4 mr-2" />
                Entrar
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-cinzel text-primary mb-4 animate-fade-in">
            Crie seu Aventureiro
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Criador de personagens D&D 5e com as regras de 2024. 
            Crie, salve e compartilhe suas fichas.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="btn-d20 text-lg px-8" onClick={handleCreateCharacter}>
              <Sword className="w-5 h-5 mr-2" />
              Criar Personagem
            </Button>
            {!user && (
              <Button size="lg" variant="outline" onClick={() => setShowAuth(true)}>
                <Shield className="w-5 h-5 mr-2" />
                Criar Conta para Salvar
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card className="parchment">
            <CardHeader>
              <BookOpen className="w-10 h-10 text-primary mb-2" />
              <CardTitle className="font-cinzel">Regras 2024</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Todas as classes, raças e backgrounds atualizados para as novas regras de D&D 5e 2024.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="parchment">
            <CardHeader>
              <Sparkles className="w-10 h-10 text-arcane mb-2" />
              <CardTitle className="font-cinzel">Atributos Automáticos</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Bônus de atributos de backgrounds e feats são aplicados automaticamente. Point Buy ou Standard Array.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="parchment">
            <CardHeader>
              <Sword className="w-10 h-10 text-blood mb-2" />
              <CardTitle className="font-cinzel">Multiclasse</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Suporte completo para multiclasse com validação de pré-requisitos e distribuição de níveis.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="parchment">
            <CardHeader>
              <Shield className="w-10 h-10 text-nature mb-2" />
              <CardTitle className="font-cinzel">Exportação</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Exporte sua ficha como JSON para Foundry VTT ou PDF no formato oficial de D&D.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="parchment">
            <CardHeader>
              <Users className="w-10 h-10 text-primary mb-2" />
              <CardTitle className="font-cinzel">Compartilhamento</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Crie uma conta para salvar seus personagens e compartilhar com outros jogadores.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="parchment">
            <CardHeader>
              <Scroll className="w-10 h-10 text-arcane mb-2" />
              <CardTitle className="font-cinzel">Level Up</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Sistema de level up integrado na ficha com seleção de novas habilidades e magias.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <Card className="parchment max-w-2xl mx-auto">
          <CardContent className="p-8">
            <h3 className="text-2xl font-cinzel text-primary mb-4">
              Pronto para sua aventura?
            </h3>
            <p className="text-muted-foreground mb-6">
              Comece criando seu personagem agora. Você pode criar sem conta e salvar depois!
            </p>
            <Button size="lg" className="btn-d20" onClick={handleCreateCharacter}>
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
