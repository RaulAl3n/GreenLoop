import React from 'react';
import { Wallet as WalletIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { targetChain } from '@/lib/wagmi';
import { toast } from 'sonner';
import { ConnectWallet } from '@coinbase/onchainkit/wallet';
import WalletMenu from './WalletMenu';

/**
 * Formata endereço Ethereum para exibição (primeiros 6 e últimos 4 caracteres)
 */
const truncateAddress = (addr) => {
  if (!addr) return '';
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
};

const WalletConnectButton = ({ onConnect }) => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChainAsync, isPending: isSwitching } = useSwitchChain();

  React.useEffect(() => {
    if (isConnected && onConnect) {
      onConnect();
    }
  }, [isConnected, onConnect]);

  /**
   * Troca a rede para Base quando o usuário está em outra rede
   */
  const handleSwitch = async () => {
    try {
      await switchChainAsync({ chainId: targetChain.id });
      toast.success('Rede trocada para Base');
    } catch (err) {
      const message = String(err?.message || '');
      if (/rejected|denied/i.test(message)) {
        toast.info('Troca de rede cancelada');
      } else {
        toast.error('Não foi possível trocar a rede');
      }
    }
  };

  if (!isConnected) {
    return (
      <ConnectWallet
        disconnectedLabel={
          <span className="inline-flex items-center gap-2">
            <WalletIcon className="w-4 h-4" /> Conectar Base Wallet
          </span>
        }
        className="px-3 py-2 rounded-md border border-border bg-[#80b703] hover:bg-[#6c8631] text-white transition-colors"
      />
    );
  }

  const wrongNetwork = chainId !== targetChain.id;

  return (
    <div className="flex items-center gap-2">
      {wrongNetwork && (
        <Button variant="destructive" size="sm" onClick={handleSwitch} disabled={isSwitching}>
          {isSwitching ? 'Trocando...' : 'Trocar para Base'}
        </Button>
      )}

      <WalletMenu address={address}>
        <Button variant="outline" size="sm" className="gap-2 h-9 font-mono bg-blue-50 border-[#0052FF] hover:bg-blue-100">
          <WalletIcon className="w-3.5 h-3.5 text-[#0052FF]" />
          <span className="text-xs text-[#0052FF]">{truncateAddress(address)}</span>
        </Button>
      </WalletMenu>
    </div>
  );
};

export default WalletConnectButton;

