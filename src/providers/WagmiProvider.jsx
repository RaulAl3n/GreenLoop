import React from 'react';
import { WagmiProvider as WagmiProviderBase } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { wagmiConfig, targetChain } from '@/lib/wagmi';

const queryClient = new QueryClient();

const WagmiProvider = ({ children }) => {
  return (
    <WagmiProviderBase config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          chain={targetChain}
          config={{
            account: {
              createOnConnect: true,
            },
          }}
        >
          {children}
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProviderBase>
  );
};

export default WagmiProvider;

