'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from './WalletContext';
import { X, Wallet, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useConnect } from 'wagmi';
import { injected } from 'wagmi/connectors';

export function ConnectionModal() {
  const { requiresConnection, setRequiresConnection, isWalletConnected } = useWallet();
  const { connectors, connect, isPending, error } = useConnect();
  const [hasWallet, setHasWallet] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Set mounted state when component is on client
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Check if MetaMask or other wallet is available
  useEffect(() => {
    if (!mounted || !requiresConnection) return;
    
    const hasEthereum = typeof window !== 'undefined' && window.ethereum !== undefined;
    setHasWallet(hasEthereum);
    
    if (error) {
      console.error('Wallet connection error:', error);
    }
  }, [requiresConnection, error, mounted]);
  
  // Simple connect function
  const handleConnect = async () => {
    setIsLoading(true);
    try {
      if (connectors && connectors.length > 0) {
        const connector = connectors.find(c => c.id === 'injected') || connectors[0];
        connect({ connector });
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
  
  // Don't render anything on the server
  if (!mounted) return null;
  
  // If connected or not requesting connection, don't render
  if (isWalletConnected || !requiresConnection) {
    return null;
  }
  
  return (
    <AnimatePresence>
      {requiresConnection && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-5 max-w-md w-full mx-4 shadow-xl"
          >
            {/* Close button */}
            <div className="flex justify-end">
              <button 
                onClick={() => setRequiresConnection(false)}
                className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X size={18} />
              </button>
            </div>
            
            {/* Content */}
            <div className="text-center mt-2 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">Connect Wallet</h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Connect your wallet to interact with the application
              </p>
            </div>
            
            {/* Connection options */}
            <div className="space-y-4">
              {hasWallet ? (
                <Button
                  variant="default"
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={handleConnect}
                  disabled={isLoading || isPending}
                >
                  {(isLoading || isPending) ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Wallet className="h-4 w-4 mr-2" />
                  )}
                  Connect to {typeof window !== 'undefined' && window.ethereum?.isMetaMask ? 'MetaMask' : 'Wallet'}
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="w-full py-2 border-blue-500 text-blue-600 hover:bg-blue-50"
                  onClick={installMetaMask}
                >
                  Install MetaMask
                </Button>
              )}
              
              <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
                By connecting, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 