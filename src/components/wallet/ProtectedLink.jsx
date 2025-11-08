/**
 * ProtectedLink Component
 * 
 * A navigation button that ensures the user is connected to a Web3 wallet
 * (via Wagmi) before navigating to a protected route. If the user is not
 * connected, a dialog appears prompting them to connect their wallet.
 * 
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.to - The target route to navigate to after connection.
 * @param {React.ReactNode} props.children - The button label or inner content.
 * @param {string} [props.className] - Optional Tailwind CSS class names for custom styling.
 * @param {string} [props.size] - The size variant for the button.
 * @param {string} [props.variant] - The style variant for the button.
 * @returns {JSX.Element} The rendered protected navigation button and wallet dialog.
 */

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

const ProtectedLink = ({ to, children, className, size, variant, ...props }) => {
  const { isConnected } = useAccount();
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);
  const [pendingRoute, setPendingRoute] = useState(null);

  /**
   * Effect that triggers when the user connects their wallet.
   * If a route is pending and the dialog is open, closes the dialog and navigates.
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
   * Handles the button click event.
   * 
   * If the user is connected, navigates directly to the target route.
   * Otherwise, opens the wallet connection dialog and stores the intended route.
   * 
   * @param {React.MouseEvent<HTMLButtonElement>} e - The click event.
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
            <DialogTitle>Connect your Wallet</DialogTitle>
            <DialogDescription>
              To continue, you need to connect your Base Wallet.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 flex justify-center">
            <WalletConnectButton />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProtectedLink;
