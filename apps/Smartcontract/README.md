

## **Smart Contract Design Overview**

### **1. Core Contract Architecture**

#### **A. PoultryMarketplace.sol** (Main Hub)
- **Purpose**: Central marketplace for listing and trading poultry products
- **Key Components**:
  - Product listing struct (farmerId, productType, quantity, price, healthCertHash, listingDate)
  - Escrow mechanism for buyer payments
  - Order management (pending, confirmed, delivered, disputed)
  - Commission fee collection (2% platform fee)
  - Integration points to other contracts

#### **B. SupplyChainTracker.sol**
- **Purpose**: Track poultry movement from farm to consumer
- **Key Components**:
  - Journey stages enum (Farm → Collection → Processing → Distribution → Retail → Consumer)
  - Batch/lot identification system
  - Timestamp and location recording for each stage
  - Actor verification at each checkpoint (farmer, transporter, distributor, retailer)
  - Immutable audit trail
  - QR code data retrieval function

#### **C. PoultryPulseToken.sol** (ERC-20)
- **Purpose**: Reward and governance token
- **Key Components**:
  - Standard ERC-20 functions (transfer, approve, etc.)
  - Minting functions (restricted to authorized contracts)
  - Reward distribution logic
  - Staking mechanism for governance participation
  - Token burn function for deflationary tokenomics

#### **D. IoTDataRegistry.sol**
- **Purpose**: Link IoT sensor data to blockchain
- **Key Components**:
  - Farm-to-sensor mapping
  - IPFS hash storage with timestamps
  - Data point struct (temperature, humidity, feedLevel, timestamp, sensorId)
  - Health score calculation based on data ranges
  - Alert threshold triggers
  - Historical data query functions

#### **E. VerificationAuthority.sol**
- **Purpose**: Vet officer certification and health verification
- **Key Components**:
  - Role-based access control (admin, vet officers, inspectors)
  - Verification request queue
  - Digital signature/attestation for health certificates
  - Certificate struct (farmId, inspectorId, healthStatus, expiryDate, ipfsReportHash)
  - Certificate validity checking
  - Revocation mechanism for failed re-inspections

---

### **2. Supporting/Utility Contracts**

#### **F. FarmerRegistry.sol**
- **Purpose**: Onboard and manage farmer profiles
- **Components**:
  - KYC data hash storage
  - Farm location coordinates
  - Flock size and type
  - Performance metrics (health scores, successful deliveries)
  - Credit score calculation based on on-chain activity
  - Reputation system

#### **G. EscrowManager.sol**
- **Purpose**: Handle secure payment flows
- **Components**:
  - Multi-signature release mechanism
  - Dispute resolution with arbitrator role
  - Refund logic for failed deliveries
  - Time-locked automatic release
  - Partial payment support for large orders

#### **H. RewardDistributor.sol**
- **Purpose**: Automate token reward distribution
- **Components**:
  - Reward calculation formulas
  - Triggers: health data uploads, verified sales, quality milestones
  - Vesting schedules for large rewards
  - Daily/weekly reward pools
  - Bonus multipliers for consistent performers

---

### **3. Contract Interaction Flow**

```
┌─────────────────────────────────────────────────────────┐
│                  POULTRY PULSE ECOSYSTEM                │
└─────────────────────────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
   [IoTDataRegistry]  [FarmerRegistry]  [VerificationAuthority]
        │                  │                  │
        └──────────┬───────┴───────┬──────────┘
                   │               │
            [PoultryMarketplace] ←─┤
                   │               │
        ┌──────────┼───────────────┼──────────┐
        │          │               │          │
   [EscrowManager] │         [RewardDistributor]
        │          │               │          │
        └──────────┼───────────────┘          │
                   │                          │
          [SupplyChainTracker]    [PoultryPulseToken]
```

---

### **4. Key Design Patterns**

#### **Access Control**
- OpenZeppelin's AccessControl for role management
- Multi-tier permissions (Owner → Admin → Operator → User)
- Vet officers as special authorized role

#### **Upgradeability**
- Transparent proxy pattern for main contracts
- Allow bug fixes and feature additions without migration
- Preserve state across upgrades

#### **Security**
- ReentrancyGuard on all payment functions
- Pausable functionality for emergency stops
- Rate limiting on sensitive operations
- Oracle integration for price feeds (Chainlink)

#### **Gas Optimization**
- Batch operations for multiple data uploads
- IPFS for heavy data storage (only hashes on-chain)
- Efficient struct packing
- Event emission instead of storage where possible

---

### **5. Data Structures**

#### **Key Structs**

**Product Listing**:
```
- listingId
- farmerId (address)
- productType (enum: Broiler, Layer, Turkey, etc.)
- quantity (uint)
- pricePerUnit (uint)
- healthCertificateHash (bytes32)
- iotDataHash (bytes32)
- status (enum: Active, Sold, Expired)
- createdAt (timestamp)
```

**Supply Chain Entry**:
```
- batchId
- stage (enum)
- actor (address)
- location (lat/long stored as IPFS hash)
- timestamp
- conditions (temp/humidity snapshot)
- signature (bytes)
```

**Health Certificate**:
```
- certificateId
- farmId
- vetOfficerId
- healthScore (0-100)
- issueDate
- expiryDate
- ipfsReportHash
- isRevoked (bool)
```

---

### **6. Events for Off-Chain Indexing**

- `ProductListed(listingId, farmerId, productType, quantity, price)`
- `PurchaseInitiated(orderId, buyerId, listingId, amount)`
- `PaymentEscrowed(orderId, amount)`
- `DeliveryConfirmed(orderId, deliveryProof)`
- `SupplyChainUpdated(batchId, stage, actor, timestamp)`
- `IoTDataRecorded(farmId, dataHash, healthScore, timestamp)`
- `HealthCertificateIssued(certificateId, farmId, vetId, score)`
- `RewardDistributed(farmerId, amount, reason)`
- `DisputeRaised(orderId, initiator, reason)`

---

### **7. External Integrations**

- **Chainlink Oracles**: For NGN/USD price feeds, weather data
- **IPFS/Filecoin**: For storing sensor data, images, reports
- **The Graph**: For indexing blockchain data and fast queries
- **Polygon/Optimism**: L2 deployment for lower gas costs
- **Biconomy**: Gasless transactions for farmers (meta-transactions)

---

### **8. Security Considerations**

- **Front-running Protection**: Commit-reveal scheme for sensitive bids
- **Oracle Manipulation**: Multiple oracle sources with median calculation
- **Sybil Attacks**: KYC verification before farmer registration
- **Flash Loan Attacks**: Time delays on critical operations
- **Smart Contract Audits**: Third-party security review before mainnet

---

### **9. Governance & Admin Functions**

- Pause/unpause contracts in emergencies
- Update commission fees (with timelock)
- Add/remove vet officers
- Adjust reward parameters
- Blacklist malicious actors
- Upgrade contract implementations

---

This modular architecture ensures scalability, security, and maintainability while keeping the system flexible for future enhancements!

## Foundry

**Foundry is a blazing fast, portable and modular toolkit for Ethereum application development written in Rust.**

Foundry consists of:

-   **Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).
-   **Cast**: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.
-   **Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.
-   **Chisel**: Fast, utilitarian, and verbose solidity REPL.

## Documentation

https://book.getfoundry.sh/

## Usage

### Build

```shell
$ forge build
```

### Test

```shell
$ forge test
```

### Format

```shell
$ forge fmt
```

### Gas Snapshots

```shell
$ forge snapshot
```

### Anvil

```shell
$ anvil
```

### Deploy

```shell
$ forge script script/Counter.s.sol:CounterScript --rpc-url <your_rpc_url> --private-key <your_private_key>
```

### Cast

```shell
$ cast <subcommand>
```

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```
