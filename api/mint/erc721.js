import { ethers } from 'ethers';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Função para carregar ABI
function loadABI() {
  const possiblePaths = [
    path.join(__dirname, '../abi/glPETc-abi.json'), // api/abi/
    path.join(__dirname, '../../src/abi/glPETc-abi.json'), // src/abi/
    path.join(process.cwd(), 'api/abi/glPETc-abi.json'), // cwd/api/abi/
    path.join(process.cwd(), 'src/abi/glPETc-abi.json'), // cwd/src/abi/
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
 * Serverless Function para mint de tokens ERC721 (glPETc)
 * POST /api/mint/erc721
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
    const glPETcAbi = loadABI();
    if (!glPETcAbi) {
      return res.status(500).json({
        success: false,
        error: 'Não foi possível carregar o ABI do contrato glPETc'
      });
    }

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

    // Configuração da rede Base Sepolia
    const BASE_RPC_URL = process.env.BASE_RPC_URL || 'https://sepolia.base.org';
    const PRIVATE_KEY = process.env.PRIVATE_KEY;
    const GLPETC_CONTRACT_ADDRESS = process.env.GLPETC_CONTRACT_ADDRESS;

    if (!PRIVATE_KEY) {
      return res.status(500).json({
        success: false,
        error: 'PRIVATE_KEY não configurada nas variáveis de ambiente do Vercel'
      });
    }

    if (!GLPETC_CONTRACT_ADDRESS) {
      return res.status(500).json({
        success: false,
        error: 'Endereço do contrato glPETc não configurado'
      });
    }

    // Configurar provider e wallet
    const provider = new ethers.JsonRpcProvider(BASE_RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

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

    return res.status(200).json({
      success: true,
      transactionHash: tx.hash,
      blockNumber: receipt.blockNumber,
      to,
      uri,
      tokenId: tokenId || 'não encontrado'
    });

  } catch (error) {
    console.error('❌ Erro ao fazer mint ERC721:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Erro ao executar mint',
      details: error.reason || error.code
    });
  }
}

