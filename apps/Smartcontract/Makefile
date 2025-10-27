-include .env

.PHONY: all test clean deploy help install snapshot format anvil deploy-all

DEFAULT_ANVIL_KEY := 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

help:
	@echo "==================================================="
	@echo "PoultryPulse Deployment Commands"
	@echo "==================================================="
	@echo ""
	@echo "Setup & Testing:"
	@echo "  make clean                  - Clean build artifacts"
	@echo "  make build                  - Compile contracts"
	@echo "  make test                   - Run tests"
	@echo "  make debug-account          - Check Hedera account"
	@echo ""
	@echo "Deployment:"
	@echo "  make deploy-all             - Deploy all contracts (Hedera)"
	@echo "  make deploy-token           - Deploy Token only"
	@echo "  make deploy-poultry TOKEN_ADDRESS=0x... - Deploy PoultryPulse"
	@echo "  make deploy-tracker         - Deploy SupplyChainTracker"
	@echo "  make deploy-marketplace TOKEN_ADDRESS=0x... - Deploy Marketplace"
	@echo ""
	@echo "Verification:"
	@echo "  make verify-token CONTRACT=0x..."
	@echo "  make verify CONTRACT=0x..."
	@echo ""
	@echo "Utilities:"
	@echo "  make get-addresses          - Show deployed addresses"
	@echo "  make view CONTRACT=0x...    - Open in HashScan"
	@echo ""
	@echo "==================================================="

all: clean install update build

# Clean the repo
clean:
	@echo "Cleaning build artifacts..."
	@forge clean
	@rm -rf cache/ out/ broadcast/

# Remove modules
remove:
	@rm -rf .gitmodules && rm -rf .git/modules/* && rm -rf lib && touch .gitmodules

install:
	@echo "Installing dependencies..."
	@forge install cyfrin/foundry-devops@0.0.11 --no-commit
	@forge install foundry-rs/forge-std@v1.5.3 --no-commit

# Update Dependencies
update:
	@forge update

build:
	@echo "Building contracts..."
	@forge build

test:
	@forge test -vvv

coverage:
	@forge coverage --report debug > coverage-report.txt

snapshot:
	@forge snapshot

format:
	@forge fmt

anvil:
	@anvil -m 'test test test test test test test test test test test junk' --steps-tracing --block-time 1

# ==================================================
# DEBUGGING
# ==================================================

debug-account:
	@echo "==================================================="
	@echo "Hedera Testnet Account Info"
	@echo "==================================================="
	@echo "RPC URL: $(HEDERA_TESTNET_RPC_URL)"
	@echo ""
	@echo "Deployer Address:"
	@cast wallet address --private-key $(HEDERA_PRIVATE_KEY)
	@echo ""
	@echo "Balance (wei):"
	@cast balance $$(cast wallet address --private-key $(HEDERA_PRIVATE_KEY)) --rpc-url $(HEDERA_TESTNET_RPC_URL)
	@echo ""
	@echo "Chain ID:"
	@cast chain-id --rpc-url $(HEDERA_TESTNET_RPC_URL)
	@echo ""
	@echo "Latest Block:"
	@cast block-number --rpc-url $(HEDERA_TESTNET_RPC_URL)
	@echo "==================================================="

# ==================================================
# FULL DEPLOYMENT
# ==================================================

deploy-all:
	@echo "==================================================="
	@echo "Deploying ALL contracts to Hedera Testnet"
	@echo "==================================================="
	@forge script script/DeployContract.s.sol:DeployContract \
		--rpc-url $(HEDERA_TESTNET_RPC_URL) \
		--private-key $(HEDERA_PRIVATE_KEY) \
		--broadcast \
		--legacy \
		--verify \
		--verifier sourcify \
		--verifier-url $(HEDERA_VERIFIER_URL) \
		-vvvv
	@echo ""
	@echo "✅ Deployment complete!"
	@echo ""
	@echo "Get addresses with: make get-addresses"
	@echo "Verify with: make verify CONTRACT=<address>"

# ==================================================
# INDIVIDUAL DEPLOYMENTS
# ==================================================

deploy-token:
	@echo "==================================================="
	@echo "Deploying Token Contract"
	@echo "==================================================="
	@forge create \
		--rpc-url $(HEDERA_TESTNET_RPC_URL) \
		--private-key $(HEDERA_PRIVATE_KEY) \
		--legacy \
		src/poultryPulseToken.sol:Token
	@echo ""
	@echo "✅ Token deployed!"
	@echo "Save the address above and use it for next steps"

deploy-poultry:
	@if [ -z "$(TOKEN_ADDRESS)" ]; then \
		echo "❌ Error: TOKEN_ADDRESS required"; \
		echo "Usage: make deploy-poultry TOKEN_ADDRESS=0x..."; \
		exit 1; \
	fi
	@echo "==================================================="
	@echo "Deploying PoultryPulse"
	@echo "Token: $(TOKEN_ADDRESS)"
	@echo "Fee: 10 tokens (10000000000000000000 wei)"
	@echo "==================================================="
	@forge create \
		--rpc-url $(HEDERA_TESTNET_RPC_URL) \
		--private-key $(HEDERA_PRIVATE_KEY) \
		--legacy \
		--constructor-args $(TOKEN_ADDRESS) 10000000000000000000 \
		src/poultryPulse.sol:PoultryPulse
	@echo "✅ PoultryPulse deployed!"

deploy-tracker:
	@echo "==================================================="
	@echo "Deploying SupplyChainTracker"
	@echo "Owner: $$(cast wallet address --private-key $(HEDERA_PRIVATE_KEY))"
	@echo "==================================================="
	@forge create \
		--rpc-url $(HEDERA_TESTNET_RPC_URL) \
		--private-key $(HEDERA_PRIVATE_KEY) \
		--legacy \
		--constructor-args $$(cast wallet address --private-key $(HEDERA_PRIVATE_KEY)) \
		src/SupplyChainTracker.sol:SupplyChainTracker
	@echo "✅ SupplyChainTracker deployed!"

deploy-marketplace:
	@if [ -z "$(TOKEN_ADDRESS)" ]; then \
		echo "❌ Error: TOKEN_ADDRESS required"; \
		echo "Usage: make deploy-marketplace TOKEN_ADDRESS=0x..."; \
		exit 1; \
	fi
	@echo "==================================================="
	@echo "Deploying PoultryMarketplace"
	@echo "Token: $(TOKEN_ADDRESS)"
	@echo "==================================================="
	@forge create \
		--rpc-url $(HEDERA_TESTNET_RPC_URL) \
		--private-key $(HEDERA_PRIVATE_KEY) \
		--legacy \
		--constructor-args \
			$$(cast wallet address --private-key $(HEDERA_PRIVATE_KEY)) \
			20 \
			$(TOKEN_ADDRESS) \
			$$(cast wallet address --private-key $(HEDERA_PRIVATE_KEY)) \
		src/PoultryMarketplace.sol:PoultryMarketplace
	@echo "✅ PoultryMarketplace deployed!"

# ==================================================
# VERIFICATION
# ==================================================

verify-token:
	@if [ -z "$(CONTRACT)" ]; then \
		echo "❌ Error: CONTRACT required"; \
		echo "Usage: make verify-token CONTRACT=0x..."; \
		exit 1; \
	fi
	@echo "Verifying Token at $(CONTRACT)..."
	@forge verify-contract $(CONTRACT) \
		src/poultryPulseToken.sol:Token \
		--chain-id 296 \
		--verifier sourcify \
		--verifier-url https://server-verify.hashscan.io \
		--watch

verify:
	@if [ -z "$(CONTRACT)" ]; then \
		echo "❌ Error: CONTRACT required"; \
		echo "Usage: make verify CONTRACT=0x..."; \
		exit 1; \
	fi
	@echo "Verifying contract at $(CONTRACT)..."
	@forge verify-contract $(CONTRACT) \
		--chain-id 296 \
		--verifier sourcify \
		--verifier-url https://server-verify.hashscan.io \
		--watch

# ==================================================
# UTILITIES
# ==================================================

get-addresses:
	@echo "==================================================="
	@echo "Recent Deployments"
	@echo "==================================================="
	@if [ -f "broadcast/DeployContract.s.sol/296/run-latest.json" ]; then \
		jq -r '.transactions[] | "Contract: \(.contractName)\nAddress: \(.contractAddress)\n"' broadcast/DeployContract.s.sol/296/run-latest.json; \
	else \
		echo "No deployments found"; \
		echo "Run 'make deploy-all' first"; \
	fi

view:
	@if [ -z "$(CONTRACT)" ]; then \
		echo "❌ Error: CONTRACT required"; \
		echo "Usage: make view CONTRACT=0x..."; \
		exit 1; \
	fi
	@echo "Opening HashScan..."
	@xdg-open "https://hashscan.io/testnet/contract/$(CONTRACT)" 2>/dev/null || \
		open "https://hashscan.io/testnet/contract/$(CONTRACT)" 2>/dev/null || \
		echo "Visit: https://hashscan.io/testnet/contract/$(CONTRACT)"

# ==================================================
# DEPLOYED ADDRESSES (Update after deployment)
# ==================================================
show-deployed:
	@echo "==================================================="
	@echo "Known Deployed Addresses"
	@echo "==================================================="
	@echo "Token:              0x4C9a5e129d607aF2905F2EB3353168D2cA4CD8A3"
	@echo "PoultryPulse:       0x27d583171526B5a34045989a7fe37bAA4aDE944e"
	@echo "SupplyChainTracker: <not deployed>"
	@echo "Marketplace:        <not deployed>"
	@echo "==================================================="