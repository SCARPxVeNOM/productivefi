export const CHAINS = {
    1: {
        name: 'Ethereum',
        icon: '🌐',
        explorer: 'https://etherscan.io',
        rpcUrl: process.env.NEXT_PUBLIC_ETHEREUM_RPC_URL,
    },
    5: {
        name: 'Goerli',
        icon: '🌐',
        explorer: 'https://goerli.etherscan.io',
        rpcUrl: process.env.NEXT_PUBLIC_GOERLI_RPC_URL,
    },
    10: {
        name: 'Optimism',
        icon: '⚡',
        explorer: 'https://optimistic.etherscan.io',
        rpcUrl: process.env.NEXT_PUBLIC_OPTIMISM_RPC_URL,
    },
    420: {
        name: 'Optimism Goerli',
        icon: '⚡',
        explorer: 'https://goerli-optimism.etherscan.io',
        rpcUrl: process.env.NEXT_PUBLIC_OPTIMISM_GOERLI_RPC_URL,
    },
    7777777: {
        name: 'Zora',
        icon: '✨',
        explorer: 'https://explorer.zora.energy',
        rpcUrl: process.env.NEXT_PUBLIC_ZORA_RPC_URL,
    },
    999: {
        name: 'Zora Testnet',
        icon: '✨',
        explorer: 'https://testnet.explorer.zora.energy',
        rpcUrl: process.env.NEXT_PUBLIC_ZORA_TESTNET_RPC_URL,
    },
} as const;

export type ChainId = keyof typeof CHAINS;

export const DEFAULT_CHAIN_ID = 7777777; // Zora mainnet 