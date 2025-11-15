#!/bin/bash

# Script de configuração automática do EcoChat
# Para Linux (Ubuntu/Debian/Fedora/Arch)

echo "🌿 EcoChat - Script de Configuração Automática"
echo "=============================================="
echo ""

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Função para verificar se comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Verificar Node.js
echo "🔍 Verificando Node.js..."
if command_exists node; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓ Node.js encontrado: $NODE_VERSION${NC}"
    
    # Verificar se versão é >= 18
    NODE_MAJOR=$(echo $NODE_VERSION | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_MAJOR" -lt 18 ]; then
        echo -e "${YELLOW}⚠ Aviso: Node.js versão 18+ recomendado. Você tem v$NODE_MAJOR${NC}"
    fi
else
    echo -e "${RED}✗ Node.js não encontrado!${NC}"
    echo "Por favor, instale Node.js 18+ primeiro:"
    echo "  Ubuntu/Debian: curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && sudo apt-get install -y nodejs"
    echo "  Fedora: sudo dnf install nodejs"
    echo "  Arch: sudo pacman -S nodejs npm"
    exit 1
fi

# Verificar npm
echo "🔍 Verificando npm..."
if command_exists npm; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✓ npm encontrado: $NPM_VERSION${NC}"
else
    echo -e "${RED}✗ npm não encontrado!${NC}"
    exit 1
fi

# Verificar Git
echo "🔍 Verificando Git..."
if command_exists git; then
    GIT_VERSION=$(git --version)
    echo -e "${GREEN}✓ Git encontrado: $GIT_VERSION${NC}"
else
    echo -e "${YELLOW}⚠ Git não encontrado (necessário para GitHub)${NC}"
    echo "Instalar Git? (s/n)"
    read -r INSTALL_GIT
    if [ "$INSTALL_GIT" = "s" ] || [ "$INSTALL_GIT" = "S" ]; then
        if command_exists apt; then
            sudo apt install git -y
        elif command_exists dnf; then
            sudo dnf install git -y
        elif command_exists pacman; then
            sudo pacman -S git --noconfirm
        fi
    fi
fi

echo ""
echo "📦 Instalando dependências..."
echo "Isso pode levar alguns minutos..."
echo ""

# Instalar dependências
npm install

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✓ Dependências instaladas com sucesso!${NC}"
else
    echo ""
    echo -e "${RED}✗ Erro ao instalar dependências${NC}"
    exit 1
fi

echo ""
echo "=============================================="
echo -e "${GREEN}🎉 Configuração concluída com sucesso!${NC}"
echo "=============================================="
echo ""
echo "📝 Próximos passos:"
echo ""
echo "1. Iniciar servidor de desenvolvimento:"
echo "   ${YELLOW}npm run dev${NC}"
echo ""
echo "2. Abrir no navegador:"
echo "   ${YELLOW}http://localhost:3000${NC}"
echo ""
echo "3. Criar build de produção:"
echo "   ${YELLOW}npm run build${NC}"
echo ""
echo "4. Inicializar Git (para GitHub):"
echo "   ${YELLOW}git init${NC}"
echo "   ${YELLOW}git add .${NC}"
echo "   ${YELLOW}git commit -m 'feat: Implementação inicial do EcoChat'${NC}"
echo ""
echo "📚 Consulte README.md e SETUP_GUIDE.md para mais informações"
echo ""
echo "🌿 Bom desenvolvimento! 🌱"
