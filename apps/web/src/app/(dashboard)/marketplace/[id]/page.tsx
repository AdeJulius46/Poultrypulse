"use client";

import React, { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import DashboardHeader from "@/components/layout/dashboardHeader";
import { ProductCard } from "@/components/productCard";
import { supabase } from "@/lib/supabase";

interface Product {
  id: string;
  livestock_type: string;
  breed_type: string;
  quantity: number;
  price_per_bird: number | null;
  media_urls: string[];
  description: string;
  health_status: string[];
  farmer_name: string;
}

interface Params {
  params: { id: string };
}

export default function FarmerProfile({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params); // This is the farmer's user ID (from URL)
  const [products, setProducts] = useState<Product[]>([]);
  const [farmerName, setFarmerName] = useState("Loading...");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchFarmerProducts = async () => {
      try {
        // Step 1: Get farmer's display name
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("display_name")
          .eq("id", id)
          .single();

        if (profileError || !profile) {
          console.error("Farmer not found:", profileError);
          setFarmerName("Unknown Farm");
          setLoading(false);
          return;
        }

        setFarmerName(profile.display_name);

        // Step 2: Get all products from this farmer using the real inventory table
        const { data: inventoryItems, error: inventoryError } = await supabase
          .from("inventory")
          .select(
            `
            id,
            livestock_type,
            breed_type,
            quantity,
            price_per_bird,
            media_urls,
            description,
            health_status
          `
          )
          .eq("farmer_id", id)
          .gt("quantity", 0) // Only show available stock
          .order("created_at", { ascending: false });

        if (inventoryError) throw inventoryError;

        // Map to Product format
        const formattedProducts: Product[] = (inventoryItems || []).map(
          (item: any) => ({
            id: item.id,
            livestock_type: item.livestock_type,
            breed_type: item.breed_type,
            quantity: item.quantity,
            price_per_bird: item.price_per_bird,
            media_urls: item.media_urls || [],
            description: item.description || "No description",
            health_status: item.health_status || [],
            farmer_name: profile.display_name,
          })
        );

        setProducts(formattedProducts);
      } catch (error: any) {
        console.error("Error fetching farmer products:", error);
        alert("Failed to load farm products: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchFarmerProducts();
  }, [id]);

  if (loading) {
    return <div className="p-8 text-center">Loading farm...</div>;
  }

  interface InsightMetric {
    id: number;
    icon: string;
    color: string;
  }

  const insightMetrics: InsightMetric[] = [
    { id: 1, icon: "🌡️", color: "bg-blue-100" },
    { id: 2, icon: "❤️", color: "bg-red-300" },
    { id: 3, icon: "🌿", color: "bg-green-100" },
    { id: 4, icon: "💧", color: "bg-blue-300" },
  ];

  return (
    <div className="min-h-screen p-4 max-w-7xl mx-auto p-6">
      <DashboardHeader text={"About Farm"} />

      <div className="min-w-full mx-auto">
        <ChevronLeft
          size={32}
          className="cursor-pointer text-green-700 mb-2"
          onClick={() => router.back()}
        />

        <div className="flex items-center lg:space-x-4 space-y-4 flex-col lg:flex-row">
          {/* Farm Info Card */}
          <div className="bg-[#94be96] w-full lg:w-[50%] rounded-3xl p-8 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="relative z-10 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {farmerName}
              </h2>
              <img
                src="/poultryFarms.png"
                alt={farmerName}
                className="w-full h-48 object-cover rounded-xl"
              />
            </div>
          </div>

          {/* Insights Card */}
          <div className="lg:col-span-2 w-full lg:w-[50%] bg-white rounded-3xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Farm Insights
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {insightMetrics.map((metric, i) => (
                <div
                  key={metric.id}
                  className={`${metric.color} rounded-2xl p-6 flex items-center justify-center text-4xl hover:scale-105 transition-transform cursor-pointer`}
                >
                  {metric.icon}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Available Products</h3>
          {products.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No products available from this farm.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={{
                    id: parseInt(product.id),
                    name: `${product.breed_type} (${product.livestock_type})`,
                    farmName: product.farmer_name,
                    description: product.description,
                    price: product.price_per_bird || 0,
                    originalPrice: (product.price_per_bird || 0) * 1.3,
                    image: product.media_urls[0] || "/placeholder.jpg",
                    healthScore: product.health_status.includes("healthy")
                      ? 95
                      : 80,
                    feedQuality: product.health_status.includes("organic")
                      ? "Organic"
                      : "Standard",
                    age: "18-20 weeks",
                    weight: "2.5kg",
                    badge: product.quantity < 10 ? "Low Stock" : undefined,
                  }}
                  isFavorite={false}
                  onToggleFavorite={() => {}}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
