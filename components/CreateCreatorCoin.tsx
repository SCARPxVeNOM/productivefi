import React, { useState } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import { createCoin } from '@zoralabs/coins-sdk';
import { base } from 'viem/chains';
import { createPublicClient, http } from 'viem';
import { notification } from '../utils/notification';
import { uploadToIPFS } from '../lib/utils/ipfs';

interface CreateCreatorCoinProps {
  onSuccess?: (coinAddress: string) => void;
}

export const CreateCreatorCoin: React.FC<CreateCreatorCoinProps> = ({ onSuccess }) => {
  const { address: creatorAddress } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    description: '',
    mediaUri: '',
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setIsUploading(true);
    try {
      const result = await uploadToIPFS(file, "file");
      setFormData(prev => ({ ...prev, mediaUri: `ipfs://${result.cid || result.path}` }));
      notification.success('File uploaded to IPFS successfully!');
    } catch (error) {
      notification.error('Failed to upload file to IPFS');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!creatorAddress || !walletClient) {
      notification.error('Please connect your wallet first');
      return;
    }
    if (!formData.mediaUri) {
      notification.error('Please upload a file first');
      return;
    }
    setIsLoading(true);
    try {
      const publicClient = createPublicClient({
        chain: base,
        transport: http()
      });
      const { request } = await createCoin({
        name: formData.name,
        symbol: formData.symbol,
        uri: formData.mediaUri,
        payoutRecipient: creatorAddress,
        initialPurchaseWei: BigInt(0),
        chain: base.id,
        publicClient
      });
      const hash = await walletClient.writeContract(request);
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      const coinAddress = receipt.logs[0].address;
      notification.success('Creator coin created successfully!');
      onSuccess?.(coinAddress);
    } catch (error) {
      console.error('Error creating creator coin:', error);
      notification.error('Failed to create creator coin');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Create Your Creator Coin</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Symbol</label>
          <input
            type="text"
            value={formData.symbol}
            onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            rows={3}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Upload Content</label>
          <div className="mt-1 flex items-center space-x-4">
            <input
              type="file"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-50 file:text-indigo-700
                hover:file:bg-indigo-100"
              accept="image/*,video/*,audio/*"
            />
            {isUploading && (
              <span className="text-sm text-gray-500">Uploading...</span>
            )}
          </div>
          {formData.mediaUri && (
            <div className="mt-2">
              <p className="text-sm text-gray-500">IPFS URI:</p>
              <p className="text-sm text-indigo-600 break-all">{formData.mediaUri}</p>
            </div>
          )}
        </div>
        <button
          type="submit"
          disabled={isLoading || isUploading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isLoading ? 'Creating...' : 'Create Creator Coin'}
        </button>
      </form>
    </div>
  );
}; 