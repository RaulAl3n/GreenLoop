# Exemplos de Teste - Endpoint Mint ERC20

## Usando cURL (Windows PowerShell)

### Exemplo básico:
```powershell
curl -X POST http://localhost:3001/api/mint/erc20 `
  -H "Content-Type: application/json" `
  -d '{\"to\": \"0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb\", \"amount\": \"100.5\"}'
```

### Exemplo com endereço específico:
```powershell
curl -X POST http://localhost:3001/api/mint/erc20 `
  -H "Content-Type: application/json" `
  -d '{\"to\": \"0xSeuEnderecoAqui\", \"amount\": \"50.25\"}'
```

### Exemplo formatado (mais legível):
```powershell
$body = @{
    to = "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
    amount = "100.5"
} | ConvertTo-Json

Invoke-RestMethod -Uri http://localhost:3001/api/mint/erc20 -Method Post -Body $body -ContentType "application/json"
```

## Usando o script PowerShell

```powershell
cd backend
.\test-mint.ps1 -ToAddress "0xSeuEnderecoAqui" -Amount "100.5"
```

## Resposta esperada (sucesso):

```json
{
  "success": true,
  "transactionHash": "0x...",
  "blockNumber": 12345678,
  "to": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "amount": "100.5",
  "amountInWei": "100500000000000000000"
}
```

## Resposta de erro:

```json
{
  "success": false,
  "error": "Mensagem de erro aqui",
  "details": "Detalhes adicionais"
}
```

