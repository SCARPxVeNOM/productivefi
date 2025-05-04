'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { mainnet, optimism, polygon, base } from 'viem/chains';
import { coinbaseWallet, walletConnect, injected } from 'wagmi/connectors';
import { WalletProvider } from '@/components/client/WalletContext';
import { ConnectionModal } from '@/components/client/ConnectionModal';

// Create wagmi config with proper WalletConnect projectId
const config = createConfig({
  chains: [mainnet, polygon, optimism, base],
  transports: {
    [mainnet.id]: http('https://eth-mainnet.g.alchemy.com/v2/demo'),
    [polygon.id]: http('https://polygon-mainnet.g.alchemy.com/v2/demo'),
    [optimism.id]: http('https://opt-mainnet.g.alchemy.com/v2/demo'),
    [base.id]: http('https://base-mainnet.g.alchemy.com/v2/demo'),
  },
  connectors: [
    injected(),
    coinbaseWallet({ 
      appName: 'Zora StudyFi App',
    }),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo-project-id',
      metadata: {
        name: 'Zora StudyFi App',
        description: 'Zora StudyFi Application',
        url: 'https://your-website.com',
        icons: ['https://your-website.com/favicon.ico']
      }
    }),
  ],
});

// Create a client
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