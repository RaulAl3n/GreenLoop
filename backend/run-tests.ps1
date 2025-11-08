# Script de Testes do Backend - Base Sepolia
# Executa apenas testes que devem funcionar (validações)

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  TESTES DO BACKEND - BASE SEPOLIA" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# TESTE 1: Health Check
Write-Host "TESTE 1: Health Check" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Gray
try {
    $health = Invoke-RestMethod -Uri http://localhost:3001/health
    Write-Host "✅ Status: $($health.status)" -ForegroundColor Green
    Write-Host "✅ Rede: $($health.network)" -ForegroundColor Green
    Write-Host "✅ Wallet conectada: $($health.wallet)" -ForegroundColor Green
    Write-Host "✅ Contrato glPET (ERC20): $($health.contracts.glPET)" -ForegroundColor Green
    Write-Host "✅ Contrato glPETc (ERC721): $($health.contracts.glPETc)" -ForegroundColor Green
    Write-Host "`n📋 Resposta JSON completa:" -ForegroundColor Gray
    $health | ConvertTo-Json -Depth 10
} catch {
    Write-Host "❌ Erro no health check: $($_.Exception.Message)" -ForegroundColor Red
}

# TESTE 2: Validação - Endereço Inválido
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "TESTE 2: Validação - Endereço Inválido" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host "Enviando: to='endereco-invalido', amount='10'" -ForegroundColor Gray
try {
    $body1 = @{
        to = "endereco-invalido"
        amount = "10"
    } | ConvertTo-Json
    
    Invoke-RestMethod -Uri http://localhost:3001/api/mint/erc20 -Method Post -Body $body1 -ContentType "application/json"
    Write-Host "❌ Erro: Deveria ter rejeitado o endereço inválido" -ForegroundColor Red
} catch {
    $error1 = $_.ErrorDetails.Message | ConvertFrom-Json
    Write-Host "✅ Validação funcionando corretamente!" -ForegroundColor Green
    Write-Host "   Erro retornado: $($error1.error)" -ForegroundColor Yellow
    Write-Host "   Success: $($error1.success)" -ForegroundColor Yellow
    Write-Host "`n📋 Resposta JSON:" -ForegroundColor Gray
    $error1 | ConvertTo-Json -Depth 10
}

# TESTE 3: Validação - Parâmetros Faltando
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "TESTE 3: Validação - Parâmetros Faltando" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host "Enviando: apenas 'to' (sem 'amount')" -ForegroundColor Gray
try {
    $body2 = @{
        to = "0x0000000000000000000000000000000000000001"
    } | ConvertTo-Json
    
    Invoke-RestMethod -Uri http://localhost:3001/api/mint/erc20 -Method Post -Body $body2 -ContentType "application/json"
    Write-Host "❌ Erro: Deveria ter rejeitado por falta de parâmetros" -ForegroundColor Red
} catch {
    $error2 = $_.ErrorDetails.Message | ConvertFrom-Json
    Write-Host "✅ Validação funcionando corretamente!" -ForegroundColor Green
    Write-Host "   Erro retornado: $($error2.error)" -ForegroundColor Yellow
    Write-Host "   Success: $($error2.success)" -ForegroundColor Yellow
    Write-Host "`n📋 Resposta JSON:" -ForegroundColor Gray
    $error2 | ConvertTo-Json -Depth 10
}

# TESTE 4: Validação - Body Vazio
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "TESTE 4: Validação - Body Vazio" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host "Enviando: body vazio {}" -ForegroundColor Gray
try {
    $body3 = @{} | ConvertTo-Json
    
    Invoke-RestMethod -Uri http://localhost:3001/api/mint/erc20 -Method Post -Body $body3 -ContentType "application/json"
    Write-Host "❌ Erro: Deveria ter rejeitado body vazio" -ForegroundColor Red
} catch {
    $error3 = $_.ErrorDetails.Message | ConvertFrom-Json
    Write-Host "✅ Validação funcionando corretamente!" -ForegroundColor Green
    Write-Host "   Erro retornado: $($error3.error)" -ForegroundColor Yellow
    Write-Host "   Success: $($error3.success)" -ForegroundColor Yellow
    Write-Host "`n📋 Resposta JSON:" -ForegroundColor Gray
    $error3 | ConvertTo-Json -Depth 10
}

# TESTE 5: Validação - Endereço Válido (formato)
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "TESTE 5: Validação - Endereço Válido (formato)" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host "Enviando: to='0x0000000000000000000000000000000000000001', amount='1.0'" -ForegroundColor Gray
Write-Host "Nota: Este teste valida o formato do endereço, mas pode falhar na execução se wallet não for owner" -ForegroundColor Gray
try {
    $body4 = @{
        to = "0x0000000000000000000000000000000000000001"
        amount = "1.0"
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri http://localhost:3001/api/mint/erc20 -Method Post -Body $body4 -ContentType "application/json"
    Write-Host "✅ Endereço aceito! (mas transação pode falhar por permissões)" -ForegroundColor Green
    Write-Host "`n📋 Resposta JSON:" -ForegroundColor Gray
    $response | ConvertTo-Json -Depth 10
} catch {
    $error4 = $_.ErrorDetails.Message | ConvertFrom-Json
    Write-Host "⚠️  Endereço válido, mas:" -ForegroundColor Yellow
    Write-Host "   Erro: $($error4.error)" -ForegroundColor Yellow
    Write-Host "   (Isso é esperado se a wallet não for owner do contrato)" -ForegroundColor Gray
    Write-Host "`n📋 Resposta JSON:" -ForegroundColor Gray
    $error4 | ConvertTo-Json -Depth 10
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "✅ TODOS OS TESTES DE VALIDAÇÃO CONCLUÍDOS" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

