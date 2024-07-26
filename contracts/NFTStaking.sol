// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract NFTStaking is Initializable, UUPSUpgradeable, OwnableUpgradeable, PausableUpgradeable {
    IERC721 public nft;
    IERC20 public rewardToken;

    uint256 public rewardPerBlock;
    uint256 public unbondingPeriod;
    uint256 public rewardClaimDelay;

    struct Stake {
        uint256 tokenId;
        uint256 stakedAtBlock;
        uint256 unstakeAtBlock;
    }

    mapping(address => Stake[]) public stakes;
    mapping(address => uint256) public rewards;

    event Staked(address indexed user, uint256 tokenId);
    event Unstaked(address indexed user, uint256 tokenId);
    event RewardClaimed(address indexed user, uint256 amount);

    function initialize(
        address _nft,
        address _rewardToken,
        uint256 _rewardPerBlock,
        uint256 _unbondingPeriod,
        uint256 _rewardClaimDelay
    ) public initializer {
        __UUPSUpgradeable_init();
        __Ownable_init(_msgSender());
        __Pausable_init();
        nft = IERC721(_nft);
        rewardToken = IERC20(_rewardToken);
        rewardPerBlock = _rewardPerBlock;
        unbondingPeriod = _unbondingPeriod;
        rewardClaimDelay = _rewardClaimDelay;
        _transferOwnership(_msgSender());
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    function stake(uint256 tokenId) external whenNotPaused {
        nft.transferFrom(msg.sender, address(this), tokenId);
        stakes[msg.sender].push(Stake(tokenId, block.number, 0));
        emit Staked(msg.sender, tokenId);
    }

    function unstake(uint256 tokenId) external {
        Stake[] storage userStakes = stakes[msg.sender];
        for (uint256 i = 0; i < userStakes.length; i++) {
            if (userStakes[i].tokenId == tokenId && userStakes[i].unstakeAtBlock == 0) {
                userStakes[i].unstakeAtBlock = block.number + unbondingPeriod;
                emit Unstaked(msg.sender, tokenId);
                return;
            }
        }
        revert("Token not found or already unstaked");
    }

    function withdraw(uint256 tokenId) external {
        Stake[] storage userStakes = stakes[msg.sender];
        for (uint256 i = 0; i < userStakes.length; i++) {
            if (userStakes[i].tokenId == tokenId && userStakes[i].unstakeAtBlock != 0 && block.number >= userStakes[i].unstakeAtBlock) {
                nft.transferFrom(address(this), msg.sender, tokenId);
                userStakes[i] = userStakes[userStakes.length - 1];
                userStakes.pop();
                return;
            }
        }
        revert("Token not found or unbonding period not over");
    }

    function claimRewards() external whenNotPaused {
        uint256 reward = rewards[msg.sender];
        require(reward > 0, "No rewards to claim");
        require(block.number >= rewardClaimDelay, "Claim delay period not over");
        rewards[msg.sender] = 0;
        rewardToken.transfer(msg.sender, reward);
        emit RewardClaimed(msg.sender, reward);
    }

    function updateRewardPerBlock(uint256 _rewardPerBlock) external onlyOwner {
        rewardPerBlock = _rewardPerBlock;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}