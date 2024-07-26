NFT Staking 
====================

Project Description
-------------------
This project implements an NFT staking with rewards using ERC20 and ERC721 tokens. Users can stake their NFTs to earn ERC20 token rewards.

Setup Instructions
------------------
1. Clone the repository:
   git clone https://github.com/your-repo/nft-staking.git
   cd nft-staking

2. Install dependencies:
   npm install

Deployment Instructions
-----------------------
1. Compile the contracts:
   npx hardhat compile

2. Add .env file with your wallet key & RPC provider API key.

3. Deploy the contracts:
   npx hardhat run scripts/deploy.js --network [network]

Testing Instructions
--------------------
1. Update the token ID in the testing script to a number greater than 5 to avoid gas errors, as previous IDs may have already been used during testing:
   Example: const mintNftTx = await ERC721Mock.mint(deployer.address, 6); -  Use a token ID greater than 5

2. Run the tests:
   npx hardhat test

Contract Addresses
------------------
Replace these placeholders with your actual deployed contract addresses:
- ERC20Mock: YOUR_DEPLOYED_ERC20MOCK_ADDRESS
- ERC721Mock: YOUR_DEPLOYED_ERC721MOCK_ADDRESS
- NFTStaking: YOUR_DEPLOYED_NFTSTAKING_ADDRESS


Live Contract Addresses on Polygon Mainnet
------------------

Check out the live contract interactions here.

- ERC20Mock: 0xa62f7A33c66C6cD165a63442584874dC0e89729A
- ERC721Mock: 0xA1EB5DDb28e51E7fb61346e4C1C2E00fCEd86a71
- NFTStaking: 0xD967C4E17DfF2808f00126C0dDca99720f2CE2F8

Tests Cases
---------------------

![Screenshot 2024-07-26 at 1 06 12 PM](https://github.com/user-attachments/assets/830003dc-7706-45e6-87f8-056923c28d0d)




