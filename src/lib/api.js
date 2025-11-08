/**
 * Helper para chamar os endpoints da API
 * Os endpoints estão disponíveis como Serverless Functions no Vercel
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

/**
 * Faz mint de tokens ERC20 (glPET)
 * @param {string} to - Endereço que receberá os tokens
 * @param {string} amount - Quantidade em formato string (ex: "100.5")
 * @returns {Promise<Object>} Resposta da API
 */
export async function mintERC20(to, amount) {
  const response = await fetch(`${API_BASE_URL}/api/mint/erc20`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to,
      amount: amount.toString(),
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao fazer mint');
  }

  return response.json();
}

/**
 * Faz mint de tokens ERC721 (glPETc)
 * @param {string} to - Endereço que receberá o NFT
 * @param {string} uri - URI do metadata do NFT (ex: "ipfs://...")
 * @returns {Promise<Object>} Resposta da API
 */
export async function mintERC721(to, uri) {
  const response = await fetch(`${API_BASE_URL}/api/mint/erc721`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to,
      uri,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao fazer mint');
  }

  return response.json();
}

/**
 * Health check da API
 * @returns {Promise<Object>} Status da API
 */
export async function healthCheck() {
  const response = await fetch(`${API_BASE_URL}/api/health`);
  
  if (!response.ok) {
    throw new Error('Erro ao verificar saúde da API');
  }

  return response.json();
}

