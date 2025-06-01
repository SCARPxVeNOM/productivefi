import { baseSepolia } from 'wagmi/chains';

export const baseSepoliaConfig = {
  ...baseSepolia,
  rpcUrls: {
    ...baseSepolia.rpcUrls,
    default: {
      http: ['https://base-sepolia.g.alchemy.com/v2/nyDzDlRhwlmT5EEDYPptVofrMsqH78G5'],
    },
    public: {
      http: ['https://base-sepolia.g.alchemy.com/v2/nyDzDlRhwlmT5EEDYPptVofrMsqH78G5'],
    },
  },
};