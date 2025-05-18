'use client';

import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { useCoinCreation } from '@/app/studyfi/hooks/useCoinCreation';
import { useAccount, useChainId } from 'wagmi';
import { Address, parseEther, formatEther } from 'viem';
import { CHAINS } from '@/app/studyfi/config/chains';
import { Card, CardContent } from '../ui/card';
import { useDebug } from '@/app/studyfi/contexts/DebugContext';

interface CoinFormProps {
    onSuccess?: (hash: `0x${string}`) => void;
    defaultValues?: {
        name: string;
        symbol: string;
        description: string;
        category: string;
    };
}

interface TransactionStatusProps {
    transactionHash?: `0x${string}`;
    status?: string;
    name: string;
    symbol: string;
    uri: string;
    chainId: keyof typeof CHAINS;
    tokenAddress?: `0x${string}`;
    description?: string;
    category?: string;
}

function TransactionStatus({
    transactionHash,
    status = '',
    name,
    symbol,
    uri,
    chainId,
    tokenAddress,
    description,
    category,
}: TransactionStatusProps) {
    if (!transactionHash) return null;

    const getTransactionStatusColor = (status: string) => {
        if (status.includes('success')) return 'text-green-600';
        if (status.includes('failed')) return 'text-red-600';
        return 'text-yellow-600';
    };

    const getExplorerUrl = (hash: `0x${string}`) => {
        const chain = CHAINS[chainId];
        return chain ? `${chain.explorer}/tx/${hash}` : '#';
    };

    const getTokenExplorerUrl = (address: `0x${string}`) => {
        const chain = CHAINS[chainId];
        return chain ? `${chain.explorer}/address/${address}` : '#';
    };

    return (
        <Card className="mt-4 p-4 bg-gray-50">
            <CardContent>
                <h3 className="font-semibold mb-2">Transaction Status</h3>
                <div className="space-y-2">
                    <div>
                        <span className="font-medium">Status:</span>{' '}
                        <span className={getTransactionStatusColor(status)}>
                            {status}
                        </span>
                    </div>
                    <div>
                        <span className="font-medium">Transaction Hash:</span>{' '}
                        <a
                            href={getExplorerUrl(transactionHash)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-blue-600 hover:text-blue-800"
                        >
                            {transactionHash.slice(0, 6)}...{transactionHash.slice(-4)}
                        </a>
                    </div>
                    {status.includes('success') && (
                        <div className="mt-4">
                            <h4 className="font-semibold mb-2">Educational Coin Created</h4>
                            <div className="space-y-1 text-sm">
                                <div>
                                    <span className="font-medium">Name:</span> {name}
                                </div>
                                <div>
                                    <span className="font-medium">Symbol:</span> {symbol}
                                </div>
                                {description && (
                                    <div>
                                        <span className="font-medium">Description:</span> {description}
                                    </div>
                                )}
                                {category && (
                                    <div>
                                        <span className="font-medium">Category:</span> {category}
                                    </div>
                                )}
                                {tokenAddress && (
                                    <div>
                                        <span className="font-medium">Token Address:</span>{' '}
                                        <a
                                            href={getTokenExplorerUrl(tokenAddress)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-mono text-blue-600 hover:text-blue-800"
                                        >
                                            {tokenAddress}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

export function CoinForm({ onSuccess, defaultValues }: CoinFormProps) {
    const { address } = useAccount();
    const chainId = useChainId() as keyof typeof CHAINS;
    const [name, setName] = useState(defaultValues?.name || 'Educational Coin');
    const [symbol, setSymbol] = useState(defaultValues?.symbol || 'EDU');
    const [description, setDescription] = useState(defaultValues?.description || '');
    const [category, setCategory] = useState(defaultValues?.category || 'Educational');
    const [uri, setUri] = useState('ipfs://Qm...'); // This would be set after uploading metadata
    const [error, setError] = useState<string | null>(null);
    const [tokenAddress, setTokenAddress] = useState<`0x${string}` | null>(null);
    const [performInitialPurchase, setPerformInitialPurchase] = useState(false);
    const [initialEthAmount, setInitialEthAmount] = useState('0');
    const [initialWeiAmount, setInitialWeiAmount] = useState<bigint>(BigInt(0));
    const { isDebug } = useDebug();

    useEffect(() => {
        try {
            if (initialEthAmount && !isNaN(parseFloat(initialEthAmount)) && parseFloat(initialEthAmount) >= 0) {
                const wei = parseEther(initialEthAmount as `${number}`);
                setInitialWeiAmount(wei);
                setError(null);
            } else if (initialEthAmount === '') {
                setInitialWeiAmount(BigInt(0));
            } else {
                if (initialEthAmount !== '.' && initialEthAmount !== '') {
                    setError('Invalid ETH amount');
                }
                setInitialWeiAmount(BigInt(0));
            }
        } catch (e) {
            setError('Invalid ETH amount format');
            setInitialWeiAmount(BigInt(0));
        }
    }, [initialEthAmount]);

    const {
        write,
        isLoading,
        error: contractError,
        transactionHash,
        status,
        tokenAddress: contractTokenAddress,
    } = useCoinCreation({
        name,
        symbol,
        uri,
        owners: undefined,
        payoutRecipient: address || '0x0000000000000000000000000000000000000000',
        platformReferrer: address || undefined,
        initialPurchaseWei: performInitialPurchase ? initialWeiAmount : BigInt(0),
        chainId,
    });

    const handleEthAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^\d*\.?\d*$/.test(value)) {
            setInitialEthAmount(value);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (performInitialPurchase && initialWeiAmount <= BigInt(0) && initialEthAmount !== '0' && initialEthAmount !== '') {
            setError('Initial purchase amount must be greater than 0 ETH.');
            return;
        }
        setError(null);

        if (isDebug) {
            console.log('Submitting coin creation with:', {
                name,
                symbol,
                description,
                category,
                initialPurchase: performInitialPurchase ? initialWeiAmount.toString() : '0',
            });
        }

        write?.();
    };

    if (transactionHash && status === 'success') {
        onSuccess?.(transactionHash);
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <div>
                    <Label htmlFor="name">Coin Name</Label>
                    <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Educational Coin"
                        required
                        className="mt-1"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                        The name of your educational coin (e.g., "Course Access Token")
                    </p>
                </div>

                <div>
                    <Label htmlFor="symbol">Symbol</Label>
                    <Input
                        id="symbol"
                        value={symbol}
                        onChange={(e) => setSymbol(e.target.value)}
                        placeholder="EDU"
                        required
                        className="mt-1"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                        A short symbol for your coin (e.g., "EDU", "LEARN")
                    </p>
                </div>

                <div>
                    <Label htmlFor="description">Description</Label>
                    <Input
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe the purpose of this educational coin"
                        className="mt-1"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                        Explain what this coin represents in your educational ecosystem
                    </p>
                </div>

                <div>
                    <Label htmlFor="category">Category</Label>
                    <Input
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="Educational"
                        className="mt-1"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                        The category of your educational coin (e.g., "Course", "Institution", "Achievement")
                    </p>
                </div>

                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="initialPurchase"
                        checked={performInitialPurchase}
                        onCheckedChange={(checked) => setPerformInitialPurchase(checked as boolean)}
                    />
                    <Label htmlFor="initialPurchase">Perform Initial Purchase</Label>
                </div>

                {performInitialPurchase && (
                    <div>
                        <Label htmlFor="initialAmount">Initial ETH Amount</Label>
                        <Input
                            id="initialAmount"
                            type="text"
                            value={initialEthAmount}
                            onChange={handleEthAmountChange}
                            placeholder="0.0"
                            className="mt-1"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            Amount of ETH to purchase initially
                        </p>
                    </div>
                )}
            </div>

            {error && (
                <div className="text-red-500 p-4 bg-red-50 rounded-lg">
                    {error}
                </div>
            )}

            <Button
                type="submit"
                disabled={isLoading || !write}
                className="w-full"
            >
                {isLoading ? 'Creating Coin...' : 'Create Educational Coin'}
            </Button>

            <TransactionStatus
                transactionHash={transactionHash}
                status={status}
                name={name}
                symbol={symbol}
                uri={uri}
                chainId={chainId}
                tokenAddress={contractTokenAddress}
                description={description}
                category={category}
            />
        </form>
    );
} 