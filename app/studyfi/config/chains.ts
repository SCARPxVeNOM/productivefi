import {
    zora,
    base,
    optimism,
    arbitrum,
    blast,
    baseSepolia,
    sepolia
} from "viem/chains";

export const CHAINS = {
    [base.id]: {
        ...base,
        name: "Base",
        icon: "🟦",
        factory: "0x777777751622c0d3258f214F9DF38E35BF45baF3",
        explorer: "https://basescan.org",
        rpc: "https://mainnet.base.org",
    },
    [baseSepolia.id]: {
        ...baseSepolia,
        name: "Base Sepolia",
        icon: "🔵",
        factory: "0x777777751622c0d3258f214F9DF38E35BF45baF3",
        explorer: "https://sepolia.basescan.org",
        rpc: "https://sepolia.base.org",
    },
    [zora.id]: {
        ...zora,
        name: "Zora",
        icon: "🟪",
        factory: "0x7777777F279eba3d3Ad8F4E708545291A6fDBA8B",
        explorer: "https://explorer.zora.energy",
        rpc: "https://rpc.zora.energy",
    },
    [optimism.id]: {
        ...optimism,
        name: "Optimism",
        icon: "🟧",
        factory: "0x7777777F279eba3d3Ad8F4E708545291A6fDBA8B",
        explorer: "https://optimistic.etherscan.io",
        rpc: "https://mainnet.optimism.io",
    },
    [arbitrum.id]: {
        ...arbitrum,
        name: "Arbitrum",
        icon: "🟨",
        factory: "0x7777777F279eba3d3Ad8F4E708545291A6fDBA8B",
        explorer: "https://arbiscan.io",
        rpc: "https://arb1.arbitrum.io/rpc",
    },
    [blast.id]: {
        ...blast,
        name: "Blast",
        icon: "💥",
        factory: "0x7777777F279eba3d3Ad8F4E708545291A6fDBA8B",
        explorer: "https://blastscan.io",
        rpc: "https://rpc.blast.io",
    },
    [sepolia.id]: {
        ...sepolia,
        name: "Sepolia Ethereum",
        icon: "♦️",
        factory: "",
        explorer: "https://sepolia.etherscan.io",
        rpc: `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
    }
} as const;

export type ChainId = keyof typeof CHAINS;

export const DEFAULT_CHAIN_ID = 7777777; // Zora mainnet 