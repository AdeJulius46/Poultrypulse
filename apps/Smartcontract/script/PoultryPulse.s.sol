// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {PoultryPulse} from "../src/poultryPulse.sol";
import {Token} from "../src/poultryPulseToken.sol";

contract DeployContract is Script {
    Token public ppToken;

    PoultryPulse public poultryPulse; 

    function run() public {
        
        vm.startBroadcast();

        ppToken = new Token();

        poultryPulse = new PoultryPulse(address(ppToken), 10e18);

        vm.stopBroadcast();
    }
}