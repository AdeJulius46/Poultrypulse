export const tokenContract = "0xd8e98db5113f0c32e208a63cb734b6b3743b9e25"
export const ppContract = "0xfd95fc7569548d4657f6dfc56ef9d4fa828802c6"
export const supplyChainTracker = "0x0ece48490aa272639c9f5da7e2957d80cebe1d8e"
export const marketplace = "0x7acfab06d03786fae78a431db890c96d472a7d13"

// ==========================================
//   DEPLOYMENT SUMMARY
//   ==========================================
//   Token:                0x24F4aDE4aB5C7E7F30283e9f9f8D7f1459dCC0CB
//   PoultryPulse:         0x316b5F19dA4446cf49e6107e42B5B4EAB62Aa20b
//   SupplyChainTracker:   0xF095901E3a52d8DD1596a826bCDC76CBFFD84CD5
//   PoultryMarketplace:   0x60de54Ecd44c8C7C24B8674D166025a4C94013D1
//   ==========================================
//   Owner/Deployer:       0xCAE2409Cb7Cca8d8cfFeD8C7e007cEbacc289d9B
//   Registration Fee:     10000000000000000000
//   Platform Fee:         20 basis points
//   ==========================================

export const token_contract_id = "0.0.7159841"
export const pp_contract = "0.0.7159842"
export const supplyChain_id = "0.0.7159843"
export const market_id = "0.0.7159844"

const marketplaceABI = [
	{
		"type": "constructor",
		"inputs": [
			{
				"name": "_feeCollector",
				"type": "address",
				"internalType": "address"
			},
			{
				"name": "_platformFeePercent",
				"type": "uint256",
				"internalType": "uint256"
			},
			{ "name": "_pulseToken", "type": "address", "internalType": "address" },
			{ "name": "_owner", "type": "address", "internalType": "address" }
		],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "ADMIN_ROLE",
		"inputs": [],
		"outputs": [{ "name": "", "type": "bytes32", "internalType": "bytes32" }],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "ARBITRATOR_ROLE",
		"inputs": [],
		"outputs": [{ "name": "", "type": "bytes32", "internalType": "bytes32" }],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "DEFAULT_ADMIN_ROLE",
		"inputs": [],
		"outputs": [{ "name": "", "type": "bytes32", "internalType": "bytes32" }],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "VERIFIED_FARMER_ROLE",
		"inputs": [],
		"outputs": [{ "name": "", "type": "bytes32", "internalType": "bytes32" }],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "VET_OFFICER_ROLE",
		"inputs": [],
		"outputs": [{ "name": "", "type": "bytes32", "internalType": "bytes32" }],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "buyerOrders",
		"inputs": [
			{ "name": "", "type": "address", "internalType": "address" },
			{ "name": "", "type": "uint256", "internalType": "uint256" }
		],
		"outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "cancelListing",
		"inputs": [
			{ "name": "_listingId", "type": "uint256", "internalType": "uint256" }
		],
		"outputs": [],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "changeStatus",
		"inputs": [
			{ "name": "_listingId", "type": "uint256", "internalType": "uint256" },
			{
				"name": "_status",
				"type": "uint8",
				"internalType": "enum PoultryMarketplace.ListingStatus"
			}
		],
		"outputs": [],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "confirmDelivery",
		"inputs": [
			{ "name": "_orderId", "type": "uint256", "internalType": "uint256" },
			{
				"name": "_deliveryProofHash",
				"type": "bytes32",
				"internalType": "bytes32"
			}
		],
		"outputs": [],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "confirmOrder",
		"inputs": [
			{ "name": "_orderId", "type": "uint256", "internalType": "uint256" }
		],
		"outputs": [],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "createListing",
		"inputs": [
			{
				"name": "_productType",
				"type": "uint8",
				"internalType": "enum PoultryMarketplace.ProductType"
			},
			{ "name": "_quantity", "type": "uint256", "internalType": "uint256" },
			{
				"name": "_pricePerUnit",
				"type": "uint256",
				"internalType": "uint256"
			},
			{
				"name": "_minimumOrder",
				"type": "uint256",
				"internalType": "uint256"
			},
			{
				"name": "_healthCertHash",
				"type": "bytes32",
				"internalType": "bytes32"
			},
			{
				"name": "_iotDataHash",
				"type": "bytes32",
				"internalType": "bytes32"
			},
			{ "name": "_farmLocation", "type": "string", "internalType": "string" },
			{
				"name": "_durationDays",
				"type": "uint256",
				"internalType": "uint256"
			}
		],
		"outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "disputes",
		"inputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
		"outputs": [
			{ "name": "orderId", "type": "uint256", "internalType": "uint256" },
			{ "name": "initiator", "type": "address", "internalType": "address" },
			{ "name": "reason", "type": "string", "internalType": "string" },
			{
				"name": "evidenceHash",
				"type": "bytes32",
				"internalType": "bytes32"
			},
			{ "name": "createdAt", "type": "uint256", "internalType": "uint256" },
			{
				"name": "status",
				"type": "uint8",
				"internalType": "enum PoultryMarketplace.DisputeStatus"
			},
			{ "name": "arbitrator", "type": "address", "internalType": "address" },
			{ "name": "resolution", "type": "string", "internalType": "string" }
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "farmerListings",
		"inputs": [
			{ "name": "", "type": "address", "internalType": "address" },
			{ "name": "", "type": "uint256", "internalType": "uint256" }
		],
		"outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "farmerStats",
		"inputs": [{ "name": "", "type": "address", "internalType": "address" }],
		"outputs": [
			{
				"name": "totalListings",
				"type": "uint256",
				"internalType": "uint256"
			},
			{ "name": "totalSales", "type": "uint256", "internalType": "uint256" },
			{
				"name": "totalRevenue",
				"type": "uint256",
				"internalType": "uint256"
			},
			{
				"name": "successfulDeliveries",
				"type": "uint256",
				"internalType": "uint256"
			},
			{ "name": "disputes", "type": "uint256", "internalType": "uint256" },
			{ "name": "rating", "type": "uint256", "internalType": "uint256" },
			{ "name": "isActive", "type": "bool", "internalType": "bool" }
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "feeCollector",
		"inputs": [],
		"outputs": [{ "name": "", "type": "address", "internalType": "address" }],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "getBuyerOrders",
		"inputs": [
			{ "name": "_buyer", "type": "address", "internalType": "address" }
		],
		"outputs": [
			{ "name": "", "type": "uint256[]", "internalType": "uint256[]" }
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "getFarmerListings",
		"inputs": [
			{ "name": "_farmer", "type": "address", "internalType": "address" }
		],
		"outputs": [
			{ "name": "", "type": "uint256[]", "internalType": "uint256[]" }
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "getFarmerStats",
		"inputs": [
			{ "name": "_farmer", "type": "address", "internalType": "address" }
		],
		"outputs": [
			{
				"name": "",
				"type": "tuple",
				"internalType": "struct PoultryMarketplace.FarmerStats",
				"components": [
					{
						"name": "totalListings",
						"type": "uint256",
						"internalType": "uint256"
					},
					{
						"name": "totalSales",
						"type": "uint256",
						"internalType": "uint256"
					},
					{
						"name": "totalRevenue",
						"type": "uint256",
						"internalType": "uint256"
					},
					{
						"name": "successfulDeliveries",
						"type": "uint256",
						"internalType": "uint256"
					},
					{
						"name": "disputes",
						"type": "uint256",
						"internalType": "uint256"
					},
					{ "name": "rating", "type": "uint256", "internalType": "uint256" },
					{ "name": "isActive", "type": "bool", "internalType": "bool" }
				]
			}
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "getListing",
		"inputs": [
			{ "name": "_listingId", "type": "uint256", "internalType": "uint256" }
		],
		"outputs": [
			{
				"name": "",
				"type": "tuple",
				"internalType": "struct PoultryMarketplace.ProductListing",
				"components": [
					{
						"name": "listingId",
						"type": "uint256",
						"internalType": "uint256"
					},
					{ "name": "farmer", "type": "address", "internalType": "address" },
					{
						"name": "productType",
						"type": "uint8",
						"internalType": "enum PoultryMarketplace.ProductType"
					},
					{
						"name": "quantity",
						"type": "uint256",
						"internalType": "uint256"
					},
					{
						"name": "pricePerUnit",
						"type": "uint256",
						"internalType": "uint256"
					},
					{
						"name": "minimumOrder",
						"type": "uint256",
						"internalType": "uint256"
					},
					{
						"name": "healthCertHash",
						"type": "bytes32",
						"internalType": "bytes32"
					},
					{
						"name": "iotDataHash",
						"type": "bytes32",
						"internalType": "bytes32"
					},
					{
						"name": "farmLocation",
						"type": "string",
						"internalType": "string"
					},
					{
						"name": "availableQuantity",
						"type": "uint256",
						"internalType": "uint256"
					},
					{
						"name": "status",
						"type": "uint8",
						"internalType": "enum PoultryMarketplace.ListingStatus"
					},
					{
						"name": "createdAt",
						"type": "uint256",
						"internalType": "uint256"
					},
					{
						"name": "expiresAt",
						"type": "uint256",
						"internalType": "uint256"
					}
				]
			}
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "getOrder",
		"inputs": [
			{ "name": "_orderId", "type": "uint256", "internalType": "uint256" }
		],
		"outputs": [
			{
				"name": "",
				"type": "tuple",
				"internalType": "struct PoultryMarketplace.Order",
				"components": [
					{ "name": "orderId", "type": "uint256", "internalType": "uint256" },
					{
						"name": "listingId",
						"type": "uint256",
						"internalType": "uint256"
					},
					{ "name": "buyer", "type": "address", "internalType": "address" },
					{ "name": "farmer", "type": "address", "internalType": "address" },
					{
						"name": "quantity",
						"type": "uint256",
						"internalType": "uint256"
					},
					{
						"name": "totalPrice",
						"type": "uint256",
						"internalType": "uint256"
					},
					{
						"name": "platformFee",
						"type": "uint256",
						"internalType": "uint256"
					},
					{
						"name": "status",
						"type": "uint8",
						"internalType": "enum PoultryMarketplace.OrderStatus"
					},
					{
						"name": "deliveryProofHash",
						"type": "bytes32",
						"internalType": "bytes32"
					},
					{
						"name": "createdAt",
						"type": "uint256",
						"internalType": "uint256"
					},
					{
						"name": "deliveredAt",
						"type": "uint256",
						"internalType": "uint256"
					},
					{
						"name": "disputeStatus",
						"type": "uint8",
						"internalType": "enum PoultryMarketplace.DisputeStatus"
					}
				]
			}
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "getRoleAdmin",
		"inputs": [
			{ "name": "role", "type": "bytes32", "internalType": "bytes32" }
		],
		"outputs": [{ "name": "", "type": "bytes32", "internalType": "bytes32" }],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "grantRole",
		"inputs": [
			{ "name": "role", "type": "bytes32", "internalType": "bytes32" },
			{ "name": "account", "type": "address", "internalType": "address" }
		],
		"outputs": [],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "hasRole",
		"inputs": [
			{ "name": "role", "type": "bytes32", "internalType": "bytes32" },
			{ "name": "account", "type": "address", "internalType": "address" }
		],
		"outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "iotRegistryContract",
		"inputs": [],
		"outputs": [{ "name": "", "type": "address", "internalType": "address" }],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "listingCounter",
		"inputs": [],
		"outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "listingOrders",
		"inputs": [
			{ "name": "", "type": "uint256", "internalType": "uint256" },
			{ "name": "", "type": "uint256", "internalType": "uint256" }
		],
		"outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "listings",
		"inputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
		"outputs": [
			{ "name": "listingId", "type": "uint256", "internalType": "uint256" },
			{ "name": "farmer", "type": "address", "internalType": "address" },
			{
				"name": "productType",
				"type": "uint8",
				"internalType": "enum PoultryMarketplace.ProductType"
			},
			{ "name": "quantity", "type": "uint256", "internalType": "uint256" },
			{
				"name": "pricePerUnit",
				"type": "uint256",
				"internalType": "uint256"
			},
			{
				"name": "minimumOrder",
				"type": "uint256",
				"internalType": "uint256"
			},
			{
				"name": "healthCertHash",
				"type": "bytes32",
				"internalType": "bytes32"
			},
			{ "name": "iotDataHash", "type": "bytes32", "internalType": "bytes32" },
			{ "name": "farmLocation", "type": "string", "internalType": "string" },
			{
				"name": "availableQuantity",
				"type": "uint256",
				"internalType": "uint256"
			},
			{
				"name": "status",
				"type": "uint8",
				"internalType": "enum PoultryMarketplace.ListingStatus"
			},
			{ "name": "createdAt", "type": "uint256", "internalType": "uint256" },
			{ "name": "expiresAt", "type": "uint256", "internalType": "uint256" }
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "markInTransit",
		"inputs": [
			{ "name": "_orderId", "type": "uint256", "internalType": "uint256" }
		],
		"outputs": [],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "orderCounter",
		"inputs": [],
		"outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "orderEscrow",
		"inputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
		"outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "orders",
		"inputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
		"outputs": [
			{ "name": "orderId", "type": "uint256", "internalType": "uint256" },
			{ "name": "listingId", "type": "uint256", "internalType": "uint256" },
			{ "name": "buyer", "type": "address", "internalType": "address" },
			{ "name": "farmer", "type": "address", "internalType": "address" },
			{ "name": "quantity", "type": "uint256", "internalType": "uint256" },
			{ "name": "totalPrice", "type": "uint256", "internalType": "uint256" },
			{ "name": "platformFee", "type": "uint256", "internalType": "uint256" },
			{
				"name": "status",
				"type": "uint8",
				"internalType": "enum PoultryMarketplace.OrderStatus"
			},
			{
				"name": "deliveryProofHash",
				"type": "bytes32",
				"internalType": "bytes32"
			},
			{ "name": "createdAt", "type": "uint256", "internalType": "uint256" },
			{ "name": "deliveredAt", "type": "uint256", "internalType": "uint256" },
			{
				"name": "disputeStatus",
				"type": "uint8",
				"internalType": "enum PoultryMarketplace.DisputeStatus"
			}
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "pause",
		"inputs": [],
		"outputs": [],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "paused",
		"inputs": [],
		"outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "placeOrder",
		"inputs": [
			{ "name": "_listingId", "type": "uint256", "internalType": "uint256" },
			{ "name": "_quantity", "type": "uint256", "internalType": "uint256" }
		],
		"outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
		"stateMutability": "payable"
	},
	{
		"type": "function",
		"name": "platformFeePercent",
		"inputs": [],
		"outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "pulseToken",
		"inputs": [],
		"outputs": [
			{ "name": "", "type": "address", "internalType": "contract Token" }
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "raiseDispute",
		"inputs": [
			{ "name": "_orderId", "type": "uint256", "internalType": "uint256" },
			{ "name": "_reason", "type": "string", "internalType": "string" },
			{
				"name": "_evidenceHash",
				"type": "bytes32",
				"internalType": "bytes32"
			}
		],
		"outputs": [],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "renounceRole",
		"inputs": [
			{ "name": "role", "type": "bytes32", "internalType": "bytes32" },
			{
				"name": "callerConfirmation",
				"type": "address",
				"internalType": "address"
			}
		],
		"outputs": [],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "revokeRole",
		"inputs": [
			{ "name": "role", "type": "bytes32", "internalType": "bytes32" },
			{ "name": "account", "type": "address", "internalType": "address" }
		],
		"outputs": [],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "rewardTokenContract",
		"inputs": [],
		"outputs": [{ "name": "", "type": "address", "internalType": "address" }],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "setIoTRegistryContract",
		"inputs": [
			{ "name": "_contract", "type": "address", "internalType": "address" }
		],
		"outputs": [],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "setRewardTokencontract",
		"inputs": [
			{ "name": "_contract", "type": "address", "internalType": "address" }
		],
		"outputs": [],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "setSupplyChainContract",
		"inputs": [
			{ "name": "_contract", "type": "address", "internalType": "address" }
		],
		"outputs": [],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "setVerificationContact",
		"inputs": [
			{ "name": "_contract", "type": "address", "internalType": "address" }
		],
		"outputs": [],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "supplyChainContract",
		"inputs": [],
		"outputs": [{ "name": "", "type": "address", "internalType": "address" }],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "supportsInterface",
		"inputs": [
			{ "name": "interfaceId", "type": "bytes4", "internalType": "bytes4" }
		],
		"outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "suspendListing",
		"inputs": [
			{ "name": "_listingId", "type": "uint256", "internalType": "uint256" }
		],
		"outputs": [],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "unpause",
		"inputs": [],
		"outputs": [],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "updateFeeCollector",
		"inputs": [
			{
				"name": "_newCollector",
				"type": "address",
				"internalType": "address"
			}
		],
		"outputs": [],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "updateListing",
		"inputs": [
			{ "name": "_listingId", "type": "uint256", "internalType": "uint256" },
			{ "name": "_newPrice", "type": "uint256", "internalType": "uint256" },
			{ "name": "_newQuantity", "type": "uint256", "internalType": "uint256" }
		],
		"outputs": [],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "updatePlatformFee",
		"inputs": [
			{
				"name": "_newFeePercent",
				"type": "uint256",
				"internalType": "uint256"
			}
		],
		"outputs": [],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "verificationContract",
		"inputs": [],
		"outputs": [{ "name": "", "type": "address", "internalType": "address" }],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "verifyFarmer",
		"inputs": [
			{ "name": "_farmer", "type": "address", "internalType": "address" }
		],
		"outputs": [],
		"stateMutability": "nonpayable"
	},
	{
		"type": "event",
		"name": "DisputeRaised",
		"inputs": [
			{
				"name": "orderId",
				"type": "uint256",
				"indexed": true,
				"internalType": "uint256"
			},
			{
				"name": "initiator",
				"type": "address",
				"indexed": true,
				"internalType": "address"
			},
			{
				"name": "reason",
				"type": "string",
				"indexed": false,
				"internalType": "string"
			}
		],
		"anonymous": false
	},
	{
		"type": "event",
		"name": "DisputeResolved",
		"inputs": [
			{
				"name": "orderId",
				"type": "uint256",
				"indexed": true,
				"internalType": "uint256"
			},
			{
				"name": "resolution",
				"type": "uint8",
				"indexed": false,
				"internalType": "enum PoultryMarketplace.DisputeStatus"
			},
			{
				"name": "arbitrator",
				"type": "address",
				"indexed": false,
				"internalType": "address"
			}
		],
		"anonymous": false
	},
	{
		"type": "event",
		"name": "FarmerVerified",
		"inputs": [
			{
				"name": "farmer",
				"type": "address",
				"indexed": true,
				"internalType": "address"
			},
			{
				"name": "timestamp",
				"type": "uint256",
				"indexed": false,
				"internalType": "uint256"
			}
		],
		"anonymous": false
	},
	{
		"type": "event",
		"name": "ListingCreated",
		"inputs": [
			{
				"name": "listingId",
				"type": "uint256",
				"indexed": true,
				"internalType": "uint256"
			},
			{
				"name": "farmer",
				"type": "address",
				"indexed": true,
				"internalType": "address"
			},
			{
				"name": "productType",
				"type": "uint8",
				"indexed": false,
				"internalType": "enum PoultryMarketplace.ProductType"
			},
			{
				"name": "quantity",
				"type": "uint256",
				"indexed": false,
				"internalType": "uint256"
			},
			{
				"name": "pricePerUnit",
				"type": "uint256",
				"indexed": true,
				"internalType": "uint256"
			}
		],
		"anonymous": false
	},
	{
		"type": "event",
		"name": "ListingStatusChanged",
		"inputs": [
			{
				"name": "listingId",
				"type": "uint256",
				"indexed": true,
				"internalType": "uint256"
			},
			{
				"name": "newStatus",
				"type": "uint8",
				"indexed": false,
				"internalType": "enum PoultryMarketplace.ListingStatus"
			}
		],
		"anonymous": false
	},
	{
		"type": "event",
		"name": "ListingUpdated",
		"inputs": [
			{
				"name": "listingId",
				"type": "uint256",
				"indexed": true,
				"internalType": "uint256"
			},
			{
				"name": "newPrice",
				"type": "uint256",
				"indexed": false,
				"internalType": "uint256"
			},
			{
				"name": "newQuantity",
				"type": "uint256",
				"indexed": false,
				"internalType": "uint256"
			}
		],
		"anonymous": false
	},
	{
		"type": "event",
		"name": "OrderPlaced",
		"inputs": [
			{
				"name": "orderId",
				"type": "uint256",
				"indexed": true,
				"internalType": "uint256"
			},
			{
				"name": "listingId",
				"type": "uint256",
				"indexed": true,
				"internalType": "uint256"
			},
			{
				"name": "buyer",
				"type": "address",
				"indexed": true,
				"internalType": "address"
			},
			{
				"name": "quantity",
				"type": "uint256",
				"indexed": false,
				"internalType": "uint256"
			},
			{
				"name": "totalPrice",
				"type": "uint256",
				"indexed": false,
				"internalType": "uint256"
			}
		],
		"anonymous": false
	},
	{
		"type": "event",
		"name": "OrderStatusChanged",
		"inputs": [
			{
				"name": "orderId",
				"type": "uint256",
				"indexed": true,
				"internalType": "uint256"
			},
			{
				"name": "newStatus",
				"type": "uint8",
				"indexed": false,
				"internalType": "enum PoultryMarketplace.OrderStatus"
			}
		],
		"anonymous": false
	},
	{
		"type": "event",
		"name": "Paused",
		"inputs": [
			{
				"name": "account",
				"type": "address",
				"indexed": false,
				"internalType": "address"
			}
		],
		"anonymous": false
	},
	{
		"type": "event",
		"name": "PaymentEscrowed",
		"inputs": [
			{
				"name": "orderId",
				"type": "uint256",
				"indexed": true,
				"internalType": "uint256"
			},
			{
				"name": "amount",
				"type": "uint256",
				"indexed": false,
				"internalType": "uint256"
			}
		],
		"anonymous": false
	},
	{
		"type": "event",
		"name": "PaymentReleased",
		"inputs": [
			{
				"name": "orderId",
				"type": "uint256",
				"indexed": true,
				"internalType": "uint256"
			},
			{
				"name": "farmer",
				"type": "address",
				"indexed": true,
				"internalType": "address"
			},
			{
				"name": "amount",
				"type": "uint256",
				"indexed": true,
				"internalType": "uint256"
			},
			{
				"name": "platformFee",
				"type": "uint256",
				"indexed": false,
				"internalType": "uint256"
			}
		],
		"anonymous": false
	},
	{
		"type": "event",
		"name": "RoleAdminChanged",
		"inputs": [
			{
				"name": "role",
				"type": "bytes32",
				"indexed": true,
				"internalType": "bytes32"
			},
			{
				"name": "previousAdminRole",
				"type": "bytes32",
				"indexed": true,
				"internalType": "bytes32"
			},
			{
				"name": "newAdminRole",
				"type": "bytes32",
				"indexed": true,
				"internalType": "bytes32"
			}
		],
		"anonymous": false
	},
	{
		"type": "event",
		"name": "RoleGranted",
		"inputs": [
			{
				"name": "role",
				"type": "bytes32",
				"indexed": true,
				"internalType": "bytes32"
			},
			{
				"name": "account",
				"type": "address",
				"indexed": true,
				"internalType": "address"
			},
			{
				"name": "sender",
				"type": "address",
				"indexed": true,
				"internalType": "address"
			}
		],
		"anonymous": false
	},
	{
		"type": "event",
		"name": "RoleRevoked",
		"inputs": [
			{
				"name": "role",
				"type": "bytes32",
				"indexed": true,
				"internalType": "bytes32"
			},
			{
				"name": "account",
				"type": "address",
				"indexed": true,
				"internalType": "address"
			},
			{
				"name": "sender",
				"type": "address",
				"indexed": true,
				"internalType": "address"
			}
		],
		"anonymous": false
	},
	{
		"type": "event",
		"name": "Unpaused",
		"inputs": [
			{
				"name": "account",
				"type": "address",
				"indexed": false,
				"internalType": "address"
			}
		],
		"anonymous": false
	},
	{ "type": "error", "name": "AccessControlBadConfirmation", "inputs": [] },
	{
		"type": "error",
		"name": "AccessControlUnauthorizedAccount",
		"inputs": [
			{ "name": "account", "type": "address", "internalType": "address" },
			{ "name": "neededRole", "type": "bytes32", "internalType": "bytes32" }
		]
	},
	{ "type": "error", "name": "EnforcedPause", "inputs": [] },
	{ "type": "error", "name": "ExpectedPause", "inputs": [] },
	{ "type": "error", "name": "ReentrancyGuardReentrantCall", "inputs": [] }
]

export const supplyChainAbi = [
	{
		"type": "constructor",
		"inputs": [
			{ "name": "_admin", "type": "address", "internalType": "address" }
		],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "ADMIN_ROLE",
		"inputs": [],
		"outputs": [{ "name": "", "type": "bytes32", "internalType": "bytes32" }],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "DEFAULT_ADMIN_ROLE",
		"inputs": [],
		"outputs": [{ "name": "", "type": "bytes32", "internalType": "bytes32" }],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "FARMER_ROLE",
		"inputs": [],
		"outputs": [{ "name": "", "type": "bytes32", "internalType": "bytes32" }],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "MARKETPLACE_ROLE",
		"inputs": [],
		"outputs": [{ "name": "", "type": "bytes32", "internalType": "bytes32" }],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "activeOrders",
		"inputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
		"outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "addEnvironmentalReading",
		"inputs": [
			{ "name": "_orderId", "type": "uint256", "internalType": "uint256" },
			{ "name": "_temperature", "type": "int16", "internalType": "int16" },
			{ "name": "_humidity", "type": "uint8", "internalType": "uint8" }
		],
		"outputs": [],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "addFarmer",
		"inputs": [
			{ "name": "_farmer", "type": "address", "internalType": "address" }
		],
		"outputs": [],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "environmentalData",
		"inputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
		"outputs": [
			{ "name": "lastUpdated", "type": "uint256", "internalType": "uint256" },
			{ "name": "readingCount", "type": "uint8", "internalType": "uint8" }
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "forceCompleteTracking",
		"inputs": [
			{ "name": "_orderId", "type": "uint256", "internalType": "uint256" }
		],
		"outputs": [],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "getActiveOrders",
		"inputs": [],
		"outputs": [
			{ "name": "", "type": "uint256[]", "internalType": "uint256[]" }
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "getCurrentStage",
		"inputs": [
			{ "name": "_orderId", "type": "uint256", "internalType": "uint256" }
		],
		"outputs": [
			{
				"name": "",
				"type": "uint8",
				"internalType": "enum SupplyChainTracker.Stage"
			}
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "getEntryTimestamp",
		"inputs": [
			{ "name": "_orderId", "type": "uint256", "internalType": "uint256" }
		],
		"outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "getEnvironmentalData",
		"inputs": [
			{ "name": "_orderId", "type": "uint256", "internalType": "uint256" }
		],
		"outputs": [
			{ "name": "temperature", "type": "int16[]", "internalType": "int16[]" },
			{ "name": "humidity", "type": "uint8[]", "internalType": "uint8[]" },
			{ "name": "lastUpdated", "type": "uint256", "internalType": "uint256" },
			{ "name": "readingCount", "type": "uint8", "internalType": "uint8" }
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "getJourneyDuration",
		"inputs": [
			{ "name": "_orderId", "type": "uint256", "internalType": "uint256" }
		],
		"outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "getRoleAdmin",
		"inputs": [
			{ "name": "role", "type": "bytes32", "internalType": "bytes32" }
		],
		"outputs": [{ "name": "", "type": "bytes32", "internalType": "bytes32" }],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "getStageHistory",
		"inputs": [
			{ "name": "_orderId", "type": "uint256", "internalType": "uint256" }
		],
		"outputs": [
			{
				"name": "",
				"type": "tuple[]",
				"internalType": "struct SupplyChainTracker.StageUpdate[]",
				"components": [
					{
						"name": "stage",
						"type": "uint8",
						"internalType": "enum SupplyChainTracker.Stage"
					},
					{ "name": "actor", "type": "address", "internalType": "address" },
					{
						"name": "locationHash",
						"type": "bytes32",
						"internalType": "bytes32"
					},
					{
						"name": "timestamp",
						"type": "uint256",
						"internalType": "uint256"
					},
					{ "name": "notes", "type": "string", "internalType": "string" }
				]
			}
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "getStageTimestamp",
		"inputs": [
			{ "name": "_orderId", "type": "uint256", "internalType": "uint256" },
			{
				"name": "_stage",
				"type": "uint8",
				"internalType": "enum SupplyChainTracker.Stage"
			}
		],
		"outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "getTrackingInfo",
		"inputs": [
			{ "name": "_orderId", "type": "uint256", "internalType": "uint256" }
		],
		"outputs": [
			{
				"name": "entry",
				"type": "tuple",
				"internalType": "struct SupplyChainTracker.SupplyChainEntry",
				"components": [
					{ "name": "orderId", "type": "uint256", "internalType": "uint256" },
					{ "name": "farmer", "type": "address", "internalType": "address" },
					{ "name": "buyer", "type": "address", "internalType": "address" },
					{
						"name": "currentStage",
						"type": "uint8",
						"internalType": "enum SupplyChainTracker.Stage"
					},
					{
						"name": "initiatedAt",
						"type": "uint256",
						"internalType": "uint256"
					},
					{ "name": "isActive", "type": "bool", "internalType": "bool" }
				]
			},
			{
				"name": "history",
				"type": "tuple[]",
				"internalType": "struct SupplyChainTracker.StageUpdate[]",
				"components": [
					{
						"name": "stage",
						"type": "uint8",
						"internalType": "enum SupplyChainTracker.Stage"
					},
					{ "name": "actor", "type": "address", "internalType": "address" },
					{
						"name": "locationHash",
						"type": "bytes32",
						"internalType": "bytes32"
					},
					{
						"name": "timestamp",
						"type": "uint256",
						"internalType": "uint256"
					},
					{ "name": "notes", "type": "string", "internalType": "string" }
				]
			},
			{
				"name": "envData",
				"type": "tuple",
				"internalType": "struct SupplyChainTracker.EnvironmentalData",
				"components": [
					{
						"name": "latestTemperature",
						"type": "int16[]",
						"internalType": "int16[]"
					},
					{
						"name": "latestHumidity",
						"type": "uint8[]",
						"internalType": "uint8[]"
					},
					{
						"name": "lastUpdated",
						"type": "uint256",
						"internalType": "uint256"
					},
					{ "name": "readingCount", "type": "uint8", "internalType": "uint8" }
				]
			}
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "grantRole",
		"inputs": [
			{ "name": "role", "type": "bytes32", "internalType": "bytes32" },
			{ "name": "account", "type": "address", "internalType": "address" }
		],
		"outputs": [],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "hasRole",
		"inputs": [
			{ "name": "role", "type": "bytes32", "internalType": "bytes32" },
			{ "name": "account", "type": "address", "internalType": "address" }
		],
		"outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "initiateTracking",
		"inputs": [
			{ "name": "_orderId", "type": "uint256", "internalType": "uint256" },
			{ "name": "_farmer", "type": "address", "internalType": "address" },
			{ "name": "_buyer", "type": "address", "internalType": "address" }
		],
		"outputs": [],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "isOrderTracked",
		"inputs": [
			{ "name": "_orderId", "type": "uint256", "internalType": "uint256" }
		],
		"outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "isTracking",
		"inputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
		"outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "pause",
		"inputs": [],
		"outputs": [],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "paused",
		"inputs": [],
		"outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "removeFarmer",
		"inputs": [
			{ "name": "_farmer", "type": "address", "internalType": "address" }
		],
		"outputs": [],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "renounceRole",
		"inputs": [
			{ "name": "role", "type": "bytes32", "internalType": "bytes32" },
			{
				"name": "callerConfirmation",
				"type": "address",
				"internalType": "address"
			}
		],
		"outputs": [],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "revokeRole",
		"inputs": [
			{ "name": "role", "type": "bytes32", "internalType": "bytes32" },
			{ "name": "account", "type": "address", "internalType": "address" }
		],
		"outputs": [],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "setMarketplace",
		"inputs": [
			{ "name": "_marketplace", "type": "address", "internalType": "address" }
		],
		"outputs": [],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "stageHistory",
		"inputs": [
			{ "name": "", "type": "uint256", "internalType": "uint256" },
			{ "name": "", "type": "uint256", "internalType": "uint256" }
		],
		"outputs": [
			{
				"name": "stage",
				"type": "uint8",
				"internalType": "enum SupplyChainTracker.Stage"
			},
			{ "name": "actor", "type": "address", "internalType": "address" },
			{
				"name": "locationHash",
				"type": "bytes32",
				"internalType": "bytes32"
			},
			{ "name": "timestamp", "type": "uint256", "internalType": "uint256" },
			{ "name": "notes", "type": "string", "internalType": "string" }
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "stageTimestamps",
		"inputs": [
			{ "name": "", "type": "uint256", "internalType": "uint256" },
			{
				"name": "",
				"type": "uint8",
				"internalType": "enum SupplyChainTracker.Stage"
			}
		],
		"outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "supportsInterface",
		"inputs": [
			{ "name": "interfaceId", "type": "bytes4", "internalType": "bytes4" }
		],
		"outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "trackingEntries",
		"inputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
		"outputs": [
			{ "name": "orderId", "type": "uint256", "internalType": "uint256" },
			{ "name": "farmer", "type": "address", "internalType": "address" },
			{ "name": "buyer", "type": "address", "internalType": "address" },
			{
				"name": "currentStage",
				"type": "uint8",
				"internalType": "enum SupplyChainTracker.Stage"
			},
			{ "name": "initiatedAt", "type": "uint256", "internalType": "uint256" },
			{ "name": "isActive", "type": "bool", "internalType": "bool" }
		],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "unpause",
		"inputs": [],
		"outputs": [],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "updateLocation",
		"inputs": [
			{ "name": "_orderId", "type": "uint256", "internalType": "uint256" },
			{
				"name": "_locationHash",
				"type": "bytes32",
				"internalType": "bytes32"
			}
		],
		"outputs": [],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "updateStage",
		"inputs": [
			{ "name": "_orderId", "type": "uint256", "internalType": "uint256" },
			{
				"name": "_newStage",
				"type": "uint8",
				"internalType": "enum SupplyChainTracker.Stage"
			},
			{
				"name": "_locationHash",
				"type": "bytes32",
				"internalType": "bytes32"
			},
			{ "name": "_notes", "type": "string", "internalType": "string" }
		],
		"outputs": [],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "verifyDelivery",
		"inputs": [
			{ "name": "_orderId", "type": "uint256", "internalType": "uint256" },
			{
				"name": "_deliveryProofHash",
				"type": "bytes32",
				"internalType": "bytes32"
			}
		],
		"outputs": [],
		"stateMutability": "nonpayable"
	},
	{
		"type": "event",
		"name": "DeliveryVerified",
		"inputs": [
			{
				"name": "orderId",
				"type": "uint256",
				"indexed": true,
				"internalType": "uint256"
			},
			{
				"name": "buyer",
				"type": "address",
				"indexed": true,
				"internalType": "address"
			},
			{
				"name": "timestamp",
				"type": "uint256",
				"indexed": false,
				"internalType": "uint256"
			}
		],
		"anonymous": false
	},
	{
		"type": "event",
		"name": "EnvironmentalDataRecorded",
		"inputs": [
			{
				"name": "orderId",
				"type": "uint256",
				"indexed": true,
				"internalType": "uint256"
			},
			{
				"name": "temperatue",
				"type": "int16",
				"indexed": false,
				"internalType": "int16"
			},
			{
				"name": "humidity",
				"type": "uint8",
				"indexed": false,
				"internalType": "uint8"
			},
			{
				"name": "timestamp",
				"type": "uint256",
				"indexed": false,
				"internalType": "uint256"
			}
		],
		"anonymous": false
	},
	{
		"type": "event",
		"name": "LocationUpdated",
		"inputs": [
			{
				"name": "orderId",
				"type": "uint256",
				"indexed": true,
				"internalType": "uint256"
			},
			{
				"name": "locationHash",
				"type": "bytes32",
				"indexed": false,
				"internalType": "bytes32"
			},
			{
				"name": "timestamp",
				"type": "uint256",
				"indexed": false,
				"internalType": "uint256"
			}
		],
		"anonymous": false
	},
	{
		"type": "event",
		"name": "Paused",
		"inputs": [
			{
				"name": "account",
				"type": "address",
				"indexed": false,
				"internalType": "address"
			}
		],
		"anonymous": false
	},
	{
		"type": "event",
		"name": "RoleAdminChanged",
		"inputs": [
			{
				"name": "role",
				"type": "bytes32",
				"indexed": true,
				"internalType": "bytes32"
			},
			{
				"name": "previousAdminRole",
				"type": "bytes32",
				"indexed": true,
				"internalType": "bytes32"
			},
			{
				"name": "newAdminRole",
				"type": "bytes32",
				"indexed": true,
				"internalType": "bytes32"
			}
		],
		"anonymous": false
	},
	{
		"type": "event",
		"name": "RoleGranted",
		"inputs": [
			{
				"name": "role",
				"type": "bytes32",
				"indexed": true,
				"internalType": "bytes32"
			},
			{
				"name": "account",
				"type": "address",
				"indexed": true,
				"internalType": "address"
			},
			{
				"name": "sender",
				"type": "address",
				"indexed": true,
				"internalType": "address"
			}
		],
		"anonymous": false
	},
	{
		"type": "event",
		"name": "RoleRevoked",
		"inputs": [
			{
				"name": "role",
				"type": "bytes32",
				"indexed": true,
				"internalType": "bytes32"
			},
			{
				"name": "account",
				"type": "address",
				"indexed": true,
				"internalType": "address"
			},
			{
				"name": "sender",
				"type": "address",
				"indexed": true,
				"internalType": "address"
			}
		],
		"anonymous": false
	},
	{
		"type": "event",
		"name": "StageUpdated",
		"inputs": [
			{
				"name": "orderId",
				"type": "uint256",
				"indexed": true,
				"internalType": "uint256"
			},
			{
				"name": "previousStage",
				"type": "uint8",
				"indexed": true,
				"internalType": "enum SupplyChainTracker.Stage"
			},
			{
				"name": "newStage",
				"type": "uint8",
				"indexed": true,
				"internalType": "enum SupplyChainTracker.Stage"
			},
			{
				"name": "actor",
				"type": "address",
				"indexed": false,
				"internalType": "address"
			},
			{
				"name": "timestamp",
				"type": "uint256",
				"indexed": false,
				"internalType": "uint256"
			}
		],
		"anonymous": false
	},
	{
		"type": "event",
		"name": "TrackingCompleted",
		"inputs": [
			{
				"name": "orderId",
				"type": "uint256",
				"indexed": true,
				"internalType": "uint256"
			},
			{
				"name": "totalDuration",
				"type": "uint256",
				"indexed": true,
				"internalType": "uint256"
			}
		],
		"anonymous": false
	},
	{
		"type": "event",
		"name": "TrackingInitiated",
		"inputs": [
			{
				"name": "orderId",
				"type": "uint256",
				"indexed": true,
				"internalType": "uint256"
			},
			{
				"name": "farmer",
				"type": "address",
				"indexed": true,
				"internalType": "address"
			},
			{
				"name": "buyer",
				"type": "address",
				"indexed": true,
				"internalType": "address"
			},
			{
				"name": "timestamp",
				"type": "uint256",
				"indexed": false,
				"internalType": "uint256"
			}
		],
		"anonymous": false
	},
	{
		"type": "event",
		"name": "Unpaused",
		"inputs": [
			{
				"name": "account",
				"type": "address",
				"indexed": false,
				"internalType": "address"
			}
		],
		"anonymous": false
	},
	{ "type": "error", "name": "AccessControlBadConfirmation", "inputs": [] },
	{
		"type": "error",
		"name": "AccessControlUnauthorizedAccount",
		"inputs": [
			{ "name": "account", "type": "address", "internalType": "address" },
			{ "name": "neededRole", "type": "bytes32", "internalType": "bytes32" }
		]
	},
	{ "type": "error", "name": "EnforcedPause", "inputs": [] },
	{ "type": "error", "name": "ExpectedPause", "inputs": [] }
]
export const tokenAbi = [
	{ "type": "constructor", "inputs": [], "stateMutability": "nonpayable" },
	{
		"type": "function",
		"name": "allowance",
		"inputs": [
			{ "name": "owner", "type": "address", "internalType": "address" },
			{ "name": "spender", "type": "address", "internalType": "address" }
		],
		"outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "approve",
		"inputs": [
			{ "name": "spender", "type": "address", "internalType": "address" },
			{ "name": "value", "type": "uint256", "internalType": "uint256" }
		],
		"outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "balanceOf",
		"inputs": [
			{ "name": "account", "type": "address", "internalType": "address" }
		],
		"outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "balanceOfSender",
		"inputs": [],
		"outputs": [],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "decimals",
		"inputs": [],
		"outputs": [{ "name": "", "type": "uint8", "internalType": "uint8" }],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "mint",
		"inputs": [
			{ "name": "to", "type": "address", "internalType": "address" },
			{ "name": "amount", "type": "uint256", "internalType": "uint256" }
		],
		"outputs": [],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "mitToSender",
		"inputs": [
			{ "name": "amount", "type": "uint256", "internalType": "uint256" }
		],
		"outputs": [],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "name",
		"inputs": [],
		"outputs": [{ "name": "", "type": "string", "internalType": "string" }],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "symbol",
		"inputs": [],
		"outputs": [{ "name": "", "type": "string", "internalType": "string" }],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "totalSupply",
		"inputs": [],
		"outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
		"stateMutability": "view"
	},
	{
		"type": "function",
		"name": "transfer",
		"inputs": [
			{ "name": "to", "type": "address", "internalType": "address" },
			{ "name": "value", "type": "uint256", "internalType": "uint256" }
		],
		"outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
		"stateMutability": "nonpayable"
	},
	{
		"type": "function",
		"name": "transferFrom",
		"inputs": [
			{ "name": "from", "type": "address", "internalType": "address" },
			{ "name": "to", "type": "address", "internalType": "address" },
			{ "name": "value", "type": "uint256", "internalType": "uint256" }
		],
		"outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
		"stateMutability": "nonpayable"
	},
	{
		"type": "event",
		"name": "Approval",
		"inputs": [
			{
				"name": "owner",
				"type": "address",
				"indexed": true,
				"internalType": "address"
			},
			{
				"name": "spender",
				"type": "address",
				"indexed": true,
				"internalType": "address"
			},
			{
				"name": "value",
				"type": "uint256",
				"indexed": false,
				"internalType": "uint256"
			}
		],
		"anonymous": false
	},
	{
		"type": "event",
		"name": "Transfer",
		"inputs": [
			{
				"name": "from",
				"type": "address",
				"indexed": true,
				"internalType": "address"
			},
			{
				"name": "to",
				"type": "address",
				"indexed": true,
				"internalType": "address"
			},
			{
				"name": "value",
				"type": "uint256",
				"indexed": false,
				"internalType": "uint256"
			}
		],
		"anonymous": false
	},
	{
		"type": "error",
		"name": "ERC20InsufficientAllowance",
		"inputs": [
			{ "name": "spender", "type": "address", "internalType": "address" },
			{ "name": "allowance", "type": "uint256", "internalType": "uint256" },
			{ "name": "needed", "type": "uint256", "internalType": "uint256" }
		]
	},
	{
		"type": "error",
		"name": "ERC20InsufficientBalance",
		"inputs": [
			{ "name": "sender", "type": "address", "internalType": "address" },
			{ "name": "balance", "type": "uint256", "internalType": "uint256" },
			{ "name": "needed", "type": "uint256", "internalType": "uint256" }
		]
	},
	{
		"type": "error",
		"name": "ERC20InvalidApprover",
		"inputs": [
			{ "name": "approver", "type": "address", "internalType": "address" }
		]
	},
	{
		"type": "error",
		"name": "ERC20InvalidReceiver",
		"inputs": [
			{ "name": "receiver", "type": "address", "internalType": "address" }
		]
	},
	{
		"type": "error",
		"name": "ERC20InvalidSender",
		"inputs": [
			{ "name": "sender", "type": "address", "internalType": "address" }
		]
	},
	{
		"type": "error",
		"name": "ERC20InvalidSpender",
		"inputs": [
			{ "name": "spender", "type": "address", "internalType": "address" }
		]
	}
]

export const pptcontractAbi = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "points",
				"type": "uint256"
			}
		],
		"name": "addPoints",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "pointsToConvert",
				"type": "uint256"
			}
		],
		"name": "convertPointsToTokens",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "paySubscription",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_pptoken",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_monthlyFee",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "points",
				"type": "uint256"
			}
		],
		"name": "PointsEarned",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "expiresAt",
				"type": "uint256"
			}
		],
		"name": "SubscriptionPaid",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "withdrawTokens",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "getUserInfo",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "points",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "subscriptionExpires",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "monthlyFee",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "pptoken",
		"outputs": [
			{
				"internalType": "contract Token",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "users",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "points",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "subscriptionExpires",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

