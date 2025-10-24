// SPDX-License-Identifier: SEE LICENSE IN LICENSE
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

    uint256 deployerPrivateKey = vm.envUint("HEDERA_PRIVATE_KEY");
    address OWNER = vm.envAddress("HEDERA_EVM_ADDRESS");

    function run() public {
        
        vm.startBroadcast(deployerPrivateKey);
    
        ppToken = new Token();
        poultryPulse = new PoultryPulse(address(ppToken), 10e18);
        supplyChainTracker = new SupplyChainTracker(OWNER);
        poultryMarketplace = new PoultryMarketplace(
            
        )
        vm.stopBroadcast();
    }
}