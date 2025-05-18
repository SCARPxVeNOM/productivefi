'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { formatEther } from 'viem';
import { erc20Abi } from 'viem';

interface TokenDetailsProps {
    contractAddress: `0x${string}`;
}

export function TokenDetails({ contractAddress }: TokenDetailsProps) {
    const { address } = useAccount();
    const [balance, setBalance] = useState<string>('0');

    const { data: tokenBalance } = useReadContract({
        address: contractAddress,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [address as `0x${string}`],
        query: {
            enabled: !!address,
        },
    });

    useEffect(() => {
        if (tokenBalance) {
            setBalance(formatEther(tokenBalance));
        }
    }, [tokenBalance]);

    return (
        <div className="text-right">
            {address && (
                <div className="text-sm text-gray-600">
                    Your Balance: {balance} tokens
                </div>
            )}
            <a
                href={`https://explorer.zora.energy/token/${contractAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800"
            >
                View on Explorer
            </a>
        </div>
    );
} 