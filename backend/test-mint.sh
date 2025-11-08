#!/bin/bash

# Script de teste para o endpoint de mint ERC20
# Uso: ./test-mint.sh <endereco> <quantidade>

# Exemplo de uso:
# ./test-mint.sh 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb 100.5

ENDPOINT="http://localhost:3001/api/mint/erc20"
TO_ADDRESS="${1:-0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb}"
AMOUNT="${2:-100.5}"

echo "🪙 Testando mint de ${AMOUNT} glPET para ${TO_ADDRESS}..."
echo ""

curl -X POST "$ENDPOINT" \
  -H "Content-Type: application/json" \
  -d "{
    \"to\": \"$TO_ADDRESS\",
    \"amount\": \"$AMOUNT\"
  }" \
  -w "\n\nStatus HTTP: %{http_code}\n"

