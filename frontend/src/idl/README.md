# IDL (Interface Definition Language)

Este diretório contém o IDL TypeScript do contrato Anchor Virtualia.

## ⚠️ IMPORTANTE

Este arquivo **DEVE** ser versionado no Git para que o build funcione na Vercel e outros serviços de CI/CD.

## 📝 Como Atualizar

Quando você modificar o contrato (`contracts/programs/virtualia/src/lib.rs`), siga estes passos:

1. **Compile o contrato:**
   ```bash
   cd contracts
   anchor build
   ```

2. **Copie o IDL gerado:**
   ```bash
   # O arquivo será gerado em:
   # contracts/target/types/virtualia.ts
   
   # Copie para:
   # frontend/src/idl/virtualia.ts
   ```

3. **Verifique se o Program ID está correto:**
   - Verifique se o `metadata.address` no IDL corresponde ao Program ID em `frontend/src/config/solana.ts`

4. **Commit o arquivo atualizado:**
   ```bash
   git add frontend/src/idl/virtualia.ts
   git commit -m "Update IDL after contract changes"
   ```

## 🔄 Automatização (Opcional)

Você pode criar um script para automatizar isso:

```bash
# scripts/update-idl.sh
#!/bin/bash
cd contracts
anchor build
cp target/types/virtualia.ts ../frontend/src/idl/virtualia.ts
echo "IDL updated successfully!"
```

---

**Nota:** Este arquivo está versionado porque o diretório `contracts/target` está no `.gitignore`, mas o frontend precisa do IDL para compilar.

