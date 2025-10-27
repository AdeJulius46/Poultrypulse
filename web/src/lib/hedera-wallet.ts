import {
  Client,
  PrivateKey,
  AccountCreateTransaction,
  Hbar,
  ContractExecuteTransaction,
  ContractFunctionParameters,
  AccountBalanceQuery,
} from "@hashgraph/sdk";

// Treasury account for funding new accounts
export const TREASURY_ID = process.env.NEXT_PUBLIC_HEDERA_TREASURY_ID!;
export const TREASURY_KEY = process.env.NEXT_PUBLIC_HEDERA_TREASURY_KEY!;

export interface HederaWallet {
  accountId: string;
  publicKey: string;
  privateKey: string;
  evmAddress: string;
}

export class HederaWalletService {
  private client: Client;
  private network: "testnet" | "mainnet";

  constructor(network: "testnet" | "mainnet" = "testnet") {
    this.network = network;
    this.client =
      network === "testnet" ? Client.forTestnet() : Client.forMainnet();

    if (TREASURY_ID && TREASURY_KEY) {
      this.client.setOperator(TREASURY_ID, TREASURY_KEY);
    }
  }

  async createAccount(initialBalance: number = 1): Promise<HederaWallet> {
    try {
      const privateKey = PrivateKey.generateECDSA();
      const publicKey = privateKey.publicKey;

      const transaction = new AccountCreateTransaction()
        .setKey(publicKey)
        .setInitialBalance(new Hbar(initialBalance));

      const response = await transaction.execute(this.client);
      const receipt = await response.getReceipt(this.client);

      if (!receipt.accountId) {
        throw new Error("Failed to create account");
      }

      const accountId = receipt.accountId.toString();
      const evmAddress = publicKey.toEvmAddress();

      return {
        accountId,
        publicKey: publicKey.toString(),
        privateKey: privateKey.toString(),
        evmAddress,
      };
    } catch (error) {
      console.error("Error creating Hedera account:", error);
      throw error;
    }
  }

  async executeContract(
    accountId: string,
    privateKey: string,
    contractId: string,
    functionName: string,
    params: ContractFunctionParameters,
    gas: number = 100000
    // payableAmount?: number
  ) {
    try {
      console.log("Executing contract with:", {
        accountId,
        contractId,
        functionName,
        gas,
      });

      // Parse the private key - handle multiple formats
      let accountPrivateKey: PrivateKey;

      // Check if it's a hex DER format (starts with 3030...)
      if (privateKey.startsWith("3030") || privateKey.startsWith("302e")) {
        // Convert hex string to bytes
        const bytes = new Uint8Array(
          privateKey.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
        );
        accountPrivateKey = PrivateKey.fromBytes(bytes);
      } else {
        // Try standard string formats
        try {
          accountPrivateKey = PrivateKey.fromStringDer(privateKey);
        } catch {
          try {
            accountPrivateKey = PrivateKey.fromStringECDSA(privateKey);
          } catch {
            accountPrivateKey = PrivateKey.fromString(privateKey);
          }
        }
      }

      console.log("Private key parsed successfully");

      // Create a new client instance for this account
      const accountClient =
        this.network === "testnet" ? Client.forTestnet() : Client.forMainnet();

      accountClient.setOperator(accountId, accountPrivateKey);

      // Build and execute the transaction
      const transaction = new ContractExecuteTransaction()
        .setContractId(contractId)
        .setGas(gas)
        .setFunction(functionName, params);

      // Add payable amount if provided (in HBAR)
      // if (payableAmount !== undefined) {
      //   transaction.setPayableAmount(new Hbar(payableAmount));
      // }

      console.log("Transaction created, executing...");
      const response = await transaction.execute(accountClient);

      console.log("Transaction submitted, waiting for receipt...");
      const receipt = await response.getReceipt(accountClient);

      console.log("Transaction successful:", receipt.status.toString());

      // Clean up
      accountClient.close();

      return receipt;
    } catch (error) {
      console.error("Error executing contract:", error);
      throw error;
    }
  }

  async getBalance(accountId: string): Promise<string> {
    try {
      const balance = await new AccountBalanceQuery()
        .setAccountId(accountId)
        .execute(this.client);

      return balance.hbars.toString();
    } catch (error) {
      console.error("Error getting balance:", error);
      throw error;
    }
  }

  /**
   * Call a contract function (read-only)
   */
  async callContract(
    contractId: string,
    functionName: string,
    params: ContractFunctionParameters,
    gas: number = 100000
  ) {
    try {
      const { ContractCallQuery } = await import("@hashgraph/sdk");

      const contractCall = new ContractCallQuery()
        .setContractId(contractId)
        .setGas(gas)
        .setFunction(functionName, params);

      const response = await contractCall.execute(this.client);
      return response;
    } catch (error) {
      console.error("Error calling contract:", error);
      throw error;
    }
  }

  /**
   * Get token balance for an address (ERC20 balanceOf)
   */
  async getTokenBalance(contractId: string, address: string): Promise<string> {
    try {
      const params = new ContractFunctionParameters().addAddress(address);

      const response = await this.callContract(
        contractId,
        "balanceOf",
        params,
        50000
      );

      // Parse the uint256 response
      const balance = response.getUint256(0);
      return balance.toString();
    } catch (error) {
      console.error("Error getting token balance:", error);
      throw error;
    }
  }
}
