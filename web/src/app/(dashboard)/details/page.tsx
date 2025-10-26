"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  Bell,
  User,
  Star,
  Plus,
  ArrowRight,
  Utensils,
  Shield,
  ChevronLeft,
} from "lucide-react";
import DashboardHeader from "@/components/layout/dashboardHeader";
import Back from "@/components/back";

export default function PoultryDetailsPage() {
  const [selectedImage, setSelectedImage] = useState(0);
  const router = useRouter();
  const images = [
    "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1612170153139-6f881ff067e0?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1603039578043-3a548a159535?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=800&h=600&fit=crop",
  ];

  const healthMetrics = [
    { label: "Health", value: "90%", align: "right" },
    { label: "Feeding Quality", value: "Organic Premium", align: "right" },
    { label: "Age", value: "16 Weeks", align: "right" },
    { label: "Weight", value: "2.3 kg", align: "right" },
  ];

  const environmentMetrics = [
    { label: "Poultry Temperature", value: "29°C", color: "bg-green-500" },
    { label: "Poultry Humidity", value: "18 - 30", color: "bg-green-500" },
    { label: "Air Quality Index", value: "Average", color: "bg-yellow-500" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}

      <DashboardHeader text={"Details Of Poultry"} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <Back />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm">
              <img
                src={images[selectedImage]}
                alt="Poultry"
                className="w-full h-96 object-cover"
              />
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-4">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`rounded-2xl overflow-hidden border-4 transition-all ${
                    selectedImage === index
                      ? "border-green-500"
                      : "border-transparent hover:border-gray-300"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-24 object-cover"
                  />
                </button>
              ))}
            </div>

            {/* AI Monitoring Card */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 opacity-20">
                <div className="absolute top-4 right-4 w-16 h-16 bg-orange-400 rounded-lg rotate-12"></div>
                <div className="absolute top-8 right-8 w-12 h-12 bg-yellow-400 rounded-lg rotate-45"></div>
                <div className="absolute top-12 right-12 w-8 h-8 bg-green-400 rounded-lg"></div>
              </div>

              <div className="relative z-10">
                <h3 className="text-2xl font-serif italic mb-2">
                  AI monitoring that
                </h3>
                <h3 className="text-2xl font-serif italic mb-4">
                  <span className="font-bold">rewards</span> you with points
                </h3>
                <p className="text-sm text-gray-700 mb-6">
                  Smarter AI, stronger
                  <br />
                  flocks, more rewards."
                </p>
                <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-full font-medium transition-colors flex items-center gap-2">
                  Start earning
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Product Info Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Details of Poultry
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Increase feed spacing to reduce crowding and improve
                distribution
              </p>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={18}
                    className="text-yellow-400 fill-yellow-400"
                  />
                ))}
                <span className="text-sm text-gray-600 ml-1">4.5</span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <span className="text-3xl font-bold text-gray-900">$10</span>
                <span className="text-gray-500 ml-2">per bird</span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mb-6">
                <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-full font-medium transition-colors">
                  Buy Now
                </button>
                <button className="flex-1 border-2 border-green-600 text-green-600 hover:bg-green-50 py-3 rounded-full font-medium transition-colors">
                  Add to Cart
                </button>
              </div>
            </div>

            {/* Health & Environment Metrics Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Health & Environment Metrics
              </h3>

              <div className="flex items-start gap-6 mb-6">
                {/* Health Score Circle */}
                <div className="flex flex-col items-center">
                  <div className="relative w-32 h-32">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="#E5E7EB"
                        strokeWidth="12"
                        fill="none"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="#10B981"
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray={`${(90 / 100) * 352} 352`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold text-gray-900">
                        90%
                      </span>
                      <span className="text-xs text-gray-500">out of 100</span>
                    </div>
                  </div>
                  <button className="mt-3 bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-full text-xs font-medium transition-colors">
                    Excellent
                  </button>
                </div>

                {/* Health Metrics */}
                <div className="flex-1 space-y-3">
                  {healthMetrics.map((metric, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <span className="text-sm text-gray-600">
                        {metric.label}
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        {metric.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Environment Metrics */}
              <div className="space-y-3 pt-4 border-t border-gray-100">
                {environmentMetrics.map((metric, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center"
                  >
                    <span className="text-sm text-gray-600">
                      {metric.label}
                    </span>
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-2 w-24 ${metric.color} rounded-full`}
                      ></div>
                      <span className="text-sm font-semibold text-gray-900 w-16 text-right">
                        {metric.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Feeding Habit Card */}
            <div className="bg-green-50 border-2 border-green-200 rounded-3xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Utensils size={20} className="text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-1">
                    Feeding Habit
                  </h4>
                  <p className="text-sm text-gray-700">
                    Organic grain feed 3x daily, with natural minerals
                  </p>
                </div>
              </div>
            </div>

            {/* Disease Status Card */}
            <div className="bg-purple-50 border-2 border-purple-200 rounded-3xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Shield size={20} className="text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-1">
                    Disease Status
                  </h4>
                  <p className="text-sm text-gray-700">
                    Last checked: 2 hours ago
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
