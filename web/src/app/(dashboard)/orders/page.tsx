"use client";

import { useEffect, useState } from "react";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DashboardHeader from "@/components/layout/dashboardHeader";
import { supabase } from "@/lib/supabase";

interface OrderItem {
  id: string;
  inventory_id: string;
  quantity: number;
  price_per_unit: number;
  total_price: number;
  inventory: {
    breed_type: string;
    media_urls: string[];
  };
}

interface Order {
  id: string;
  total_hbar: number;
  status: string;
  transaction_hash: string | null;
  created_at: string;
  updated_at: string;
  order_items: OrderItem[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("Please login to view orders");
        return;
      }

      // Fetch orders
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select("*")
        .eq("buyer_id", user.id)
        .order("created_at", { ascending: false });

      if (ordersError) throw ordersError;

      if (!ordersData || ordersData.length === 0) {
        setOrders([]);
        return;
      }

      // Fetch order items for all orders
      const orderIds = ordersData.map((order) => order.id);
      const { data: orderItemsData, error: itemsError } = await supabase
        .from("order_items")
        .select("*")
        .in("order_id", orderIds);

      if (itemsError) throw itemsError;

      // Fetch inventory details for all items
      const inventoryIds =
        orderItemsData?.map((item) => item.inventory_id) || [];
      const { data: inventoryData, error: inventoryError } = await supabase
        .from("inventory_public")
        .select("id, breed_type, media_urls")
        .in("id", inventoryIds);

      if (inventoryError) throw inventoryError;

      // Create a map for quick inventory lookup
      const inventoryMap = new Map(
        inventoryData?.map((inv) => [inv.id, inv]) || []
      );

      // Combine all data
      const transformedOrders = ordersData.map((order) => ({
        ...order,
        order_items: (orderItemsData || [])
          .filter((item) => item.order_id === order.id)
          .map((item) => ({
            ...item,
            inventory: inventoryMap.get(item.inventory_id) || {
              breed_type: "Unknown Product",
              media_urls: [],
            },
          })),
      }));

      setOrders(transformedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      alert("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "paid":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "paid":
        return <CheckCircle className="w-5 h-5" />;
      case "pending":
        return <Clock className="w-5 h-5" />;
      case "cancelled":
      case "failed":
        return <XCircle className="w-5 h-5" />;
      default:
        return <Package className="w-5 h-5" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader text={"My Orders"} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {loading ? (
          <Card className="bg-white rounded-2xl p-8 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
              <p className="text-gray-500">Loading your orders...</p>
            </div>
          </Card>
        ) : orders.length === 0 ? (
          <Card className="bg-white rounded-2xl p-8 sm:p-12 text-center">
            <Package className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              No Orders Yet
            </h3>
            <p className="text-gray-500 mb-6">
              Start shopping to see your orders here
            </p>
            <Button className="bg-green-600 hover:bg-green-700 text-white rounded-full px-6 py-3">
              Browse Products
            </Button>
          </Card>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {orders.map((order) => (
              <Card
                key={order.id}
                className="bg-white border border-gray-200 rounded-2xl sm:rounded-3xl shadow-sm hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4 sm:p-6">
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                        {getStatusIcon(order.status)}
                      </div>
                      <div>
                        <h3 className="font-bold text-base sm:text-lg text-gray-900">
                          Order #{order.id.slice(0, 8)}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">
                          {formatDate(order.created_at)}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 sm:gap-2">
                      <Badge
                        className={`${getStatusColor(
                          order.status
                        )} border px-3 py-1 rounded-full text-xs sm:text-sm font-semibold capitalize`}
                      >
                        {order.status}
                      </Badge>
                      <p className="text-xl sm:text-2xl font-bold text-gray-900">
                        ${order.total_hbar.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="bg-gray-50 rounded-xl p-3 sm:p-4 mb-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">
                        {order.order_items.length} item(s)
                      </span>
                      {order.transaction_hash && (
                        <span className="text-xs text-green-600 font-mono truncate max-w-[200px]">
                          TX: {order.transaction_hash.slice(0, 12)}...
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Toggle Details Button */}
                  <button
                    onClick={() => toggleOrderDetails(order.id)}
                    className="w-full flex items-center justify-center gap-2 text-green-600 hover:text-green-700 font-medium py-2 transition-colors"
                  >
                    {expandedOrderId === order.id ? (
                      <>
                        Hide Details <ChevronUp className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        View Details <ChevronDown className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  {/* Order Items (Expandable) */}
                  {expandedOrderId === order.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Order Items:
                      </h4>
                      {order.order_items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between bg-gray-50 rounded-lg p-3"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                              <Package className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 text-sm">
                                {item.inventory?.breed_type || "Product"}
                              </p>
                              <p className="text-xs text-gray-500">
                                Qty: {item.quantity} × $
                                {item.price_per_unit.toFixed(2)}
                              </p>
                            </div>
                          </div>
                          <p className="font-bold text-gray-900">
                            ${item.total_price.toFixed(2)}
                          </p>
                        </div>
                      ))}

                      {/* Transaction Hash (if available) */}
                      {order.transaction_hash && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                          <p className="text-xs font-semibold text-gray-700 mb-1">
                            Transaction Hash:
                          </p>
                          <p className="text-xs font-mono text-blue-600 break-all">
                            {order.transaction_hash}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
