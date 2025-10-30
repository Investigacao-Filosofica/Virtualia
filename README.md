# Virtualia

Virtualia é uma plataforma on-chain para destacar produções acadêmicas como artigos, traduções, cursos e certificados, permitindo que criadores monetizem seus conteúdos via tokens na rede Solana.

## Estrutura do repositório

- `frontend/`: Aplicação web (React + Vite) com integração a carteiras Solana.
- `contracts/`: Programa (smart contract) escrito com Anchor para gerenciar a mintagem de conteúdos.
- `backend/`: API Node.js responsável por persistir perfis de usuários e certificados em um cluster MongoDB.
- `docs/`: Documentação complementar sobre arquitetura, fluxos e referências.

## Começando

1. **Instale as dependências do frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
2. **Configure o ambiente Anchor** (veja `docs/backend-setup.md`).
3. **Implemente e teste o fluxo ponta a ponta** seguindo o guia de desenvolvimento (`docs/architecture.md`).

### Backend API

1. Crie um arquivo `.env` dentro de `backend/` baseado em `.env.example` com a string de conexão do cluster MongoDB (`MONGODB_URI`).
2. Instale as dependências e inicie o servidor:

   ```bash
   cd backend
   npm install
   npm run dev
   ```

3. Utilize os endpoints REST para criar ou atualizar perfis (`POST /api/users`), consultar (`GET /api/users/:walletAddress`) e anexar novos certificados (`POST /api/users/:walletAddress/certificates`).

## Estado atual

Este repositório traz um esqueleto funcional com os elementos essenciais para iniciar o protótipo:

- UI com conexão a carteira Solana, formulário de mint e listagem local dos assets criados.
- Programa Anchor que armazena metadados on-chain de conteúdos acadêmicos e distribui recompensas simbólicas em tokens.

A partir deste ponto é possível evoluir para integrações com storage descentralizado, emissão real de NFTs/SPL Tokens e publicação da aplicação.
