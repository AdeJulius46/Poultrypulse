// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {SupplyChainTracker} from "../src/SupplyChainTracker.sol";
import {PoultryMarketplace} from "../src/PoultryMarketplace.sol";
import {Token} from "../src/poultryPulseToken.sol";

contract SupplyChainTrackerTest is Test {
    // ============== ENUMS ==========
    enum Stage {
        NotStarted,
        Farm,
        Packed,
        InTransit,
        Delivered,
        Error
    }

    // ================ SPECIAL STATE VARIABLES ======
    SupplyChainTracker public supplyChainTracker;
    PoultryMarketplace public poultryMarketplace;
    Token public pulseToken;

    // ======== STATE VARIABLES ======
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

    // =========== EVENTS ==================
    event TrackingInitiated(
        uint256 indexed orderId,
        address indexed farmer,
        address indexed buyer,
        uint256 timestamp
    );

    event StageUpdated(
        uint256 indexed orderId,
        Stage indexed previousStage,
        Stage indexed newStage,
        address actor,
        uint256 timestamp
    );

    event TrackingCompleted(uint indexed orderId, uint indexed totalDuration);

    function setUp() public {
        // Deploy contracts
        pulseToken = new Token();
        supplyChainTracker = new SupplyChainTracker(owner);
        poultryMarketplace = new PoultryMarketplace(
            feeCollector,
            platformFeePercent,
            address(pulseToken),
            owner
        );
        poultryMarketplace.verifyFarmer(farmer1);
        poultryMarketplace.verifyFarmer(farmer2);
        poultryMarketplace.setSupplyChainContract(address(supplyChainTracker));

        supplyChainTracker.setMarketplace(address(poultryMarketplace));
    }

    modifier _createListing() {
        vm.startPrank(farmer1);
        poultryMarketplace.createListing(
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
        pulseToken.approve(address(poultryMarketplace), amount_to_mint);
        poultryMarketplace.placeOrder(listingId, order_quantity);
        vm.stopPrank();
        _;
    }

    modifier _confirmOrder_markInTransit() {
        vm.startPrank(farmer1);
        poultryMarketplace.confirmOrder(orderId);
        poultryMarketplace.markInTransit(orderId);
        vm.stopPrank();
        _;
    }

    function test_initiateTracking()
        public
        _createListing
        _placeOrder
        _confirmOrder_markInTransit
    {
        SupplyChainTracker.Stage currentStage = supplyChainTracker
            .getCurrentStage(orderId);

        assertEq(uint(currentStage), uint(Stage.Farm));
    }

    function test_updateStage()
        public
        _createListing
        _placeOrder
        _confirmOrder_markInTransit
    {
        vm.startPrank(address(poultryMarketplace));
        SupplyChainTracker.Stage previousStage = supplyChainTracker
            .getCurrentStage(orderId);

        vm.expectEmit(true, true, true, false);
        emit StageUpdated(
            orderId,
            Stage(uint8(previousStage)),
            Stage(uint8(SupplyChainTracker.Stage.Packed)),
            address(poultryMarketplace),
            block.timestamp
        );
        supplyChainTracker.updateStage(
            orderId,
            SupplyChainTracker.Stage.Packed,
            deliverProofHash,
            "In transit"
        );

        SupplyChainTracker.Stage currentStage = supplyChainTracker
            .getCurrentStage(orderId);

        vm.stopPrank();

        assertEq(uint(currentStage), uint(Stage.Packed));
    }

    function test_updateStage_invalid_stage_progression()
        public
        _createListing
        _placeOrder
        _confirmOrder_markInTransit
    {
        vm.prank(address(poultryMarketplace));
        vm.expectRevert("Invalid stage progression");
        supplyChainTracker.updateStage(
            orderId,
            SupplyChainTracker.Stage.Farm,
            deliverProofHash,
            "In transit"
        );
    }

    function test_updateStage_complete_tracking()
        public
        _createListing
        _placeOrder
        _confirmOrder_markInTransit
    {
        uint256 timeStamp = supplyChainTracker.getEntryTimestamp(orderId);
        vm.prank(address(poultryMarketplace));
        vm.expectEmit(true, true, true, false);
        emit TrackingCompleted(orderId, block.timestamp - timeStamp);
        supplyChainTracker.updateStage(
            orderId,
            SupplyChainTracker.Stage.Delivered,
            deliverProofHash,
            "In transit"
        );
    }
}
