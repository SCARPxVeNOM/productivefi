'use client';

import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { createPublicClient, createWalletClient, http } from 'viem';
import { mainnet } from 'viem/chains';
import { injected } from 'wagmi/connectors';
import { createCreatorClient } from '@zoralabs/protocol-sdk';
import { uploadFileToIPFS } from '../../app/lib/uploadToIPFSClient';
import { uploadMetadataToIPFS } from '../../app/lib/uploadMetadataToIPFSClient';

const UploadMint = () => {
  const { address, isConnected } = useAccount();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [minting, setMinting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const handleMintNFT = async () => {
    if (!file || !address || !isConnected) {
      setStatus('Please connect your wallet and select a file');
      return;
    }

    if (!title.trim()) {
      setStatus('Please provide a title for your NFT');
      return;
    }

    setMinting(true);
    setStatus('Uploading media to IPFS...');

    try {
      const mediaURI = await uploadFileToIPFS(file);

      setStatus('Uploading metadata...');
      const metadata = {
        name: title,
        description: description || 'NFT created on Zora via EduCreator',
        image: mediaURI,
        attributes: [
          { trait_type: 'type', value: 'educational' },
          { trait_type: 'format', value: file.type },
          { trait_type: 'size', value: file.size.toString() },
        ],
      };

      const metadataURI = await uploadMetadataToIPFS(metadata);

      setStatus('Creating Zora edition...');
      const publicClient = createPublicClient({
        chain: mainnet,
        transport: http(),
      });

      const walletClient = await createWalletClient({
        chain: mainnet,
        transport: http(),
        account: address,
      });

      const [account] = await walletClient.getAddresses();

      const creatorClient = createCreatorClient({ 
        chainId: mainnet.id, 
        publicClient 
      });

      const { request } = await creatorClient.create1155({
        name: title,
        description: description,
        imageURI: mediaURI,
        animationURI: null,
        tokenURI: metadataURI,
        maxSupply: BigInt(1),
        mintPrice: BigInt(0),
        royaltyBPS: 500,
        account: address,
      });

      const hash = await walletClient.writeContract(request);
      
      setTxHash(hash);
      setStatus('NFT minted successfully!');
    } catch (err: any) {
      console.error(err);
      setStatus(`Error: ${err.message}`);
    } finally {
      setMinting(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col h-full p-6 border rounded-md shadow-md bg-white dark:bg-gray-800">
      <h2 className="text-2xl font-bold mb-6">Mint Your NFT</h2>
      <div className="space-y-4 flex-1">
        <div>
          <label className="block text-sm font-medium mb-1">
            Upload File
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            accept="image/*"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter NFT title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter NFT description"
            rows={3}
          />
        </div>
        {status && (
          <div className="mt-4 p-3 rounded-md bg-gray-100">
            <p className="text-sm text-gray-700">{status}</p>
          </div>
        )}
        {txHash && (
          <div className="mt-4 p-3 rounded-md bg-green-100">
            <p className="text-sm text-green-700">
              Transaction Hash: {txHash}
            </p>
          </div>
        )}
      </div>
      <div className="mt-auto">
        <button
          onClick={handleMintNFT}
          disabled={minting || !file || !title.trim()}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            minting || !file || !title.trim()
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {minting ? 'Minting...' : 'Mint NFT'}
        </button>
      </div>
    </div>
  );
};

export default UploadMint; 