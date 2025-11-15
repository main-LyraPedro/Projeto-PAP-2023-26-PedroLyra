# 📋 Requisitos do Sistema - EcoChat

## 🖥️ Requisitos de Hardware Mínimos

- **CPU**: Processador dual-core (2 GHz ou superior)
- **RAM**: 4 GB (8 GB recomendado)
- **Armazenamento**: 2 GB de espaço livre
- **Internet**: Conexão para baixar dependências

## 💻 Requisitos de Software

### Essenciais

#### 1. Node.js (Versão 18 ou superior)
- **O que é**: Ambiente de execução JavaScript
- **Por que é necessário**: Executa o projeto e gerencia dependências
- **Como instalar**:

**Ubuntu/Debian/Linux Mint:**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Fedora/RHEL/CentOS:**
```bash
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo dnf install nodejs
```

**Arch/Manjaro:**
```bash
sudo pacman -S nodejs npm
```

**Verificar instalação:**
```bash
node --version  # Deve mostrar v18.x.x ou superior
```

#### 2. npm (vem com Node.js)
- **O que é**: Gerenciador de pacotes JavaScript
- **Por que é necessário**: Instala e gerencia bibliotecas do projeto
- **Verificar instalação:**
```bash
npm --version  # Deve mostrar 9.x.x ou superior
```

#### 3. Git
- **O que é**: Sistema de controle de versão
- **Por que é necessário**: Gerenciar código e enviar para GitHub
- **Como instalar**:

**Ubuntu/Debian:**
```bash
sudo apt install git
```

**Fedora:**
```bash
sudo dnf install git
```

**Arch:**
```bash
sudo pacman -S git
```

**Verificar instalação:**
```bash
git --version
```

### Opcionais (mas recomendados)

#### 4. Editor de Código

**Visual Studio Code (Recomendado)**
```bash
# Ubuntu/Debian
sudo snap install code --classic

# Ou baixe de: https://code.visualstudio.com/
```

**Alternativas:**
- WebStorm
- Sublime Text
- Vim/Neovim
- nano (básico)

#### 5. Navegador Moderno
- Google Chrome
- Firefox
- Microsoft Edge
- Brave

## 📦 Dependências do Projeto (instaladas via npm)

### Principais (Production)

```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "typescript": "^5.6.3",
  "motion": "^11.15.0",
  "lucide-react": "^0.462.0",
  "sonner": "^1.7.1",
  "tailwindcss": "^4.0.0"
}
```

**Total de dependências**: ~200 pacotes (incluindo subdependências)
**Tamanho após instalação**: ~500-700 MB

### Desenvolvimento (DevDependencies)

```json
{
  "vite": "^6.0.1",
  "@vitejs/plugin-react": "^4.3.4",
  "@typescript-eslint/eslint-plugin": "^8.15.0",
  "eslint": "^9.15.0"
}
```

## 🔧 Ferramentas de Build

### Vite
- **Versão**: 6.x
- **Função**: Build tool e dev server
- **Por que**: Extremamente rápido, suporte nativo a TypeScript

### TypeScript
- **Versão**: 5.x
- **Função**: Superset tipado do JavaScript
- **Por que**: Previne erros e melhora desenvolvimento

### Tailwind CSS
- **Versão**: 4.0
- **Função**: Framework CSS utilitário
- **Por que**: Estilização rápida e responsiva

## 🌐 Distribuições Linux Testadas

✅ **Totalmente Compatível:**
- Ubuntu 20.04+
- Debian 11+
- Linux Mint 20+
- Fedora 35+
- Arch Linux (rolling)
- Manjaro
- Pop!_OS 20.04+
- Elementary OS 6+
- Zorin OS 16+

⚠️ **Requer adaptação:**
- CentOS 7 (Node.js 18 pode não estar no repositório oficial)
- Distros muito antigas (< 2020)

## 📊 Tempo de Instalação Estimado

| Etapa | Tempo Estimado |
|-------|----------------|
| Instalar Node.js | 2-5 minutos |
| Instalar Git | 1-2 minutos |
| Clonar repositório | 10-30 segundos |
| npm install | 3-8 minutos |
| **Total** | **6-15 minutos** |

*Tempos variam conforme conexão de internet e hardware*

## 💾 Espaço em Disco Necessário

| Item | Tamanho |
|------|---------|
| Node.js | ~50 MB |
| Código fonte | ~5 MB |
| node_modules | ~500-700 MB |
| Build de produção | ~2 MB |
| **Total Projeto** | ~700 MB |

## 🔌 Requisitos de Rede

### Durante Desenvolvimento
- **Porta padrão**: 3000
- **Acesso**: localhost:3000
- **Firewall**: Não necessário abrir portas

### Para Produção/Deploy
- **Hospedagem**: Vercel, Netlify, etc.
- **Domínio**: Opcional
- **SSL**: Fornecido gratuitamente pelas plataformas

## 🎯 Compatibilidade de Navegadores

### Totalmente Suportado:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

### Parcialmente Suportado:
- Internet Explorer: ❌ Não suportado

## 🔐 Permissões Necessárias

### Durante Instalação:
- ✅ Permissão de escrita na pasta do projeto
- ✅ Acesso à internet para baixar pacotes
- ⚠️ sudo/root: Apenas para instalar Node.js e Git (sistema)

### Durante Execução:
- ✅ Porta 3000 disponível (ou outra configurada)
- ✅ Sem necessidade de permissões elevadas

## 📝 Resumo Rápido

**Para começar, você precisa:**

1. ✅ Linux (qualquer distribuição moderna)
2. ✅ Node.js 18+
3. ✅ npm (vem com Node.js)
4. ✅ Git
5. ✅ 2 GB de espaço livre
6. ✅ Conexão com internet

**Instalação em 3 comandos:**

```bash
# 1. Instalar Node.js (Ubuntu/Debian)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. Instalar dependências do projeto
npm install

# 3. Rodar projeto
npm run dev
```

## 🆘 Suporte

Se encontrar problemas:

1. Verifique se Node.js versão >= 18
2. Execute `npm install` novamente
3. Limpe cache: `rm -rf node_modules && npm install`
4. Consulte `SETUP_GUIDE.md` para troubleshooting detalhado

## ✅ Checklist Pré-instalação

Antes de começar, confirme:

- [ ] Node.js 18+ instalado
- [ ] npm 9+ instalado
- [ ] Git instalado
- [ ] 2 GB de espaço livre
- [ ] Porta 3000 disponível
- [ ] Conexão de internet estável

---

**Tudo pronto?** Execute `bash setup.sh` ou siga o `SETUP_GUIDE.md`! 🚀
