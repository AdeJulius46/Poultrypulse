"use client";

import { useState } from "react";
import { ShoppingBag, Bell, Plus, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import DashboardHeader from "@/components/layout/dashboardHeader";

interface CartItem {
  id: string;
  name: string;
  quantity1: string;
  quantity2: string;
  price: number;
}

interface Transaction {
  id: string;
  type: "Convert" | "Receive" | "Buy";
  date: string;
  amount: string;
  value: string;
  isPositive: boolean;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "1",
      name: "Pulse",
      quantity1: "0.12 PUL",
      quantity2: "0.12 PUL",
      price: 1200,
    },
    {
      id: "2",
      name: "Pulse",
      quantity1: "0.12 PUL",
      quantity2: "0.12 PUL",
      price: 1200,
    },
    {
      id: "3",
      name: "Pulse",
      quantity1: "0.12 PUL",
      quantity2: "0.12 PUL",
      price: 1200,
    },
    {
      id: "4",
      name: "Pulse",
      quantity1: "0.12 PUL",
      quantity2: "0.12 PUL",
      price: 1200,
    },
    {
      id: "5",
      name: "Pulse",
      quantity1: "0.12 PUL",
      quantity2: "0.12 PUL",
      price: 1200,
    },
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "1",
      type: "Convert",
      date: "26/9/2025",
      amount: "+ 3,000 BAG",
      value: "$340",
      isPositive: true,
    },
    {
      id: "2",
      type: "Receive",
      date: "26/9/2025",
      amount: "+ 3,000 BAG",
      value: "$340",
      isPositive: true,
    },
    {
      id: "3",
      type: "Receive",
      date: "26/9/2025",
      amount: "+ 3,000 BAG",
      value: "$340",
      isPositive: true,
    },
    {
      id: "4",
      type: "Buy",
      date: "26/9/2025",
      amount: "- 400 PUL",
      value: "$80",
      isPositive: false,
    },
    {
      id: "5",
      type: "Receive",
      date: "26/9/2025",
      amount: "+ 3,000 BAG",
      value: "$340",
      isPositive: true,
    },
  ]);

  const handleRemoveItem = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <DashboardHeader text={"Cart"} />
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 md:gap-8">
          {/* Left Column - Cart Items */}
          <div className="lg:col-span-7 space-y-3 sm:space-y-4">
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
                          {item.name}
                        </h3>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2 mt-0.5 sm:mt-1">
                          <span className="text-xs sm:text-sm text-gray-600">
                            {item.quantity1}
                          </span>
                          <span className="hidden sm:inline text-gray-400">
                            •
                          </span>
                          <span className="text-xs sm:text-sm text-gray-600">
                            {item.quantity2}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-base sm:text-lg md:text-xl text-gray-900">
                        ${item.price}
                      </p>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-xs sm:text-sm text-red-500 hover:text-red-700 mt-1 sm:mt-2 font-medium transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* AI Monitoring Banner */}
            <Card className="hidden lg:flex bg-gradient-to-br from-green-50 to-emerald-50 border-0 rounded-2xl sm:rounded-3xl shadow-sm overflow-hidden mt-6 sm:mt-8">
              <CardContent className="p-4 sm:p-6 md:p-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-serif italic text-gray-900 mb-1 sm:mb-2">
                      AI monitoring that
                    </h3>
                    <p className="text-lg sm:text-xl md:text-2xl font-serif italic text-gray-900 mb-2 sm:mb-3">
                      <span className="italic">rewards you with points</span>
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                      Smarter AI, stronger flocks, more rewards.
                    </p>
                    <Button className="bg-green-600 hover:bg-green-700 text-white rounded-full px-4 sm:px-6 py-2 text-xs sm:text-sm font-semibold">
                      Start earning →
                    </Button>
                  </div>

                  <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 flex-shrink-0">
                    <div className="w-full h-full bg-gradient-to-br from-orange-300 via-orange-400 to-orange-500 rounded-2xl flex items-center justify-center relative overflow-hidden">
                      <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
                        <div className="flex gap-1">
                          <div className="w-6 h-1 sm:w-8 sm:h-1.5 bg-orange-200 rounded-full transform -rotate-12"></div>
                          <div className="w-4 h-4 sm:w-5 sm:h-5 bg-yellow-300 rounded-full"></div>
                          <div className="w-6 h-1 sm:w-8 sm:h-1.5 bg-orange-200 rounded-full transform rotate-12"></div>
                        </div>
                      </div>
                      <div className="w-8 h-12 sm:w-10 sm:h-14 bg-gradient-to-b from-red-500 to-red-600 rounded-sm"></div>
                      <div className="absolute bottom-4 left-2 w-6 h-8 sm:w-7 sm:h-10 bg-orange-300 rounded-sm"></div>
                      <div className="absolute bottom-4 right-2 w-6 h-8 sm:w-7 sm:h-10 bg-orange-300 rounded-sm"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24 space-y-4 sm:space-y-6">
              <Card className="bg-white border border-gray-200 rounded-2xl sm:rounded-3xl shadow-lg">
                <CardContent className="p-4 sm:p-6 md:p-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                    Order Summary
                  </h2>

                  <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                    {transactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-start justify-between py-2 sm:py-3 border-b border-gray-100 last:border-0"
                      >
                        <div>
                          <p className="font-semibold text-sm sm:text-base text-gray-900">
                            {transaction.type}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
                            {transaction.date}
                          </p>
                        </div>
                        <div className="text-right">
                          <p
                            className={`font-bold text-sm sm:text-base ${
                              transaction.isPositive
                                ? "text-green-600"
                                : "text-gray-900"
                            }`}
                          >
                            {transaction.amount}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
                            {transaction.value}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white rounded-2xl py-4 sm:py-6 text-base sm:text-lg font-bold shadow-lg hover:shadow-xl transition-all">
                    Proceed to Checkout
                  </Button>
                </CardContent>
              </Card>

              {/* Placeholder Card */}
              <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-0 rounded-2xl sm:rounded-3xl overflow-hidden h-32 sm:h-40 md:h-48">
                <CardContent className="p-4 sm:p-6 h-full flex items-center justify-center">
                  <p className="text-xs sm:text-sm text-gray-400">
                    Additional content area
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
