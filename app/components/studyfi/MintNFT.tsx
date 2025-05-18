"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { NFTForm } from "./NFTForm";
import { NFTDetails } from "./NFTDetails";
import { ChainSelector } from "../ui/ChainSelector";
import { WalletConnect } from "../ui/WalletConnect";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Alert, AlertDescription } from "../ui/alert";
import { AlertCircle } from "lucide-react";

interface NFT {
    id: string;
    address: `0x${string}`;
    name: string;
    description: string;
    imageUrl: string;
    creator: string;
    createdAt: string;
}

export function MintNFT() {
    const { address, isConnected } = useAccount();
    const [recentNFTs, setRecentNFTs] = useState<NFT[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchRecentNFTs = async () => {
        try {
            setIsLoading(true);
            setError(null);
            // TODO: Implement NFT fetching from your contract
            // This is a placeholder for the actual implementation
            const response = await fetch("/api/nfts/recent");
            const data = await response.json();
            setRecentNFTs(data);
        } catch (err) {
            setError(err as Error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isConnected) {
        return (
            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>Connect Wallet</CardTitle>
                </CardHeader>
                <CardContent>
                    <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            Please connect your wallet to mint NFTs
                        </AlertDescription>
                    </Alert>
                    <div className="mt-4">
                        <WalletConnect />
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Mint NFT</h1>
                <div className="flex gap-4">
                    <ChainSelector />
                    <WalletConnect />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <NFTForm onSuccess={fetchRecentNFTs} />
                </div>

                <div className="space-y-6">
                    <h2 className="text-2xl font-semibold">Recent NFTs</h2>
                    {isLoading && (
                        <div className="text-muted-foreground">Loading recent NFTs...</div>
                    )}
                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                Error loading NFTs: {error.message}
                            </AlertDescription>
                        </Alert>
                    )}
                    {recentNFTs.length === 0 && !isLoading && !error && (
                        <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                No NFTs found. Be the first to mint one!
                            </AlertDescription>
                        </Alert>
                    )}
                    <div className="grid gap-4">
                        {recentNFTs.map((nft) => (
                            <Card key={nft.id}>
                                <CardContent className="p-4">
                                    <div className="flex gap-4">
                                        <img
                                            src={nft.imageUrl}
                                            alt={nft.name}
                                            className="w-24 h-24 object-cover rounded-lg"
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-semibold">{nft.name}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                {nft.description}
                                            </p>
                                            <div className="mt-2 text-sm">
                                                <p>Creator: {nft.creator.slice(0, 6)}...{nft.creator.slice(-4)}</p>
                                                <p>Created: {new Date(nft.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
} 