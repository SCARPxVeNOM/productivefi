'use client';

import React, { useState, useEffect } from 'react';
import { useAccount, useEnsName } from 'wagmi';
import { WalletConnect } from './WalletConnect';
import { Wallet } from 'lucide-react';

export function WalletDisplay() {
  const { address, isConnected } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const [mounted, setMounted] = useState(false);
  
  // Set mounted state when component is on client
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Don't render anything on the server
  if (!mounted) return null;
  
  // If not connected, show regular wallet connect button
  if (!isConnected || !address) {
    return <WalletConnect preferredWallet="rainbow" />;
  }

  // Display connected wallet with Rainbow styling
  return (
    <div className="flex items-center gap-2 bg-gray-800 p-2 rounded-full border border-purple-500/30">
      {/* Rainbow logo */}
      <div className="flex items-center justify-center w-8 h-8 rounded-full overflow-hidden bg-black">
        <img 
          src="https://rainbow.me/favicon.ico" 
          alt="Rainbow" 
          className="w-5 h-5"
        />
      </div>
      
      {/* Connected address */}
      <div className="text-white text-sm font-medium px-2">
        {ensName || `${address.slice(0, 4)}...${address.slice(-4)}`}
      </div>
      
      {/* Rainbow indicator */}
      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500"></div>
    </div>
  );
} 