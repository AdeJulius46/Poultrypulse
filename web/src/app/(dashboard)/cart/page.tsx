"use client";

import { useCallback, useEffect, useState } from "react";
import { ShoppingBag, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import DashboardHeader from "@/components/layout/dashboardHeader";
import { supabase } from "@/lib/supabase";
import { useStore } from "@/lib/store";
import { ContractFunctionParameters } from "@hashgraph/sdk";
import { HederaWalletService } from "@/lib/hedera-wallet";
import { market_id, marketplace, token_contract_id } from "@/contract";
import { useRouter } from "next/navigation";

interface CartItem {
  id: string;
  inventory_id: string;
  quantity: number;
  inventory: {
    id: string;
    breed_type: string;
    price_per_bird: number;
    media_urls: string[];
  };
}

interface CheckoutState {
  isProcessing: boolean;
  currentStep:
    | "idle"
    | "creating-order"
    | "approving-tokens"
    | "placing-order"
    | "clearing-cart"
    | "complete";
  error: string | null;
}

export default function CartPage() {
  const router = useRouter();
  const profile = useStore((state) => state.profile);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoadingCart, setIsLoadingCart] = useState(false);
  const [checkoutState, setCheckoutState] = useState<CheckoutState>({
    isProcessing: false,
    currentStep: "idle",
    error: null,
  });

  // Calculate total amount
  const calculateTotal = useCallback(() => {
    return cartItems.reduce((total, item) => {
      return total + (item.inventory?.price_per_bird || 0) * item.quantity;
    }, 0);
  }, [cartItems]);

  // Fetch cart items
  const fetchCart = useCallback(async () => {
    try {
      setIsLoadingCart(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from("cart")
        .select(
          `
          id,
          inventory_id,
          quantity,
          inventory_public(
            id,
            breed_type,
            price_per_bird,
            media_urls
          )
        `
        )
        .eq("buyer_id", user.id);

      if (error) throw error;

      const transformedData =
        data?.map((item) => ({
          ...item,
          inventory: Array.isArray(item.inventory_public)
            ? item.inventory_public[0]
            : item.inventory_public,
        })) || [];

      setCartItems(transformedData);
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCheckoutState((prev) => ({
        ...prev,
        error: "Failed to load cart items",
      }));
    } finally {
      setIsLoadingCart(false);
    }
  }, []);

  // Remove item from cart
  const handleRemoveItem = async (id: string) => {
    try {
      const { error } = await supabase.from("cart").delete().eq("id", id);
      if (error) throw error;

      setCartItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error removing item:", error);
      alert("Failed to remove item from cart");
    }
  };

  // Validate profile data
  const validateProfile = useCallback(() => {
    const params = profile?.[0];

    if (!params) {
      throw new Error("Profile data not found. Please complete your profile.");
    }
    if (!params.hedera_wallet) {
      throw new Error("Hedera wallet address not found");
    }
    if (!params.hedera_account_id) {
      throw new Error("Hedera account ID not found");
    }
    if (!params.hedera_private_key_encrypted) {
      throw new Error("Hedera private key not found");
    }

    return params;
  }, [profile]);

  // Create order in database
  const createOrder = async (userId: string, totalAmount: number) => {
    setCheckoutState((prev) => ({ ...prev, currentStep: "creating-order" }));

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        buyer_id: userId,
        total_hbar: totalAmount,
        status: "pending",
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Insert order items
    const items = cartItems.map((item) => ({
      order_id: order.id,
      inventory_id: item.inventory_id,
      quantity: item.quantity,
      price_per_unit: item.inventory?.price_per_bird,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(items);

    if (itemsError) throw itemsError;

    return order;
  };

  // Approve tokens for marketplace
  const approveTokens = async (
    params: any,
    walletService: HederaWalletService
  ) => {
    setCheckoutState((prev) => ({ ...prev, currentStep: "approving-tokens" }));

    const approveParams = new ContractFunctionParameters()
      .addAddress(marketplace)
      .addUint256(1000000000000);

    const approveTx = await walletService.executeContract(
      params.hedera_account_id,
      params.hedera_private_key_encrypted,
      token_contract_id,
      "approve",
      approveParams,
      700000
    );

    return approveTx;
  };

  function hederaToEvmAddress(accountId: string) {
    // Extract the account number (last part after the dots)
    const accountNum = accountId.split(".").pop();

    // Convert to hex and pad to 40 characters (20 bytes)
    const hex = parseInt(accountNum ?? "0")
      .toString(16)
      .padStart(40, "0");

    return "0x" + hex;
  }

  const transferTokens = async (
    params: any,
    walletService: HederaWalletService,
    amount: number
  ) => {
    setCheckoutState((prev) => ({ ...prev, currentStep: "approving-tokens" }));
    const evmAddress = hederaToEvmAddress(params.hedera_account_id);
    const approveParams = new ContractFunctionParameters()
      .addAddress(evmAddress)
      .addUint256(amount);

    const approveTx = await walletService.executeContract(
      params.hedera_account_id,
      params.hedera_private_key_encrypted,
      token_contract_id,
      "transfer",
      approveParams,
      700000
    );

    return approveTx;
  };

  // Place order on blockchain
  const placeBlockchainOrder = async (
    params: any,
    walletService: HederaWalletService
  ) => {
    setCheckoutState((prev) => ({ ...prev, currentStep: "placing-order" }));

    const orderParams = new ContractFunctionParameters()
      .addUint256(1)
      .addUint256(3);

    const orderTx = await walletService.executeContract(
      params.hedera_account_id,
      params.hedera_private_key_encrypted,
      market_id,
      "placeOrder",
      orderParams,
      700000
    );

    return orderTx;
  };

  // Clear cart from database
  const clearCart = async (userId: string) => {
    setCheckoutState((prev) => ({ ...prev, currentStep: "clearing-cart" }));

    const { error: deleteError } = await supabase
      .from("cart")
      .delete()
      .eq("buyer_id", userId);

    if (deleteError) throw deleteError;
  };

  // Update order with transaction hash
  const updateOrderStatus = async (orderId: string, txHash: string) => {
    await supabase
      .from("orders")
      .update({
        transaction_hash: txHash,
        status: "paid",
      })
      .eq("id", orderId);
  };

  // Main checkout handler
  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty");
      return;
    }

    setCheckoutState({
      isProcessing: true,
      currentStep: "creating-order",
      error: null,
    });

    try {
      // Step 1: Get user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Please login to continue");

      // Step 2: Validate profile
      const params = validateProfile();

      // Step 3: Calculate total
      const totalAmount = calculateTotal();

      // Step 4: Create order in database
      const order = await createOrder(user.id, totalAmount);

      // Step 5: Initialize wallet service
      const walletService = new HederaWalletService("testnet");

      // Step 5.1: Transfer tokens to buyer
      await transferTokens(params, walletService, totalAmount);
      // Step 6: Approve tokens
      await approveTokens(params, walletService);

      // Step 7: Place blockchain order
      const orderTx = await placeBlockchainOrder(params, walletService);

      // Step 8: Update order with transaction hash
      if (orderTx?.transactionHash) {
        console.log(orderTx.transactionHash);
        await updateOrderStatus(order.id, orderTx.transactionHash.toString());
      }

      // Step 9: Clear cart
      await clearCart(user.id);

      // Step 10: Update local state
      setCartItems([]);
      setCheckoutState((prev) => ({ ...prev, currentStep: "complete" }));

      // Success notification
      alert(
        `Order placed successfully!\nOrder ID: ${
          order.id
        }\nTotal: $${totalAmount.toFixed(2)}`
      );

      // Redirect to orders page
      router.push("/orders");
    } catch (err: any) {
      console.error("Checkout error:", err);
      setCheckoutState((prev) => ({
        ...prev,
        error: err.message || "Failed to process checkout",
      }));
      alert(err.message || "Failed to process checkout. Please try again.");
    } finally {
      setCheckoutState((prev) => ({
        ...prev,
        isProcessing: false,
        currentStep: "idle",
      }));
    }
  };

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const totalAmount = calculateTotal();
  const isCheckoutDisabled =
    checkoutState.isProcessing || cartItems.length === 0;

  // Get checkout button text based on current step
  const getCheckoutButtonText = () => {
    if (!checkoutState.isProcessing) {
      return `Proceed to Checkout - $${totalAmount.toFixed(2)}`;
    }

    switch (checkoutState.currentStep) {
      case "creating-order":
        return "Creating order...";
      case "approving-tokens":
        return "Approving tokens...";
      case "placing-order":
        return "Placing order...";
      case "clearing-cart":
        return "Finalizing...";
      default:
        return "Processing...";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader text="Cart" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 md:gap-8">
          {/* Left Column - Cart Items */}
          <div className="lg:col-span-7 space-y-3 sm:space-y-4">
            {/* Error Message */}
            {checkoutState.error && (
              <Card className="bg-red-50 border-2 border-red-200 rounded-2xl">
                <CardContent className="p-4">
                  <p className="text-red-800 text-sm">{checkoutState.error}</p>
                </CardContent>
              </Card>
            )}

            {/* Loading State */}
            {isLoadingCart ? (
              <Card className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
                <Loader2 className="w-8 h-8 animate-spin text-green-600 mx-auto mb-2" />
                <p className="text-gray-500">Loading cart...</p>
              </Card>
            ) : cartItems.length === 0 ? (
              <Card className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
                <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Your cart is empty</p>
                <Button
                  onClick={() => router.push("/marketplace")}
                  className="mt-4 bg-green-600 hover:bg-green-700"
                >
                  Browse Products
                </Button>
              </Card>
            ) : (
              <>
                {/* Cart Items */}
                {cartItems.map((item) => (
                  <Card
                    key={item.id}
                    className="bg-white border border-gray-200 rounded-2xl sm:rounded-3xl shadow-sm hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-4 sm:p-5 md:p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 sm:gap-4 md:gap-5">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                            <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-green-600" />
                          </div>

                          <div>
                            <h3 className="font-semibold text-sm sm:text-base md:text-lg text-gray-900">
                              {item.inventory?.breed_type}
                            </h3>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2 mt-0.5 sm:mt-1">
                              <span className="text-xs sm:text-sm text-gray-600">
                                Quantity: {item.quantity}
                              </span>
                              <span className="text-xs sm:text-sm text-gray-600">
                                @ ${item.inventory?.price_per_bird} each
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="font-bold text-base sm:text-lg md:text-xl text-gray-900">
                            $
                            {(
                              (item.inventory?.price_per_bird || 0) *
                              item.quantity
                            ).toFixed(2)}
                          </p>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            disabled={checkoutState.isProcessing}
                            className="text-xs sm:text-sm text-red-500 cursor-pointer hover:text-red-700 mt-1 sm:mt-2 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Total Summary */}
                <Card className="bg-green-50 border-2 border-green-200 rounded-2xl sm:rounded-3xl">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-600">Total Items:</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {cartItems.length}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Total Amount:</p>
                        <p className="text-3xl font-bold text-green-600">
                          ${totalAmount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Checkout Button */}
                <Button
                  onClick={handleCheckout}
                  disabled={isCheckoutDisabled}
                  className="w-full cursor-pointer bg-green-600 hover:bg-green-700 text-white rounded-2xl py-4 sm:py-6 text-base sm:text-lg font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {checkoutState.isProcessing && (
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  )}
                  {getCheckoutButtonText()}
                </Button>

                {/* Progress Indicator */}
                {checkoutState.isProcessing && (
                  <Card className="bg-blue-50 border-2 border-blue-200 rounded-2xl">
                    <CardContent className="p-4">
                      <p className="text-blue-800 text-sm text-center">
                        Please wait while we process your order. Do not close
                        this window.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>

          {/* Right Column - Summary Placeholder */}
          <div className="lg:col-span-5">
            <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-0 rounded-2xl sm:rounded-3xl overflow-hidden h-64">
              <CardContent className="p-4 sm:p-6 h-full flex items-center justify-center">
                <p className="text-xs sm:text-sm text-gray-400">
                  Order summary
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
