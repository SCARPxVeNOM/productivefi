import { createConfig, http } from 'wagmi';
import { baseSepoliaConfig } from './chains';

export const config = createConfig({
  chains: [baseSepoliaConfig],
  transports: {
    [baseSepoliaConfig.id]: http(),
  },
});