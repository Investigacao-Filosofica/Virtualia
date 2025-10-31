# 🪟 Guia de Instalação - Windows

Este guia fornece instruções detalhadas para instalar todas as ferramentas necessárias para desenvolver e fazer deploy de smart contracts Solana no Windows.

---

## ⚠️ Pré-requisitos

- Windows 10 ou 11 (64-bit)
- PowerShell 5.1 ou superior
- Conexão com internet
- Pelo menos 10GB de espaço livre em disco

---

## 📦 Instalação Passo a Passo

### 1️⃣ Instalar Rust

#### Opção A: Via Instalador (Recomendado)

1. **Baixe o instalador:**
   - Acesse: https://rustup.rs/
   - Ou baixe diretamente: https://win.rustup.rs/x86_64

2. **Execute o instalador:**
   - Clique duas vezes em `rustup-init.exe`
   - Pressione `1` para instalação padrão
   - Aguarde a instalação (pode demorar 5-10 minutos)

3. **Reinicie o PowerShell**

4. **Verifique a instalação:**
   ```powershell
   rustc --version
   cargo --version
   ```

#### Opção B: Via PowerShell

```powershell
# Execute como Administrador
Invoke-WebRequest -Uri https://win.rustup.rs/x86_64 -OutFile rustup-init.exe
.\rustup-init.exe
```

#### Configurar Rust para Solana

```powershell
# Adicionar target para BPF (necessário para Solana)
rustup target add bpf-unknown-unknown
```

---

### 2️⃣ Instalar Solana CLI

#### Método 1: Via Script (Recomendado)

```powershell
# Execute como Administrador
cmd /c "curl https://release.solana.com/stable/solana-install-init-x86_64-pc-windows-msvc.exe --output C:\solana-install-tmp\solana-install-init.exe --create-dirs"

# Execute o instalador
C:\solana-install-tmp\solana-install-init.exe v1.18.0
```

#### Método 2: Download Manual

1. **Baixe o instalador:**
   - Acesse: https://github.com/solana-labs/solana/releases
   - Baixe: `solana-install-init-x86_64-pc-windows-msvc.exe`

2. **Execute o instalador:**
   ```powershell
   .\solana-install-init-x86_64-pc-windows-msvc.exe v1.18.0
   ```

#### Adicionar ao PATH

```powershell
# Adicionar permanentemente ao PATH
$env:PATH += ";$HOME\.local\share\solana\install\active_release\bin"

# Tornar permanente
[Environment]::SetEnvironmentVariable(
    "Path",
    [Environment]::GetEnvironmentVariable("Path", "User") + ";$HOME\.local\share\solana\install\active_release\bin",
    "User"
)
```

#### Verificar Instalação

```powershell
# Reinicie o PowerShell e execute:
solana --version
```

**Saída esperada:**
```
solana-cli 1.18.0 (src:devbuild; feat:1234567890)
```

---

### 3️⃣ Instalar Node.js

#### Via Instalador Oficial

1. **Baixe o instalador:**
   - Acesse: https://nodejs.org/
   - Baixe a versão LTS (Long Term Support)

2. **Execute o instalador:**
   - Aceite os termos
   - Selecione "Automatically install necessary tools"
   - Clique em "Next" e "Install"

3. **Verifique a instalação:**
   ```powershell
   node --version
   npm --version
   ```

**Saída esperada:**
```
v20.11.0
10.2.4
```

---

### 4️⃣ Instalar Anchor Framework

⚠️ **IMPORTANTE:** Anchor no Windows requer WSL2 (Windows Subsystem for Linux)

#### Opção A: Instalar via WSL2 (Recomendado)

##### 1. Instalar WSL2

```powershell
# Execute como Administrador
wsl --install
```

**Reinicie o computador** quando solicitado.

##### 2. Configurar Ubuntu no WSL2

```powershell
# Após reiniciar, abra o Ubuntu do menu iniciar
# Configure usuário e senha quando solicitado
```

##### 3. Instalar Anchor no WSL2

```bash
# No terminal Ubuntu (WSL2):

# Instalar dependências
sudo apt update
sudo apt install -y pkg-config build-essential libudev-dev

# Instalar Rust no WSL2
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env

# Instalar Solana CLI no WSL2
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"

# Instalar Anchor
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install latest
avm use latest
```

##### 4. Verificar Instalação

```bash
anchor --version
```

**Saída esperada:**
```
anchor-cli 0.29.0
```

#### Opção B: Usar Docker (Alternativa)

Se não quiser usar WSL2, você pode usar Docker:

```powershell
# Instalar Docker Desktop para Windows
# https://www.docker.com/products/docker-desktop/

# Criar container com Anchor
docker pull projectserum/build:latest
```

---

## ✅ Verificação Completa

Execute estes comandos para verificar se tudo está instalado:

### No PowerShell (Windows):

```powershell
# Rust
rustc --version
cargo --version

# Solana
solana --version

# Node.js
node --version
npm --version
```

### No WSL2 (Ubuntu):

```bash
# Rust
rustc --version
cargo --version

# Solana
solana --version

# Anchor
anchor --version
```

---

## 🔧 Configuração Inicial

### 1. Configurar Solana CLI

```bash
# No WSL2 ou PowerShell (se Solana estiver instalado no Windows)

# Definir rede como Devnet
solana config set --url devnet

# Verificar configuração
solana config get
```

### 2. Criar Carteira

```bash
# Gerar nova keypair
solana-keygen new

# IMPORTANTE: Anote a seed phrase!
```

### 3. Solicitar SOL (Devnet)

```bash
# Solicitar airdrop
solana airdrop 2

# Verificar saldo
solana balance
```

---

## 🎯 Próximos Passos

Agora que tudo está instalado, você pode:

1. **Compilar o contrato:**
   ```bash
   cd contracts
   anchor build
   ```

2. **Fazer deploy:**
   ```bash
   anchor deploy --provider.cluster devnet
   ```

3. **Seguir o guia completo:** Veja `DEPLOY_GUIDE.md`

---

## 🐛 Troubleshooting

### Erro: "rustc not found" após instalação

**Solução:**
```powershell
# Reinicie o PowerShell
# Ou adicione manualmente ao PATH:
$env:PATH += ";$HOME\.cargo\bin"
```

### Erro: "solana command not found"

**Solução:**
```powershell
# Verifique se o PATH está correto:
$env:PATH

# Adicione manualmente:
$env:PATH += ";$HOME\.local\share\solana\install\active_release\bin"
```

### Erro: "anchor not found" no Windows

**Solução:**
- Anchor não funciona nativamente no Windows
- Use WSL2 (recomendado) ou Docker
- Todos os comandos `anchor` devem ser executados no WSL2

### WSL2 não instala

**Solução:**
```powershell
# Habilitar recursos necessários
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart

# Reinicie o computador
# Depois execute:
wsl --install
```

---

## 📚 Recursos Adicionais

- **Rust:** https://www.rust-lang.org/tools/install
- **Solana:** https://docs.solana.com/cli/install-solana-cli-tools
- **Anchor:** https://www.anchor-lang.com/docs/installation
- **WSL2:** https://learn.microsoft.com/en-us/windows/wsl/install
- **Node.js:** https://nodejs.org/

---

## 💡 Dicas

1. **Use WSL2 para desenvolvimento Solana** - É muito mais fácil que tentar fazer tudo no Windows nativo
2. **Instale Windows Terminal** - Melhor experiência de linha de comando
3. **Use VS Code com extensão WSL** - Edite arquivos no WSL diretamente do Windows
4. **Mantenha tudo atualizado** - Execute `rustup update` e `solana-install update` regularmente

---

## ⚡ Quick Start (Resumo)

Se você já sabe o que está fazendo:

```powershell
# 1. Instalar Rust
Invoke-WebRequest -Uri https://win.rustup.rs/x86_64 -OutFile rustup-init.exe
.\rustup-init.exe

# 2. Instalar WSL2
wsl --install

# 3. No WSL2 Ubuntu:
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install latest
avm use latest

# 4. Configurar
solana config set --url devnet
solana-keygen new
solana airdrop 2

# 5. Deploy
cd contracts
anchor build
anchor deploy --provider.cluster devnet
```

---

**Instalação completa! Agora você está pronto para desenvolver na Solana! 🚀**

