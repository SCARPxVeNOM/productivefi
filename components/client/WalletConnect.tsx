'use client';

import React, { useState, useEffect } from 'react';
import { useConnect, useAccount, useDisconnect } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Loader2, Wallet, LogOut } from 'lucide-react';

export function WalletConnect({ preferredWallet = 'any' }: { preferredWallet?: 'rainbow' | 'metamask' | 'any' }) {
  const connectResult = useConnect();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [hasWallet, setHasWallet] = useState(false);
  const [hasRainbow, setHasRainbow] = useState(false);
  const [hasMetaMask, setHasMetaMask] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Detect available wallets
  useEffect(() => {
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
    
    if (connectResult.error) {
      console.error('Wallet connection error:', connectResult.error);
    }
  }, [connectResult.error]);

  // Basic connect function that uses the appropriate connector
  const handleConnect = async () => {
    setIsLoading(true);
    try {
      if (connectResult.connectors.length === 0) return;
      
      let connector = connectResult.connectors[0]; // Default to first connector
      
      // Try to find preferred connector
      if (preferredWallet === 'rainbow' && hasRainbow) {
        // When Rainbow is installed, the injected connector will work with it
        connector = connectResult.connectors.find(c => c.id === 'injected') || connectResult.connectors[0];
      } else if (preferredWallet === 'metamask' && hasMetaMask) {
        connector = connectResult.connectors.find(c => c.id === 'injected') || connectResult.connectors[0];
      }
      
      await connectResult.connect({ connector });
    } catch (err) {
      console.error('Connection error:', err);
    } finally {
      setIsLoading(false);
    }
  };

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

  // Determine button content based on detected wallets and preference
  const getButtonContent = () => {
    if (preferredWallet === 'rainbow' && hasRainbow) {
      return (
        <>
          <img src="https://rainbow.me/favicon.ico" alt="Rainbow" className="h-4 w-4 mr-2" />
          Connect Rainbow
        </>
      );
    } else if (preferredWallet === 'metamask' && hasMetaMask) {
      return (
        <>
          <img src="https://metamask.io/images/metamask-fox.svg" alt="MetaMask" className="h-4 w-4 mr-2" />
          Connect MetaMask
        </>
      );
    } else if (hasRainbow) {
      return (
        <>
          <img src="https://rainbow.me/favicon.ico" alt="Rainbow" className="h-4 w-4 mr-2" />
          Connect Rainbow
        </>
      );
    } else if (hasMetaMask) {
      return (
        <>
          <img src="https://metamask.io/images/metamask-fox.svg" alt="MetaMask" className="h-4 w-4 mr-2" />
          Connect MetaMask
        </>
      );
    } else {
      return (
        <>
          <Wallet className="h-4 w-4 mr-2" />
          Connect Wallet
        </>
      );
    }
  };

  // Determine button style based on preferred wallet
  const getButtonStyle = () => {
    if (preferredWallet === 'rainbow' && hasRainbow) {
      return "bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600";
    } else {
      return "bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600";
    }
  };

  // If not connected, show connect button
  return (
    <Button
      variant="default"
      className={`px-3 py-1 text-sm ${getButtonStyle()}`}
      onClick={handleConnect}
      disabled={isLoading || !hasWallet}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        getButtonContent()
      )}
    </Button>
  );
} 