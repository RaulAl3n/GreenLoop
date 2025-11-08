### BACKEND ###

API Node.js para realizar mint de tokens glPET (ERC20) e glPETc (ERC721) na rede Base.

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Wallet com chave privada configurada como owner dos contratos

## 🚀 Instalação

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

3. Edite o arquivo `.env` e configure:
   - `BASE_RPC_URL`: URL do RPC da rede Base (ou use um RPC privado)
   - `PRIVATE_KEY`: Chave privada da wallet owner dos contratos
   - `GLPET_CONTRACT_ADDRESS`: Endereço do contrato ERC20 (já configurado)
   - `GLPETC_CONTRACT_ADDRESS`: Endereço do contrato ERC721
   - `PORT`: Porta do servidor (opcional, padrão: 3001)

## ▶️ Execução

### Modo desenvolvimento (com watch):
```bash
npm run dev
```

### Modo produção:
```bash
npm start
```

O servidor estará disponível em `http://localhost:3001`

## 📡 Endpoints

### Health Check
```
GET /health
```
Retorna status do servidor e informações dos contratos.

### Mint ERC20 (glPET)
```
POST /api/mint/erc20
Content-Type: application/json

Body:
{
  "to": "0x...",        // Endereço que receberá os tokens
  "amount": "100.5"     // Quantidade em formato de string (será convertido para wei)
}
```

**Resposta de sucesso:**
```json
{
  "success": true,
  "transactionHash": "0x...",
  "blockNumber": 12345678,
  "to": "0x...",
  "amount": "100.5",
  "amountInWei": "100500000000000000000"
}
```

### Mint ERC721 (glPETc)
```
POST /api/mint/erc721
Content-Type: application/json

Body:
{
  "to": "0x...",        // Endereço que receberá o NFT
  "uri": "ipfs://..."   // URI do metadata do NFT
}
```

**Resposta de sucesso:**
```json
{
  "success": true,
  "transactionHash": "0x...",
  "blockNumber": 12345678,
  "to": "0x...",
  "uri": "ipfs://...",
  "tokenId": "1"
}
```

## ⚠️ Importante

- A wallet configurada no `PRIVATE_KEY` deve ser o **owner** dos contratos
- Mantenha a chave privada segura e nunca commite o arquivo `.env`
- Certifique-se de ter ETH suficiente na wallet para pagar as taxas de gas
- Os contratos devem ter a função `mint` (ERC20) e `safeMint` (ERC721) com permissão `onlyOwner`

## 🔒 Segurança

- Nunca exponha a chave privada
- Use variáveis de ambiente para configurações sensíveis
- Considere usar um serviço de gerenciamento de secrets em produção
- Implemente rate limiting e autenticação para uso em produção
