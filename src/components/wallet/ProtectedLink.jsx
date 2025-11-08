import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import WalletConnectButton from './WalletConnectButton';

/**
 * Componente que protege rotas exigindo conexão de wallet antes de navegar
 */
const ProtectedLink = ({ to, children, className, size, variant, ...props }) => {
  const { isConnected } = useAccount();
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);
  const [pendingRoute, setPendingRoute] = useState(null);

  /**
   * Redireciona automaticamente após conexão da wallet
   */
  useEffect(() => {
    if (isConnected && pendingRoute && showDialog) {
      setShowDialog(false);
      setTimeout(() => {
        navigate(pendingRoute);
        setPendingRoute(null);
      }, 300);
    }
  }, [isConnected, pendingRoute, showDialog, navigate]);

  /**
   * Verifica conexão antes de navegar ou mostra dialog de conexão
   */
  const handleClick = (e) => {
    e.preventDefault();
    
    if (isConnected) {
      navigate(to);
    } else {
      setPendingRoute(to);
      setShowDialog(true);
    }
  };

  return (
    <>
      <Button
        onClick={handleClick}
        className={className}
        size={size}
        variant={variant}
        {...props}
      >
        {children}
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Conecte sua Wallet</DialogTitle>
            <DialogDescription>
              Para continuar, você precisa conectar sua Base Wallet.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 flex justify-center">
            <WalletConnectButton />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProtectedLink;

