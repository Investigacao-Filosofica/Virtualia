# Guia rápido: ambiente Anchor + Solana

## Pré-requisitos

- Rust (`rustup`, nightly toolchain e `cargo`
- Anchor CLI (`npm install -g @coral-xyz/anchor-cli`)
- Solana CLI (`sh -c "$(curl -sSfL https://release.solana.com/stable/install)"`)
- Node.js 18+

## Configuração inicial

```bash
solana config set --url https://api.devnet.solana.com
solana-keygen new --outfile ~/.config/solana/virtualia.json
solana airdrop 2 <SEU_PUBKEY>
anchor keys list
```

Atualize o arquivo `Anchor.toml` com o caminho da sua keypair, se necessário.

## Compilando o programa

```bash
cd contracts
anchor build
```

Após o build, o IDL será gerado em `target/idl/virtualia.json`.

## Executando testes

```bash
anchor test
```

Isso dispara o test runner TypeScript (`contracts/tests/virtualia.ts`) que cobre os fluxos básicos de inicialização de usuário e mintagem.

## Deploy

```bash
anchor deploy
```

Guarde o endereço do programa gerado para configurar o frontend (`services/solana.ts`).

## Próximos passos

- Criar token SPL personalizado para recompensas.
- Automatizar distribuição de recompensas via cron job off-chain ou instrução on-chain.
- Integrar storage descentralizado (Arweave/IPFS) para hospedar os arquivos.
