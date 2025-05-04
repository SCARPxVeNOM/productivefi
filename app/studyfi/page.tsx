'use client';

import React, { useState, useEffect } from 'react';
import UploadMint from '../../components/studyfi/UploadMint';
import MintNFT from '../../components/studyfi/MintNFT';
import ConnectWallet from '../../components/studyfi/ConnectWallet';
import Link from 'next/link';

export default function StudyFiPage() {
  const [mounted, setMounted] = useState(false);
  
  // Only show UI once component is mounted on client
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Don't render content until client-side
  if (!mounted) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">StudyFi - Educational NFT Platform</h1>
        <p className="text-lg text-gray-600 mb-4">Mint educational NFTs using Zora Protocol</p>
        <ConnectWallet />
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Upload & Mint Your Educational NFT</h2>
            <UploadMint />
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Advanced NFT Minting</h2>
            <p className="mb-4 text-gray-600">Create NFT editions and mint multiple copies at once.</p>
            <MintNFT />
          </div>
        </div>
        
        <div className="lg:col-span-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">About StudyFi</h2>
            <p className="mb-3">
              StudyFi is a platform that allows educators and students to mint educational content as NFTs.
              This helps creators monetize their educational materials while providing learners with verifiable credentials.
            </p>
            <p>
              With StudyFi, you can mint lecture notes, research papers, educational videos, and more as NFTs on the Zora Protocol.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">How It Works</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Connect your wallet</li>
              <li>Upload your educational content</li>
              <li>Add title and description</li>
              <li>Mint your NFT on Zora</li>
              <li>Share with your audience</li>
            </ol>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Benefits</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Monetize educational content</li>
              <li>Provide verifiable credentials</li>
              <li>Low gas fees with Zora</li>
              <li>Support educational creators</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <Link href="/dashboard" className="text-blue-500 hover:text-blue-700">
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
} 