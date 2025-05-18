import { http, createConfig } from "wagmi";
import {
    base,
    zora,
    optimism,
    arbitrum,
    blast,
    baseSepolia,
    sepolia,
} from "viem/chains";
import { CHAINS } from "./chains";

export const config = createConfig({
    chains: [baseSepolia, base, zora, optimism, arbitrum, blast, sepolia],
    transports: {
        [baseSepolia.id]: http(CHAINS[baseSepolia.id].rpc),
        [base.id]: http(CHAINS[base.id].rpc),
        [zora.id]: http(CHAINS[zora.id].rpc),
        [optimism.id]: http(CHAINS[optimism.id].rpc),
        [arbitrum.id]: http(CHAINS[arbitrum.id].rpc),
        [blast.id]: http(CHAINS[blast.id].rpc),
        [sepolia.id]: http(CHAINS[sepolia.id].rpc),
    },
}); 