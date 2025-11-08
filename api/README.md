# API Serverless Functions - Vercel

Os endpoints do backend estão integrados como Serverless Functions do Vercel na pasta `api/`.

## 📡 Endpoints Disponíveis

### `GET /api/health`
Health check da API

### `POST /api/mint/erc20`
Mint de tokens ERC20 (glPET)

**Body:**
```json
{
  "to": "0x...",
  "amount": "100.5"
}
```

### `POST /api/mint/erc721`
Mint de tokens ERC721 (glPETc)

**Body:**
```json
{
  "to": "0x...",
  "uri": "ipfs://..."
}
```

## 🔧 Configuração no Vercel

### 1. Variáveis de Ambiente

Configure as seguintes variáveis de ambiente no painel do Vercel:

- `BASE_RPC_URL` - URL do RPC (padrão: `https://sepolia.base.org`)
- `PRIVATE_KEY` - Chave privada da wallet owner dos contratos
- `GLPET_CONTRACT_ADDRESS` - Endereço do contrato ERC20 (padrão: `0x35FbA5dE07ed5479c8a151b78013b8Fea0FE67B4`)
- `GLPETC_CONTRACT_ADDRESS` - Endereço do contrato ERC721

### 2. Como Configurar

1. Acesse o projeto no [Vercel Dashboard](https://vercel.com/dashboard)
2. Vá em **Settings** → **Environment Variables**
3. Adicione cada variável:
   - **Name**: Nome da variável (ex: `PRIVATE_KEY`)
   - **Value**: Valor da variável
   - **Environment**: Selecione Production, Preview e Development

### 3. Deploy

Após configurar as variáveis, faça o deploy:

```bash
vercel --prod
```

Ou através do GitHub (deploy automático ao fazer push).

## 📝 Uso no Frontend

Use o helper criado em `src/lib/api.js`:

```javascript
import { mintERC20, mintERC721, healthCheck } from '@/lib/api';

// Mint ERC20
const result = await mintERC20('0x...', '100.5');
console.log(result.transactionHash);

// Mint ERC721
const result = await mintERC721('0x...', 'ipfs://...');
console.log(result.tokenId);

// Health check
const health = await healthCheck();
console.log(health);
```

## ⚠️ Importante

- As variáveis de ambiente são **obrigatórias** para o funcionamento
- A `PRIVATE_KEY` deve ser da wallet **owner** dos contratos
- Mantenha a `PRIVATE_KEY` segura e nunca commite no código
- Os endpoints funcionam automaticamente após o deploy no Vercel

