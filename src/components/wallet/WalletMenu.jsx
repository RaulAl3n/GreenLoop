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
   * Copia o endereço da wallet para a área de transferência
   */
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      toast.success('Endereço copiado!');
    } catch (error) {
      toast.error('Erro ao copiar endereço');
    }
  };

  /**
   * Abre o endereço no Basescan em nova aba
   */
  const handleViewOnExplorer = () => {
    window.open(`https://basescan.org/address/${address}`, '_blank');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={handleCopy} className="cursor-pointer">
          <Copy className="w-4 h-4 mr-2" />
          Copiar endereço
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleViewOnExplorer} className="cursor-pointer">
          <ExternalLink className="w-4 h-4 mr-2" />
          Ver no Basescan
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => disconnect()}
          className="text-destructive cursor-pointer focus:text-destructive"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Desconectar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default WalletMenu;

