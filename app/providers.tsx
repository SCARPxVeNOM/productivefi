'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { mainnet, optimism, polygon, base } from 'wagmi/chains';
import { injected, coinbaseWallet, walletConnect } from 'wagmi/connectors';
import { WalletProvider } from '@/components/client/WalletContext';
import { ConnectionModal } from '@/components/client/ConnectionModal';

// Create connectors for multiple wallets
const connectors = [
  injected(),
  coinbaseWallet({
    appName: 'Zora StudyFi App',
  }),
  walletConnect({
    projectId: 'YOUR_WALLET_CONNECT_PROJECT_ID', // Replace with your WalletConnect project ID
  }),
];

// Config with multiple chains for better network support
const config = createConfig({
  chains: [mainnet, polygon, optimism, base],
  connectors,
  transports: {
    [mainnet.id]: http('https://eth-mainnet.g.alchemy.com/v2/demo'),
    [polygon.id]: http('https://polygon-mainnet.g.alchemy.com/v2/demo'),
    [optimism.id]: http('https://opt-mainnet.g.alchemy.com/v2/demo'),
    [base.id]: http('https://base-mainnet.g.alchemy.com/v2/demo'),
  },
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <WalletProvider>
          <ConnectionModal />
          {children}
        </WalletProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
} 