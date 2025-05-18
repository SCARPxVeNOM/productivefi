"use client";

import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useAccount, useChainId } from "wagmi";
import { parseEther } from "viem";
import { CHAINS } from "../config/chains";
import { createCoin } from "@zoralabs/coins-sdk";

interface UseCoinCreationProps {
    name: string;
    symbol: string;
    description: string;
    category: string;
    initialAmount?: string;
}

export function useCoinCreation() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hash, setHash] = useState<`0x${string}` | null>(null);
    const { address } = useAccount();
    const chainId = useChainId();

    const { writeContract, data: writeData } = useWriteContract();
    const { isLoading: isPending, isSuccess } = useWaitForTransactionReceipt({
        hash: writeData,
    });

    const create = async ({
        name,
        symbol,
        description,
        category,
        initialAmount,
    }: UseCoinCreationProps) => {
        try {
            setIsLoading(true);
            setError(null);

            if (!address) {
                throw new Error("Please connect your wallet first");
            }

            if (!chainId || !CHAINS[chainId]) {
                throw new Error("Unsupported network");
            }

            const { request } = await createCoin({
                name,
                symbol,
                description,
                category,
                initialAmount: initialAmount ? parseEther(initialAmount) : undefined,
                chainId,
            });

            const hash = await writeContract(request);
            setHash(hash);

            return hash;
        } catch (err) {
            console.error("Error creating coin:", err);
            setError(err instanceof Error ? err.message : "Failed to create coin");
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        create,
        isLoading: isLoading || isPending,
        isSuccess,
        error,
        hash,
    };
} 