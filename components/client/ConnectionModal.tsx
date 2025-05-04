'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from './WalletContext';
import { X, Wallet, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useConnect } from 'wagmi';

export function ConnectionModal() {
  const { requiresConnection, setRequiresConnection, isWalletConnected } = useWallet();
  const connectResult = useConnect();
  const [hasWallet, setHasWallet] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Check if MetaMask or other wallet is available
  useEffect(() => {
    if (!requiresConnection) return;
    
    const hasEthereum = typeof window !== 'undefined' && window.ethereum !== undefined;
    setHasWallet(hasEthereum);
    
    if (connectResult.error) {
      console.error('Wallet connection error:', connectResult.error);
    }
  }, [requiresConnection, connectResult.error]);
  
  if (isWalletConnected) {
    setRequiresConnection(false);
    return null;
  }
  
  // Simple connect function
  const handleConnect = async () => {
    setIsLoading(true);
    try {
      if (connectResult.connectors && connectResult.connectors.length > 0) {
        await connectResult.connect({ connector: connectResult.connectors[0] });
        setRequiresConnection(false);
      }
    } catch (error) {
      console.error("Connection error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Open MetaMask install page
  const installMetaMask = () => {
    window.open('https://metamask.io/download/', '_blank');
  };
  
  return (
    <AnimatePresence>
      {requiresConnection && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setRequiresConnection(false)}
          />
          
          <motion.div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-900 rounded-xl p-6 z-50 w-[90%] max-w-md shadow-xl border border-purple-500/30"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Connect Your Wallet</h2>
              <button 
                onClick={() => setRequiresConnection(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            
            {hasWallet ? (
              <>
                <p className="text-gray-300 mb-6">
                  Connect your wallet to access Creator Coins features.
                </p>
                
                <Button
                  variant="default"
                  className="w-full p-3 text-base justify-center bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
                  onClick={handleConnect}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                  ) : (
                    <Wallet className="h-5 w-5 mr-3" />
                  )}
                  Connect Wallet
                </Button>
              </>
            ) : (
              <>
                <p className="text-gray-300 mb-6">
                  You need a wallet to use Creator Coins. We recommend MetaMask:
                </p>
                
                <Button
                  variant="default"
                  className="w-full p-3 text-base justify-center bg-gradient-to-r from-orange-500 to-amber-500"
                  onClick={installMetaMask}
                >
                  <img src="https://metamask.io/images/metamask-fox.svg" alt="MetaMask" className="h-5 w-5 mr-3" />
                  Install MetaMask
                </Button>
                
                <p className="text-gray-400 text-sm mt-4">
                  After installing, refresh this page to connect your wallet.
                </p>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 