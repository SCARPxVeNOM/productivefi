'use client';

import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { createPublicClient, createWalletClient, http } from 'viem';
import { mainnet } from 'viem/chains';
import { injected } from 'wagmi/connectors';
import { createCreatorClient } from '@zoralabs/protocol-sdk';
import axios from 'axios';

const PINATA_API_KEY = '26c48f1f91fb3215b55b';
const PINATA_SECRET_API_KEY = '306cb16fe34499bbe0fca0f8c5e07b09639ff4935f84952e15e5b7b36b34c81c';

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

  const uploadToIPFS = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
      maxBodyLength: Infinity,
      headers: {
        'Content-Type': `multipart/form-data; boundary=${(formData as any)._boundary}`,
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_API_KEY,
      },
    });

    return res.data.IpfsHash;
  };

  const uploadMetadataToIPFS = async (metadata: any) => {
    const res = await axios.post('https://api.pinata.cloud/pinning/pinJSONToIPFS', metadata, {
      headers: {
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_API_KEY,
      },
    });

    return res.data.IpfsHash;
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
      const mediaHash = await uploadToIPFS(file);
      const mediaURI = `ipfs://${mediaHash}`;

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

      const metadataHash = await uploadMetadataToIPFS(metadata);
      const metadataURI = `ipfs://${metadataHash}`;

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
    }

    setMinting(false);
  };

  if (!mounted) return null;

  return (
    <div className="max-w-xl mx-auto">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Upload File</label>
          <input
            type="file"
            accept="image/*,.pdf,.doc,.docx"
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            placeholder="NFT Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md text-black"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            placeholder="Describe your content"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md text-black"
            rows={4}
          />
        </div>

        <button
          onClick={handleMintNFT}
          disabled={!file || !isConnected || minting}
          className={`w-full p-3 rounded-md ${
            !file || !isConnected || minting
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {minting ? 'Minting...' : 'Mint NFT'}
        </button>

        {status && (
          <div
            className={`p-3 rounded-md ${
              status.includes('error') || status.includes('Error')
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'bg-blue-50 text-blue-700 border border-blue-200'
            }`}
          >
            <p>{status}</p>
            {txHash && (
              <p className="mt-2 text-sm">
                Transaction:{' '}
                <a
                  href={`https://etherscan.io/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  {txHash.slice(0, 10)}...{txHash.slice(-8)}
                </a>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadMint; 