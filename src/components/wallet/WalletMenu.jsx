/**
 * WalletMenu Component
 * 
 * A dropdown menu component for managing wallet-related actions.
 * It allows users to copy their wallet address, view it on the BaseScan explorer,
 * or disconnect their wallet using Wagmi.
 * 
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.address - The connected wallet address.
 * @param {React.ReactNode} props.children - The trigger element for the dropdown (usually a button).
 * @returns {JSX.Element} The rendered wallet management dropdown menu.
 */

import React from 'react';
import { Copy, ExternalLink, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDisconnect } from 'wagmi';
import { toast } from 'sonner';

/**
 * Menu dropdown com opções da wallet conectada (copiar, ver no explorer, desconectar)
 */
const WalletMenu = ({ address, children }) => {
  const { disconnect } = useDisconnect();

  /**
   * Copies the wallet address to the user's clipboard.
   * Displays a success toast on success or an error toast if copying fails.
   * 
   * @async
   */
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      toast.success('Address copied!');
    } catch (error) {
      toast.error('Failed to copy address');
    }
  };

  /**
   * Opens the BaseScan explorer in a new browser tab
   * showing the user's wallet address.
   */
  const handleViewOnExplorer = () => {
    window.open(`https://sepolia.basescan.org/address/${address}`, '_blank');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={handleCopy} className="cursor-pointer">
          <Copy className="w-4 h-4 mr-2" />
          Copy address
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleViewOnExplorer} className="cursor-pointer">
          <ExternalLink className="w-4 h-4 mr-2" />
          View on BaseScan
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => disconnect()}
          className="text-destructive cursor-pointer focus:text-destructive"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default WalletMenu;
