// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title SupplyChainTracker
 * @notice Tracks poultry product journey from farm to consumer
 * @dev Simplified 4-stage tracking for hackathon demo
 */

contract SupplyChainTracker is AccessControl, Pausable {
    // =========== ROLES ========
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant MARKETPLACE_ROLE = keccak256("MARKETPLACE_ROLE");
    bytes32 public constant FARMER_ROLE = keccak256("FARMER_ROLE");

    // ========== ENUMS ===========
    enum Stage {
        NotStarted,
        Farm,
        Packed,
        InTransit,
        Delivered
    }

    // =========== STUCTS =======
    struct SupplyChainEntry {
        uint256 orderId;
        address farmer;
        address buyer;
        Stage currentStage;
        uint256 initiatedAt;
        bool isActive;
    }

    struct StageUpdate {
        Stage stage;
        address actor;
        bytes32 locationHash;
        int16 temperature;
        uint8 humidity;
        uint256 timestamp;
        string notes;
    }

    struct EnvironmentalData {
        int16[] latestTemperature;
        uint8[] latestHumidity;
        uint256 lastUpdated;
        uint8 readingCount;
    }

    // =========== STATE VARIABLES ===============

    // Main tracking data
    mapping(uint256 => SupplyChainEntry) public trackingEntries;

    // Stage history for each order
    mapping(uint256 => StageUpdate[]) public stageHistory;

    // Environmental monitoring data
    mapping(uint256 => EnvironmentalData) public environmentalData;

    // Stage timestamps for quick lookup
    mapping(uint256 => mapping(Stage => uint256)) public stageTimestamps;

    // Active orders tracker
    uint256[] public activeOrders;
    mapping(uint256 => bool) public isTracking;

    // =============== EVENTs ===================
    event TrackingInitiated(
        uint256 indexed orderId,
        address indexed farner,
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

    event EnvironmentalDataRecorded(
        uint256 indexed orderId,
        int16 temperatue,
        uint8 humidity,
        uint256 timestamp
    );

    event LocationUpdated(
        uint256 indexed orderId,
        bytes32 locationHash,
        uint256 timestamp
    );

    event DeliveryVerified(
        uint256 indexed orderId,
        address indexed buyer,
        uint256 timestamp
    );

    event TrackingCompleted(uint indexed orderId, uint totalDuration);

    // ============= CONSTRUCTOR =========

    constructor(address _admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, _admin);
    }

    // ============ MODIFIERS =========
    modifier onlyActiveTracking(uint256 _orderId) {
        require(isTracking[_orderId], "Order not being tracked");
        require(trackingEntries[_orderId].isActive, "Tracking completed");
        _;
    }

    modifier onlyOrderParticipnat(uint256 _orderId) {
        SupplyChainEntry memory entry = trackingEntries[_orderId];
        require(
            msg.sender == entry.farmer ||
                msg.sender == entry.buyer ||
                hasRole(MARKETPLACE_ROLE, msg.sender),
            "Not authorized for this order"
        );
        _;
    }

    // ============== MARKETPLACE FUNCTIONS =============

    /**
     * @notice Initialize tracking for a new order
     * @dev called by marketplace contract when order is confirmed
     */
    function initiateTracking(
        uint256 _orderId,
        address _farmer,
        address _buyer
    ) external onlyRole(MARKETPLACE_ROLE) whenNotPaused {
        require(!isTracking[_orderId], "Order already tracked");
        require(
            _farmer != address(0) && _buyer != address(0),
            "Invalid addresses"
        );

        trackingEntries[_orderId] = SupplyChainEntry({
            orderId: _orderId,
            farmer: _farmer,
            buyer: _buyer,
            currentStage: Stage.Farm,
            initiatedAt: block.timestamp,
            isActive: true
        });

        // Record initial stage
        stageTimestamps[_orderId][Stage.Farm] = block.timestamp;

        // Add to active orders
        activeOrders.push(_orderId);
        isTracking[_orderId] = true;

        // Create first stage update
        stageHistory[_orderId].push(
            StageUpdate({
                stage: Stage.Farm,
                actor: _farmer,
                locationHash: bytes32(0),
                temperature: 0,
                humidity: 0,
                timestamp: block.timestamp,
                notes: "Tracking initiated"
            })
        );

        emit TrackingInitiated(_orderId, _farmer, _buyer, block.timestamp);
        emit StageUpdated(
            _orderId,
            Stage.NotStarted,
            Stage.Farm,
            _farmer,
            block.timestamp
        );
    }

    // ===== FARMER FUNCTIONS ========

    /**
     * @notice Update the current stage of delivery
     * @dev Only farmer or marketplace can update stages
     */
    function updateStage(
        uint256 _orderId,
        Stage _newStage,
        bytes32 _locationHash,
        int16 _temperature,
        uint8 _humidity,
        string memory _notes
    )
        external
        onlyActiveTracking(_orderId)
        onlyOrderParticipnat(_orderId)
        whenNotPaused
    {
        SupplyChainEntry storage entry = trackingEntries[_orderId];
        Stage previousStage = entry.currentStage;

        // Validate stage progression
        require(_newStage > previousStage, "Invalid stage progression");
        require(_newStage <= Stage.Delivered, "Invalid stage");
        require(_humidity <= 100, "Invalid humidity value");

        // Update current stage
        entry.currentStage = _newStage;
        stageTimestamps[_orderId][_newStage] = block.timestamp;

        // Record stage update
        stageHistory[_orderId].push(
            StageUpdate({
                stage: _newStage,
                actor: msg.sender,
                locationHash: _locationHash,
                temperature: _temperature,
                humidity: _humidity,
                timestamp: block.timestamp,
                notes: _notes
            })
        );

        // Update environmental data
        if (_temperature != 0 || _humidity != 0) {
            _recordEnvironmentalData(_orderId, _temperature, _humidity);
        }

        emit StageUpdated(
            _orderId,
            previousStage,
            _newStage,
            msg.sender,
            block.timestamp
        );

        if (_locationHash != bytes32(0)) {
            emit LocationUpdated(_orderId, _locationHash, block.timestamp);
        }

        // If delivered, mark as completed
        if (_newStage == Stage.Delivered) {
            _completeTracking(_orderId);
        }
    }

    // ================= INTERNAL FUNCTIONS ==================

    /**
     * @notice Record environmental data
     */

    function _recordEnvironmentalData(
        uint256 _orderId,
        int16 _temperature,
        uint8 _humidity
    ) internal {
        EnvironmentalData storage data = environmentalData[_orderId];

        // push temperature into the int16[] and humidity into the uint8[]
        data.latestTemperature.push(_temperature);
        data.latestHumidity.push(_humidity);

        // update last updated timestamp
        data.lastUpdated = block.timestamp;

        // increment reading count safely (uint8)
        if (data.readingCount < type(uint8).max) {
            data.readingCount += 1;
        }
    }

    /**
     * @notice Mark tracking as completed
     */
    function _completeTracking(uint256 _orderId) internal {
        SupplyChainEntry storage entry = trackingEntries[_orderId];
        entry.isActive = false;

        uint256 totalDuration = block.timestamp - entry.initiatedAt;

        emit TrackingCompleted(_orderId, totalDuration);
    }
}
