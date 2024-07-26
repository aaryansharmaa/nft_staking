const { ethers, upgrades } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const balance = await deployer.getBalance();
  console.log("Account balance:", balance.toString());

  // Deploy ERC20Mock contract
  const ERC20Mock = await ethers.getContractFactory("ERC20Mock");
  const erc20Mock = await ERC20Mock.deploy("MyToken", "MTK");
  await erc20Mock.deployed();
  console.log("ERC20Mock deployed to:", erc20Mock.address);

  // Deploy ERC721Mock contract
  const ERC721Mock = await ethers.getContractFactory("ERC721Mock");
  const erc721Mock = await ERC721Mock.deploy("MyNFT", "MNFT");
  await erc721Mock.deployed();
  console.log("ERC721Mock deployed to:", erc721Mock.address);

  // Deploy NFTStaking contract using OpenZeppelin upgrades
  const NFTStaking = await ethers.getContractFactory("NFTStaking");
  const nftStaking = await upgrades.deployProxy(
    NFTStaking,
    [
      erc721Mock.address, // Use the deployed ERC721Mock contract address
      erc20Mock.address, // Use the deployed ERC20Mock contract address
      ethers.utils.parseUnits("1", "ether"), // reward per block
      100, //  Unbonding period
      10, //  Reward claim delay
    ],
    { initializer: "initialize" }
  );

  await nftStaking.deployed();
  console.log("NFTStaking deployed to:", nftStaking.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
