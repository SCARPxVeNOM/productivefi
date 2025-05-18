const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying StudyFiNFT contract...");

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