"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Heart,
  ShoppingCart,
  Bell,
  User,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import DashboardHeader from "@/components/layout/dashboardHeader";
import { ProductCard } from "@/components/productCard";

interface Product {
  id: number;
  name: string;
  farmName: string;
  description: string;
  price: number;
  originalPrice: number;
  image: string;
  healthScore: number;
  feedQuality: string;
  age: string;
  weight: string;
  badge?: string;
}

interface InsightMetric {
  id: number;
  icon: string;
  color: string;
}

export default function FreshPoultryFarms() {
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const router = useRouter();
  const products: Product[] = [
    {
      id: 1,
      name: "Premium Broiler",
      farmName: "Local Farms",
      description:
        "Healthy, free-range chickens with complete health monitoring",
      price: 10,
      originalPrice: 15,
      image:
        "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=400&h=300&fit=crop",
      healthScore: 90,
      feedQuality: "Organic Feed",
      age: "18 Weeks",
      weight: "2.5kg",
    },
    {
      id: 2,
      name: "Premium Layers",
      farmName: "Multi Farms",
      description:
        "Healthy, free-range chickens with complete health monitoring",
      price: 10,
      originalPrice: 15,
      image:
        "https://images.unsplash.com/photo-1612170153139-6f881ff067e0?w=400&h=300&fit=crop",
      healthScore: 90,
      feedQuality: "Organic Feed",
      age: "18 Weeks",
      weight: "2.5kg",
      badge: "30% OFF",
    },
    {
      id: 3,
      name: "Premium Neuters",
      farmName: "Garden Farms",
      description:
        "Healthy, free-range chickens with complete health monitoring",
      price: 10,
      originalPrice: 15,
      image:
        "https://images.unsplash.com/photo-1603039578043-3a548a159535?w=400&h=300&fit=crop",
      healthScore: 90,
      feedQuality: "Organic Feed",
      age: "18 Weeks",
      weight: "2.5kg",
      badge: "40% OFF",
    },
    {
      id: 4,
      name: "Local Chicken",
      farmName: "Poultry Farms",
      description:
        "Healthy, free-range chickens with complete health monitoring",
      price: 10,
      originalPrice: 15,
      image:
        "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=400&h=300&fit=crop",
      healthScore: 90,
      feedQuality: "Organic Feed",
      age: "18 Weeks",
      weight: "2.5kg",
      badge: "35% OFF",
    },
    {
      id: 5,
      name: "Premium Layers",
      farmName: "Multi Farms",
      description:
        "Healthy, free-range chickens with complete health monitoring",
      price: 10,
      originalPrice: 15,
      image:
        "https://images.unsplash.com/photo-1612170153139-6f881ff067e0?w=400&h=300&fit=crop",
      healthScore: 90,
      feedQuality: "Organic Feed",
      age: "18 Weeks",
      weight: "2.5kg",
    },
  ];

  const insightMetrics: InsightMetric[] = [
    { id: 1, icon: "🌡️", color: "bg-blue-100" },
    { id: 2, icon: "❤️", color: "bg-red-300" },
    { id: 3, icon: "🌿", color: "bg-green-100" },
    { id: 4, icon: "💧", color: "bg-blue-300" },
  ];

  const toggleFavorite = (id: number) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
  };

  return (
    <div className="min-h-screen p-4">
      {/* Header */}
      {/* <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
          <div className="flex items-center gap-3">
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-full font-medium transition-colors">
              + Add New Batch
            </button>
            <button className="bg-white border-2 border-gray-200 hover:border-gray-300 px-6 py-2.5 rounded-full font-medium transition-colors flex items-center gap-2">
              <ShoppingCart size={20} className="text-orange-500" />
              Connect Wallet
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-pink-400 flex items-center justify-center">
              <User size={20} className="text-white" />
            </div>
            <div className="relative">
              <Bell size={24} className="text-gray-700" />
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                3
              </div>
            </div>
          </div>
        </div>
      </div> */}

      <DashboardHeader text={"About Farm"} />

      {/* Main Content */}
      <div className="min-w-full mx-auto">
        <ChevronLeft
          size={32}
          className="cursor-pointer text-green-700 mb-2"
          onClick={() => router.back()}
        />

        <div className="flex items-center lg:space-x-4 space-y-4 flex-col lg:flex-row ">
          {/* Farm Info Card */}
          <div className="bg-[#94be96] w-full lg:w-[50%] rounded-3xl p-8 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="relative z-10 text-center">
              <div className="w-full h-48 mx-auto mb-6 relative">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex flex-col ">
                  Jireh Farms
                </h2>

                {/* <div className="absolute inset-0 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <div className="text-center">
                    <div className="text-6xl mb-2">👑</div>
                    <div className="text-orange-500 text-4xl mb-1">🐔</div>
                    <div className="bg-green-600 text-white text-xs font-bold py-1 px-4 rounded-full">
                      FRESH POULTRY FARM
                    </div>
                  </div>
                </div> */}
                <img
                  src="poultryFarms.png"
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Insights Card */}
          <div className="lg:col-span-2 w-full  lg:w-[50%] bg-white rounded-3xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Insights from Fresh Poultry Farms
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {insightMetrics.map((metric) => (
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
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isFavorite={favorites.has(product.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
