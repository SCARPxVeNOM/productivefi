'use client';

import React, { useState, useEffect } from 'react';
import { useConnect, useAccount, useDisconnect } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Loader2, Wallet, LogOut } from 'lucide-react';
import { injected } from 'wagmi/connectors';

export function WalletConnect({ preferredWallet = 'any' }: { preferredWallet?: 'rainbow' | 'metamask' | 'any' }) {
  const { connectors, connect, isPending: isConnectPending, error: connectError } = useConnect();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [hasWallet, setHasWallet] = useState(false);
  const [hasRainbow, setHasRainbow] = useState(false);
  const [hasMetaMask, setHasMetaMask] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Set mounted state to true when component mounts on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Detect available wallets - only run on client
  useEffect(() => {
    if (!mounted) return;
    
    const checkWallets = () => {
      if (typeof window === 'undefined') return;
      
      const ethereum = window.ethereum;
      if (!ethereum) {
        setHasWallet(false);
        return;
      }
      
      setHasWallet(true);
      setHasRainbow(!!ethereum.isRainbow);
      setHasMetaMask(!!ethereum.isMetaMask);
    };
    
    checkWallets();
    
    if (connectError) {
      console.error('Wallet connection error:', connectError);
    }
  }, [connectError, mounted]);

  // Basic connect function that uses the appropriate connector
  const handleConnect = async () => {
    setIsLoading(true);
    try {
      if (connectors.length === 0) return;
      
      let connector = connectors[0]; // Default to first connector
      
      // Try to find preferred connector
      if (preferredWallet === 'rainbow' && hasRainbow) {
        // When Rainbow is installed, the injected connector will work with it
        connector = connectors.find(c => c.id === 'injected') || connectors[0];
      } else if (preferredWallet === 'metamask' && hasMetaMask) {
        connector = connectors.find(c => c.id === 'injected') || connectors[0];
      }
      
      connect({ connector });
    } catch (err) {
      console.error('Connection error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render anything until client-side
  if (!mounted) return null;

  // If connected, show address and disconnect button
  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <p className="text-sm text-gray-300">
          {address.slice(0, 6)}...{address.slice(-4)}
        </p>
        <Button 
          variant="outline"
          onClick={() => disconnect()}
          className="px-2 py-1 text-xs border-red-500 text-red-400 hover:bg-red-500/10"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Disconnect
        </Button>
      </div>
    );
  }

  // If no wallet is detected, show install prompt
  if (!hasWallet) {
    return (
      <Button 
        variant="outline" 
        onClick={() => window.open('https://metamask.io/download/', '_blank')}
        className="bg-[#1969FF] hover:bg-[#0F5BFF] text-white"
      >
        <Wallet className="h-4 w-4 mr-2" />
        Install Wallet
      </Button>
    );
  }

  // Show connect button
  return (
    <Button 
      onClick={handleConnect}
      disabled={isLoading || isConnectPending}
      className="bg-[#1969FF] hover:bg-[#0F5BFF] text-white"
    >
      {(isLoading || isConnectPending) ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <Wallet className="h-4 w-4 mr-2" />
      )}
      Connect Wallet
    </Button>
  );
} 