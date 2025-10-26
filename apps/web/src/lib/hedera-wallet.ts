import {
  Client,
  PrivateKey,
  AccountCreateTransaction,
  Hbar,
  ContractExecuteTransaction,
  ContractFunctionParameters,
  AccountBalanceQuery,
} from "@hashgraph/sdk";

// Treasury account for funding new accounts (you need to set these up)
const TREASURY_ID = process.env.NEXT_PUBLIC_HEDERA_TREASURY_ID!;
const TREASURY_KEY = process.env.NEXT_PUBLIC_HEDERA_TREASURY_KEY!;

export interface HederaWallet {
  accountId: string;
  publicKey: string;
  privateKey: string; // Store this encrypted in production!
  evmAddress: string;
}

export class HederaWalletService {
  private client: Client;

  constructor(network: "testnet" | "mainnet" = "testnet") {
    this.client =
      network === "testnet" ? Client.forTestnet() : Client.forMainnet();

    // Set treasury as operator for funding new accounts
    if (TREASURY_ID && TREASURY_KEY) {
      this.client.setOperator(TREASURY_ID, TREASURY_KEY);
    }
  }

  /**
   * Create a new Hedera account
   */
  async createAccount(initialBalance: number = 1): Promise<HederaWallet> {
    try {
      // Generate new key pair
      const privateKey = PrivateKey.generateECDSA();
      const publicKey = privateKey.publicKey;

      // Create new account
      const transaction = new AccountCreateTransaction()
        .setKey(publicKey)
        .setInitialBalance(new Hbar(initialBalance)); // Fund with HBAR from treasury

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

  /**
   * Execute a smart contract function
   */
  async executeContract(
    accountId: string,
    privateKey: string,
    contractId: string,
    functionName: string,
    params: ContractFunctionParameters,
    gas: number = 100000
  ) {
    try {
      const accountPrivateKey = PrivateKey.fromString(privateKey);

      // Create client for this specific account
      const accountClient =
        this.client.network.name === "testnet"
          ? Client.forTestnet()
          : Client.forMainnet();
      accountClient.setOperator(accountId, accountPrivateKey);

      const transaction = new ContractExecuteTransaction()
        .setContractId(contractId)
        .setGas(gas)
        .setFunction(functionName, params);

      const response = await transaction.execute(accountClient);
      const receipt = await response.getReceipt(accountClient);

      return receipt;
    } catch (error) {
      console.error("Error executing contract:", error);
      throw error;
    }
  }

  /**
   * Get account balance
   */
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
}
