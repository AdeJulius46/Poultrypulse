// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";
import {Token} from "./poultryPulseToken.sol";

interface ISupplyChain {
    enum Stage {
        NotStarted,
        Farm,
        Packed,
        InTransit,
        Delivered
    }

    function initiateTracking(
        uint256 orderId,
        address farmer,
        address buyer
    ) external;

    function updateStage(
        uint256 orderId,
        Stage newStage,
        bytes32 locationHash,
        int16 temp,
        uint8 humidity,
        string memory notes
    ) external;

    function verifyDelivery(
        uint256 orderId,
        bytes32 deliveryProofHash
    ) external;
}

/**
 * @title Poultry Marketplace
 * @notice core marketplace contract for Poultry Pulse ecosystem
 * @dev Handles product listings, orders, payments and marketplace operations
 */

contract PoultryMarketplace is AccessControl, ReentrancyGuard, Pausable {
    // ========== ROLES ==========
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant VERIFIED_FARMER_ROLE =
        keccak256("VERIFIED_FARMER_ROLE");
    bytes32 public constant VET_OFFICER_ROLE = keccak256("VET_OFFICER_ROLE");
    bytes32 public constant ARBITRATOR_ROLE = keccak256("ARBITRATOR_ROLE");

    // ========= ENUMS =========
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

    enum ListingStatus {
        Active,
        Sold,
        Expired,
        Cancelled,
        Suspended
    }

    enum OrderStatus {
        Pending,
        Confirmed,
        InTransit,
        Delivered,
        Completed,
        Disputed,
        Cancelled,
        Refunded
    }

    enum DisputeStatus {
        None,
        Raised,
        UnderReview,
        ResolvedForBuyer,
        ResolvedForFarmer
    }

    // ========== STRUCTS ==========

    struct ProductListing {
        uint256 listingId;
        address farmer;
        ProductType productType;
        uint256 quantity;
        uint256 pricePerUnit;
        uint256 minimumOrder;
        bytes32 healthCertHash;
        bytes32 iotDataHash;
        string farmLocation;
        uint256 availableQuantity;
        ListingStatus status;
        uint256 createdAt;
        uint256 expiresAt;
    }

    struct Order {
        uint256 orderId;
        uint256 listingId;
        address buyer;
        address farmer;
        uint256 quantity;
        uint256 totalPrice;
        uint256 platformFee;
        OrderStatus status;
        bytes32 deliveryProofHash;
        uint256 createdAt;
        uint256 deliveredAt;
        DisputeStatus disputeStatus;
    }

    struct Dispute {
        uint256 orderId;
        address initiator;
        string reason;
        bytes32 evidenceHash;
        uint256 createdAt;
        DisputeStatus status;
        address arbitrator;
        string resolution;
    }

    struct FarmerStats {
        uint256 totalListings;
        uint256 totalSales;
        uint256 totalRevenue;
        uint256 successfulDeliveries;
        uint256 disputes;
        uint256 rating;
        bool isActive;
    }

    // ========== STATE VARIABLES ==========
    Token public pulseToken;

    uint256 public listingCounter;
    uint256 public orderCounter;
    uint256 public platformFeePercent; // e.g., 250 = 2%
    address public feeCollector;

    // External contract references
    address public verificationContract;
    address public iotRegistryContract;
    address public rewardTokenContract;
    address public supplyChainContract;

    // Mappings
    mapping(uint256 => ProductListing) public listings;
    mapping(uint256 => Order) public orders;
    mapping(uint256 => Dispute) public disputes;
    mapping(address => FarmerStats) public farmerStats;
    mapping(address => uint256[]) public farmerListings;
    mapping(address => uint256[]) public buyerOrders;
    mapping(uint256 => uint256[]) public listingOrders;

    // Escrow balances
    mapping(uint256 => uint256) public orderEscrow;

    // ========== EVENTS ==========

    event ListingCreated(
        uint256 indexed listingId,
        address indexed farmer,
        ProductType productType,
        uint256 quantity,
        uint256 indexed pricePerUnit
    );

    event ListingUpdated(
        uint256 indexed listingId,
        uint256 newPrice,
        uint256 newQuantity
    );

    event ListingStatusChanged(
        uint256 indexed listingId,
        ListingStatus newStatus
    );

    event OrderPlaced(
        uint256 indexed orderId,
        uint256 indexed listingId,
        address indexed buyer,
        uint256 quantity,
        uint256 totalPrice
    );

    event OrderStatusChanged(uint256 indexed orderId, OrderStatus newStatus);

    event PaymentEscrowed(uint256 indexed orderId, uint256 amount);

    event PaymentReleased(
        uint256 indexed orderId,
        address indexed farmer,
        uint256 indexed amount,
        uint256 platformFee
    );

    event DisputeRaised(
        uint256 indexed orderId,
        address indexed initiator,
        string reason
    );

    event DisputeResolved(
        uint256 indexed orderId,
        DisputeStatus resolution,
        address arbitrator
    );

    event FarmerVerified(address indexed farmer, uint256 timestamp);

    // ========== CONSTRUCTOR & INITIALIZER ==========

    ///@custom:oz-upgrades-unsafe-allow constructor
    constructor(
        address _feeCollector,
        uint256 _platformFeePercent,
        address _pulseToken,
        address _owner
    ) {
        require(_feeCollector != address(0), "Invalid fee collector");
        require(_platformFeePercent <= 1000, "Fee too high"); // Max 10%

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, _owner);

        pulseToken = Token(_pulseToken);
        feeCollector = _feeCollector;
        platformFeePercent = _platformFeePercent;
        listingCounter = 1;
        orderCounter = 1;
    }

    // ========= EXTERNAL CONTRACT SETTERS =========

    function setVerificationContact(
        address _contract
    ) external onlyRole(ADMIN_ROLE) {
        verificationContract = _contract;
    }

    function setIoTRegistryContract(
        address _contract
    ) external onlyRole(ADMIN_ROLE) {
        iotRegistryContract = _contract;
    }

    function setRewardTokencontract(
        address _contract
    ) external onlyRole(ADMIN_ROLE) {
        rewardTokenContract = _contract;
    }

    function setSupplyChainContract(
        address _contract
    ) external onlyRole(ADMIN_ROLE) {
        supplyChainContract = _contract;
    }

    // ========== FARMER FUNCTIONS ==========

    /**
     * @notice Create a new product listing
     * @dev Requires VERIFIED_FARMER_ROLE and valid health certificate
     */

    function createListing(
        ProductType _productType,
        uint256 _quantity,
        uint256 _pricePerUnit,
        uint256 _minimumOrder,
        bytes32 _healthCertHash,
        bytes32 _iotDataHash,
        string memory _farmLocation,
        uint256 _durationDays
    ) external onlyRole(VERIFIED_FARMER_ROLE) whenNotPaused returns (uint256) {
        require(_quantity > 0, "Quantity must be positive");
        require(_pricePerUnit > 0, "Price must be positive");
        require(
            _minimumOrder > 0 && _minimumOrder <= _quantity,
            "Invalid minmum order"
        );

        uint256 listingId = listingCounter++;
        listings[listingId] = ProductListing({
            listingId: listingId,
            farmer: msg.sender,
            productType: _productType,
            quantity: _quantity,
            pricePerUnit: _pricePerUnit,
            minimumOrder: _minimumOrder,
            healthCertHash: _healthCertHash,
            iotDataHash: _iotDataHash,
            farmLocation: _farmLocation,
            availableQuantity: _quantity,
            status: ListingStatus.Active,
            createdAt: block.timestamp,
            expiresAt: block.timestamp + (_durationDays * 1 days)
        });

        farmerListings[msg.sender].push(listingId);
        farmerStats[msg.sender].totalListings++;

        emit ListingCreated(
            listingId,
            msg.sender,
            _productType,
            _quantity,
            _pricePerUnit
        );

        return listingId;
    }

    /**
     * @notice Update listing price and qunatity
     */

    function updateListing(
        uint256 _listingId,
        uint256 _newPrice,
        uint256 _newQuantity
    ) external onlyRole(VERIFIED_FARMER_ROLE) {
        ProductListing storage listing = listings[_listingId];
        require(listing.farmer == msg.sender, "Not listing owner");
        require(listing.status == ListingStatus.Active, "Listing not active");

        if (_newPrice > 0) {
            listing.pricePerUnit = _newPrice;
        }

        if (_newQuantity > 0) {
            listing.quantity = _newQuantity;
            listing.availableQuantity = _newQuantity;
        }
        emit ListingUpdated(_listingId, _newPrice, _newQuantity);
    }

    /**
     * @notice cancel a listing
     */

    function cancelListing(
        uint256 _listingId
    ) external onlyRole(VERIFIED_FARMER_ROLE) {
        ProductListing storage listing = listings[_listingId];
        require(listing.farmer == msg.sender, "Not listing owner");
        require(listing.status == ListingStatus.Active, "Listing not active");

        listing.status = ListingStatus.Cancelled;

        emit ListingStatusChanged(_listingId, ListingStatus.Cancelled);
    }

    /**
     * @notice Confirm Order and prepare for delivery
     */

    function confirmOrder(
        uint256 _orderId
    ) external onlyRole(VERIFIED_FARMER_ROLE) {
        Order storage order = orders[_orderId];
        require(order.farmer == msg.sender, "Not order farmer");
        require(order.status == OrderStatus.Pending, "Order not pending");

        order.status = OrderStatus.Confirmed;

        emit OrderStatusChanged(_orderId, OrderStatus.Confirmed);

        // Notify supply chain contract to start tracking
        ISupplyChain(supplyChainContract).initiateTracking(_orderId, order.farmer, order.buyer);
    }

    /**
     * @notice Mark order as in transit
     */

    function markInTransit(
        uint256 _orderId
    ) external onlyRole(VERIFIED_FARMER_ROLE) {
        Order storage order = orders[_orderId];
        require(order.farmer == msg.sender, "Not order farmer");
        require(order.status == OrderStatus.Confirmed, "Order not confirmed");

        order.status = OrderStatus.InTransit;

        emit OrderStatusChanged(_orderId, OrderStatus.InTransit);
    }

    // ========== BUYER FUNCTIONS ==========

    /**
     * @notice Place an order and escrow payment
     */

    function placeOrder(
        uint256 _listingId,
        uint256 _quantity
    ) external payable nonReentrant whenNotPaused returns (uint256) {
        ProductListing storage listing = listings[_listingId];

        require(listing.status == ListingStatus.Active, "Listing not active");
        require(block.timestamp < listing.expiresAt, "Listing expired");
        require(_quantity >= listing.minimumOrder, "Below minimum order");
        require(
            _quantity <= listing.availableQuantity,
            "Insufficient quantity"
        );

        uint totalPrice = _quantity * listing.pricePerUnit;
        uint platformFee = (totalPrice * platformFeePercent) / 10000;
        uint totalRequired = totalPrice + platformFee;

        require(
            pulseToken.balanceOf(msg.sender) >= totalRequired,
            "Insufficient payment"
        );

        uint256 orderId = orderCounter++;

        orders[orderId] = Order({
            orderId: orderId,
            listingId: _listingId,
            buyer: msg.sender,
            farmer: listing.farmer,
            quantity: _quantity,
            totalPrice: totalPrice,
            platformFee: platformFee,
            status: OrderStatus.Pending,
            deliveryProofHash: bytes32(0),
            createdAt: block.timestamp,
            deliveredAt: 0,
            disputeStatus: DisputeStatus.None
        });

        // Update available quantity
        listing.availableQuantity -= _quantity;
        if (listing.availableQuantity == 0) {
            listing.status = ListingStatus.Sold;
        }

        // Store in escrow
        orderEscrow[orderId] = totalRequired;

        // Update mappings
        buyerOrders[msg.sender].push(orderId);
        listingOrders[_listingId].push(orderId);

        emit OrderPlaced(
            orderId,
            _listingId,
            msg.sender,
            _quantity,
            totalPrice
        );
        emit PaymentEscrowed(orderId, totalRequired);

        pulseToken.transferFrom(msg.sender, address(this), totalRequired);
        // Refund excess payment
        // if (msg.value > totalRequired) {
        //     (bool success, ) = msg.sender.call{
        //         value: msg.value - totalRequired
        //     }("");
        //     require(success, "Refund failed");
        // }

        return orderId;
    }

    /**
     * @notice Confirm delivery and release payment
     */

    function confirmDelivery(
        uint256 _orderId,
        bytes32 _deliveryProofHash
    ) external nonReentrant {
        Order storage order = orders[_orderId];
        require(order.buyer == msg.sender, "Not order buyer");
        require(order.status == OrderStatus.InTransit, "Order not in transit");

        order.status = OrderStatus.Delivered;
        order.deliveredAt = block.timestamp;
        order.deliveryProofHash = _deliveryProofHash;

        emit OrderStatusChanged(_orderId, OrderStatus.Delivered);

        // Release payment
        _releasePayment(_orderId);
    }

    /**
     * @notice Raise a dispute for an order
     */

    function raiseDispute(
        uint256 _orderId,
        string memory _reason,
        bytes32 _evidenceHash
    ) external {
        Order storage order = orders[_orderId];
        require(
            order.buyer == msg.sender || order.farmer == msg.sender,
            "Not order participant"
        );

        require(
            order.status != OrderStatus.Completed &&
                order.status != OrderStatus.Cancelled &&
                order.status != OrderStatus.Refunded,
            "Order finalized"
        );
        require(
            order.disputeStatus == DisputeStatus.None,
            "Dispute already raised"
        );

        order.status = OrderStatus.Disputed;
        order.disputeStatus = DisputeStatus.Raised;

        disputes[_orderId] = Dispute({
            orderId: _orderId,
            initiator: msg.sender,
            reason: _reason,
            evidenceHash: _evidenceHash,
            createdAt: block.timestamp,
            status: DisputeStatus.Raised,
            arbitrator: address(0),
            resolution: ""
        });

        emit DisputeRaised(_orderId, msg.sender, _reason);
    }

    // ============ INTERNAL FUNCTIONS ===========
    /**
     * @notice Release escrowed payment to farmer
     */
    function _releasePayment(uint256 _orderId) internal {
        Order storage order = orders[_orderId];
        uint256 escrowAmount = orderEscrow[_orderId];

        require(escrowAmount > 0, "No escrow balance");

        orderEscrow[_orderId] = 0;
        order.status = OrderStatus.Completed;

        // Transfer to farmer
        uint256 farmerAmount = order.totalPrice;
        // pulseToken.transfer(order.farmer, farmerAmount);
        pulseToken.transfer(order.farmer, farmerAmount);

        // Update Stats
        farmerStats[order.farmer].totalSales++;
        farmerStats[order.farmer].totalRevenue += farmerAmount;
        farmerStats[order.farmer].successfulDeliveries++;

        emit PaymentReleased(
            _orderId,
            order.farmer,
            farmerAmount,
            order.platformFee
        );
        emit OrderStatusChanged(_orderId, OrderStatus.Completed);

        // Trigger reward distribution
        // IRewardDistributor(rewardTokencontract).distributeReward(order.farmer, farmerAmount);
    }

    // ============== VIEW FUNCTIONS ============

    function getListing(
        uint256 _listingId
    ) external view returns (ProductListing memory) {
        return listings[_listingId];
    }

    function getOrder(uint256 _orderId) external view returns (Order memory) {
        return orders[_orderId];
    }

    function getFarmerListings(
        address _farmer
    ) external view returns (uint256[] memory) {
        return farmerListings[_farmer];
    }

    function getBuyerOrders(
        address _buyer
    ) external view returns (uint256[] memory) {
        return buyerOrders[_buyer];
    }

    function getFarmerStats(
        address _farmer
    ) external view returns (FarmerStats memory) {
        return farmerStats[_farmer];
    }

    // ============= ADMIN FUNCTIONS ==========

    function changeStatus(
        uint256 _listingId,
        ListingStatus _status
    ) external onlyRole(ADMIN_ROLE) {
        ProductListing storage listing = listings[_listingId];
        listing.status = _status;
    }

    function updatePlatformFee(
        uint256 _newFeePercent
    ) external onlyRole(ADMIN_ROLE) {
        require(_newFeePercent <= 1000, "Fee to high");
        platformFeePercent = _newFeePercent;
    }

    function updateFeeCollector(
        address _newCollector
    ) external onlyRole(ADMIN_ROLE) {
        require(_newCollector != address(0), "Invalid address");
        feeCollector = _newCollector;
    }

    function verifyFarmer(address _farmer) external onlyRole(ADMIN_ROLE) {
        grantRole(VERIFIED_FARMER_ROLE, _farmer);
        farmerStats[_farmer].isActive = true;
        emit FarmerVerified(_farmer, block.timestamp);
    }

    function suspendListing(uint256 _listingId) external onlyRole(ADMIN_ROLE) {
        listings[_listingId].status = ListingStatus.Suspended;
        emit ListingStatusChanged(_listingId, ListingStatus.Suspended);
    }

    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }
}
