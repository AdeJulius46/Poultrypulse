// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/interfaces/IERC20.sol";

contract PoultryPulse {
    IERC20 public pptoken;
    uint256 public monthlyFee; // in BlockDag tokens
    address public owner;

    struct User {
        uint256 points;
        uint256 subscriptionExpires;
    }

    modifier _onlyOwner() {
        require(msg.sender == owner, "Only Owner");
        _;
    }

    mapping(address => User) public users;

    event PointsEarned(address indexed user, uint256 points);
    event SubscriptionPaid(address indexed user, uint256 expiresAt);

    constructor(address _pptoken, uint256 _monthlyFee) {
        pptoken = IERC20(_pptoken);
        monthlyFee = _monthlyFee;
    }

    // 1. Add reward points to a user
    function addPoints(address user, uint256 points) external {
        users[user].points += points;
        emit PointsEarned(user, points);
    }

    // 2. Pay monthly subscription
    function paySubscription() external {
        require(
            pptoken.balanceOf(msg.sender) >= monthlyFee,
            "Not enough tokens"
        );
        require(
            pptoken.transferFrom(msg.sender, address(this), monthlyFee),
            "Transfer failed"
        );

        uint256 currentExpiration = users[msg.sender].subscriptionExpires;
        if (currentExpiration < block.timestamp) {
            users[msg.sender].subscriptionExpires = block.timestamp + 30 days;
        } else {
            users[msg.sender].subscriptionExpires += 30 days;
        }

        emit SubscriptionPaid(
            msg.sender,
            users[msg.sender].subscriptionExpires
        );
    }

    function convertPointsToTokens(uint256 pointsToConvert) external {
        User storage user = users[msg.sender];
        require(user.points >= pointsToConvert, "Not enough points");

        // Example conversion rate: 1 point = 1 ppToken
        pptoken.transfer(msg.sender, pointsToConvert * 1e18);

        // Deduct points
        user.points -= pointsToConvert;
    }

    // 3. View points and subscription
    function getUserInfo(
        address user
    ) external view returns (uint256 points, uint256 subscriptionExpires) {
        User memory u = users[user];
        return (u.points, u.subscriptionExpires);
    }

    // 4. Owner can withdraw collected tokens
    function withdrawTokens(address to, uint256 amount) external _onlyOwner {
        pptoken.transfer(to, amount);
    }
}
