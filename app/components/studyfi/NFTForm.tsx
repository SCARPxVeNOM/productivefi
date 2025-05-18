"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { useNFTMinting } from "../../hooks/useNFTMinting";
import { useAccount, useChainId } from "wagmi";
import { CHAINS } from "../../config/chains";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "../ui/card";
import { TransactionStatus } from "./TransactionStatus";
import { ImageUpload } from "./ImageUpload";

interface NFTFormProps {
    onSuccess?: (hash: `0x${string}`) => void;
}

export function NFTForm({ onSuccess }: NFTFormProps) {
    const { address } = useAccount();
    const chainId = useChainId() as keyof typeof CHAINS;
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [error, setError] = useState<string | null>(null);

    const {
        write,
        isLoading,
        error: contractError,
        transactionHash,
        status,
        tokenAddress,
    } = useNFTMinting({
        name,
        description,
        imageUrl,
        creator: address,
        chainId,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !description || !imageUrl) {
            setError("Please fill in all fields");
            return;
        }
        setError(null);
        write?.();
    };

    const handleImageUpload = (url: string) => {
        setImageUrl(url);
    };

    if (transactionHash && status === "success") {
        onSuccess?.(transactionHash);
    }

    return (
        <Card className="w-full max-w-2xl mx-auto shadow-lg">
            <CardHeader className="space-y-1">
                <CardTitle className="text-3xl font-semibold text-foreground">
                    Create New NFT
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                    Mint your NFT on the blockchain
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <Label htmlFor="name">NFT Name</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="My Awesome NFT"
                            required
                            className="text-foreground"
                        />
                    </div>

                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe your NFT"
                            required
                            className="text-foreground min-h-[100px]"
                        />
                    </div>

                    <div>
                        <Label>NFT Image</Label>
                        <ImageUpload onUpload={handleImageUpload} />
                        {imageUrl && (
                            <div className="mt-2">
                                <img
                                    src={imageUrl}
                                    alt="NFT Preview"
                                    className="w-32 h-32 object-cover rounded-lg"
                                />
                            </div>
                        )}
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading || !name || !description || !imageUrl}
                        className="w-full"
                    >
                        {isLoading ? "Minting..." : "Mint NFT"}
                    </Button>

                    {error && (
                        <div className="text-red-500 text-sm mt-2">{error}</div>
                    )}
                    {contractError && (
                        <div className="text-red-500 text-sm mt-2">
                            Error: {contractError.message}
                        </div>
                    )}
                </form>

                <TransactionStatus
                    transactionHash={transactionHash}
                    status={status}
                    name={name}
                    description={description}
                    imageUrl={imageUrl}
                    chainId={chainId}
                    tokenAddress={tokenAddress}
                />
            </CardContent>
        </Card>
    );
} 