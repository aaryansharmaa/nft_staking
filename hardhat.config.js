require("@nomiclabs/hardhat-waffle");
require("@openzeppelin/hardhat-upgrades");

require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  networks: {
    mainnet: {
      url: process.env.ALCHEMY_API_KEY,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
  },
};
