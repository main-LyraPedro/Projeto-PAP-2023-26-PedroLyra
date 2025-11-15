# 🔄 Guia de Migração - Figma Make para Projeto Local

Este guia mostra como organizar os arquivos do Figma Make na estrutura correta do projeto local.

## 📋 Passo a Passo

### 1. Criar Estrutura de Pastas

```bash
mkdir -p ~/projetos/ecochat
cd ~/projetos/ecochat

# Criar estrutura necessária
mkdir -p src/components/ui
mkdir -p src/components/figma
mkdir -p src/styles
mkdir -p public
```

### 2. Mapeamento de Arquivos

Copie os arquivos do Figma Make seguindo este mapeamento:

#### 📄 Arquivos Raiz

```
FIGMA MAKE                    →  PROJETO LOCAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

index.html                    →  index.html
package.json                  →  package.json
vite.config.ts                →  vite.config.ts
tsconfig.json                 →  tsconfig.json
tsconfig.node.json            →  tsconfig.node.json
.eslintrc.cjs                 →  .eslintrc.cjs
.gitignore                    →  .gitignore
README.md                     →  README.md
REQUIREMENTS.md               →  REQUIREMENTS.md
SETUP_GUIDE.md                →  SETUP_GUIDE.md
PROJECT_STRUCTURE.md          →  PROJECT_STRUCTURE.md
QUICK_START.md                →  QUICK_START.md
MIGRATION_GUIDE.md            →  MIGRATION_GUIDE.md
LICENSE                       →  LICENSE
setup.sh                      →  setup.sh
```

#### 📁 Pasta src/

```
FIGMA MAKE                    →  PROJETO LOCAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/src/main.tsx                 →  src/main.tsx
/App.tsx                      →  src/App.tsx
/styles/globals.css           →  src/styles/globals.css
```

#### 📁 Pasta src/components/

```
FIGMA MAKE                           →  PROJETO LOCAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/components/LoginPage.tsx            →  src/components/LoginPage.tsx
/components/ChatPage.tsx             →  src/components/ChatPage.tsx
/components/Sidebar.tsx              →  src/components/Sidebar.tsx
/components/ChatArea.tsx             →  src/components/ChatArea.tsx
/components/RankingSection.tsx       →  src/components/RankingSection.tsx
/components/TasksSection.tsx         →  src/components/TasksSection.tsx
/components/FriendsSection.tsx       →  src/components/FriendsSection.tsx
/components/ProfileSection.tsx       →  src/components/ProfileSection.tsx
```

#### 📁 Pasta src/components/ui/

```
FIGMA MAKE                           →  PROJETO LOCAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/components/ui/button.tsx            →  src/components/ui/button.tsx
/components/ui/input.tsx             →  src/components/ui/input.tsx
/components/ui/card.tsx              →  src/components/ui/card.tsx
/components/ui/avatar.tsx            →  src/components/ui/avatar.tsx
/components/ui/badge.tsx             →  src/components/ui/badge.tsx
/components/ui/progress.tsx          →  src/components/ui/progress.tsx
/components/ui/scroll-area.tsx       →  src/components/ui/scroll-area.tsx
/components/ui/switch.tsx            →  src/components/ui/switch.tsx
/components/ui/sonner.tsx            →  src/components/ui/sonner.tsx
/components/ui/checkbox.tsx          →  src/components/ui/checkbox.tsx
/components/ui/textarea.tsx          →  src/components/ui/textarea.tsx

...e todos os outros arquivos em /components/ui/*
```

#### 📁 Pasta src/components/figma/

```
FIGMA MAKE                           →  PROJETO LOCAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/components/figma/ImageWithFallback.tsx  →  src/components/figma/ImageWithFallback.tsx
```

### 3. Comando Automatizado (Linux)

Se você tem os arquivos do Figma Make em uma pasta, pode usar este script:

```bash
#!/bin/bash

# Definir pastas
FIGMA_DIR="/caminho/para/figma-make"
PROJECT_DIR="$HOME/projetos/ecochat"

# Criar estrutura
mkdir -p "$PROJECT_DIR/src/components/ui"
mkdir -p "$PROJECT_DIR/src/components/figma"
mkdir -p "$PROJECT_DIR/src/styles"
mkdir -p "$PROJECT_DIR/public"

# Copiar arquivos raiz
cp "$FIGMA_DIR/index.html" "$PROJECT_DIR/"
cp "$FIGMA_DIR/package.json" "$PROJECT_DIR/"
cp "$FIGMA_DIR/vite.config.ts" "$PROJECT_DIR/"
cp "$FIGMA_DIR/tsconfig.json" "$PROJECT_DIR/"
cp "$FIGMA_DIR/tsconfig.node.json" "$PROJECT_DIR/"
cp "$FIGMA_DIR/.eslintrc.cjs" "$PROJECT_DIR/"
cp "$FIGMA_DIR/.gitignore" "$PROJECT_DIR/"
cp "$FIGMA_DIR/"*.md "$PROJECT_DIR/"
cp "$FIGMA_DIR/LICENSE" "$PROJECT_DIR/"
cp "$FIGMA_DIR/setup.sh" "$PROJECT_DIR/"

# Copiar src/
cp "$FIGMA_DIR/src/main.tsx" "$PROJECT_DIR/src/"
cp "$FIGMA_DIR/App.tsx" "$PROJECT_DIR/src/"  # Note: App.tsx está na raiz no Figma Make

# Copiar styles
cp "$FIGMA_DIR/styles/globals.css" "$PROJECT_DIR/src/styles/"

# Copiar components
cp "$FIGMA_DIR/components/"*.tsx "$PROJECT_DIR/src/components/"

# Copiar components/ui
cp "$FIGMA_DIR/components/ui/"*.tsx "$PROJECT_DIR/src/components/ui/"
cp "$FIGMA_DIR/components/ui/"*.ts "$PROJECT_DIR/src/components/ui/"

# Copiar components/figma
cp "$FIGMA_DIR/components/figma/"*.tsx "$PROJECT_DIR/src/components/figma/"

echo "✅ Migração concluída!"
```

### 4. Verificar Estrutura Final

Após a cópia, sua estrutura deve estar assim:

```
ecochat/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── .eslintrc.cjs
├── .gitignore
├── README.md
├── REQUIREMENTS.md
├── SETUP_GUIDE.md
├── PROJECT_STRUCTURE.md
├── QUICK_START.md
├── MIGRATION_GUIDE.md
├── LICENSE
├── setup.sh
│
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   │
│   ├── components/
│   │   ├── LoginPage.tsx
│   │   ├── ChatPage.tsx
│   │   ├── Sidebar.tsx
│   │   ├── ChatArea.tsx
│   │   ├── RankingSection.tsx
│   │   ├── TasksSection.tsx
│   │   ├── FriendsSection.tsx
│   │   ├── ProfileSection.tsx
│   │   │
│   │   ├── ui/
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── scroll-area.tsx
│   │   │   ├── switch.tsx
│   │   │   ├── sonner.tsx
│   │   │   └── ... (todos os outros)
│   │   │
│   │   └── figma/
│   │       └── ImageWithFallback.tsx
│   │
│   └── styles/
│       └── globals.css
│
└── public/
    └── (vazio por enquanto)
```

### 5. Verificar Comandos

Execute este comando para verificar se a estrutura está correta:

```bash
cd ~/projetos/ecochat

# Verificar arquivos principais
ls -la

# Verificar src/
ls -la src/

# Verificar components
ls -la src/components/

# Verificar ui
ls -la src/components/ui/
```

### 6. Instalar Dependências

```bash
cd ~/projetos/ecochat
npm install
```

### 7. Testar

```bash
npm run dev
```

Acesse: http://localhost:3000

## ⚠️ Diferenças Importantes

### Imports que Precisam Ser Atualizados

Se você encontrar erros de import, pode ser necessário atualizar os caminhos:

#### ❌ Antes (Figma Make):
```tsx
import { LoginPage } from './components/LoginPage';
```

#### ✅ Depois (Estrutura src/):
Se o arquivo estiver em `src/App.tsx`:
```tsx
import { LoginPage } from './components/LoginPage';  // ✅ Permanece igual
```

Se estiver em outro componente dentro de `src/components/`:
```tsx
import { Button } from './ui/button';  // ✅ Correto
```

### Arquivo main.tsx

O `src/main.tsx` deve importar App assim:

```tsx
import App from './App.tsx';  // ✅ Caminho correto
```

## 🔧 Ajustes de Paths

Se você tiver problemas com imports, verifique o `tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

E o `vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
```

## ✅ Checklist Final

Após migração, verifique:

- [ ] Todos os arquivos `.tsx` estão em `src/`
- [ ] `globals.css` está em `src/styles/`
- [ ] Componentes UI estão em `src/components/ui/`
- [ ] `package.json` está na raiz
- [ ] `index.html` está na raiz
- [ ] `npm install` executou sem erros
- [ ] `npm run dev` inicia sem erros
- [ ] Aplicação abre em http://localhost:3000
- [ ] Todas as funcionalidades funcionam

## 🐛 Resolução de Problemas

### Erro: "Cannot find module"

**Causa:** Caminho de import incorreto

**Solução:** Verifique se o arquivo existe no caminho especificado

```bash
# Procurar arquivo
find src -name "LoginPage.tsx"
```

### Erro: "Failed to resolve import"

**Causa:** Arquivo não está na estrutura src/

**Solução:** Mova o arquivo para a pasta correta

```bash
mv components/LoginPage.tsx src/components/
```

### Erro ao executar npm install

**Causa:** package.json não está correto ou falta Node.js

**Solução:** Verifique Node.js e reinstale

```bash
node --version  # Deve ser 18+
rm -rf node_modules package-lock.json
npm install
```

## 📚 Próximos Passos

Após migração bem-sucedida:

1. ✅ Testar todas as funcionalidades
2. 📦 Fazer primeiro commit no Git
3. 📤 Enviar para GitHub
4. 🚀 Continuar desenvolvimento

Consulte `QUICK_START.md` para próximos passos!

---

**Migração concluída!** 🎉 Agora você tem o EcoChat rodando localmente com a estrutura correta!
