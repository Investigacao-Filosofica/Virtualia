# Troubleshooting - Virtualia

## Erro: "IdlError: Type not found: ContentMetadata"

### Problema
```
Failed to initialize Virtualia program: IdlError: Type not found: {"name":"metadata","type":{"defined":{"name":"ContentMetadata"}}}
```

### Causa
O formato do IDL (Interface Definition Language) estava incorreto. O Anchor espera que tipos customizados sejam referenciados como strings simples, não como objetos aninhados.

### Solução Aplicada

#### ❌ Formato Incorreto (ANTES)
```json
{
  "name": "metadata",
  "type": {
    "defined": {
      "name": "ContentMetadata"
    }
  }
}
```

#### ✅ Formato Correto (DEPOIS)
```json
{
  "name": "metadata",
  "type": {
    "defined": "ContentMetadata"
  }
}
```

### Arquivos Corrigidos
- `contracts/target/idl/virtualia.json`
- `contracts/target/types/virtualia.ts`

### Como Prevenir
Quando gerar o IDL com `anchor build`, certifique-se de que os tipos definidos usem o formato correto. Se necessário, ajuste manualmente após a geração.

---

## Erro: "Non-base58 character"

### Problema
```
Error: Non-base58 character
```

### Causa
O Program ID configurado não era uma chave pública válida do Solana (base58).

### Solução
Substituído `"virtualia1111111111111111111111111111111111"` por `"11111111111111111111111111111111"` (chave válida para desenvolvimento).

**IMPORTANTE**: Ao fazer deploy do contrato real, atualize o Program ID em:
- `contracts/programs/virtualia/src/lib.rs` (declare_id!)
- `contracts/Anchor.toml`
- `frontend/src/config/solana.ts` (ou variável de ambiente `VITE_VIRTUALIA_PROGRAM_ID`)

---

## Botão "Register on Solana" Desabilitado

### Causa
O botão permanece desabilitado até que todas as condições sejam atendidas:
1. ✅ Carteira Solana conectada
2. ✅ Todos os campos obrigatórios preenchidos
3. ✅ **Arquivo enviado para IPFS** (URI preenchido automaticamente)

### Solução
1. Preencha todos os campos do formulário
2. Faça upload do arquivo usando o campo "Upload (opcional)"
3. Aguarde a mensagem: "Upload completed on IPFS (nome-do-arquivo)"
4. O botão será habilitado automaticamente

### Feedback Visual
Se o botão ainda estiver desabilitado após conectar a carteira, você verá:
```
⚠️ Faça o upload de um arquivo para habilitar o registro
```

---

## Configuração do Ambiente

### Variáveis de Ambiente Necessárias

Crie um arquivo `.env` na pasta `frontend/`:

```bash
# Solana Configuration
VITE_SOLANA_NETWORK=devnet
VITE_SOLANA_RPC_URL=https://api.devnet.solana.com

# Virtualia Program Configuration
VITE_VIRTUALIA_PROGRAM_ID=11111111111111111111111111111111

# IPFS/Pinata Configuration
VITE_PINATA_JWT=your_pinata_jwt_here
```

### Como Obter o Pinata JWT
1. Acesse [Pinata Cloud](https://pinata.cloud)
2. Crie uma conta gratuita
3. Vá em API Keys
4. Crie uma nova chave com permissões de upload
5. Copie o JWT e adicione ao `.env`

---

## Deploy do Contrato

### Passo a Passo

1. **Compile o contrato**:
```bash
cd contracts
anchor build
```

2. **Deploy no devnet**:
```bash
anchor deploy
```

3. **Copie o Program ID** do output do deploy

4. **Atualize a configuração**:
   - Em `contracts/programs/virtualia/src/lib.rs`:
     ```rust
     declare_id!("SEU_PROGRAM_ID_AQUI");
     ```
   - Em `contracts/Anchor.toml`:
     ```toml
     [programs.devnet]
     virtualia = "SEU_PROGRAM_ID_AQUI"
     ```
   - Em `frontend/.env`:
     ```bash
     VITE_VIRTUALIA_PROGRAM_ID=SEU_PROGRAM_ID_AQUI
     ```

5. **Rebuild o IDL**:
```bash
anchor build
```

6. **Reinicie o frontend**:
```bash
cd ../frontend
npm run dev
```

---

## Testando a Aplicação

### Checklist de Teste

- [ ] Carteira conectada (Phantom/Solflare)
- [ ] Saldo suficiente na devnet (use faucet se necessário)
- [ ] Variável `VITE_PINATA_JWT` configurada
- [ ] Todos os campos preenchidos
- [ ] Arquivo enviado para IPFS com sucesso
- [ ] Botão "Register on Solana" habilitado
- [ ] Transação confirmada na blockchain

### Solana Devnet Faucet
Se precisar de SOL para testes:
```bash
solana airdrop 2 SUA_CARTEIRA_AQUI --url devnet
```

Ou use: https://faucet.solana.com

---

## Logs e Debugging

### Habilitar Logs Detalhados

No console do navegador, você verá:
- ✅ Upload para IPFS
- ✅ Inicialização do programa Anchor
- ✅ Criação de perfil do usuário
- ✅ Mint do conteúdo
- ❌ Erros detalhados com stack trace

### Verificar Transações

Após mintar, copie a assinatura da transação e verifique em:
- Devnet: https://explorer.solana.com/?cluster=devnet
- Mainnet: https://explorer.solana.com/

---

## Suporte

Para mais informações, consulte:
- [Documentação do Anchor](https://www.anchor-lang.com/)
- [Documentação da Solana](https://docs.solana.com/)
- [Pinata Docs](https://docs.pinata.cloud/)

