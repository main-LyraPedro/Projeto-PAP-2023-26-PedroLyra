# 🌱 EcoChat - Aplicação de Sustentabilidade

## 📋 Sobre o Projeto
EcoChat é uma aplicação web gamificada que promove hábitos sustentáveis através de um sistema de tarefas, ranking global e rede social ecológica. Os usuários completam missões diárias, semanais e mensais, ganham pontos, sobem de nível e competem com amigos.

## 🎯 Funcionalidades
- ✅ Sistema de autenticação (login/registro)
- ✅ Perfil de usuário com estatísticas
- ✅ Tarefas gamificadas (diárias, semanais, mensais)
- ✅ Sistema de pontos e níveis
- ✅ Ranking global em tempo real
- ✅ Sistema de amigos
- ✅ Chat bot para dicas sustentáveis

## 🔧 Tecnologias Utilizadas

### Backend
- **Flask** (Python) - Framework web
- **SQLAlchemy** - ORM para banco de dados
- **SQLite** - Banco de dados
- **Flask-CORS** - Gerenciamento de CORS

### Frontend
- **React** - Biblioteca JavaScript
- **TypeScript** - Tipagem estática
- **Vite** - Build tool
- **Tailwind CSS** - Estilização
- **Framer Motion** - Animações

## 🚀 API REST - Endpoints

### 🔐 Autenticação
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/login` | Autenticação de usuário |
| POST | `/api/register` | Registro de novo usuário |

### 👤 Perfil de Usuário
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/profile/<user_id>` | Buscar dados do perfil |
| POST | `/api/profile/update` | Atualizar nome e email |
| POST | `/api/profile/change-password` | Alterar senha |

### ✅ Tarefas
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/tasks/user/<user_id>` | Buscar tarefas do usuário |
| POST | `/api/tasks/complete` | Completar tarefa e ganhar pontos |
| POST | `/api/tasks/uncomplete` | Desmarcar tarefa |

### 🏆 Ranking
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/ranking` | Buscar ranking global ordenado por pontos |

### 👥 Amigos
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/friends/<user_id>` | Listar amigos aceitos |
| GET | `/api/friends/pending/<user_id>` | Listar pedidos pendentes |
| POST | `/api/friends/add` | Enviar pedido de amizade |
| POST | `/api/friends/accept` | Aceitar pedido |
| POST | `/api/friends/decline` | Recusar pedido |
| POST | `/api/friends/remove` | Remover amigo |

### 💬 Chat
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/chat` | Enviar mensagem ao bot |

## 📦 Exemplos de Respostas JSON

### Login Response
```json
{
  "sucesso": true,
  "mensagem": "Login OK!",
  "user": {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@email.com"
  }
}
```

### Perfil Response
```json
{
  "id": 1,
  "nome": "João Silva",
  "email": "joao@email.com",
  "pontos": 1820,
  "nivel": "Defensor Verde",
  "tarefas_completas": 47,
  "dias_ativos": 23,
  "amigos_count": 12,
  "proximo_nivel": 2000
}
```

### Tarefas Response
```json
[
  {
    "id": 1,
    "titulo": "Reciclar o lixo corretamente",
    "descricao": "Separe plástico, papel e vidro",
    "pontos": 5,
    "categoria": "daily",
    "dificuldade": "facil",
    "icone": "Recycle",
    "completada": false
  },
  {
    "id": 2,
    "titulo": "Usar bicicleta em vez de carro",
    "descricao": "Transporte sustentável",
    "pontos": 10,
    "categoria": "daily",
    "dificuldade": "media",
    "icone": "Leaf",
    "completada": true
  }
]
```

### Ranking Response
```json
[
  {
    "id": 1,
    "nome": "Ana Silva",
    "pontos": 2850,
    "nivel": "Eco Master",
    "tarefas_completas": 95,
    "posicao": 1
  },
  {
    "id": 2,
    "nome": "Carlos Santos",
    "pontos": 2640,
    "nivel": "Defensor Verde",
    "tarefas_completas": 78,
    "posicao": 2
  }
]
```

## 💾 Persistência de Dados

### Tipo
Banco de dados relacional **SQLite**

### Localização
`backend/ecochat.db`

### Modelos do Banco de Dados

#### Usuario
- `id` - Identificador único
- `nome` - Nome do usuário
- `email` - Email (único)
- `senha` - Hash da senha

#### UserStats
- `user_id` - Referência ao usuário
- `pontos` - Total de pontos acumulados
- `tarefas_completas` - Quantidade de tarefas completadas
- `dias_ativos` - Dias consecutivos ativos
- `nivel` - Nível atual (Eco Iniciante, Guardião Verde, etc.)

#### Tarefa
- `id` - Identificador único
- `titulo` - Nome da tarefa
- `descricao` - Descrição detalhada
- `pontos` - Pontos que a tarefa vale
- `categoria` - daily, weekly ou monthly
- `dificuldade` - facil, media ou dificil
- `icone` - Ícone visual

#### TarefaUsuario
- `user_id` - Quem completou
- `tarefa_id` - Qual tarefa
- `completada_em` - Data e hora

#### Amizade
- `user_id` - Usuário que enviou
- `friend_id` - Usuário que recebeu
- `status` - pendente ou aceito

## 🏃 Como Executar o Projeto

### Pré-requisitos
- Python 3.8+
- Node.js 16+
- npm ou yarn

### 1. Backend (Flask)

```bash
# Navegar para a pasta do backend
cd backend

# Criar ambiente virtual (Windows)
python -m venv venv
venv\Scripts\activate

# Criar ambiente virtual (Linux/Mac)
python3 -m venv venv
source venv/bin/activate

# Instalar dependências
pip install -r requirements.txt

# Executar o servidor
python app.py
```

**Backend estará rodando em:** `http://127.0.0.1:5000`

### 2. Frontend (React + Vite)

```bash
# Navegar para a pasta do frontend
cd frontend

# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev
```

**Frontend estará rodando em:** `http://localhost:5173`

### 3. Acessar a Aplicação
Abra o navegador em `http://localhost:5173`

## 👥 Usuários de Teste

A aplicação cria automaticamente usuários de teste:

| Email | Senha |
|-------|-------|
| teste@eco.com | 123456 |
| maria@email.com | 123456 |
| joao@email.com | 123456 |
| ana@email.com | 123456 |
| pedro@gmail.com | 123456 |

## 🧪 Como Testar as Funcionalidades

### 1. Sistema de Login
- Acesse a aplicação
- Use um dos emails de teste
- Senha: `123456`

### 2. Completar Tarefas
- Vá para a aba "Tarefas"
- Clique em uma tarefa para completá-la
- Veja seus pontos aumentarem

### 3. Ver Ranking
- Vá para a aba "Ranking"
- Veja sua posição no ranking global
- O ranking atualiza automaticamente a cada 30 segundos

### 4. Adicionar Amigos
- Vá para a aba "Amigos"
- Digite o email de outro usuário de teste
- Faça login com outro usuário para aceitar o pedido

### 5. Ver Perfil
- Vá para a aba "Perfil"
- Veja suas estatísticas atualizadas
- Edite seu nome/email
- Altere sua senha

### 6. Testar Persistência
1. Complete algumas tarefas
2. Faça logout
3. Faça login novamente
4. Suas tarefas completadas e pontos estarão salvos

## 📁 Estrutura do Projeto

```
Projeto-PAP-2023-26-PedroLyra/
├── backend/
│   ├── app.py                 # API Flask principal
│   ├── ecochat.db            # Banco de dados SQLite
│   ├── requirements.txt       # Dependências Python
│   └── venv/                 # Ambiente virtual (ignorado no git)
│
├── frontend/
│   ├── src/
│   │   ├── components/        # Componentes React
│   │   │   ├── ChatArea.tsx
│   │   │   ├── ChatPage.tsx
│   │   │   ├── FriendsSection.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── ProfileSection.tsx
│   │   │   ├── RankingSection.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── TasksSection.tsx
│   │   │   └── ui/           # Componentes UI reutilizáveis
│   │   ├── styles/           # Estilos globais
│   │   ├── App.tsx           # Componente principal
│   │   └── main.tsx          # Ponto de entrada
│   ├── package.json          # Dependências Node.js
│   ├── vite.config.ts        # Configuração Vite
│   ├── tailwind.config.js    # Configuração Tailwind
│   └── node_modules/         # Dependências (ignorado no git)
│
├── .gitignore                # Arquivos ignorados pelo Git
└── README.md                 # Este arquivo
```

## 🎮 Sistema de Gamificação

### Níveis
- **Eco Iniciante** - 0-499 pontos
- **Guardião Verde** - 500-999 pontos
- **Defensor Verde** - 1000-1999 pontos
- **Eco Master** - 2000+ pontos

### Pontuação das Tarefas
- **Fácil** - 5-10 pontos
- **Média** - 10-25 pontos
- **Difícil** - 20-50 pontos

### Conquistas
- 🎯 Primeira Tarefa
- 🌿 Eco Iniciante (500 pontos)
- 📅 Semana Verde (7 dias ativos)
- 👥 Social (10 amigos)
- 🏆 Eco Master (2000 pontos)
- 🗓️ Mês Sustentável (30 dias ativos)

## 🔄 Sistema de Atualização de Tarefas

- **Diárias**: Resetam a cada 24 horas
- **Semanais**: Resetam toda segunda-feira
- **Mensais**: Resetam todo dia 1 do mês

Tarefas são escolhidas aleatoriamente sem repetição até que todas sejam completadas.

## 📝 Notas Importantes

- O backend cria automaticamente o banco de dados na primeira execução
- Todos os dados são persistidos localmente no SQLite
- A API não possui rate limiting (apenas para ambiente de desenvolvimento)
- CORS está habilitado para permitir comunicação entre frontend e backend

## 🐛 Troubleshooting

### Backend não inicia
```bash
# Certifique-se de que o ambiente virtual está ativo
# Reinstale as dependências
pip install -r requirements.txt
```

### Frontend não carrega
```bash
# Limpe o cache e reinstale
rm -rf node_modules
npm install
```

### Erro de CORS
- Verifique se o backend está rodando em `http://127.0.0.1:5000`
- Verifique se CORS está configurado no `app.py`

## 👨‍💻 Autor
**Pedro Lyra** - Projeto de Aptidão Profissional (PAP) 2023-2026

## 📅 Data
Janeiro 2026
