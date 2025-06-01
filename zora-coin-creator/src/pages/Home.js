import React, { useState, useEffect } from 'react';
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  
} from 'wagmi';
import { createCoinCall, getCoinCreateFromLogs } from '@zoralabs/coins-sdk';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import {
  Container,
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Paper,
} from '@mui/material';
import {
  uploadImageToIPFS,
  uploadMetadataToIPFS,
} from '../services/pinataService';
import ThreeDRetroBackground from '../components/ThreeDRetroBackground';





const Home = () => {
  const { address, isConnected } = useAccount();
  const {
    writeContract,
    isPending,
    isSuccess,
    data: txHash,
  } = useWriteContract();

  const [coinName, setCoinName] = useState('');
  const [coinSymbol, setCoinSymbol] = useState('');
  const [coinImage, setCoinImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [deployedCoinAddress, setDeployedCoinAddress] = useState('');

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setCoinImage(e.target.files[0]);
    }
  };

 
  
  
  const handleCreateCoin = async () => {
    if (!coinName || !coinSymbol || !coinImage || !address) return;

    try {
      setIsUploading(true);
      console.log('Starting token creation process...');

      // 1. Upload image to IPFS
      const imageUri = await uploadImageToIPFS(coinImage);
      console.log('Image uploaded:', imageUri);

      // 2. Create and upload metadata
      const metadata = {
        name: coinName,
        symbol: coinSymbol,
        description: `${coinName} token created on Base Sepolia testnet`,
        image: imageUri,
      };

      const metadataUri = await uploadMetadataToIPFS(metadata);
      console.log('Metadata uploaded:', metadataUri);

      // 3. Prepare coin parameters
      const coinParams = {
        name: coinName,
        symbol: coinSymbol,
        uri: metadataUri,
        payoutRecipient: address,
        owners: [address],
        currency: '0x0000000000000000000000000000000000000000',
        tickLower: -199200,
        initialMintAmount: 1000000000000000000n, // 1 token
        initialPurchaseWei: 10000000000000000n, // 0.01 ETH
      };

      const contractCallParams = await createCoinCall(coinParams);
      console.log('Contract call params:', contractCallParams);
      
      // Set chain ID if needed
      contractCallParams.chainId = 84532;

      // Set gas limit if needed
      contractCallParams.gas = 13000000n;

      // 4. Call writeContract
      try {
        contractCallParams.gas = 1_500_000n; // STEP 6
        console.log('Writing contract with:', contractCallParams); // STEP 5
        console.log('Contract Call Args:', contractCallParams.args);
      
        await writeContract(contractCallParams); // STEP 4
      } catch (error) {
        console.error('🛑 Contract reverted:', error); // STEP 4
        alert(`Contract failed: ${error?.message || error?.cause || 'Unknown error'}`);
      }
      

      setIsUploading(false);
    } catch (error) {
      console.error('Error creating coin:', error);
      setIsUploading(false);
    }
  };

  const {
    data: receipt,
    isLoading: isReceiptLoading,
    isSuccess: isReceiptSuccess,
  } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  useEffect(() => {
    if (isReceiptSuccess && receipt) {
      const deployment = getCoinCreateFromLogs(receipt.logs);
      if (deployment?.coin) {
        setDeployedCoinAddress(deployment.coin);
      }
    }
  }, [isReceiptSuccess, receipt]);

  return (
    <>
      <ThreeDRetroBackground />
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Typography variant="h3" align="center" gutterBottom>
            Create Your Coin 
          </Typography>
          <Typography align="center" variant="subtitle1" sx={{ mb: 4 }}>
            Create your own token with ZORA 
          </Typography>

          <Paper elevation={6} sx={{
            p: 4, mb: 4, borderRadius: 4, background: 'rgba(24,28,47,0.85)', boxShadow: '0 8px 32px 0 rgba(31,38,135,0.37)', border: '1px solid rgba(255,255,255,0.18)', backdropFilter: 'blur(6px)',
          }}>
            <Box display="flex" justifyContent="flex-end" mb={3}>
              <ConnectButton />
            </Box>

            {isConnected ? (
              <>
                <TextField
                  label="Coin Name"
                  fullWidth
                  margin="normal"
                  value={coinName}
                  onChange={(e) => setCoinName(e.target.value)}
                  InputProps={{
                    style: {
                      background: 'rgba(255,255,255,0.15)',
                      borderRadius: 8,
                      color: '#fff',
                      fontWeight: 600,
                      boxShadow: '0 2px 8px rgba(0,255,247,0.08)',
                    },
                  }}
                  InputLabelProps={{ style: { color: '#00fff7' } }}
                />
                <TextField
                  label="Coin Symbol"
                  fullWidth
                  margin="normal"
                  value={coinSymbol}
                  onChange={(e) => setCoinSymbol(e.target.value)}
                  InputProps={{
                    style: {
                      background: 'rgba(255,255,255,0.15)',
                      borderRadius: 8,
                      color: '#fff',
                      fontWeight: 600,
                      boxShadow: '0 2px 8px rgba(255,0,204,0.08)',
                    },
                  }}
                  InputLabelProps={{ style: { color: '#ff00cc' } }}
                />

                <Box sx={{ mt: 2, mb: 3 }}>
                  <Typography text-color="blue" variant="body1" gutterBottom>
                    Coin Image
                  </Typography>
                  <input accept="image/*" type="file" onChange={handleImageChange} />
                  {coinImage && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Selected: {coinImage.name}
                    </Typography>
                  )}
                </Box>

                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{
                    mt: 2,
                    py: 1.5,
                    fontWeight: 700,
                    fontSize: '1.2rem',
                    letterSpacing: 2,
                    borderRadius: 3,
                    background: 'linear-gradient(90deg, #00fff7 0%, #ff00cc 100%)',
                    boxShadow: '0 4px 24px 0 #00fff799, 0 1.5px 0 #ff00cc',
                    color: '#181c2f',
                    textShadow: '0 1px 8px #fff',
                    transition: 'transform 0.2s cubic-bezier(.34,1.56,.64,1)',
                    '&:hover': {
                      background: 'linear-gradient(90deg, #ff00cc 0%, #00fff7 100%)',
                      transform: 'scale(1.04) rotate(-1deg)',
                    },
                  }}
                  disabled={
                    !coinName ||
                    !coinSymbol ||
                    !coinImage ||
                    isUploading ||
                    isPending
                  }
                  onClick={handleCreateCoin}
                >
                  {isUploading || isPending ? (
                    <CircularProgress size={24} color="inherit" sx={{ color: '#fff' }} />
                  ) : (
                    'Create Coin'
                  )}
                </Button>

                {isSuccess && txHash && (
                  <Box mt={3} p={2} bgcolor="#f5f5f5" borderRadius={1}>
                    <Typography variant="body1" gutterBottom>
                      Transaction sent successfully!
                    </Typography>
                    <Typography variant="body2">
                      Tx Hash: <code>{txHash}</code>
                    </Typography>
                    {isReceiptLoading && (
                      <Typography variant="body2">
                        Waiting for confirmation...
                      </Typography>
                    )}
                    {deployedCoinAddress && (
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Coin Address: <code>{deployedCoinAddress}</code>
                      </Typography>
                    )}
                  </Box>
                )}
              </>
            ) : (
              <Box mt={4} textAlign="center">
                <Typography variant="h5" color="white" gutterBottom font Weight={700} font-style="italic">
                  Connect your wallet to create a coin
                </Typography>
              </Box>
            )}
          </Paper>
        </Box>
      </Container>
    </>
  );
};

export default Home;
