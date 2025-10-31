# 🚀 Guia Completo: Deploy do Smart Contract Virtualia

Este guia fornece instruções passo a passo para criar, compilar e fazer deploy do smart contract Virtualia na blockchain Solana.

---

## 📋 Índice

1. [Pré-requisitos](#pré-requisitos)
2. [Instalação das Ferramentas](#instalação-das-ferramentas)
3. [Configuração do Ambiente](#configuração-do-ambiente)
4. [Compilação do Contrato](#compilação-do-contrato)
5. [Deploy na Devnet](#deploy-na-devnet)
6. [Atualização do Código](#atualização-do-código)
7. [Verificação do Deploy](#verificação-do-deploy)
8. [Deploy na Mainnet](#deploy-na-mainnet)
9. [Troubleshooting](#troubleshooting)

---

## 🔧 Pré-requisitos

### Sistema Operacional
- Windows 10/11, macOS, ou Linux
- Mínimo 8GB RAM
- 10GB espaço em disco livre

### Conhecimentos Necessários
- Básico de linha de comando
- Conceitos de blockchain
- Rust (básico)

---

## 📦 Instalação das Ferramentas

### 1. Instalar Rust

#### Windows
```powershell
# Baixe e execute o instalador
# https://rustup.rs/

# Ou via PowerShell:
Invoke-WebRequest -Uri https://win.rustup.rs/x86_64 -OutFile rustup-init.exe
.\rustup-init.exe
```

#### Linux/macOS
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

#### Verificar Instalação
```bash
rustc --version
cargo --version
```

**Saída esperada:**
```
rustc 1.75.0 (ou superior)
cargo 1.75.0 (ou superior)
```

---

### 2. Instalar Solana CLI

#### Windows (PowerShell como Administrador)
```powershell
# Baixar e instalar
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"

# Adicionar ao PATH
$env:PATH += ";$HOME\.local\share\solana\install\active_release\bin"

# Tornar permanente (adicione ao perfil do PowerShell)
[Environment]::SetEnvironmentVariable("Path", $env:PATH, [EnvironmentVariableTarget]::User)
```

#### Linux/macOS
```bash
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"

# Adicionar ao PATH (adicione ao ~/.bashrc ou ~/.zshrc)
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"

# Recarregar o shell
source ~/.bashrc  # ou source ~/.zshrc
```

#### Verificar Instalação
```bash
solana --version
```

**Saída esperada:**
```
solana-cli 1.18.0 (ou superior)
```

---

### 3. Instalar Anchor Framework

```bash
# Instalar AVM (Anchor Version Manager)
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force

# Instalar a versão mais recente do Anchor
avm install latest
avm use latest
```

#### Verificar Instalação
```bash
anchor --version
```

**Saída esperada:**
```
anchor-cli 0.29.0 (ou superior)
```

---

### 4. Instalar Node.js e npm

#### Windows
Baixe o instalador em: https://nodejs.org/ (versão LTS)

#### Linux/macOS
```bash
# Via nvm (recomendado)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install --lts
```

#### Verificar Instalação
```bash
node --version
npm --version
```

**Saída esperada:**
```
v20.x.x (ou superior)
10.x.x (ou superior)
```

---

## ⚙️ Configuração do Ambiente

### 1. Configurar Solana CLI

```bash
# Definir a rede como Devnet
solana config set --url devnet

# Verificar configuração
solana config get
```

**Saída esperada:**
```
Config File: ~/.config/solana/cli/config.yml
RPC URL: https://api.devnet.solana.com
WebSocket URL: wss://api.devnet.solana.com/ (computed)
Keypair Path: ~/.config/solana/id.json
Commitment: confirmed
```

---

### 2. Criar Carteira para Deploy

```bash
# Gerar nova keypair
solana-keygen new --outfile ~/.config/solana/id.json

# IMPORTANTE: Anote a seed phrase em local seguro!
# Você precisará dela para recuperar a carteira
```

**Saída esperada:**
```
Generating a new keypair

For added security, enter a BIP39 passphrase

NOTE! This passphrase improves security of the recovery seed phrase NOT the
keypair file itself, which is stored as insecure plain text

BIP39 Passphrase (empty for none): 

Wrote new keypair to ~/.config/solana/id.json
================================================================================
pubkey: 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU
================================================================================
Save this seed phrase and your BIP39 passphrase to recover your new keypair:
[SEED PHRASE AQUI - GUARDE EM LOCAL SEGURO!]
================================================================================
```

#### Verificar Endereço da Carteira
```bash
solana address
```

**Anote este endereço!** Você precisará dele.

---

### 3. Solicitar SOL para Deploy (Devnet)

```bash
# Solicitar 2 SOL via airdrop
solana airdrop 2

# Verificar saldo
solana balance
```

**Saída esperada:**
```
2 SOL
```

#### Se o Airdrop Falhar

Use o faucet online:
1. Acesse: https://faucet.solana.com
2. Cole seu endereço (obtido com `solana address`)
3. Clique em "Request Airdrop"
4. Aguarde a confirmação

**Dica:** Você pode solicitar até 5 SOL por dia na devnet.

---

## 🔨 Compilação do Contrato

### 1. Navegar para o Diretório do Projeto

```bash
cd C:\Users\OFF\Documents\GitHub\Virtualia\contracts
# ou no Linux/macOS:
# cd ~/Documents/GitHub/Virtualia/contracts
```

---

### 2. Instalar Dependências

```bash
# Instalar dependências Node.js (para testes)
npm install

# ou
yarn install
```

---

### 3. Limpar Builds Anteriores (Opcional)

```bash
anchor clean
```

Isso remove a pasta `target/` e garante uma compilação limpa.

---

### 4. Compilar o Programa

```bash
anchor build
```

**Este processo pode demorar 5-10 minutos na primeira vez.**

**Saída esperada:**
```
Compiling virtualia v0.1.0
    Finished release [optimized] target(s) in 8m 32s
```

---

### 5. Verificar Arquivos Gerados

```bash
# Windows
dir target\deploy\

# Linux/macOS
ls -lh target/deploy/
```

**Arquivos esperados:**
- `virtualia.so` - O programa compilado
- `virtualia-keypair.json` - Keypair do programa

---

### 6. Verificar o IDL Gerado

```bash
# Windows
type target\idl\virtualia.json

# Linux/macOS
cat target/idl/virtualia.json
```

O IDL (Interface Definition Language) contém a definição da interface do contrato.

---

## 🚀 Deploy na Devnet

### 1. Verificar Saldo Antes do Deploy

```bash
solana balance
```

**Mínimo necessário:** ~1 SOL (o deploy consome aproximadamente 0.5-1 SOL)

---

### 2. Fazer o Deploy

```bash
anchor deploy --provider.cluster devnet
```

**Este processo pode demorar 2-5 minutos.**

**Saída esperada:**
```
Deploying cluster: https://api.devnet.solana.com
Upgrade authority: 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU
Deploying program "virtualia"...
Program path: /path/to/target/deploy/virtualia.so...
Program Id: Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS

Deploy success
```

**🎯 IMPORTANTE: Copie o Program Id!**

No exemplo acima: `Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS`

---

### 3. Verificar o Deploy

```bash
# Substitua PROGRAM_ID pelo seu Program Id
solana program show Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS --url devnet
```

**Saída esperada:**
```
Program Id: Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS
Owner: BPFLoaderUpgradeab1e11111111111111111111111
ProgramData Address: 8xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU
Authority: 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU
Last Deployed In Slot: 123456789
Data Length: 123456 (0x1e240) bytes
Balance: 1.234 SOL
```

---

## 🔄 Atualização do Código

Após o deploy, você precisa atualizar o Program ID em vários lugares:

### 1. Atualizar no Contrato Rust

**Arquivo:** `contracts/programs/virtualia/src/lib.rs`

```rust
// Linha 4 - Substituir pelo seu Program ID
declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");
```

---

### 2. Atualizar no Anchor.toml

**Arquivo:** `contracts/Anchor.toml`

```toml
[programs.devnet]
virtualia = "Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS"
```

---

### 3. Atualizar no Frontend

**Arquivo:** `frontend/.env`

```bash
# Solana Configuration
VITE_SOLANA_NETWORK=devnet
VITE_SOLANA_RPC_URL=https://api.devnet.solana.com

# Virtualia Program Configuration
VITE_VIRTUALIA_PROGRAM_ID=Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS

# IPFS/Pinata Configuration
VITE_PINATA_JWT=seu_jwt_aqui
```

---

### 4. Recompilar com o Novo Program ID

```bash
# Recompilar o contrato
anchor build

# Fazer upgrade do programa (opcional mas recomendado)
anchor upgrade target/deploy/virtualia.so \
  --program-id Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS \
  --provider.cluster devnet
```

---

### 5. Atualizar o Frontend

```bash
# Navegar para o frontend
cd ../frontend

# Instalar dependências (se necessário)
npm install

# Rebuild
npm run build

# Iniciar servidor de desenvolvimento
npm run dev
```

---

## ✅ Verificação do Deploy

### 1. Verificar no Solana Explorer

Acesse: https://explorer.solana.com/?cluster=devnet

Cole seu Program ID na barra de busca.

**Você deve ver:**
- ✅ Program Account
- ✅ Upgrade Authority
- ✅ Data Length
- ✅ Balance

---

### 2. Executar Testes

```bash
# Voltar para a pasta contracts
cd ../contracts

# Executar testes
anchor test --skip-local-validator
```

**Saída esperada:**
```
  virtualia
    ✔ Inicializa perfil do usuário (1234ms)
    ✔ Registra conteúdo (2345ms)

  2 passing (4s)
```

---

### 3. Testar no Frontend

1. Abra o navegador em `http://localhost:5173`
2. Conecte sua carteira (Phantom/Solflare)
3. **Certifique-se de estar na Devnet!**
4. Preencha o formulário
5. Faça upload de um arquivo
6. Clique em "Register on Solana"

**Resultado esperado:**
- ✅ Transação enviada
- ✅ Confirmação recebida
- ✅ Link para ver no Explorer

---

## 🌐 Deploy na Mainnet

⚠️ **ATENÇÃO:** Deploy na mainnet custa SOL real!

### Pré-requisitos

1. **Carteira com SOL suficiente** (~2-5 SOL para deploy inicial)
2. **Código auditado** e testado extensivamente
3. **Backup da keypair** em local seguro

---

### Passos para Mainnet

#### 1. Configurar para Mainnet

```bash
solana config set --url mainnet-beta
```

#### 2. Verificar Saldo

```bash
solana balance
```

**Mínimo recomendado:** 3 SOL

#### 3. Atualizar Anchor.toml

**Arquivo:** `contracts/Anchor.toml`

```toml
[provider]
cluster = "mainnet-beta"
wallet = "~/.config/solana/id.json"

[programs.mainnet]
virtualia = "SEU_PROGRAM_ID_AQUI"
```

#### 4. Deploy

```bash
anchor deploy --provider.cluster mainnet-beta
```

#### 5. Atualizar Configurações

Atualize o Program ID em todos os lugares (como feito para devnet).

#### 6. Atualizar Frontend para Mainnet

**Arquivo:** `frontend/.env`

```bash
VITE_SOLANA_NETWORK=mainnet-beta
VITE_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
VITE_VIRTUALIA_PROGRAM_ID=SEU_PROGRAM_ID_MAINNET
```

---

## 🐛 Troubleshooting

### Erro: "insufficient funds for rent"

**Causa:** Saldo insuficiente para deploy

**Solução:**
```bash
# Devnet
solana airdrop 2

# Mainnet
# Adicione mais SOL à sua carteira
```

---

### Erro: "anchor: command not found"

**Causa:** Anchor não está no PATH

**Solução:**
```bash
# Reinstalar Anchor
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install latest
avm use latest

# Reiniciar o terminal
```

---

### Erro: "failed to send transaction: Transaction simulation failed"

**Causa:** Erro no código do contrato ou saldo insuficiente

**Solução:**
1. Verificar logs: `solana logs`
2. Revisar o código
3. Verificar saldo: `solana balance`
4. Testar localmente: `anchor test`

---

### Erro: "Error: Account allocation failed: unable to confirm transaction"

**Causa:** Rede congestionada ou timeout

**Solução:**
```bash
# Aumentar o timeout
solana config set --commitment confirmed

# Tentar novamente
anchor deploy --provider.cluster devnet
```

---

### Erro: "Program Id mismatch"

**Causa:** Program ID no código não corresponde ao deployado

**Solução:**
1. Verificar `declare_id!()` em `lib.rs`
2. Verificar `Anchor.toml`
3. Recompilar: `anchor build`
4. Fazer upgrade: `anchor upgrade ...`

---

## 📊 Custos Estimados

### Devnet (Grátis)
- Deploy: 0 SOL (usa faucet)
- Transações: 0 SOL

### Mainnet
- **Deploy inicial:** ~1-2 SOL
- **Rent (armazenamento):** ~0.5 SOL
- **Cada mint:** ~0.001-0.005 SOL
- **Criar perfil:** ~0.002 SOL

**Total estimado para começar:** 3-5 SOL

---

## 🔒 Segurança

### Checklist de Segurança

- [ ] Keypair armazenada em local seguro
- [ ] Seed phrase anotada offline
- [ ] Código auditado (para mainnet)
- [ ] Testes extensivos realizados
- [ ] Upgrade authority configurada corretamente
- [ ] Backup de todas as keypairs
- [ ] `.env` no `.gitignore`
- [ ] Nunca commitar chaves privadas

---

## 📚 Recursos Adicionais

### Documentação Oficial
- [Solana Docs](https://docs.solana.com/)
- [Anchor Book](https://book.anchor-lang.com/)
- [Solana Cookbook](https://solanacookbook.com/)

### Ferramentas Úteis
- [Solana Explorer](https://explorer.solana.com/)
- [Solana Beach](https://solanabeach.io/)
- [Anchor Examples](https://github.com/coral-xyz/anchor/tree/master/examples)

### Comunidade
- [Solana Discord](https://discord.gg/solana)
- [Anchor Discord](https://discord.gg/anchorlang)
- [Solana Stack Exchange](https://solana.stackexchange.com/)

---

## 📝 Checklist Completo

### Pré-Deploy
- [ ] Rust instalado
- [ ] Solana CLI instalado
- [ ] Anchor instalado
- [ ] Node.js instalado
- [ ] Carteira criada
- [ ] SOL obtido (devnet)
- [ ] Código compilado sem erros

### Deploy
- [ ] `anchor build` executado com sucesso
- [ ] `anchor deploy` executado com sucesso
- [ ] Program ID copiado
- [ ] Program ID atualizado em `lib.rs`
- [ ] Program ID atualizado em `Anchor.toml`
- [ ] Program ID atualizado em `.env`
- [ ] Recompilado com novo Program ID

### Pós-Deploy
- [ ] Deploy verificado no Explorer
- [ ] Testes executados com sucesso
- [ ] Frontend atualizado e testado
- [ ] Documentação atualizada
- [ ] Commit feito no Git

---

## 🎉 Conclusão

Parabéns! Você deployou com sucesso o smart contract Virtualia na Solana!

**Próximos passos:**
1. Testar todas as funcionalidades
2. Monitorar transações no Explorer
3. Coletar feedback dos usuários
4. Iterar e melhorar

**Lembre-se:**
- Sempre teste na devnet primeiro
- Mantenha backups de todas as chaves
- Monitore os custos na mainnet
- Mantenha o código atualizado

---

**Desenvolvido com ❤️ para a comunidade acadêmica**

Para suporte, abra uma issue em: https://github.com/Investigacao-Filosofica/virtualia/issues

