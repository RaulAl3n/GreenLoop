# Script PowerShell para testar o endpoint de mint ERC20
# Uso: .\test-mint.ps1 -ToAddress "0x..." -Amount "100.5"

param(
    [string]$ToAddress = "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    [string]$Amount = "100.5"
)

$endpoint = "http://localhost:3001/api/mint/erc20"

$body = @{
    to = $ToAddress
    amount = $Amount
} | ConvertTo-Json

Write-Host "🪙 Testando mint de $Amount glPET para $ToAddress..." -ForegroundColor Cyan
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri $endpoint -Method Post -Body $body -ContentType "application/json"
    
    Write-Host "✅ Sucesso!" -ForegroundColor Green
    Write-Host ($response | ConvertTo-Json -Depth 10)
} catch {
    Write-Host "❌ Erro:" -ForegroundColor Red
    Write-Host $_.Exception.Message
    if ($_.ErrorDetails.Message) {
        Write-Host $_.ErrorDetails.Message
    }
}

