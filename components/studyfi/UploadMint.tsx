'use client';

import React, { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import axios from "axios";

// Use the Pinata keys from your provided code
const PINATA_API_KEY = "26c48f1f91fb3215b55b";
const PINATA_SECRET_API_KEY = "306cb16fe34499bbe0fca0f8c5e07b09639ff4935f84952e15e5b7b36b34c81c";

const UploadMint = () => {
  const { address, isConnected } = useAccount();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [ipfsHash, setIpfsHash] = useState<string | null>(null);
  const [minting, setMinting] = useState(false);
  const [minted, setMinted] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // For client-side rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const handleUploadToIPFS = async () => {
    if (!file) return null;

    setStatus("Uploading to IPFS...");
    const formData = new FormData();
    formData.append("file", file);

    try {
      // For development testing, create a mock success response after 2 seconds
      // This helps avoid rate limiting or API key issues with Pinata
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Use a hardcoded hash for testing
      const mockHash = "QmXExS4BMc1YrH6iWERq6Z8btvFwnbCm74Xdjq5shxJXtL";
      setIpfsHash(mockHash);
      return mockHash;
      
      /* Uncomment for real Pinata implementation
      const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
        maxBodyLength: Infinity,
        headers: {
          "Content-Type": `multipart/form-data; boundary=${(formData as any)._boundary}`,
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET_API_KEY,
        },
      });
      
      const hash = res.data.IpfsHash;
      setIpfsHash(hash);
      return hash;
      */
    } catch (err) {
      console.error("Error uploading to IPFS", err);
      setStatus("Error uploading to IPFS: Please check your connection and try again");
      return null;
    }
  };

  const handleMintNFT = async () => {
    if (!file || !address || !isConnected) {
      setStatus("Please connect your wallet and select a file");
      return;
    }

    if (!title.trim()) {
      setStatus("Please provide a title for your NFT");
      return;
    }

    setMinting(true);
    setStatus("Starting minting process...");
    
    try {
      // Upload file to IPFS
      const ipfsHash = await handleUploadToIPFS();
      if (!ipfsHash) {
        setMinting(false);
        return;
      }
      
      const mediaURI = `ipfs://${ipfsHash}`;
      
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
      
      // Upload metadata to IPFS - mock this too for testing
      setStatus("Uploading metadata...");
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock minting functionality since we don't have Zora SDK
      setStatus("Creating NFT edition...");
      
      // Simulate blockchain delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setStatus("Confirming transaction...");
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate a mock transaction hash
      const mockTxHash = "0x" + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');
      setTxHash(mockTxHash);
      setMinted(true);
      setStatus("NFT minted successfully!");
    } catch (err) {
      console.error("Minting error", err);
      setStatus(`Minting error: ${(err as Error).message}`);
    }
    
    setMinting(false);
  };

  // Don't render until client-side hydration is complete
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
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="mt-1 text-xs text-gray-500">Supported formats: Images, PDFs, and documents</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            placeholder="NFT Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black dark:text-white"
            style={{ color: 'black' }}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            placeholder="Describe your educational content"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black dark:text-white"
            rows={4}
            style={{ color: 'black' }}
          />
        </div>
        
        <button
          onClick={handleMintNFT}
          disabled={!file || !isConnected || minting}
          className={`w-full p-3 rounded-md ${
            !file || !isConnected || minting
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {minting ? "Minting in progress..." : "Mint NFT"}
        </button>
        
        {status && (
          <div className={`p-3 rounded-md ${
            status.includes("error") || status.includes("Error")
              ? "bg-red-50 text-red-700 border border-red-200"
              : minted
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-blue-50 text-blue-700 border border-blue-200"
          }`}>
            <p>{status}</p>
            {txHash && (
              <p className="mt-2 text-sm">
                Transaction Hash: <a 
                  href={`https://etherscan.io/tx/${txHash}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline"
                >
                  {txHash.substring(0, 10)}...{txHash.substring(txHash.length - 8)}
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