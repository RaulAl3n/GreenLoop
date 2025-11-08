/**
 * WalletConnectButton Component
 * 
 * A button component that manages the user's wallet connection status.
 * It integrates with Wagmi and Coinbase OnchainKit to handle wallet connection,
 * network switching, and wallet menu display. If the user is disconnected,
 * it shows a “Connect Wallet” button. If connected but on the wrong chain,
 * it prompts to switch networks.
 * 
 * @component
 * @param {Object} props - The component props.
 * @param {Function} [props.onConnect] - Optional callback executed when the wallet successfully connects.
 * @returns {JSX.Element} The rendered wallet connection button or wallet menu.
 */

import React from 'react';
import { Wallet as WalletIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { targetChain } from '@/lib/wagmi';
import { toast } from 'sonner';
import { ConnectWallet } from '@coinbase/onchainkit/wallet';
import WalletMenu from './WalletMenu';

/**
 * Truncates an Ethereum address for display purposes.
 * Example: 0x1234567890abcdef → 0x1234...cdef
 * 
 * @param {string} addr - The full wallet address.
 * @returns {string} The truncated address or an empty string if invalid.
 */
const truncateAddress = (addr) => {
  if (!addr) return '';
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
};

const WalletConnectButton = ({ onConnect }) => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChainAsync, isPending: isSwitching } = useSwitchChain();

  /**
   * Effect triggered when the wallet connection state changes.
   * If the wallet becomes connected and an `onConnect` callback is provided,
   * it executes the callback.
   */
  React.useEffect(() => {
    if (isConnected && onConnect) {
      onConnect();
    }
  }, [isConnected, onConnect]);

  /**
   * Handles network switching to the target chain (Base).
   * Displays appropriate toast messages based on the outcome.
   */
  const handleSwitch = async () => {
    try {
      await switchChainAsync({ chainId: targetChain.id });
      toast.success('Network switched to Base');
    } catch (err) {
      const message = String(err?.message || '');
      if (/rejected|denied/i.test(message)) {
        toast.info('Network switch canceled');
      } else {
        toast.error('Unable to switch network');
      }
    }
  };

  // If the wallet is not connected, render the Coinbase Connect button
  if (!isConnected) {
    return (
      <ConnectWallet
        disconnectedLabel={
          <span className="inline-flex items-center gap-2">
            <WalletIcon className="w-4 h-4" /> Connect Base Wallet
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
        <Button
          variant="destructive"
          size="sm"
          onClick={handleSwitch}
          disabled={isSwitching}
        >
          {isSwitching ? 'Switching...' : 'Switch to Base'}
        </Button>
      )}

      <WalletMenu address={address}>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 h-9 font-mono bg-blue-50 border-[#0052FF] hover:bg-blue-100"
        >
          <WalletIcon className="w-3.5 h-3.5 text-[#0052FF]" />
          <span className="text-xs text-[#0052FF]">
            {truncateAddress(address)}
          </span>
        </Button>
      </WalletMenu>
    </div>
  );
};

export default WalletConnectButton;
