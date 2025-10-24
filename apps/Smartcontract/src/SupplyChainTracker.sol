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

    event TrackingCompleted(uint indexed orderId, uint indexed totalDuration);

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

    modifier onlyOrderParticipant(uint256 _orderId) {
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
        string memory _notes
    )
        external
        onlyActiveTracking(_orderId)
        onlyOrderParticipant(_orderId)
        whenNotPaused
    {
        SupplyChainEntry storage entry = trackingEntries[_orderId];
        Stage previousStage = entry.currentStage;

        // Validate stage progression
        require(_newStage > previousStage, "Invalid stage progression");
        require(_newStage <= Stage.Delivered, "Invalid stage");

        // Update current stage
        entry.currentStage = _newStage;
        stageTimestamps[_orderId][_newStage] = block.timestamp;

        // Record stage update
        stageHistory[_orderId].push(
            StageUpdate({
                stage: _newStage,
                actor: msg.sender,
                locationHash: _locationHash,
                timestamp: block.timestamp,
                notes: _notes
            })
        );

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

    /**
     * @notice Add environmental monitoring data
     * @dev Can be called multiple times during journey
     */
    function addEnvironmentalReading(
        uint256 _orderId,
        int16 _temperature,
        uint8 _humidity
    )
        external
        onlyActiveTracking(_orderId)
        onlyOrderParticipant(_orderId)
        whenNotPaused
    {
        require(_humidity <= 100, "Invalid humidity value");
        require(
            _temperature >= -40 && _temperature <= 80,
            "Temperature out of range"
        );

        _recordEnvironmentalData(_orderId, _temperature, _humidity);

        emit EnvironmentalDataRecorded(
            _orderId,
            _temperature,
            _humidity,
            block.timestamp
        );
    }

    /**
     * @notice Update location with photo/GPS data
     */
    function updateLocation(
        uint256 _orderId,
        bytes32 _locationHash
    )
        external
        onlyActiveTracking(_orderId)
        onlyOrderParticipant(_orderId)
        whenNotPaused
    {
        require(_locationHash != bytes32(0), "Invalid location hash");

        // Add location update to history
        stageHistory[_orderId].push(
            StageUpdate({
                stage: trackingEntries[_orderId].currentStage,
                actor: msg.sender,
                locationHash: _locationHash,
                timestamp: block.timestamp,
                notes: "Location update"
            })
        );

        emit LocationUpdated(_orderId, _locationHash, block.timestamp);
    }

    // ================= BUYER FUNCTIONS ===============

    /**
     * @notice Verify delivery completion
     * @dev Called by buyer or marketplace when delivery is confirmed
     */
    function verifyDelivery(
        uint256 _orderId,
        bytes32 _deliveryProofHash
    ) external onlyActiveTracking(_orderId) whenNotPaused {
        SupplyChainEntry storage entry = trackingEntries[_orderId];
        require(
            msg.sender == entry.buyer || hasRole(MARKETPLACE_ROLE, msg.sender),
            "Only buyer or marketplace can verify"
        );
        require(entry.currentStage == Stage.InTransit, "Not in transit");

        // Update to delivered stage
        entry.currentStage = Stage.Delivered;
        stageTimestamps[_orderId][Stage.Delivered] = block.timestamp;

        // Record final stage
        stageHistory[_orderId].push(
            StageUpdate({
                stage: Stage.Delivered,
                actor: msg.sender,
                locationHash: _deliveryProofHash,
                timestamp: block.timestamp,
                notes: "Delivery verified by buyer"
            })
        );

        emit DeliveryVerified(_orderId, entry.buyer, block.timestamp);
        emit StageUpdated(
            _orderId,
            Stage.InTransit,
            Stage.Delivered,
            msg.sender,
            block.timestamp
        );
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

    // ========== ADMIN FUNCTIONS ==========

    /**
     * @notice Grant marketplace role to contract
     */
    /**
     * @notice Grant marketplace role to contract
     */
    function setMarketplace(
        address _marketplace
    ) external onlyRole(ADMIN_ROLE) {
        require(_marketplace != address(0), "Invalid marketplace address");
        grantRole(MARKETPLACE_ROLE, _marketplace);
    }

    /**
     * @notice Grant farmer role for manual updates
     */
    function addFarmer(address _farmer) external onlyRole(ADMIN_ROLE) {
        require(_farmer != address(0), "Invalid farmer address");
        grantRole(FARMER_ROLE, _farmer);
    }

    /**
     * @notice Remove farmer role
     */
    function removeFarmer(address _farmer) external onlyRole(ADMIN_ROLE) {
        revokeRole(FARMER_ROLE, _farmer);
    }

    /**
     * @notice Emergency pause
     */
    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }

    /**
     * @notice Unpause contract
     */
    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }

    /**
     * @notice Manually complete tracking (emergency)
     */
    function forceCompleteTracking(
        uint256 _orderId
    ) external onlyRole(ADMIN_ROLE) {
        require(isTracking[_orderId], "Order not tracked");
        _completeTracking(_orderId);
    }

    // ============== VIEW FUNCTIONS =========
    /**
     * @notice Get current stage of an order
     */
    function getEntryTimestamp(
        uint256 _orderId
    ) external view returns (uint256) {
        SupplyChainEntry storage entry = trackingEntries[_orderId];
        return entry.initiatedAt;
    }

    /**
     * @notice Get complete tracking information for QR code display
     */
    function getTrackingInfo(
        uint256 _orderId
    )
        external
        view
        returns (
            SupplyChainEntry memory entry,
            StageUpdate[] memory history,
            EnvironmentalData memory envData
        )
    {
        return (
            trackingEntries[_orderId],
            stageHistory[_orderId],
            environmentalData[_orderId]
        );
    }

    /**
     * @notice Get simplified data for consumer QR scan
     */
    // function getQRData(
    //     uint256 _orderId
    // )
    //     external
    //     view
    //     returns (
    //         address farmer,
    //         Stage currentStage,
    //         uint256[] memory timestamps,
    //         int16 temperature,
    //         uint8 humidity,
    //         bool isCompleted
    //     )
    // {
    //     SupplyChainEntry memory entry = trackingEntries[_orderId];
    //     EnvironmentalData memory envData = environmentalData[_orderId];

    //     // Build timestamps array for all stages
    //     timestamps = new uint256[](5);
    //     timestamps[0] = stageTimestamps[_orderId][Stage.NotStarted];
    //     timestamps[1] = stageTimestamps[_orderId][Stage.Farm];
    //     timestamps[2] = stageTimestamps[_orderId][Stage.Packed];
    //     timestamps[3] = stageTimestamps[_orderId][Stage.InTransit];
    //     timestamps[4] = stageTimestamps[_orderId][Stage.Delivered];

    //     return (
    //         entry.farmer,
    //         entry.currentStage,
    //         timestamps,
    //         !entry.isActive
    //     );
    // }

    /**
     * @notice Get current stage of an order
     */
    function getCurrentStage(uint256 _orderId) external view returns (Stage) {
        return trackingEntries[_orderId].currentStage;
    }

    /**
     * @notice Get timestamp for a specific stage
     */
    function getStageTimestamp(
        uint256 _orderId,
        Stage _stage
    ) external view returns (uint256) {
        return stageTimestamps[_orderId][_stage];
    }

    /**
     * @notice Get all stage updates for an order
     */
    function getStageHistory(
        uint256 _orderId
    ) external view returns (StageUpdate[] memory) {
        return stageHistory[_orderId];
    }

    /**
     * @notice Get latest environmental data
     */
    function getEnvironmentalData(
        uint256 _orderId
    )
        external
        view
        returns (
            int16[] memory temperature,
            uint8[] memory humidity,
            uint256 lastUpdated,
            uint8 readingCount
        )
    {
        EnvironmentalData memory data = environmentalData[_orderId];
        return (
            data.latestTemperature,
            data.latestHumidity,
            data.lastUpdated,
            data.readingCount
        );
    }

    /**
     * @notice Get all active orders
     */
    function getActiveOrders() external view returns (uint256[] memory) {
        uint256 count = 0;

        // Count active orders
        for (uint256 i = 0; i < activeOrders.length; i++) {
            if (trackingEntries[activeOrders[i]].isActive) {
                count++;
            }
        }

        // Build array of active order IDs
        uint256[] memory active = new uint256[](count);
        uint256 index = 0;

        for (uint256 i = 0; i < activeOrders.length; i++) {
            if (trackingEntries[activeOrders[i]].isActive) {
                active[index] = activeOrders[i];
                index++;
            }
        }

        return active;
    }

    /**
     * @notice Check if order is being tracked
     */
    function isOrderTracked(uint256 _orderId) external view returns (bool) {
        return isTracking[_orderId];
    }

    /**
     * @notice Get journey duration
     */
    function getJourneyDuration(
        uint256 _orderId
    ) external view returns (uint256) {
        SupplyChainEntry memory entry = trackingEntries[_orderId];

        if (entry.isActive) {
            return block.timestamp - entry.initiatedAt;
        } else {
            uint256 deliveryTime = stageTimestamps[_orderId][Stage.Delivered];
            return deliveryTime - entry.initiatedAt;
        }
    }
}
