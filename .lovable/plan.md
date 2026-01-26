
# 🎲 D&D 5e Character Creator - Regras 2024

## Visão Geral
Aplicação web responsiva para criar, gerenciar e exportar personagens de D&D 5e usando as regras de 2024. Interface Dark Fantasy com tema medieval, pergaminhos e cores douradas.

---

## 🧙‍♂️ Fluxo de Criação de Personagem

### Etapa 1: Informações Básicas
- Campo para **nome do personagem**
- Seletor de **nível inicial** (1-20)
- Upload de **imagem do personagem** (opcional)

### Etapa 2: Background
- Lista de backgrounds disponíveis (Acolyte, Artisan, Charlatan, etc.)
- Ao selecionar, mostra: habilidades, proficiências, feat bônus e equipamento
- **Bônus de atributos aplicados automaticamente**
- Área de texto para escrever a história/descrição do personagem

### Etapa 3: Raça
- Seleção entre todas as raças (Aasimar, Dragonborn, Dwarf, Elf, etc.)
- Visualização de traits, velocidade, tamanho e habilidades raciais
- Opções especiais por raça (ex: Draconic Ancestry para Dragonborn)

### Etapa 4: Classe Principal + Multiclasse
- Seleção da classe principal com descrição completa
- Visualização da progressão de features por nível
- **Sistema de multiclasse**: adicionar segunda/terceira classe com distribuição de níveis
- Validação de pré-requisitos para multiclasse

### Etapa 5: Atributos
- **Duas opções de distribuição**:
  - **Standard Array**: Distribuir 8, 10, 12, 13, 14, 15 nos 6 atributos
  - **Point Buy**: 27 pontos com custos (8=0, 9=1, 10=2, 11=3, 12=4, 13=5, 14=7, 15=9)
- Visualização em tempo real dos modificadores
- **Bônus automáticos** de background e feats aplicados visualmente

### Etapa 6: Feats & Magias
- Seleção de feats disponíveis por nível (Origin Feats, General Feats, etc.)
- Para classes conjuradoras: **sistema completo de magias**
  - Lista de cantrips e spells por nível
  - Slots de magia por nível de personagem
  - Descrições e componentes de cada magia

---

## 📜 Ficha do Personagem

### Visualização Completa
- Layout estilo ficha de D&D com todos os campos preenchidos
- Seções: Atributos, Saves, Skills, HP, AC, Iniciativa, Velocidade
- Lista de Features de classe e raça
- Equipamento e inventário
- Magias conhecidas e slots

### ⬆️ Sistema de Level Up
- Botão de "power up" ao lado do nível
- Popup com opções do novo nível:
  - Novas features de classe
  - Aumento de HP
  - Novos slots de magia
  - Feats (em níveis específicos)
  - Spell selection para conjuradores

### Exportações
- **Download PDF**: Formato oficial da ficha de D&D 5e
- **Export JSON para Foundry VTT**: Seguindo o modelo fornecido, compatível para importação direta

---

## 📚 Compêndio de Referência

### Seção de Classes
- Todas as 13+ classes com descrições detalhadas
- Tabela de progressão por nível
- Subclasses e features
- Spell lists por classe

### Seção de Raças
- Todas as raças com traits completos
- Opções de lineage e variantes

### Seção de Feats
- Categorias: Origin Feats, General Feats, Fighting Style Feats
- Pré-requisitos e descrições
- Bônus de atributos destacados

### Seção de Backgrounds
- Todos os backgrounds com detalhes
- Proficiências, feats e equipamento

---

## 👤 Sistema de Contas

### Funcionalidades de Usuário
- Registro e login (email/senha)
- Perfil personalizável (nome de usuário, avatar, tema)
- Dashboard com lista de personagens salvos

### Compartilhamento
- Gerar link público para compartilhar personagem
- Opção de "read-only" ou "clonable" (outros podem copiar)
- Visualização de personagens compartilhados por outros

### Modo Visitante
- Criar personagem sem conta
- Opção de salvar localmente (localStorage)
- Prompt para criar conta ao tentar exportar

---

## 📱 Design Responsivo

### Desktop
- Layout em colunas com sidebar de navegação
- Ficha completa em visualização expandida
- Compêndio com busca e filtros laterais

### Mobile
- Interface step-by-step para criação
- Navegação bottom tabs
- Ficha otimizada para scroll vertical
- Gestos de swipe entre seções

---

## 🛠️ Tecnologias

### Frontend
- React + TypeScript + Tailwind CSS
- Tema Dark Fantasy customizado
- Componentes shadcn/ui estilizados

### Backend (Lovable Cloud)
- Autenticação de usuários
- Banco de dados para personagens e perfis
- Storage para imagens de personagem

### Exportação
- Biblioteca para geração de PDF
- JSON formatter para Foundry VTT

