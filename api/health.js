/**
 * Serverless Function para health check
 * GET /api/health
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Método não permitido. Use GET.'
    });
  }

  const GLPET_CONTRACT_ADDRESS = process.env.GLPET_CONTRACT_ADDRESS || '0x35FbA5dE07ed5479c8a151b78013b8Fea0FE67B4';
  const GLPETC_CONTRACT_ADDRESS = process.env.GLPETC_CONTRACT_ADDRESS;
  const BASE_RPC_URL = process.env.BASE_RPC_URL || 'https://sepolia.base.org';
  const PRIVATE_KEY = process.env.PRIVATE_KEY;

  let walletAddress = 'não configurado';
  if (PRIVATE_KEY) {
    try {
      const { ethers } = await import('ethers');
      const provider = new ethers.JsonRpcProvider(BASE_RPC_URL);
      const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
      walletAddress = wallet.address;
    } catch (error) {
      console.error('Erro ao obter endereço da wallet:', error);
    }
  }

  return res.status(200).json({
    status: 'ok',
    network: 'Base Sepolia',
    wallet: walletAddress,
    contracts: {
      glPET: GLPET_CONTRACT_ADDRESS,
      glPETc: GLPETC_CONTRACT_ADDRESS || 'não configurado'
    },
    environment: process.env.VERCEL_ENV || 'development'
  });
}

