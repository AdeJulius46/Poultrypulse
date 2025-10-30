"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Plus,
  Bell,
  ArrowUpDown,
  ArrowDownUp,
  ArrowRight,
  TrendingUp,
  Wallet,
  Gift,
  Star,
  Calendar,
  Loader2,
  ChevronDown,
  Check,
  Copy,
} from "lucide-react";
import DashboardHeader from "@/components/layout/dashboardHeader";
import { useCallback, useEffect, useState } from "react";
import { HederaWalletService } from "@/lib/hedera-wallet";
import { useStore } from "@/lib/store";
import { token_contract_id } from "@/contract";
import { ContractFunctionParameters } from "@hashgraph/sdk";

export default function WalletPage() {
  const profile = useStore((state) => state.profile);
  const [balance, setBalance] = useState<any>(null);
  const [tokenBalance, setTokenBalance] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showInput, setShowInput] = useState<boolean>(false);
  const [amount, setAmount] = useState("");

  const checkBalance = useCallback(async () => {
    if (profile[0]?.hedera_account_id) {
      try {
        const walletService = new HederaWalletService("testnet");
        const _balance = await walletService.getBalance(
          profile[0]?.hedera_account_id || ""
        );
        setBalance(_balance);
      } catch (error) {
        if (error instanceof Error) {
          alert(error.message);
        }
      }
    }
  }, []);

  const mintToken = useCallback(async () => {
    try {
      if (!profile || !profile[0]) {
        alert("Profile not loaded");
        return;
      }

      setLoading(true);
      const params = profile[0];

      // Validate required fields
      if (!params.hedera_wallet) {
        alert("Hedera wallet address not found");
        return;
      }
      if (!params.hedera_account_id) {
        alert("Hedera account ID not found");
        return;
      }
      if (!params.hedera_private_key_encrypted) {
        alert("Hedera private key not found");
        return;
      }
      console.log("Amount is", amount);
      if (Number(amount) < 0 || Number(amount) == 0) {
        alert("Input a correct amount");
        return;
      }

      console.log("Minting tokens to:", params.hedera_wallet);
      console.log("Account ID:", params.hedera_account_id);

      // Build contract parameters
      const contractParams = new ContractFunctionParameters().addUint256(
        Number(amount)
      );

      // Execute the contract
      const walletService = new HederaWalletService("testnet");

      // IMPORTANT: If hedera_private_key_encrypted is actually encrypted,
      // you need to decrypt it first before passing to executeContract
      // For now, assuming it's stored as plain text (not recommended for production)
      const privateKey = params.hedera_private_key_encrypted;

      const receipt = await walletService.executeContract(
        params.hedera_account_id,
        privateKey,
        token_contract_id,
        "mitToSender",
        contractParams,
        200000 // Gas limit
        //1 // Payable amount in HBAR (adjust based on your needs)
      );

      console.log("Mint successful! Receipt:", receipt);
      alert("Tokens minted successfully!");

      // Refresh balance
      await checkBalance();

      // Get token balance
      await checkTokenBalance();
    } catch (error) {
      if (error instanceof Error) {
        console.error("Mint error:", error);
        alert(`Failed to mint tokens: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  }, [profile, checkBalance, amount]);

  const checkTokenBalance = useCallback(async () => {
    try {
      if (!profile || !profile[0]?.hedera_wallet) {
        return;
      }

      const walletService = new HederaWalletService("testnet");
      const _tokenBalance = await walletService.getTokenBalance(
        token_contract_id
      );

      // const contractParams = new ContractFunctionParameters();
      // const response = await walletService.executeContract(
      //   profile[0]?.hedera_account_id,
      //   profile[0]?.hedera_private_key_encrypted,
      //   token_contract_id,
      //   "balanceOfSender",
      //   contractParams,
      //   200000
      // );
      // console.log(response);
      console.log("Token Balance:", tokenBalance);
      setTokenBalance(_tokenBalance);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error checking token balance:", error.message);
      }
    }
  }, [profile]);

  const CopyableField = ({
    value,
    truncate = false,
  }: {
    value: string;
    truncate?: boolean;
  }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    };

    const displayValue =
      truncate && value ? `${value.slice(0, 6)}...${value.slice(-4)}` : value;

    return (
      <div className="max-w-7xl mx-auto p-6 flex items-center justify-center gap-2 text-black font-medium  py-3 sm:py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
        <span>{value == profile[0]?.hedera_account_id ? "id:" : "EVM:"}</span>
        <span>{displayValue}</span>
        <button
          onClick={handleCopy}
          className="ml-2 p-1 hover:bg-gray-100 rounded transition-colors"
          title="Copy to clipboard"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-600 cursor-pointer" />
          ) : (
            <Copy className="w-4 h-4 text-gray-600 cursor-pointer" />
          )}
        </button>
      </div>
    );
  };

  useEffect(() => {
    checkBalance();
    checkTokenBalance();
  }, [checkTokenBalance, checkBalance]);

  return (
    <div className="max-w-7xl mx-0 p-6 flex-1 bg-gray-50 min-h-screen p-2 sm:p-4 lg:p-6">
      {/* Header */}
      <DashboardHeader text={"Wallet"} />

      {/* Main Content */}
      {profile && (
        <div className="space-y-4 sm:space-y-6">
          {/* Top Section - Wallet and Transaction History */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Wallet Card */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-green-50">
              <CardHeader className="pb-4 sm:pb-6">
                <CardTitle className="flex items-center space-x-3 text-lg sm:text-xl">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <span className="font-bold">Wallet</span>
                </CardTitle>

                <div className="flex flex-col lg:flex-row ">
                  <CopyableField value={profile[0]?.hedera_account_id} />

                  <CopyableField
                    value={profile[0]?.hedera_wallet}
                    truncate={true}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-6 sm:space-y-8">
                {/* Token Balance */}
                <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm sm:text-base text-green-700 font-semibold">
                      Total Balance
                    </span>
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-green-800">
                    {balance}
                  </div>
                  <div className="flex items-center mt-2">
                    <span className="text-green-600 text-sm font-medium">
                      +2.5% from last month
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <Button
                    className="flex items-center justify-center bg-gradient-to-r cursor-pointer from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 sm:py-4  rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                    onClick={() => setShowInput(!showInput)}
                  >
                    <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Mint Pulse Token
                  </Button>

                  <Button
                    variant="outline"
                    className="border-2 border-green-300 text-green-700 hover:bg-green-50 font-semibold py-3 sm:py-4 rounded-xl transition-all duration-200"
                  >
                    <ArrowDownUp className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Withdraw
                  </Button>
                  <Button
                    variant="outline"
                    className="border-2 border-blue-300 text-blue-700 hover:bg-blue-50 font-semibold py-3 sm:py-4 rounded-xl transition-all duration-200"
                  >
                    <ArrowUpDown className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Convert
                  </Button>
                </div>

                {showInput && (
                  <div className="flex flex-col w-full mt-4 space-y-2 transition-all duration-200">
                    <input
                      name="mint"
                      type="number" // ✅ Use number input
                      placeholder="Amount"
                      value={amount}
                      min="1" // ✅ Minimum value
                      step="1" // ✅ Step increment
                      className="flex items-center justify-center text-black px-3 font-semibold py-3 sm:py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                      onChange={(e) => {
                        const value = e.target.value;
                        // ✅ Only allow positive numbers
                        if (value === "" || Number(value) >= 0) {
                          setAmount(value);
                        }
                      }}
                      onKeyPress={(e) => {
                        // ✅ Prevent entering negative signs or decimals if you only want integers
                        if (e.key === "-" || e.key === "e" || e.key === "+") {
                          e.preventDefault();
                        }
                      }}
                    />

                    <Button
                      className="flex items-center justify-center bg-gradient-to-r cursor-pointer from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 sm:py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={mintToken}
                      disabled={loading || !amount || Number(amount) <= 0} // ✅ Disable when invalid
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                          Mint
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {/* Token Holdings */}
                <div className="space-y-4 sm:space-y-5">
                  <h3 className="font-bold text-gray-900 text-base sm:text-lg flex items-center">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-2">
                      <span className="text-white text-xs font-bold">₿</span>
                    </div>
                    Token Holdings
                  </h3>
                  <div className="space-y-3 sm:space-y-4">
                    {/* Pulse Token */}
                    <div className="group flex items-center justify-between p-4 sm:p-5 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl hover:from-green-100 hover:to-emerald-100 transition-all duration-300 hover:shadow-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                          <span className="text-white text-sm sm:text-base font-bold">
                            P
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-gray-900 text-base sm:text-lg">
                            Pulse
                          </div>
                          <div className="text-sm text-gray-600 font-medium">
                            {tokenBalance} PUL
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900 text-base sm:text-lg">
                          $1,200
                        </div>
                        <div className="text-sm text-green-600 font-semibold flex items-center">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          +$2.09
                        </div>
                      </div>
                    </div>

                    {/* BlockDAG Token */}
                    {/* <div className="group flex items-center justify-between p-4 sm:p-5 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl hover:from-blue-100 hover:to-cyan-100 transition-all duration-300 hover:shadow-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                        <span className="text-white text-sm sm:text-base font-bold">
                          B
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-gray-900 text-base sm:text-lg">
                          BlockDAG
                        </div>
                        <div className="text-sm text-gray-600 font-medium">
                          5,020 BAG
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900 text-base sm:text-lg">
                        $640.91
                      </div>
                      <div className="text-sm text-green-600 font-semibold flex items-center">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        +$2.09
                      </div>
                    </div>
                  </div> */}

                    {/* Bitcoin */}
                    {/* <div className="group flex items-center justify-between p-4 sm:p-5 bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-2xl hover:from-orange-100 hover:to-yellow-100 transition-all duration-300 hover:shadow-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                        <span className="text-white text-sm sm:text-base font-bold">
                          ₿
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-gray-900 text-base sm:text-lg">
                          Bitcoin
                        </div>
                        <div className="text-sm text-gray-600 font-medium">
                          0.01 BTC
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900 text-base sm:text-lg">
                        $1,094.30
                      </div>
                      <div className="text-sm text-green-600 font-semibold flex items-center">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        +$2.09
                      </div>
                    </div>
                  </div> */}

                    {/* Ethereum */}
                    {/* <div className="group flex items-center justify-between p-4 sm:p-5 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl hover:from-purple-100 hover:to-pink-100 transition-all duration-300 hover:shadow-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                        <span className="text-white text-sm sm:text-base font-bold">
                          Ξ
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-gray-900 text-base sm:text-lg">
                          Ethereum
                        </div>
                        <div className="text-sm text-gray-600 font-medium">
                          0.0093 ETH
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900 text-base sm:text-lg">
                        $132.91
                      </div>
                      <div className="text-sm text-green-600 font-semibold flex items-center">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        +$2.09
                      </div>
                    </div>
                  </div> */}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Transaction History Card */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50">
              <CardHeader className="pb-4 sm:pb-6">
                <CardTitle className="text-lg sm:text-xl font-bold flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg mr-3">
                    <ArrowUpDown className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  Transaction History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 sm:space-y-5">
                  {/* Transaction 1 */}
                  <div className="group flex items-center justify-between p-4 sm:p-5 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl hover:from-green-100 hover:to-emerald-100 transition-all duration-300 hover:shadow-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                        <ArrowUpDown className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-gray-900 text-base sm:text-lg">
                          Convert
                        </div>
                        <div className="text-sm text-gray-600 font-medium flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          26/9/2025
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600 text-base sm:text-lg">
                        + 3,000 BAG
                      </div>
                      <div className="text-sm text-gray-600 font-medium">
                        $340
                      </div>
                    </div>
                  </div>

                  {/* Transaction 2 */}
                  <div className="group flex items-center justify-between p-4 sm:p-5 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl hover:from-blue-100 hover:to-cyan-100 transition-all duration-300 hover:shadow-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                        <ArrowDownUp className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-gray-900 text-base sm:text-lg">
                          Receive
                        </div>
                        <div className="text-sm text-gray-600 font-medium flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          26/9/2025
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600 text-base sm:text-lg">
                        + 400 PUL
                      </div>
                      <div className="text-sm text-gray-600 font-medium">
                        $60
                      </div>
                    </div>
                  </div>

                  {/* Transaction 3 */}
                  <div className="group flex items-center justify-between p-4 sm:p-5 bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-2xl hover:from-orange-100 hover:to-yellow-100 transition-all duration-300 hover:shadow-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                        <Plus className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-gray-900 text-base sm:text-lg">
                          Buy
                        </div>
                        <div className="text-sm text-gray-600 font-medium flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          26/9/2025
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-red-600 text-base sm:text-lg">
                        - 400 PUL
                      </div>
                      <div className="text-sm text-gray-600 font-medium">
                        $60
                      </div>
                    </div>
                  </div>

                  {/* Transaction 4 */}
                  <div className="group flex items-center justify-between p-4 sm:p-5 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl hover:from-purple-100 hover:to-pink-100 transition-all duration-300 hover:shadow-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                        <ArrowUpDown className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-gray-900 text-base sm:text-lg">
                          Convert
                        </div>
                        <div className="text-sm text-gray-600 font-medium flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          26/9/2025
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600 text-base sm:text-lg">
                        + 0.01 BTC
                      </div>
                      <div className="text-sm text-gray-600 font-medium">
                        $1,094
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Section - AI Monitoring and Rewards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* AI Monitoring Card */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-green-500 via-green-600 to-blue-600 text-white">
              <CardContent className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                  <div className="flex-1 space-y-4 sm:space-y-6">
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-black leading-tight">
                      AI monitoring that rewards you with points
                    </h3>
                    <p className="text-green-100 text-base sm:text-lg font-medium">
                      Smarter AI, stronger flocks, more rewards.
                    </p>
                    <Button className="bg-white text-green-600 hover:bg-gray-100 font-bold text-base sm:text-lg py-4 px-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                      Start earning
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                  <div className="mt-6 sm:mt-8 lg:mt-0 lg:ml-8 flex-shrink-0">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                      <Gift className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 text-white" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rewards Card */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-yellow-50">
              <CardHeader className="pb-4 sm:pb-6">
                <CardTitle className="flex items-center space-x-3 text-lg sm:text-xl font-bold">
                  <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Star className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <span>Reward Earned</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 sm:space-y-5">
                  <div className="group flex items-center justify-between p-4 sm:p-5 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl hover:from-green-100 hover:to-emerald-100 transition-all duration-300 hover:shadow-lg">
                    <span className="font-bold text-gray-900 text-base sm:text-lg">
                      Daily monitoring bonus
                    </span>
                    <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg group-hover:scale-105 transition-transform duration-200">
                      +50 points
                    </Badge>
                  </div>
                  <div className="group flex items-center justify-between p-4 sm:p-5 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl hover:from-blue-100 hover:to-cyan-100 transition-all duration-300 hover:shadow-lg">
                    <span className="font-bold text-gray-900 text-base sm:text-lg">
                      Health optimization
                    </span>
                    <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg group-hover:scale-105 transition-transform duration-200">
                      +34 points
                    </Badge>
                  </div>
                  <div className="group flex items-center justify-between p-4 sm:p-5 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl hover:from-purple-100 hover:to-pink-100 transition-all duration-300 hover:shadow-lg">
                    <span className="font-bold text-gray-900 text-base sm:text-lg">
                      Feed efficiency
                    </span>
                    <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg group-hover:scale-105 transition-transform duration-200">
                      +28 points
                    </Badge>
                  </div>
                  <div className="group flex items-center justify-between p-4 sm:p-5 bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-2xl hover:from-orange-100 hover:to-yellow-100 transition-all duration-300 hover:shadow-lg">
                    <span className="font-bold text-gray-900 text-base sm:text-lg">
                      Temperature control
                    </span>
                    <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg group-hover:scale-105 transition-transform duration-200">
                      +42 points
                    </Badge>
                  </div>
                  <div className="group flex items-center justify-between p-4 sm:p-5 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl hover:from-red-100 hover:to-pink-100 transition-all duration-300 hover:shadow-lg">
                    <span className="font-bold text-gray-900 text-base sm:text-lg">
                      Batch completion
                    </span>
                    <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg group-hover:scale-105 transition-transform duration-200">
                      +75 points
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
