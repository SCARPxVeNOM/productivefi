"use client";

import { useState, useEffect } from "react";
import { usePublicClient } from "wagmi";
import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { ExternalLink } from "lucide-react";

interface NFTDetailsProps {
    contractAddress: `0x${string}` | undefined;
    tokenId?: string;
}

interface NFTMetadata {
    name: string;
    description: string;
    image: string;
    attributes?: Array<{
        trait_type: string;
        value: string;
    }>;
}

export function NFTDetails({ contractAddress, tokenId }: NFTDetailsProps) {
    const [metadata, setMetadata] = useState<NFTMetadata | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const publicClient = usePublicClient();

    useEffect(() => {
        const fetchNFTDetails = async () => {
            if (!contractAddress) return;

            try {
                setIsLoading(true);
                setError(null);

                // TODO: Implement actual NFT metadata fetching
                // This is a placeholder for the actual implementation
                const tokenURI = await publicClient.readContract({
                    address: contractAddress,
                    abi: NFT_ABI, // Add your NFT contract ABI
                    functionName: "tokenURI",
                    args: [tokenId || "0"],
                });

                // Fetch metadata from IPFS or HTTP URL
                const response = await fetch(tokenURI as string);
                const data = await response.json();
                setMetadata(data);
            } catch (err) {
                console.error("Error fetching NFT details:", err);
                setError("Failed to load NFT details");
            } finally {
                setIsLoading(false);
            }
        };

        fetchNFTDetails();
    }, [contractAddress, tokenId, publicClient]);

    if (!contractAddress) return null;

    if (isLoading) {
        return (
            <Card>
                <CardContent className="p-4 space-y-4">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-32 w-full" />
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card>
                <CardContent className="p-4">
                    <div className="text-red-500">{error}</div>
                </CardContent>
            </Card>
        );
    }

    if (!metadata) {
        return (
            <Card>
                <CardContent className="p-4">
                    <div className="text-muted-foreground">No metadata found</div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardContent className="p-4 space-y-4">
                <div>
                    <h3 className="text-lg font-semibold">{metadata.name}</h3>
                    <p className="text-sm text-muted-foreground">
                        {metadata.description}
                    </p>
                </div>

                {metadata.image && (
                    <div className="relative aspect-square w-full overflow-hidden rounded-lg">
                        <img
                            src={metadata.image}
                            alt={metadata.name}
                            className="object-cover w-full h-full"
                        />
                    </div>
                )}

                {metadata.attributes && metadata.attributes.length > 0 && (
                    <div className="space-y-2">
                        <h4 className="font-medium">Attributes</h4>
                        <div className="grid grid-cols-2 gap-2">
                            {metadata.attributes.map((attr, index) => (
                                <div
                                    key={index}
                                    className="bg-muted p-2 rounded-lg text-sm"
                                >
                                    <div className="font-medium">{attr.trait_type}</div>
                                    <div className="text-muted-foreground">
                                        {attr.value}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Contract:</span>
                    <a
                        href={`https://etherscan.io/address/${contractAddress}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                        {contractAddress.slice(0, 6)}...{contractAddress.slice(-4)}
                        <ExternalLink className="w-4 h-4" />
                    </a>
                </div>
            </CardContent>
        </Card>
    );
}

// TODO: Add your NFT contract ABI
const NFT_ABI = [
    // Add your NFT contract ABI here
] as const; 