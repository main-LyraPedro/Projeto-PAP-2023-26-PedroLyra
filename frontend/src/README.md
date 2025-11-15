# 🌿 EcoChat

EcoChat é um chatbot educativo voltado para sustentabilidade e consumo consciente, direcionado para jovens e estudantes interessados em meio ambiente e tecnologia.

## 🚀 Funcionalidades

- 💬 **Chat Interativo**: Converse com o assistente virtual sobre sustentabilidade
- 🏆 **Sistema de Ranking**: Compete com outros usuários e acompanhe seu progresso
- ✅ **Tarefas Ecológicas**: Complete desafios diários de sustentabilidade
- 👥 **Rede de Amigos**: Conecte-se com outros usuários eco-conscientes
- 👤 **Perfil Personalizado**: Acompanhe suas conquistas e estatísticas
- 🌓 **Tema Claro/Escuro**: Alterne entre temas conforme sua preferência

## 🛠️ Tecnologias Utilizadas

- **React 18** - Biblioteca JavaScript para interfaces
- **TypeScript** - Superset tipado do JavaScript
- **Vite** - Build tool rápida e moderna
- **Tailwind CSS v4** - Framework CSS utilitário
- **Motion (Framer Motion)** - Biblioteca de animações
- **Lucide React** - Ícones modernos
- **Sonner** - Notificações toast elegantes
- **shadcn/ui** - Componentes UI reutilizáveis
- **Radix UI** - Componentes acessíveis

## 📋 Pré-requisitos

Antes de começar, você precisa ter instalado em seu Linux:

- **Node.js** (versão 18 ou superior)
- **npm** ou **yarn** ou **pnpm**
- **Git**

### Instalando no Linux (Ubuntu/Debian)

```bash
# Instalar Node.js (via NodeSource)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verificar instalação
node --version
npm --version

# Instalar Git (se ainda não tiver)
sudo apt-get install git
```

### Instalando no Linux (Fedora/RHEL)

```bash
# Instalar Node.js
sudo dnf install nodejs

# Verificar instalação
node --version
npm --version

# Instalar Git (se ainda não tiver)
sudo dnf install git
```

### Instalando no Linux (Arch)

```bash
# Instalar Node.js
sudo pacman -S nodejs npm

# Verificar instalação
node --version
npm --version

# Instalar Git (se ainda não tiver)
sudo pacman -S git
```

## 🔧 Instalação e Configuração

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/ecochat.git
cd ecochat
```

### 2. Instale as dependências

```bash
npm install
```

Ou com yarn:
```bash
yarn install
```

Ou com pnpm:
```bash
pnpm install
```

### 3. Execute o projeto em modo desenvolvimento

```bash
npm run dev
```

O projeto estará rodando em: `http://localhost:3000`

## 📦 Build para Produção

Para criar a versão otimizada para produção:

```bash
npm run build
```

Para visualizar a build de produção localmente:

```bash
npm run preview
```

## 📁 Estrutura de Pastas

```
ecochat/
├── src/
│   ├── components/           # Componentes React
│   │   ├── ui/              # Componentes shadcn/ui
│   │   ├── figma/           # Componentes auxiliares
│   │   ├── ChatArea.tsx     # Área de chat
│   │   ├── ChatPage.tsx     # Página principal do chat
│   │   ├── FriendsSection.tsx    # Seção de amigos
│   │   ├── LoginPage.tsx    # Página de login/registro
│   │   ├── ProfileSection.tsx    # Perfil do usuário
│   │   ├── RankingSection.tsx    # Ranking de usuários
│   │   ├── Sidebar.tsx      # Barra lateral de navegação
│   │   └── TasksSection.tsx # Lista de tarefas
│   ├── styles/
│   │   └── globals.css      # Estilos globais e Tailwind
│   ├── App.tsx              # Componente principal
│   └── main.tsx             # Ponto de entrada
├── index.html               # HTML base
├── package.json             # Dependências do projeto
├── tsconfig.json            # Configuração TypeScript
├── vite.config.ts           # Configuração Vite
└── README.md                # Este arquivo
```

## 🔄 Próximos Passos - Integração com Backend

Para transformar este protótipo em uma aplicação completa com persistência de dados, você pode:

### Opção 1: Supabase (Recomendado para começar)

```bash
npm install @supabase/supabase-js
```

- Banco de dados PostgreSQL
- Autenticação integrada
- APIs REST automáticas
- Realtime subscriptions

### Opção 2: Firebase

```bash
npm install firebase
```

- Firestore para banco de dados
- Firebase Authentication
- Cloud Functions
- Hosting integrado

### Opção 3: Backend Customizado (Node.js)

```bash
npm install express mongoose
```

- Express.js para API REST
- MongoDB com Mongoose
- JWT para autenticação
- Controle total sobre o backend

## 🌍 Deploy

Opções de deploy recomendadas:

- **Vercel** - Ideal para aplicações React/Vite (deploy automático do GitHub)
- **Netlify** - Ótima integração com Git
- **GitHub Pages** - Gratuito para projetos públicos
- **Railway** - Para aplicações fullstack
- **Render** - Alternativa ao Heroku

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se livre para:

1. Fazer um Fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abrir um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 👨‍💻 Autor

Desenvolvido com 💚 para promover sustentabilidade e consumo consciente.

---

**EcoChat** - Construindo um futuro mais verde, uma conversa por vez! 🌱
