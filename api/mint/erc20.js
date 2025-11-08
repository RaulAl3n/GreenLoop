import { ethers } from 'ethers';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Função para carregar ABI
function loadABI() {
  const possiblePaths = [
    path.join(__dirname, '../abi/glPET-abi.json'), // api/abi/
    path.join(__dirname, '../../src/abi/glPET-abi.json'), // src/abi/
    path.join(process.cwd(), 'api/abi/glPET-abi.json'), // cwd/api/abi/
    path.join(process.cwd(), 'src/abi/glPET-abi.json'), // cwd/src/abi/
  ];

  for (const abiPath of possiblePaths) {
    try {
      if (fs.existsSync(abiPath)) {
        return JSON.parse(fs.readFileSync(abiPath, 'utf8'));
      }
    } catch (error) {
      console.error(`Erro ao tentar carregar ABI de ${abiPath}:`, error.message);
      continue;
    }
  }
  return null;
}

/**
 * Serverless Function para mint de tokens ERC20 (glPET)
 * POST /api/mint/erc20
 */
export default async function handler(req, res) {
  // Apenas POST permitido
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Método não permitido. Use POST.'
    });
  }

  try {
    // Carregar ABI
    const glPETAbi = loadABI();
    if (!glPETAbi) {
      return res.status(500).json({
        success: false,
        error: 'Não foi possível carregar o ABI do contrato glPET'
      });
    }

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

    // Configuração da rede Base Sepolia
    const BASE_RPC_URL = process.env.BASE_RPC_URL || 'https://sepolia.base.org';
    const PRIVATE_KEY = process.env.PRIVATE_KEY;
    const GLPET_CONTRACT_ADDRESS = process.env.GLPET_CONTRACT_ADDRESS || '0x35FbA5dE07ed5479c8a151b78013b8Fea0FE67B4';

    if (!PRIVATE_KEY) {
      return res.status(500).json({
        success: false,
        error: 'PRIVATE_KEY não configurada nas variáveis de ambiente do Vercel'
      });
    }

    // Configurar provider e wallet
    const provider = new ethers.JsonRpcProvider(BASE_RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

    // Criar instância do contrato
    const contract = new ethers.Contract(GLPET_CONTRACT_ADDRESS, glPETAbi, wallet);

    // Converter amount para wei
    const amountInWei = ethers.parseEther(amount.toString());

    console.log(`🪙 Mintando ${amount} glPET para ${to}...`);

    // Executar mint
    const tx = await contract.mint(to, amountInWei);
    console.log(`📝 Transação enviada: ${tx.hash}`);

    // Aguardar confirmação
    const receipt = await tx.wait();
    console.log(`✅ Transação confirmada no bloco ${receipt.blockNumber}`);

    return res.status(200).json({
      success: true,
      transactionHash: tx.hash,
      blockNumber: receipt.blockNumber,
      to,
      amount: amount.toString(),
      amountInWei: amountInWei.toString()
    });

  } catch (error) {
    console.error('❌ Erro ao fazer mint ERC20:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Erro ao executar mint',
      details: error.reason || error.code
    });
  }
}

