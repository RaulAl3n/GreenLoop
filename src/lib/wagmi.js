import { createConfig, http } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { coinbaseWallet } from 'wagmi/connectors';

/**
 * Rede principal da aplicação (Base Sepolia)
 */
export const targetChain = baseSepolia;

/**
 * Configuração do Wagmi para conexão com wallets e interação com blockchain
 */
export const wagmiConfig = createConfig({
  chains: [base, baseSepolia],
  connectors: [
    coinbaseWallet({
      appName: 'GreenLoop',
      appLogoUrl: window.location.origin + '/icon.svg',
    }),
  ],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
});

