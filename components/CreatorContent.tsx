import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { getCoin } from '@zoralabs/coins-sdk';
import { base } from 'viem/chains';
import { createPublicClient, http } from 'viem';
import { notification } from '../utils/notification';

interface CreatorContentProps {
  coinAddress: string;
}

interface CoinData {
  name: string;
  symbol: string;
  description: string;
  address: string;
  totalSupply: string;
  uri: string;
  creator: string;
}

export const CreatorContent: React.FC<CreatorContentProps> = ({ coinAddress }) => {
  const { address: userAddress } = useAccount();
  const [coin, setCoin] = useState<CoinData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userBalance, setUserBalance] = useState('0');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const loadCoinData = async () => {
      try {
        const publicClient = createPublicClient({
          chain: base,
          transport: http()
        });

        const coinData = await getCoin({
          address: coinAddress,
          chain: base.id,
          publicClient
        });

        setCoin({
          name: coinData.name,
          symbol: coinData.symbol,
          description: coinData.description || '',
          address: coinData.address,
          totalSupply: coinData.totalSupply.toString(),
          uri: coinData.uri,
          creator: coinData.creator
        });
      } catch (error) {
        console.error('Error loading coin data:', error);
        notification.error('Failed to load creator coin data');
      } finally {
        setIsLoading(false);
      }
    };

    loadCoinData();
  }, [coinAddress]);

  const handleBuyTokens = async () => {
    // Implement token purchase logic using Zora SDK
    try {
      // Add your token purchase implementation here
      notification.success('Tokens purchased successfully!');
    } catch (error) {
      console.error('Error buying tokens:', error);
      notification.error('Failed to buy tokens');
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Create form data
      const formData = new FormData();
      formData.append('file', file);

      // Upload to IPFS (you'll need to implement this endpoint)
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      notification.success('File uploaded successfully!');
      
      // Here you would typically update the coin's URI with the new IPFS hash
      // This would require additional contract interaction
      
    } catch (error) {
      console.error('Error uploading file:', error);
      notification.error('Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return <div className="text-center">Loading...</div>;
  }

  if (!coin) {
    return <div className="text-center text-red-500">Creator coin not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">{coin.name}</h2>
            <p className="text-gray-600">{coin.symbol}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Total Supply</p>
            <p className="text-lg font-semibold">{coin.totalSupply}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Creator</p>
            <p className="text-lg font-semibold">{coin.creator}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Contract Address</p>
            <p className="text-lg font-semibold">{coin.address}</p>
          </div>
        </div>

        {userAddress && (
          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Your Balance</p>
                <p className="text-lg font-semibold">{userBalance} {coin.symbol}</p>
              </div>
              <button
                onClick={handleBuyTokens}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Buy Tokens
              </button>
            </div>
          </div>
        )}

        {userAddress && userAddress.toLowerCase() === coin?.creator.toLowerCase() && (
          <div className="mt-6 border-t pt-4">
            <h3 className="text-lg font-semibold mb-4">Upload Content</h3>
            <div className="flex items-center space-x-4">
              <label className="relative cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <span>{isUploading ? 'Uploading...' : 'Upload File'}</span>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                />
              </label>
              {isUploading && (
                <div className="text-sm text-gray-500">
                  Uploading...
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4">Creator Content</h3>
        <p className="text-gray-700">{coin.description}</p>
        {coin.uri && (
          <div className="mt-4">
            <p className="text-sm text-gray-500">Content URI:</p>
            <a 
              href={coin.uri.replace('ipfs://', 'https://ipfs.io/ipfs/')}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 break-all"
            >
              {coin.uri}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}; 