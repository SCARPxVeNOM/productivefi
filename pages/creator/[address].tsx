'use client';

import { useState } from 'react';
import { useAccount, useChainId, useWalletClient } from 'wagmi';
import { baseSepolia } from 'viem/chains';
import { uploadToPinata } from '../../src/lib/ipfs/upload';
import { useRouter } from 'next/router';
import { ethers } from 'ethers';

export default function LaunchCoin() {
  const router = useRouter();
  const { address } = useAccount();
  const chainId = useChainId();
  const { data: walletClient } = useWalletClient();
  const creatorAddress = router.query.address as string;
  
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    description: '',
    initialSupply: '',
    image: null as File | null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (!address) throw new Error('Please connect your wallet');
      if (chainId !== baseSepolia.id) throw new Error('Please switch to Base Sepolia network');
      if (!walletClient) throw new Error('Wallet client not found');
      if (address.toLowerCase() !== creatorAddress.toLowerCase()) {
        throw new Error('You can only create coins for your own address');
      }

      // 1. Create metadata
      const metadata = {
        name: formData.name,
        symbol: formData.symbol,
        description: formData.description,
        image: formData.image ? URL.createObjectURL(formData.image) : '',
        creator: creatorAddress,
      };

      // 2. Upload metadata to IPFS
      const metadataResult = await uploadToPinata(metadata);

      // 3. Create provider and signer
      const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC);
      const signer = new ethers.Wallet(process.env.NEXT_PUBLIC_PRIVATE_KEY || '', provider);

      // 4. Deploy token
      const tokenFactory = new ethers.ContractFactory(
        ['function initialize(string memory name, string memory symbol, uint256 initialSupply, string memory metadataURI)'],
        '0x...', // Your token implementation address
        signer
      );

      const token = await tokenFactory.deploy();
      const tx = await token.initialize(
        formData.name,
        formData.symbol,
        ethers.parseEther(formData.initialSupply),
        metadataResult.url
      );

      const receipt = await tx.wait();

      setSuccess(`Token deployed successfully! Transaction: ${receipt.hash}`);
      // Optionally redirect to the new coin page
      // router.push(`/creator/${creatorAddress}/coin/${receipt.hash}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Launch Your Creator Coin</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Token Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Token Symbol</label>
              <input
                type="text"
                name="symbol"
                value={formData.symbol}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Initial Supply</label>
              <input
                type="number"
                name="initialSupply"
                value={formData.initialSupply}
                onChange={handleInputChange}
                required
                min="0"
                step="0.000001"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Token Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-1 block w-full"
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}

            {success && (
              <div className="text-green-600 text-sm">{success}</div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? 'Launching...' : 'Launch Coin'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 