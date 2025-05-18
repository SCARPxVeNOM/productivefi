const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying StudyFiNFT contract...");

  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    console.error("Error: PRIVATE_KEY is not set in your environment variables.");
    console.error("Please add PRIVATE_KEY=your_private_key to your .env file");
    process.exit(1);
  }
  console.log(`Private key loaded: ${privateKey.substring(0, 6)}...${privateKey.substring(privateKey.length - 4)}`);

  const StudyFiNFT = await ethers.getContractFactory("StudyFiNFT");
  const nft = await StudyFiNFT.deploy();

  await nft.waitForDeployment();

  const address = await nft.getAddress();
  console.log(`StudyFiNFT deployed to: ${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 