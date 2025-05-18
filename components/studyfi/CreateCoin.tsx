'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { CoinForm } from './CoinForm';
import { TokenDetails } from './TokenDetails';
import { useRetry } from '../../app/hooks/useRetry';
import { getCoinsNew } from '@zoralabs/coins-sdk';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';

interface Coin {
    id: string;
    address: `0x${string}`;
    name: string;
    symbol: string;
    description?: string;
    category?: string;
}

export function CreateCoin() {
    const { address } = useAccount();
    const [recentCoins, setRecentCoins] = useState<Coin[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchRecentCoins = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await useRetry(() => getCoinsNew({ count: 10 }));
            if (response?.data?.exploreList?.edges) {
                setRecentCoins(
                    response.data.exploreList.edges.map((edge: any) => ({
                        ...edge.node,
                        address: edge.node.address as `0x${string}`,
                        category: edge.node.metadata?.category || 'Educational',
                    }))
                );
            }
        } catch (err) {
            setError(err as Error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-12">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Create Educational Coin</CardTitle>
                    <CardDescription>
                        Create a new educational coin for your course, institution, or learning community.
                        This coin can be used to represent educational value, achievements, or access rights.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <CoinForm 
                        onSuccess={fetchRecentCoins}
                        defaultValues={{
                            name: 'Educational Coin',
                            symbol: 'EDU',
                            description: 'A token for educational value and achievements',
                            category: 'Educational'
                        }}
                    />
                </CardContent>
            </Card>

            <div className="space-y-6">
                <h3 className="text-xl font-semibold">Recent Educational Coins</h3>
                {isLoading && (
                    <div className="animate-pulse space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-20 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                )}
                {error && (
                    <div className="text-red-500 p-4 bg-red-50 rounded-lg">
                        Error loading coins: {error.message}
                    </div>
                )}
                {recentCoins.map((coin) => (
                    <Card key={coin.id} className="p-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="font-semibold">{coin.name}</h4>
                                <p className="text-sm text-gray-600">{coin.symbol}</p>
                                {coin.category && (
                                    <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full mt-2">
                                        {coin.category}
                                    </span>
                                )}
                            </div>
                            <TokenDetails contractAddress={coin.address} />
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
} 