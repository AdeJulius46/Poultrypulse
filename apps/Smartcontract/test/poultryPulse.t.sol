// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {PoultryPulse} from "../src/poultryPulse.sol";
import {Token} from "../src/poultryPulseToken.sol";

contract PoultryPulseTest is Test {
    PoultryPulse public poultryPulse;
    Token public ppToken;
    uint256 monthlyFee = 10e18;

    address user1 = makeAddr("user1");

    function setUp() public {
        // Deploy ERC20 token for testing
        ppToken = new Token();

        // Deploy PoultryPulse contract
        poultryPulse = new PoultryPulse(address(ppToken), monthlyFee);

    }

    function test_convert_points_to_tokens() public {
        // Credit points to user1 (test-only)
        poultryPulse.addPoints(user1, 100);

        // Mint tokens to contract to cover conversion
        ppToken.mint(address(poultryPulse), 100 * 1e18);

        // User converts 50 points
        vm.startPrank(user1);
        poultryPulse.convertPointsToTokens(50);
        vm.stopPrank();

        // Check remaining points
        (uint256 remainingPoints, uint256 fees) = poultryPulse.getUserInfo(user1);
        assertEq(remainingPoints, 50);

        // Check user token balance
        uint256 _bal = ppToken.balanceOf(address(poultryPulse));
        console.log(_bal);

        uint user_bal = ppToken.balanceOf(address(user1));
        console.log(user_bal);

        assertEq(ppToken.balanceOf(user1), 50 * 1e18);
    }

    function test_pay_subscription() public {
        // Mint tokens to user1
        ppToken.mint(user1, monthlyFee);

        // Impersonate user1
        vm.startPrank(user1);

        // Approve contract to spend tokens
        ppToken.approve(address(poultryPulse), monthlyFee);

        // Pay subscription
        poultryPulse.paySubscription();

        // Check subscription expiration
        (, uint256 subscriptionExpires) = poultryPulse.getUserInfo(user1);
        assertTrue(subscriptionExpires > block.timestamp);

        vm.stopPrank();
    }

    function test_fail_insufficient_tokens_for_subscription() public {
        // user1 has no tokens
        vm.startPrank(user1);
        ppToken.approve(address(poultryPulse), monthlyFee);

        vm.expectRevert("Not enough tokens");
        poultryPulse.paySubscription();
        vm.stopPrank();
    }
}
