// Explicitly require dotenv and specify path
require("dotenv").config({ path: require('path').resolve(__dirname, '.env') });

const { HardhatUserConfig } = require("hardhat/config");
require("@nomicfoundation/hardhat-toolbox");

// --- Added check for ALCHEMY_API_KEY --- 
const alchemyApiKey = process.env.ALCHEMY_API_KEY;
if (!alchemyApiKey) {
  console.error("Error: ALCHEMY_API_KEY is not set in your environment variables.");
  console.error("Please add ALCHEMY_API_KEY=your_key to your .env file");
  // We won't exit here, so Hardhat can still attempt to load the config, 
  // but this log will tell us if the variable is missing.
}
console.log(`Alchemy API Key loaded: ${alchemyApiKey ? alchemyApiKey.substring(0, 6) + '...' : 'Not Set'}`);
// --- End added check --- 

const config = {
  solidity: "0.8.20",
  networks: {
    baseSepolia: {
      url: `https://base-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: {
      baseSepolia: process.env.BASESCAN_API_KEY || "",
      sepolia: process.env.ETHERSCAN_API_KEY || "", // You might need a different API key for Etherscan Sepolia
    },
  },
};

module.exports = config; 