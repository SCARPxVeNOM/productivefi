'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import axios from 'axios';

// Using the provided Pinata keys
const PINATA_API_KEY = "26c48f1f91fb3215b55b";
const PINATA_SECRET_API_KEY = "306cb16fe34499bbe0fca0f8c5e07b09639ff4935f84952e15e5b7b36b34c81c";

const MintNFT = () => {
  const { address, isConnected } = useAccount();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [editionAddress, setEditionAddress] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // For client-side rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  const uploadToPinata = async () => {
    if (!file) return null;

    setStatus("Uploading to IPFS...");
    const formData = new FormData();
    formData.append("file", file);

    try {
      // For testing - mock the upload process
      await new Promise(resolve => setTimeout(resolve, 2000));
      const mockHash = "QmXExS4BMc1YrH6iWERq6Z8btvFwnbCm74Xdjq5shxJXtL";
      return `ipfs://${mockHash}`;
      
      /* Uncomment for real implementation
      const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET_API_KEY,
        },
      });

      const hash = res.data.IpfsHash;
      return `ipfs://${hash}`;
      */
    } catch (err) {
      console.error("Error uploading to IPFS", err);
      setStatus("Error uploading to IPFS: Please check your connection and try again");
      return null;
    }
  };

  const createEdition = async () => {
    if (!file || !address || !isConnected) {
      setStatus("Please connect your wallet and select a file");
      return;
    }

    if (!title.trim()) {
      setStatus("Please enter a title for your collection");
      return;
    }

    try {
      setStatus("Creating a new edition...");
      
      const mediaURI = await uploadToPinata();
      if (!mediaURI) return;
      
      // Create metadata
      const metadata = {
        name: title || file.name,
        description: description || "Educational NFT minted via StudyFi",
        image: mediaURI,
        properties: {
          type: "educational",
          format: file.type,
          size: file.size,
        }
      };

      // Upload metadata to IPFS - mocked for testing
      setStatus("Uploading metadata...");
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock edition creation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate a mock edition address
      const createdEditionAddress = "0x" + Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join('');
      
      setEditionAddress(createdEditionAddress);
      setStatus(`Edition created successfully! Address: ${createdEditionAddress.substring(0, 6)}...${createdEditionAddress.substring(38)}`);
      
      return createdEditionAddress;
    } catch (err) {
      console.error("Edition creation error", err);
      setStatus(`Edition creation error: ${(err as Error).message}`);
      return null;
    }
  };

  const mintEdition = async () => {
    if (!address || !isConnected) {
      setStatus("Please connect your wallet");
      return;
    }
    
    if (!editionAddress) {
      // Create the edition first, then mint
      const newEditionAddress = await createEdition();
      if (!newEditionAddress) return;
    }
    
    try {
      setStatus(`Minting ${quantity} NFTs...`);
      
      // Simulate minting process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setStatus("Finalizing mint...");
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStatus(`Successfully minted ${quantity} NFTs!`);
    } catch (err) {
      console.error("Minting error", err);
      setStatus(`Minting error: ${(err as Error).message}`);
    }
  };

  const handleMint = async () => {
    if (editionAddress) {
      await mintEdition();
    } else {
      await createEdition();
    }
  };

  // Don't render until client-side hydration is complete
  if (!mounted) return null;

  return (
    <div className="p-6 border rounded-md shadow-md bg-white dark:bg-gray-800">
      <h2 className="text-xl font-semibold mb-4">Advanced NFT Minting</h2>
      
      {!editionAddress ? (
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
              placeholder="NFT Collection Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-black dark:text-white"
              style={{ color: 'black' }}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              placeholder="Collection description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-black dark:text-white"
              rows={3}
              style={{ color: 'black' }}
            />
          </div>
          
          <button
            onClick={createEdition}
            disabled={!file || !isConnected}
            className={`w-full p-3 rounded-md ${
              !file || !isConnected
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            Create Edition
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-md">
            <p className="text-sm font-medium">Edition Address:</p>
            <p className="font-mono text-xs">{editionAddress}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Quantity to Mint</label>
            <input
              type="number"
              min="1"
              max="100"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              className="w-full p-2 border border-gray-300 rounded-md text-black dark:text-white"
              style={{ color: 'black' }}
            />
            <p className="mt-1 text-xs text-gray-500">Maximum 100 per transaction</p>
          </div>
          
          <button
            onClick={mintEdition}
            disabled={!isConnected}
            className={`w-full p-3 rounded-md ${
              !isConnected
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Mint {quantity} NFT{quantity !== 1 ? 's' : ''}
          </button>
          
          <button
            onClick={() => setEditionAddress(null)}
            className="w-full p-3 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Create New Edition
          </button>
        </div>
      )}
      
      {status && (
        <div className={`mt-4 p-3 rounded-md ${
          status.includes("error") || status.includes("Error")
            ? "bg-red-50 text-red-700 border border-red-200"
            : status.includes("Success") || status.includes("successfully")
            ? "bg-green-50 text-green-700 border border-green-200"
            : "bg-blue-50 text-blue-700 border border-blue-200"
        }`}>
          <p>{status}</p>
        </div>
      )}
    </div>
  );
};

export default MintNFT; 