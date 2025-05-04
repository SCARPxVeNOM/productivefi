'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

type WalletContextType = {
  isWalletConnected: boolean;
  requiresConnection: boolean;
  setRequiresConnection: (value: boolean) => void;
};

const defaultContext: WalletContextType = {
  isWalletConnected: false,
  requiresConnection: false,
  setRequiresConnection: () => {},
};

const WalletContext = createContext<WalletContextType>(defaultContext);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const { isConnected = false } = useAccount();
  const [requiresConnection, setRequiresConnection] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Set mounted state when component is on client
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Update connection status whenever isConnected changes
  useEffect(() => {
    if (!mounted) return;
    
    setIsWalletConnected(isConnected);
    
    // If connected, no need to show connection modal
    if (isConnected) {
      setRequiresConnection(false);
    }
  }, [isConnected, mounted]);

  return (
    <WalletContext.Provider 
      value={{ 
        isWalletConnected: mounted ? isWalletConnected : false, 
        requiresConnection: mounted ? requiresConnection : false,
        setRequiresConnection,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  return useContext(WalletContext);
} 