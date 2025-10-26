"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Bell, 
  Crown, 
  Check,
  CreditCard,
  Calendar
} from "lucide-react";

export default function SubscriptionPage() {
    return (
    <div className="flex-1 bg-gray-50 min-h-screen p-2 sm:p-4 lg:p-6">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 mb-4 sm:mb-6 rounded-lg shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Subscription</h1>
          <div className="flex items-center justify-between sm:justify-end space-x-1 sm:space-x-2 lg:space-x-4">
            {/* Add New Batch Button - Icon only on mobile */}
            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-9">
              <Plus className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
              <span className="hidden sm:inline">Add New Batch</span>
            </Button>
            
            {/* Wallet Address Button - Icon only on mobile */}
            <Button variant="outline" className="flex items-center justify-center text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-9 border-gray-300">
              <span className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2">🦊</span>
              <span className="hidden sm:inline">0x67dfD......8df9E5</span>
              <span className="sm:hidden">Wallet</span>
            </Button>
            
            {/* Avatar */}
            <Avatar className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 border-2 border-gray-200">
              <AvatarImage src="/avatar.png" />
              <AvatarFallback className="text-xs sm:text-sm font-medium">U</AvatarFallback>
            </Avatar>
            
            {/* Notification Bell */}
            <Button size="icon" variant="ghost" className="relative w-8 h-8 sm:w-9 sm:h-9 hover:bg-gray-100">
              <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full border border-white"></span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-4 sm:space-y-6">
        {/* Plan Section */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center">
              <Crown className="w-5 h-5 mr-2 text-yellow-500" />
              Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Starter Plan Card - Current Plan */}
              <div className="relative group border-2 border-green-400 rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-green-50 via-green-100 to-green-50 flex flex-col justify-between min-h-[240px] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="absolute top-4 right-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl sm:text-2xl font-bold text-green-800">Starter</h3>
                    <Badge className="bg-green-500 text-white text-xs px-3 py-1 rounded-full shadow-md">Current</Badge>
                  </div>
                  <div className="mb-4">
                    <p className="text-3xl sm:text-4xl font-black text-green-700 mb-1">5 $BAG</p>
                    <p className="text-sm text-green-600 font-medium">per batch</p>
                  </div>
                  <div className="bg-white/60 rounded-lg p-3 mb-4">
                    <p className="text-sm text-gray-700 font-medium">30 chickens per batch</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full border-2 border-green-500 text-green-600 hover:bg-green-500 hover:text-white font-semibold py-3 rounded-xl transition-all duration-200">
                  Cancel Subscription
                </Button>
              </div>

              {/* Professional Plan Card */}
              <div className="relative group rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-green-500 via-green-600 to-green-700 text-white flex flex-col justify-between min-h-[240px] shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="absolute top-4 right-4">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Crown className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-3">Professional</h3>
                  <div className="mb-4">
                    <p className="text-3xl sm:text-4xl font-black mb-1">10 $BAG</p>
                    <p className="text-sm opacity-90 font-medium">per batch</p>
                  </div>
                  <div className="bg-white/20 rounded-lg p-3 mb-4 backdrop-blur-sm">
                    <p className="text-sm font-medium">30 chickens per batch</p>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <Button className="w-full bg-white text-green-600 hover:bg-gray-100 font-semibold py-3 rounded-xl shadow-lg transition-all duration-200">
                    Upgrade Now
                  </Button>
                  <Button variant="ghost" className="w-full border border-white/30 text-white hover:bg-white/20 font-medium py-2 rounded-xl transition-all duration-200">
                    Learn more
                  </Button>
                </div>
              </div>

              {/* Enterprise Plan Card */}
              <div className="relative group rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-orange-500 via-orange-600 to-red-500 text-white flex flex-col justify-between min-h-[240px] shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="absolute top-4 right-4">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Crown className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-3">Enterprise</h3>
                  <div className="mb-4">
                    <p className="text-3xl sm:text-4xl font-black mb-1">15 $BAG</p>
                    <p className="text-sm opacity-90 font-medium">per batch</p>
                  </div>
                  <div className="bg-white/20 rounded-lg p-3 mb-4 backdrop-blur-sm">
                    <p className="text-sm font-medium">30 chickens per batch</p>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <Button className="w-full bg-white text-orange-600 hover:bg-gray-100 font-semibold py-3 rounded-xl shadow-lg transition-all duration-200">
                    Upgrade Now
                  </Button>
                  <Button variant="ghost" className="w-full border border-white/30 text-white hover:bg-white/20 font-medium py-2 rounded-xl transition-all duration-200">
                    Learn more
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Method Section */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center">
              <CreditCard className="w-5 h-5 mr-2 text-blue-500" />
              Payment Method
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Active Payment Method */}
              <div className="relative group border-2 border-green-400 rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-green-50 via-green-100 to-green-50 flex flex-col items-center justify-center h-40 sm:h-48 cursor-pointer hover:bg-green-100 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
                <div className="absolute top-4 right-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-gray-800 text-base font-semibold">Card ending in **** 1234</span>
                  <p className="text-sm text-green-600 font-medium mt-2 bg-green-100 px-3 py-1 rounded-full">Primary</p>
                </div>
              </div>

              {/* Empty Placeholder */}
              <div className="relative group border-2 border-gray-200 rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center h-40 sm:h-48 hover:bg-gray-100 transition-all duration-300">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="w-6 h-6 text-gray-400" />
                  </div>
                  <span className="text-gray-500 text-sm font-medium">No other payment method</span>
                </div>
              </div>

              {/* Add New Payment Method */}
              <div className="relative group border-2 border-dashed border-blue-300 rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center h-40 sm:h-48 cursor-pointer hover:bg-blue-100 hover:border-blue-400 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-200">
                    <Plus className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-blue-700 text-base font-semibold">Add Payment Method</span>
                  <p className="text-xs text-blue-600 mt-1">Click to add new card</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Billing History Section */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-purple-50">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-purple-500" />
              Billing History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 sm:space-y-6">
              {/* Transaction 1 */}
              <div className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl hover:from-red-100 hover:to-orange-100 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start space-x-4 flex-1 mb-3 sm:mb-0">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Crown className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 text-base sm:text-lg">Subscription Upgraded</div>
                    <div className="text-sm text-gray-600 flex items-center mt-1">
                      <Calendar className="w-4 h-4 mr-2 text-purple-500" />
                      26/9/2025
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-red-600 text-lg sm:text-xl">- 15 BAG</div>
                  <div className="text-sm text-gray-600 bg-red-100 px-3 py-1 rounded-full mt-1">Enterprise Plan</div>
                </div>
              </div>

              {/* Transaction 2 */}
              <div className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl hover:from-green-100 hover:to-emerald-100 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start space-x-4 flex-1 mb-3 sm:mb-0">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Crown className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 text-base sm:text-lg">Subscription Upgraded</div>
                    <div className="text-sm text-gray-600 flex items-center mt-1">
                      <Calendar className="w-4 h-4 mr-2 text-purple-500" />
                      26/9/2025
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-red-600 text-lg sm:text-xl">- 10 BAG</div>
                  <div className="text-sm text-gray-600 bg-green-100 px-3 py-1 rounded-full mt-1">Professional Plan</div>
                </div>
              </div>

              {/* Transaction 3 */}
              <div className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl hover:from-blue-100 hover:to-cyan-100 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start space-x-4 flex-1 mb-3 sm:mb-0">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 text-base sm:text-lg">Subscription Paid</div>
                    <div className="text-sm text-gray-600 flex items-center mt-1">
                      <Calendar className="w-4 h-4 mr-2 text-purple-500" />
                      26/9/2025
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-red-600 text-lg sm:text-xl">- 5 BAG</div>
                  <div className="text-sm text-gray-600 bg-blue-100 px-3 py-1 rounded-full mt-1">Starter Plan</div>
                </div>
              </div>

              {/* Transaction 4 */}
              <div className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl hover:from-purple-100 hover:to-pink-100 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-start space-x-4 flex-1 mb-3 sm:mb-0">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 text-base sm:text-lg">Subscription Renewed</div>
                    <div className="text-sm text-gray-600 flex items-center mt-1">
                      <Calendar className="w-4 h-4 mr-2 text-purple-500" />
                      15/9/2025
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-red-600 text-lg sm:text-xl">- 5 BAG</div>
                  <div className="text-sm text-gray-600 bg-purple-100 px-3 py-1 rounded-full mt-1">Starter Plan</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    );
  }