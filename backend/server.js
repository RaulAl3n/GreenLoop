import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ethers } from 'ethers';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Carregar variáveis de ambiente
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Configuração da rede Base
const BASE_RPC_URL = process.env.BASE_RPC_URL || 'https://sepolia.base.org';
const PRIVATE_KEY = process.env.PRIVATE_KEY;

if (!PRIVATE_KEY) {
  console.error('❌ PRIVATE_KEY não configurada no .env');
  process.exit(1);
}

// Endereços dos contratos (configurar no .env)
const GLPET_CONTRACT_ADDRESS = process.env.GLPET_CONTRACT_ADDRESS || '0x35FbA5dE07ed5479c8a151b78013b8Fea0FE67B4';
const GLPETC_CONTRACT_ADDRESS = process.env.GLPETC_CONTRACT_ADDRESS;

if (!GLPETC_CONTRACT_ADDRESS) {
  console.warn('⚠️  GLPETC_CONTRACT_ADDRESS não configurada no .env');
}

// Carregar ABIs
const glPETAbi = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'abi', 'glPET-abi.json'), 'utf8')
);

const glPETcAbi = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'abi', 'glPETc-abi.json'), 'utf8')
);

// Configurar provider e wallet
const provider = new ethers.JsonRpcProvider(BASE_RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

console.log('🔗 Conectado à rede Base');
console.log('👛 Wallet:', wallet.address);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    network: 'Base',
    wallet: wallet.address,
    contracts: {
      glPET: GLPET_CONTRACT_ADDRESS,
      glPETc: GLPETC_CONTRACT_ADDRESS || 'não configurado'
    }
  });
});

/**
 * Endpoint para mint de tokens ERC20 (glPET)
 * POST /api/mint/erc20
 * Body: { to: string, amount: string } (amount em formato de string, será convertido para wei)
 */
app.post('/api/mint/erc20', async (req, res) => {
  try {
    const { to, amount } = req.body;

    // Validações
    if (!to || !amount) {
      return res.status(400).json({
        success: false,
        error: 'Parâmetros obrigatórios: to (endereço) e amount (quantidade)'
      });
    }

    if (!ethers.isAddress(to)) {
      return res.status(400).json({
        success: false,
        error: 'Endereço inválido'
      });
    }

    // Criar instância do contrato
    const contract = new ethers.Contract(GLPET_CONTRACT_ADDRESS, glPETAbi, wallet);

    // Converter amount para wei (assumindo que amount vem em formato de string de ether)
    const amountInWei = ethers.parseEther(amount.toString());

    console.log(`🪙 Mintando ${amount} glPET para ${to}...`);

    // Executar mint
    const tx = await contract.mint(to, amountInWei);
    console.log(`📝 Transação enviada: ${tx.hash}`);

    // Aguardar confirmação
    const receipt = await tx.wait();
    console.log(`✅ Transação confirmada no bloco ${receipt.blockNumber}`);

    res.json({
      success: true,
      transactionHash: tx.hash,
      blockNumber: receipt.blockNumber,
      to,
      amount: amount.toString(),
      amountInWei: amountInWei.toString()
    });

  } catch (error) {
    console.error('❌ Erro ao fazer mint ERC20:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Erro ao executar mint',
      details: error.reason || error.code
    });
  }
});

/**
 * Endpoint para mint de tokens ERC721 (glPETc)
 * POST /api/mint/erc721
 * Body: { to: string, uri: string }
 */
app.post('/api/mint/erc721', async (req, res) => {
  try {
    const { to, uri } = req.body;

    // Validações
    if (!to || !uri) {
      return res.status(400).json({
        success: false,
        error: 'Parâmetros obrigatórios: to (endereço) e uri (URI do token)'
      });
    }

    if (!ethers.isAddress(to)) {
      return res.status(400).json({
        success: false,
        error: 'Endereço inválido'
      });
    }

    if (!GLPETC_CONTRACT_ADDRESS) {
      return res.status(500).json({
        success: false,
        error: 'Endereço do contrato glPETc não configurado'
      });
    }

    // Criar instância do contrato
    const contract = new ethers.Contract(GLPETC_CONTRACT_ADDRESS, glPETcAbi, wallet);

    console.log(`🎨 Mintando NFT glPETc para ${to} com URI: ${uri}...`);

    // Executar safeMint
    const tx = await contract.safeMint(to, uri);
    console.log(`📝 Transação enviada: ${tx.hash}`);

    // Aguardar confirmação
    const receipt = await tx.wait();
    console.log(`✅ Transação confirmada no bloco ${receipt.blockNumber}`);

    // Obter o tokenId (o evento Transfer será emitido)
    const transferEvent = receipt.logs.find(log => {
      try {
        const parsed = contract.interface.parseLog(log);
        return parsed && parsed.name === 'Transfer';
      } catch {
        return false;
      }
    });

    let tokenId = null;
    if (transferEvent) {
      const parsed = contract.interface.parseLog(transferEvent);
      tokenId = parsed.args.tokenId.toString();
    }

    res.json({
      success: true,
      transactionHash: tx.hash,
      blockNumber: receipt.blockNumber,
      to,
      uri,
      tokenId: tokenId || 'não encontrado'
    });

  } catch (error) {
    console.error('❌ Erro ao fazer mint ERC721:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Erro ao executar mint',
      details: error.reason || error.code
    });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📡 Endpoints disponíveis:`);
  console.log(`   GET  /health`);
  console.log(`   POST /api/mint/erc20`);
  console.log(`   POST /api/mint/erc721`);
});

