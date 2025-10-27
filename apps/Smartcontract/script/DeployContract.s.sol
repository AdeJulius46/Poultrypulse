// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {PoultryPulse} from "../src/poultryPulse.sol";
import {Token} from "../src/poultryPulseToken.sol";
import {SupplyChainTracker} from "../src/SupplyChainTracker.sol";
import {PoultryMarketplace} from "../src/PoultryMarketplace.sol";

contract DeployContract is Script {
    Token public ppToken;
    PoultryPulse public poultryPulse;
    SupplyChainTracker public supplyChainTracker;
    PoultryMarketplace public poultryMarketplace;

    function run() public {
        // Get private key from environment
        uint256 deployerPrivateKey = vm.envUint("HEDERA_PRIVATE_KEY");

        // Calculate deployer address from private key
        address deployer = vm.addr(deployerPrivateKey);

        console.log("==========================================");
        console.log("Deploying contracts...");
        console.log("Deployer address:", deployer);
        console.log("Chain ID:", block.chainid);
        console.log("==========================================");

        // Configuration
        uint256 registrationFee = 10e18; // 10 tokens with 18 decimals
        uint256 platformFeePercent = 20; // 0.2% (20 basis points)

        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy Token first
        console.log("\n1. Deploying Token...");
        ppToken = new Token();
        console.log("Token deployed at:", address(ppToken));

        // 2. Deploy PoultryPulse
        console.log("\n2. Deploying PoultryPulse...");
        poultryPulse = new PoultryPulse(address(ppToken), registrationFee);
        console.log("PoultryPulse deployed at:", address(poultryPulse));

        // 3. Deploy SupplyChainTracker
        console.log("\n3. Deploying SupplyChainTracker...");
        supplyChainTracker = new SupplyChainTracker(deployer);
        console.log(
            "SupplyChainTracker deployed at:",
            address(supplyChainTracker)
        );

        // 4. Deploy PoultryMarketplace
        console.log("\n4. Deploying PoultryMarketplace...");
        poultryMarketplace = new PoultryMarketplace(
            deployer, // owner
            platformFeePercent, // platformFeePercent (0.2%)
            address(ppToken), // payment token
            deployer // fee recipient
        );
        console.log(
            "PoultryMarketplace deployed at:",
            address(poultryMarketplace)
        );

        vm.stopBroadcast();

        // Print summary
        console.log("\n==========================================");
        console.log("DEPLOYMENT SUMMARY");
        console.log("==========================================");
        console.log("Token:               ", address(ppToken));
        console.log("PoultryPulse:        ", address(poultryPulse));
        console.log("SupplyChainTracker:  ", address(supplyChainTracker));
        console.log("PoultryMarketplace:  ", address(poultryMarketplace));
        console.log("==========================================");
        console.log("Owner/Deployer:      ", deployer);
        console.log("Registration Fee:    ", registrationFee);
        console.log(
            "Platform Fee:        ",
            platformFeePercent,
            "basis points"
        );
        console.log("==========================================");
    }
}

// Separate script for verification if auto-verify fails
contract VerifyContracts is Script {
    function run() public view {
        console.log("To verify your contracts on Hedera, use:");
        console.log("");
        console.log("make verify-hedera CONTRACT=<token_address>");
        console.log("make verify-hedera CONTRACT=<poultry_pulse_address>");
        console.log("make verify-hedera CONTRACT=<supply_chain_address>");
        console.log("make verify-hedera CONTRACT=<marketplace_address>");
        console.log("");
        console.log("Or view on HashScan:");
        console.log("https://hashscan.io/testnet");
    }
}
