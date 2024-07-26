const { ethers } = require("hardhat");

// Change ERC721 token IDs to avoid gas errors. Use id>5 (previous IDs deployed for testing)

async function main() {
  const [deployer, user] = await ethers.getSigners();
  console.log("Using deployer account:", deployer.address);

  // Deployed addresses on Polygon mainnet
  const ERC20MockAddress = "0xa62f7A33c66C6cD165a63442584874dC0e89729A";
  const ERC721MockAddress = "0xA1EB5DDb28e51E7fb61346e4C1C2E00fCEd86a71";
  const NFTStakingAddress = "0xD967C4E17DfF2808f00126C0dDca99720f2CE2F8";

  const ERC20Mock = await ethers.getContractAt("ERC20Mock", ERC20MockAddress);
  const ERC721Mock = await ethers.getContractAt(
    "ERC721Mock",
    ERC721MockAddress
  );
  const NFTStaking = await ethers.getContractAt(
    "NFTStaking",
    NFTStakingAddress
  );

  if (!ERC20Mock || !ERC721Mock || !NFTStaking) {
    throw new Error(
      "Failed to get contract instances. Please check your contract addresses."
    );
  }

  // Mint ERC20 tokens to the deployer
  const mintTx = await ERC20Mock.mint(
    deployer.address,
    ethers.utils.parseUnits("1000", 18),
    { gasLimit: 1000000 }
  );
  await mintTx.wait();
  console.log(`Minted 1000 ERC20 tokens to ${deployer.address}`);

  // Mint an NFT to the deployer - change ID from 1 to above 5 number

  const mintNftTx = await ERC721Mock.mint(deployer.address, 1);
  await mintNftTx.wait();
  console.log(`Minted an NFT with tokenId 1 to ${deployer.address}`);

  // Approve NFTStaking contract to transfer deployer's NFT
  const approveTx = await ERC721Mock.approve(NFTStaking.address, 1);
  await approveTx.wait();
  console.log(`Approved NFTStaking contract to transfer NFT with tokenId 1`);

  // Stake the NFT
  const stakeTx = await NFTStaking.stake(1);
  await stakeTx.wait();
  console.log(`Staked NFT with tokenId 1 to NFTStaking contract`);

  //Wait for the unbonding period - commented out to avoid wait

  // console.log(`Waiting for unbonding period...`);
  // await ethers.provider.send("evm_increaseTime", [3600]);

  // await ethers.provider.send("evm_mine"); // Mine a new block

  // Unstake the NFT
  const unstakeTx = await NFTStaking.unstake(1);
  await unstakeTx.wait();
  console.log(`Unstaked NFT with tokenId 1 from NFTStaking contract`);

  // Claim rewards - works if any rewards accumulated
  const claimTx = await NFTStaking.claimRewards();
  await claimTx.wait();
  console.log(`Claimed staking rewards`);

  console.log("All operations completed successfully.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
