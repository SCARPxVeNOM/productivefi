'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    getCoinsNew,
    getCoinsTopGainers,
    getCoinsTopVolume24h,
    getCoinsMostValuable,
    getCoinsLastTraded,
    getCoinsLastTradedUnique,
} from '@zoralabs/coins-sdk';
import { useChainId } from 'wagmi';
import { formatEther } from 'viem';
import { CHAINS } from '@/app/studyfi/config/chains';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { useDebug } from '@/app/studyfi/contexts/DebugContext';
import { TokenDetails } from './TokenDetails';
import { ExploreTypeSelector, ExploreQueryType } from './ExploreTypeSelector';
import { CountSelector } from './CountSelector';
import { Button } from '../ui/button';
import { Loader2, RefreshCw } from 'lucide-react';

interface Coin {
    name: string;
    symbol: string;
    address: string;
    createdAt: string;
    creatorAddress: string;
    marketCap?: string;
    chainId: number;
    volume24h?: string;
    uniqueHolders?: number;
    marketCapDelta24h?: string;
    description?: string;
    category?: string;
}

interface GetCoinsProps {
    count?: number;
    after?: string;
    initialType?: ExploreQueryType;
}

interface PageInfo {
    hasNextPage: boolean;
    endCursor: string | null;
}

export function GetCoins({
    count: initialCount = 10,
    after,
    initialType = 'new',
}: GetCoinsProps) {
    const [coins, setCoins] = useState<Coin[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);
    const [type, setType] = useState<ExploreQueryType>(initialType);
    const [count, setCount] = useState(initialCount);
    const [pageInfo, setPageInfo] = useState<PageInfo>({ hasNextPage: false, endCursor: null });
    const [loadingMore, setLoadingMore] = useState(false);
    const [retryCount, setRetryCount] = useState(0);
    const chainId = useChainId();
    const { isDebug } = useDebug();

    const fetchGetCoins = useCallback(async (isLoadMore = false) => {
        try {
            if (!isLoadMore) {
                setLoading(true);
            } else {
                setLoadingMore(true);
            }
            setError(null);

            if (!chainId || !(chainId in CHAINS)) {
                if (isDebug) {
                    console.log('Unsupported chain:', chainId);
                }
                setError('Please switch to a supported network');
                return;
            }

            if (isDebug) {
                console.log('Fetching coins for chain:', chainId, CHAINS[chainId as keyof typeof CHAINS]?.name);
            }

            const params = {
                count,
                after: isLoadMore ? pageInfo.endCursor : after,
            };

            let response;
            switch (type) {
                case 'new':
                    response = await getCoinsNew(params);
                    break;
                case 'topGainers':
                    response = await getCoinsTopGainers(params);
                    break;
                case 'topVolume':
                    response = await getCoinsTopVolume24h(params);
                    break;
                case 'mostValuable':
                    response = await getCoinsMostValuable(params);
                    break;
                case 'lastTraded':
                    response = await getCoinsLastTraded(params);
                    break;
                case 'lastTradedUnique':
                    response = await getCoinsLastTradedUnique(params);
                    break;
                default:
                    response = await getCoinsNew(params);
            }

            if (!response?.data?.exploreList) {
                throw new Error('Invalid response format');
            }

            const { edges, pageInfo: newPageInfo } = response.data.exploreList;

            if (!edges) {
                throw new Error('No coins found on this network');
            }

            const fetchedCoins = edges
                .map((edge: any) => ({
                    name: edge.node.name,
                    symbol: edge.node.symbol,
                    address: edge.node.address,
                    createdAt: edge.node.createdAt,
                    creatorAddress: edge.node.creatorAddress,
                    marketCap: edge.node.marketCap,
                    chainId: edge.node.chainId,
                    volume24h: edge.node.volume24h,
                    uniqueHolders: edge.node.uniqueHolders,
                    marketCapDelta24h: edge.node.marketCapDelta24h,
                    description: edge.node.metadata?.description,
                    category: edge.node.metadata?.category || 'Educational',
                }))
                .sort(
                    (a: Coin, b: Coin) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                );

            if (isDebug) {
                console.log('Processed coins:', fetchedCoins);
            }

            setCoins(prev => isLoadMore ? [...prev, ...fetchedCoins] : fetchedCoins);
            setPageInfo({
                hasNextPage: newPageInfo.hasNextPage,
                endCursor: newPageInfo.endCursor,
            });
            setRetryCount(0);
        } catch (err) {
            if (isDebug) {
                console.error('Error fetching coins:', err);
            }
            setError(err instanceof Error ? err.message : 'Failed to fetch coins');
            if (retryCount < 3) {
                setRetryCount(prev => prev + 1);
                setTimeout(() => fetchGetCoins(isLoadMore), 1000 * Math.pow(2, retryCount));
            }
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [chainId, count, after, type, isDebug, pageInfo.endCursor, retryCount]);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted) {
            fetchGetCoins();
        }
    }, [mounted, fetchGetCoins]);

    const handleLoadMore = () => {
        if (!loadingMore && pageInfo.hasNextPage) {
            fetchGetCoins(true);
        }
    };

    const handleRetry = () => {
        setRetryCount(0);
        fetchGetCoins();
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    const getTitle = () => {
        switch (type) {
            case 'new':
                return 'New Educational Coins';
            case 'topGainers':
                return 'Top Performing Educational Coins';
            case 'topVolume':
                return 'Most Traded Educational Coins';
            case 'mostValuable':
                return 'Most Valuable Educational Coins';
            case 'lastTraded':
                return 'Recently Traded Educational Coins';
            case 'lastTradedUnique':
                return 'Recently Traded by Unique Traders';
            default:
                return 'Educational Coins';
        }
    };

    if (!mounted) {
        return null;
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle className="text-2xl font-semibold">
                        {getTitle()}
                    </CardTitle>
                    <div className="flex gap-4 items-center">
                        <ExploreTypeSelector
                            value={type}
                            onValueChange={setType}
                        />
                        <CountSelector
                            value={count}
                            onValueChange={setCount}
                        />
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handleRetry}
                            disabled={loading}
                        >
                            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="animate-pulse space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-20 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-red-500 p-4 bg-red-50 rounded-lg flex flex-col gap-2">
                        <p>{error}</p>
                        <Button
                            variant="outline"
                            onClick={handleRetry}
                            className="w-fit"
                        >
                            Retry
                        </Button>
                    </div>
                ) : !chainId || !(chainId in CHAINS) ? (
                    <div className="p-4 bg-yellow-50 rounded-lg">
                        <p className="text-yellow-700">
                            Please switch to a supported network (Base, Zora, Optimism, Arbitrum, or Blast).
                        </p>
                    </div>
                ) : coins.length === 0 ? (
                    <div className="p-4 bg-yellow-50 rounded-lg">
                        <p className="text-yellow-700">
                            No educational coins found. Try checking back later.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {coins?.map((coin, index) => (
                            <Card key={`${coin.address}-${index}`} className="p-4">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-2">
                                        <div>
                                            <h4 className="font-semibold">{coin.name}</h4>
                                            <p className="text-sm text-gray-600">{coin.symbol}</p>
                                        </div>
                                        {coin.description && (
                                            <p className="text-sm text-gray-600">{coin.description}</p>
                                        )}
                                        <div className="flex flex-wrap gap-2">
                                            {coin.category && (
                                                <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                                                    {coin.category}
                                                </span>
                                            )}
                                            <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                                                Created {formatDate(coin.createdAt)}
                                            </span>
                                        </div>
                                        {coin.marketCap && (
                                            <p className="text-sm">
                                                Market Cap: {(() => {
                                                    try {
                                                        return `${formatEther(BigInt(coin.marketCap))} ETH`;
                                                    } catch (err) {
                                                        if (isDebug) {
                                                            console.error('Error formatting market cap:', err);
                                                        }
                                                        return 'N/A';
                                                    }
                                                })()}
                                            </p>
                                        )}
                                    </div>
                                    <TokenDetails contractAddress={coin.address as `0x${string}`} />
                                </div>
                            </Card>
                        ))}
                        {pageInfo.hasNextPage && (
                            <div className="flex justify-center pt-4">
                                <Button
                                    variant="outline"
                                    onClick={handleLoadMore}
                                    disabled={loadingMore}
                                >
                                    {loadingMore ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Loading...
                                        </>
                                    ) : (
                                        'Load More'
                                    )}
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
} 