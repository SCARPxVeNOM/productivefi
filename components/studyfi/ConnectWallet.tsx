'use client';

import { useAccount, useConnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { useState, useEffect } from 'react';

export default function ConnectWallet() {
  const { isConnected, address } = useAccount();
  const { connect } = useConnect();
  const [mounted, setMounted] = useState(false);

  // Only show UI once component is mounted on client
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleConnect = () => {
    connect({ connector: injected() });
  };

  // Don't render anything until client-side
  if (!mounted) return null;

  return (
    <div className="my-4">
      {!isConnected ? (
        <button
          onClick={handleConnect}
          type="button"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
        >
          Connect Wallet
        </button>
      ) : (
        <div className="flex items-center gap-3">
          <div className="bg-gray-100 dark:bg-gray-700 py-2 px-3 rounded-md">
            <span className="text-sm font-medium truncate max-w-[120px] inline-block">
              {address ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : ''}
            </span>
          </div>
        </div>
      )}
    </div>
  );
} 