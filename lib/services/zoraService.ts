import { getCoin, createCoin } from "@zoralabs/coins-sdk";
import { sepolia } from "viem/chains";
import { createPublicClient, http } from "viem";

export interface CreatorCoin {
  name: string;
  symbol: string;
  description: string;
  address: string;
  totalSupply: string;
  mediaContent: {
    originalUri: string;
    mimeType: string;
    previewImage?: {
      blurhash: string;
      medium: string;
      small: string;
    };
  };
  totalVolume: string;
  marketCap: string;
  createdAt?: string;
  creatorAddress: string;
  uniqueHolders: number;
}

export const fetchCreatorCoin = async (address: string): Promise<CreatorCoin> => {
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http()
  });

  const coin = await getCoin({
    address,
    chain: sepolia.id,
    publicClient
  });

  return {
    name: coin.name,
    symbol: coin.symbol,
    description: coin.description || '',
    address: coin.address,
    totalSupply: coin.totalSupply.toString(),
    mediaContent: {
      originalUri: coin.uri,
      mimeType: 'image/png', // Default to image/png, update based on actual content
    },
    totalVolume: '0', // These values need to be fetched from the contract
    marketCap: '0',
    creatorAddress: coin.creator,
    uniqueHolders: 0
  };
};

export const createCreatorCoin = async ({
  name,
  symbol,
  description,
  uri,
  creatorAddress,
  platformReferrer,
}: {
  name: string;
  symbol: string;
  description: string;
  uri: string;
  creatorAddress: string;
  platformReferrer: string;
}) => {
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http()
  });

  const { request } = await createCoin({
    name,
    symbol,
    uri,
    payoutRecipient: creatorAddress,
    initialPurchaseWei: BigInt(0),
    chain: sepolia.id,
    publicClient
  });

  return request;
};

export const validateMetadataURI = async (uri: string): Promise<boolean> => {
  if (!uri.startsWith('ipfs://')) {
    return false;
  }
  // Add additional validation if needed
  return true;
}; 