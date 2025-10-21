// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {PoultryMarketplace} from "../src/PoultryMarketplace.sol";
import {Token} from "../src/poultryPulseToken.sol";
import {PoultryPulse} from "../src/poultryPulse.sol";

contract PoultryMarketplaceTest is Test {
    PoultryMarketplace public poultrypulseMarketplace;
    PoultryPulse public poultryPulse;
    address owner = makeAddr("Owner");

    address farmer1 = makeAddr("Farmer-1");
    address farmer2 = makeAddr("Farmer-2");

    address buyer1 = makeAddr("Buyer-1");
    address buyer2 = makeAddr("Buyer-2");

    uint256 quantity = 40;
    uint256 pricePerUnit = 3000;
    uint256 minimumOrder = 2;
    bytes32 healthCerHash = "0x325";
    bytes32 iotDataHash = "0x345";
    string farmLocation = "Lagos";
    uint256 durationDays = 30;

    // Mock State Value
    address feeCollector = makeAddr("feeCollector");
    uint platformFeePercent = 20; // Representing 0.2 as 20 (20% / 100)

    // ===== ENUMS =====
    enum ProductType {
        Broiler,
        Layer,
        Turkey,
        Duck,
        Goose,
        GuineaFowl,
        Quail,
        Eggs,
        ProcessedMeat
    }

    // ====== Events ======
    event ListingCreated(
        uint256 indexed listingId,
        address indexed farmer,
        PoultryMarketplace.ProductType productType,
        uint256 quantity,
        uint256 indexed pricePerUnit
    );

    event ListingUpdated(
        uint256 indexed listingId,
        uint256 newPrice,
        uint256 newQuantity
    );

    function setUp() public {
        // Deploy contracts
        poultrypulseMarketplace = new PoultryMarketplace(
            feeCollector,
            platformFeePercent
        );
        poultrypulseMarketplace.verifyFarmer(farmer1);
        poultrypulseMarketplace.verifyFarmer(farmer2);
    }

    modifier _createListing() {
        vm.startPrank(farmer1);
        uint256 listingId = poultrypulseMarketplace.createListing(
            PoultryMarketplace.ProductType.Broiler,
            quantity,
            pricePerUnit,
            minimumOrder,
            healthCerHash,
            iotDataHash,
            farmLocation,
            durationDays
        );
        vm.stopPrank();
        _;
    }

    function test_createListing() public {
        uint256 listingCounter_before = poultrypulseMarketplace
            .listingCounter();

        vm.startPrank(farmer1);
        vm.expectEmit(true, true, true, true);

        emit ListingCreated(
            1,
            farmer1,
            PoultryMarketplace.ProductType.Broiler,
            quantity,
            pricePerUnit
        );
        uint256 listingId = poultrypulseMarketplace.createListing(
            PoultryMarketplace.ProductType.Broiler,
            quantity,
            pricePerUnit,
            minimumOrder,
            healthCerHash,
            iotDataHash,
            farmLocation,
            durationDays
        );
        vm.stopPrank();

        uint256 listingCounter_after = poultrypulseMarketplace.listingCounter();

        console.log("Listing counter before", listingCounter_before);
        console.log("Listing counter after", listingCounter_after);
        console.log("Listing Id", listingId);

        // Correct assertions
        assertEq(listingId, 1);
        assertEq(listingCounter_before, 1);
        assertEq(listingCounter_after, 2);
        assertEq(listingCounter_after, listingCounter_before + 1); // Counter incremented by 1
        assertEq(listingId, listingCounter_before); // ID equals the counter BEFORE increment
    }

    function test_createListing_expect_failure() public {
        vm.startPrank(farmer1);
        vm.expectRevert("Quantity must be positive");
        poultrypulseMarketplace.createListing(
            PoultryMarketplace.ProductType.Broiler,
            0,
            pricePerUnit,
            minimumOrder,
            healthCerHash,
            iotDataHash,
            farmLocation,
            durationDays
        );

        vm.expectRevert("Price must be positive");
        poultrypulseMarketplace.createListing(
            PoultryMarketplace.ProductType.Broiler,
            quantity,
            0,
            minimumOrder,
            healthCerHash,
            iotDataHash,
            farmLocation,
            durationDays
        );

        vm.expectRevert("Invalid minmum order");
        poultrypulseMarketplace.createListing(
            PoultryMarketplace.ProductType.Broiler,
            quantity,
            pricePerUnit,
            100,
            healthCerHash,
            iotDataHash,
            farmLocation,
            durationDays
        );
        vm.stopPrank();
    }

    function test_updateListing() public _createListing {
        uint256 newPrice = 5000;
        uint256 newQuantity = 60;
        vm.prank(farmer1);
        vm.expectEmit(true, false, false, false);
        emit ListingUpdated(1, newPrice, newQuantity);
        poultrypulseMarketplace.updateListing(1, newPrice, newQuantity);
    }

    function test_updateListing_to_fail() public _createListing {
        vm.prank(farmer2);
        vm.expectRevert("Not listing owner");
        poultrypulseMarketplace.updateListing(1, 0, 60);
    }

    function test_cancel_listing() public _createListing {
        vm.startPrank(farmer1);
        poultrypulseMarketplace.cancelListing(1);
        vm.stopPrank();
    }

    function test_cancel_listing_fail() public _createListing {
        vm.startPrank(farmer2);
        vm.expectRevert("Not listing owner");
        poultrypulseMarketplace.cancelListing(1);
        vm.stopPrank();
    }
}
