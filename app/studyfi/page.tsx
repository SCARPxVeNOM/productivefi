"use client";

import { StudyFiProvidersDynamic } from "./providers";
import { CreateCoin } from "../../components/studyfi/CreateCoin";
import { GetCoins } from "../../components/studyfi/GetCoins";
import { ChainSelector } from "../../components/studyfi/ChainSelector";
import { useState } from "react";
import UploadMint from "../../components/studyfi/UploadMint";
import MintNFT from "../../components/studyfi/MintNFT";
import ConnectWallet from "../../components/studyfi/ConnectWallet";
import { CoinForm } from "@/components/studyfi/CoinForm";
import { DebugProvider } from "./contexts/DebugContext";

export default function StudyFiPage() {
    const [activeTab, setActiveTab] = useState<'nft' | 'coin'>('nft');

    return (
        <DebugProvider>
            <StudyFiProvidersDynamic>
                <div className="container mx-auto px-4 py-8">
                    <header className="mb-8 text-center">
                        <h1 className="text-4xl font-bold mb-4">StudyFi Platform</h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300">
                            Create and manage educational NFTs and Coins
                        </p>
                        <div className="mt-4 flex justify-center gap-4">
                            <ConnectWallet />
                            <ChainSelector />
                        </div>
                    </header>

                    <div className="mb-8">
                        <div className="flex border-b border-gray-200 dark:border-gray-700">
                            <button
                                className={`px-4 py-2 font-medium ${
                                    activeTab === 'nft'
                                        ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                                        : 'text-gray-600 dark:text-gray-300'
                                }`}
                                onClick={() => setActiveTab('nft')}
                            >
                                NFTs
                            </button>
                            <button
                                className={`px-4 py-2 font-medium ${
                                    activeTab === 'coin'
                                        ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                                        : 'text-gray-600 dark:text-gray-300'
                                }`}
                                onClick={() => setActiveTab('coin')}
                            >
                                Coins
                            </button>
                        </div>
                    </div>

                    <main>
                        {activeTab === 'nft' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <UploadMint />
                                <MintNFT />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <CoinForm />
                                <GetCoins />
                            </div>
                        )}
                    </main>

                    <section className="mt-16">
                        <h2 className="text-2xl font-bold mb-4">About StudyFi</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            StudyFi is a decentralized platform that combines the power of NFTs and Coins
                            to revolutionize educational credentialing and community building. Create
                            verifiable educational credentials as NFTs and build tokenized learning
                            communities with custom educational coins.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                                <h3 className="text-xl font-semibold mb-2">Verifiable Credentials</h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Create and mint educational achievements as NFTs, providing
                                    verifiable and immutable credentials.
                                </p>
                            </div>
                            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                                <h3 className="text-xl font-semibold mb-2">Tokenized Communities</h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Build and manage learning communities with custom educational
                                    coins, enabling new forms of engagement and value exchange.
                                </p>
                            </div>
                            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                                <h3 className="text-xl font-semibold mb-2">Cross-Chain Support</h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Deploy your educational assets across multiple blockchains,
                                    including Zora, Base, Optimism, and more.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="mt-16">
                        <h2 className="text-2xl font-bold mb-4">How It Works</h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            <div className="text-center">
                                <div className="text-4xl font-bold text-blue-500 mb-2">1</div>
                                <h3 className="text-lg font-semibold mb-2">Choose Your Asset</h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Select between creating an NFT or Coin for your educational content
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-blue-500 mb-2">2</div>
                                <h3 className="text-lg font-semibold mb-2">Configure Details</h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Set up your asset's properties, metadata, and parameters
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-blue-500 mb-2">3</div>
                                <h3 className="text-lg font-semibold mb-2">Select Network</h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Choose the blockchain network for your asset deployment
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-blue-500 mb-2">4</div>
                                <h3 className="text-lg font-semibold mb-2">Deploy & Share</h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Mint your asset and share it with your learning community
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            </StudyFiProvidersDynamic>
        </DebugProvider>
    );
} 