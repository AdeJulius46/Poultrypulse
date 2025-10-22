// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {PoultryMarketplace} from "../src/PoultryMarketplace.sol";
import {Token} from "../src/poultryPulseToken.sol";
import {PoultryPulse} from "../src/poultryPulse.sol";

contract PoultryMarketplaceTest is Test {
    PoultryMarketplace public poultrypulseMarketplace;
    PoultryPulse public poultryPulse;
    Token public pulseToken;
    address owner = makeAddr("Owner");

    address farmer1 = makeAddr("Farmer-1");
    address farmer2 = makeAddr("Farmer-2");

    address buyer1 = makeAddr("Buyer-1");
    address buyer2 = makeAddr("Buyer-2");

    uint256 quantity = 40;
    uint256 pricePerUnit = 3000e18;
    uint256 minimumOrder = 3;
    bytes32 healthCerHash = "0x325";
    bytes32 iotDataHash = "0x345";
    string farmLocation = "Lagos";
    uint256 durationDays = 30;
    bytes32 deliverProofHash = "0x345";
    uint256 orderId = 1;

    uint256 amount_to_mint = 1_000_000_000e18;

    // Mock State Value
    address feeCollector = makeAddr("feeCollector");
    uint platformFeePercent = 20; // Representing 0.2 as 20 (20% / 100)
    bytes32 constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    uint256 listingId = 1;
    uint256 order_quantity = 10;

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

    event OrderPlaced(
        uint256 indexed orderId,
        uint256 indexed listingId,
        address indexed buyer,
        uint256 quantity,
        uint256 totalPrice
    );

    event OrderStatusChanged(
        uint256 indexed orderId,
        PoultryMarketplace.OrderStatus newStatus
    );

    event PaymentReleased(
        uint256 indexed orderId,
        address indexed farmer,
        uint256 indexed amount,
        uint256 platformFee
    );

    function setUp() public {
        // Deploy contracts
        pulseToken = new Token();
        poultrypulseMarketplace = new PoultryMarketplace(
            feeCollector,
            platformFeePercent,
            address(pulseToken),
            owner
        );
        poultrypulseMarketplace.verifyFarmer(farmer1);
        poultrypulseMarketplace.verifyFarmer(farmer2);
    }

    modifier _createListing() {
        vm.startPrank(farmer1);
        poultrypulseMarketplace.createListing(
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

    modifier _placeOrder() {
        vm.startPrank(buyer1);
        pulseToken.mint(buyer1, amount_to_mint);
        uint256 totalPrice = pricePerUnit * order_quantity;
        pulseToken.approve(address(poultrypulseMarketplace), amount_to_mint);
        poultrypulseMarketplace.placeOrder(listingId, order_quantity);
        vm.stopPrank();
        _;
    }

    modifier _confirmOrder_markInTransit() {
        vm.startPrank(farmer1);
        poultrypulseMarketplace.confirmOrder(orderId);
        poultrypulseMarketplace.markInTransit(orderId);
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
        poultrypulseMarketplace.createListing(
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

    // function() test_confirmOrder_markInTransit() public {}
    // function() test_confirmOrder() publuc {}

    function test_place_order() public _createListing {
        vm.startPrank(buyer1);

        pulseToken.mint(buyer1, amount_to_mint);
        uint256 totalPrice = pricePerUnit * order_quantity;
        pulseToken.approve(address(poultrypulseMarketplace), amount_to_mint);
        vm.expectEmit(true, true, true, true);
        emit OrderPlaced(1, listingId, buyer1, order_quantity, totalPrice);
        uint256 orderId_before = poultrypulseMarketplace.orderCounter();
        poultrypulseMarketplace.placeOrder(listingId, order_quantity);
        uint256 orderId_after = poultrypulseMarketplace.orderCounter();

        assertEq(orderId_before, orderId);
        assert(orderId_after != orderId_before);

        vm.stopPrank();
    }

    function test_place_order_to_fail_status_change() public _createListing {
        vm.prank(owner);
        poultrypulseMarketplace.changeStatus(
            listingId,
            PoultryMarketplace.ListingStatus.Suspended
        );

        vm.prank(buyer1);
        vm.expectRevert("Listing not active");
        poultrypulseMarketplace.placeOrder(listingId, order_quantity);
    }

    function test_place_order_to_fail_status_expired() public _createListing {
        vm.warp(durationDays * 2 days);
        vm.prank(buyer1);
        vm.expectRevert("Listing expired");
        poultrypulseMarketplace.placeOrder(listingId, order_quantity);
    }

    function test_place_order_to_fail_below_minimum() public _createListing {
        vm.prank(buyer1);
        vm.expectRevert("Below minimum order");
        poultrypulseMarketplace.placeOrder(listingId, 0);
    }

    function test_place_order_to_fail_insufficient_quantity()
        public
        _createListing
    {
        vm.prank(buyer1);
        vm.expectRevert("Insufficient quantity");
        poultrypulseMarketplace.placeOrder(listingId, 10000);
    }

    function test_confirm_order()
        public
        _createListing
        _placeOrder
        _confirmOrder_markInTransit
    {
        vm.prank(feeCollector);
        pulseToken.approve(address(poultrypulseMarketplace), amount_to_mint);

        vm.startPrank(buyer1);
        uint256 feeCollector_balance_before = pulseToken.balanceOf(
            address(feeCollector)
        );
        console.log("Fee collector Balance", feeCollector_balance_before);
        uint256 totalPrice = pricePerUnit * order_quantity;
        vm.expectEmit(true, true, false, false);
        emit OrderStatusChanged(1, PoultryMarketplace.OrderStatus.Delivered);
        emit PaymentReleased(1, buyer1, totalPrice, 3e18);
        emit OrderStatusChanged(
            orderId,
            PoultryMarketplace.OrderStatus.Completed
        );
        poultrypulseMarketplace.confirmDelivery(1, deliverProofHash);
        vm.stopPrank();
        uint256 feeCollector_balance_after = pulseToken.balanceOf(
            address(feeCollector)
        );
        assert(feeCollector_balance_before > feeCollector_balance_after);
        assertEq(pulseToken.balanceOf(address(farmer1)), totalPrice);
    }

    function test_confirm_delivery_fail()
        public
        _createListing
        _placeOrder
        _confirmOrder_markInTransit
    {
        vm.prank(buyer2);
        vm.expectRevert("Not order buyer");
        poultrypulseMarketplace.confirmDelivery(orderId, deliverProofHash);
    }

    function test_confirm_delivery_fail_order_not_in_transit()
        public
        _createListing
        _placeOrder
    {
        vm.prank(farmer1);
        poultrypulseMarketplace.confirmOrder(orderId);
        vm.expectRevert("Order not in transit");
        vm.prank(buyer1);
        poultrypulseMarketplace.confirmDelivery(orderId, deliverProofHash);
    }

    // ========== ADMIN FUNCTIONS TEST ==========

    function test_updatePlatformFee() public {
        vm.prank(owner);
        uint256 _newFeePercent = 30;
        poultrypulseMarketplace.updatePlatformFee(_newFeePercent);
        assertEq(_newFeePercent, poultrypulseMarketplace.platformFeePercent());
    }

    function test_updatePlatformfee_fail() public {
        vm.prank(owner);
        uint256 _newFeePercent = 1500;
        vm.expectRevert("Fee to high");
        poultrypulseMarketplace.updatePlatformFee(_newFeePercent);
    }

    function test_updateFee_colleactor() public {
        vm.prank(owner);
        address newFeeCollector = makeAddr("new_fee_collector");
        poultrypulseMarketplace.updateFeeCollector(newFeeCollector);
        assertEq(newFeeCollector, poultrypulseMarketplace.feeCollector());
    }

    function test_updateFee_colleactor_fail() public {
        vm.prank(owner);
        vm.expectRevert();
        poultrypulseMarketplace.updateFeeCollector(address(0)); 
    }
}
