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
  const { isConnected } = useAccount();
  const [requiresConnection, setRequiresConnection] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  
  // Update connection status whenever isConnected changes
  useEffect(() => {
    setIsWalletConnected(isConnected);
    
    // If connected, no need to show connection modal
    if (isConnected) {
      setRequiresConnection(false);
    }
  }, [isConnected]);

  return (
    <WalletContext.Provider 
      value={{ 
        isWalletConnected, 
        requiresConnection,
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