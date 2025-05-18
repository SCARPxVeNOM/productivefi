"use client";

import { CHAINS } from "../../config/chains";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { ExternalLink } from "lucide-react";

interface TransactionStatusProps {
    transactionHash?: `0x${string}`;
    status?: string;
    name: string;
    description: string;
    imageUrl: string;
    chainId: keyof typeof CHAINS;
    tokenAddress?: `0x${string}`;
}

export function TransactionStatus({
    transactionHash,
    status = "",
    name,
    description,
    imageUrl,
    chainId,
    tokenAddress,
}: TransactionStatusProps) {
    if (!transactionHash) return null;

    const getStatusColor = (status: string) => {
        if (status.includes("success")) return "bg-green-100 text-green-800";
        if (status.includes("failed")) return "bg-red-100 text-red-800";
        return "bg-yellow-100 text-yellow-800";
    };

    const getExplorerUrl = (hash: `0x${string}`) => {
        const chain = CHAINS[chainId];
        return chain ? `${chain.explorer}/tx/${hash}` : "#";
    };

    const getTokenExplorerUrl = (address: `0x${string}`) => {
        const chain = CHAINS[chainId];
        return chain ? `${chain.explorer}/address/${address}` : "#";
    };

    return (
        <Card className="mt-6">
            <CardContent className="pt-6">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Transaction Status</h3>
                        <Badge className={getStatusColor(status)}>
                            {status}
                        </Badge>
                    </div>

                    <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                            <span className="font-medium">Transaction:</span>
                            <a
                                href={getExplorerUrl(transactionHash)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                            >
                                {transactionHash.slice(0, 6)}...{transactionHash.slice(-4)}
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        </div>

                        {status.includes("success") && (
                            <>
                                <div className="border-t pt-4 mt-4">
                                    <h4 className="font-semibold mb-2">NFT Created</h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="font-medium">Name:</div>
                                        <div>{name}</div>
                                        <div className="font-medium">Description:</div>
                                        <div>{description}</div>
                                        {tokenAddress && (
                                            <>
                                                <div className="font-medium">Contract:</div>
                                                <div>
                                                    <a
                                                        href={getTokenExplorerUrl(tokenAddress)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                                    >
                                                        {tokenAddress.slice(0, 6)}...{tokenAddress.slice(-4)}
                                                        <ExternalLink className="w-4 h-4" />
                                                    </a>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    {imageUrl && (
                                        <div className="mt-4">
                                            <img
                                                src={imageUrl}
                                                alt={name}
                                                className="w-32 h-32 object-cover rounded-lg"
                                            />
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
} 