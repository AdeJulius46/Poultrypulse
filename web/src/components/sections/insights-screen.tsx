"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ChartContainer } from "@/components/ui/chart";
import {
  Plus,
  Bell,
  Heart,
  Fan,
  ArrowUpDown,
  CloudRain,
  TrendingUp,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import DashboardHeader from "../layout/dashboardHeader";

// Wrapper component to handle the video display without batch selection
const VideoDisplay = ({ selectedBatch }: { selectedBatch: string }) => {
  return (
    <div
      className="relative bg-gray-900 rounded-2xl overflow-hidden shadow-lg"
      style={{ aspectRatio: "16/9" }}
    >
      {/* Batch indicator */}
      <div className="absolute top-6 right-6 z-20 bg-black/70 text-white px-3 py-2 rounded-md">
        <span className="text-sm font-medium">Batch {selectedBatch}</span>
      </div>

      {/* Video content */}
      <video
        src={
          selectedBatch === "A"
            ? "vid1.mp4"
            : selectedBatch === "B"
            ? "http://172.20.10.10:8080/?action=stream"
            : "vid2.mp4"
        }
        className="w-full h-full object-cover"
        controls
        autoPlay
        muted
        loop
      >
        <source
          src={
            selectedBatch === "A"
              ? "vid1.mp4"
              : selectedBatch === "B"
              ? "http://172.20.10.10:8080/?action=stream"
              : "vid2.mp4"
          }
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      {/* Stream info overlay */}
      <div className="absolute bottom-6 left-6 bg-black/70 text-white px-4 py-2 rounded-lg">
        <div className="text-sm font-medium">
          {selectedBatch === "B" ? "Live Feed" : "Recorded Video"} • Batch{" "}
          {selectedBatch}
        </div>
        <div className="text-xs opacity-75 mt-1">
          {selectedBatch === "B" ? "Live Stream" : "Poultry Farm Recording"}
        </div>
      </div>
    </div>
  );
};

const chartConfig = {
  healthy: {
    label: "Healthy",
    color: "hsl(142, 76%, 36%)",
  },
  atRisk: {
    label: "At Risk",
    color: "hsl(38, 92%, 50%)",
  },
  sick: {
    label: "Sick",
    color: "hsl(0, 84%, 60%)",
  },
};

export function InsightsScreen() {
  const [selectedBatch, setSelectedBatch] = useState("A");

  const handleBatchSelect = (batchId: string) => {
    setSelectedBatch(batchId);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <DashboardHeader text={"Insight"} />

      {/* Main Content */}
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Growth Rate Section */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  <span>Growth Rate for Batch A</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto mb-4 relative">
                    <div className="w-full h-full rounded-full bg-green-100 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">
                          91%
                        </div>
                        <div className="text-sm text-gray-500">out of 100</div>
                      </div>
                    </div>
                  </div>
                  <p className="text-lg font-semibold text-green-600">
                    Excellent
                  </p>
                </div>

                <div className="mt-6 space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Behavior</span>
                      <span>89%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: "89%" }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Climate</span>
                      <span>75%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: "75%" }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Activity</span>
                      <span>92%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: "92%" }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Stress Patterns</span>
                      <span>63%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: "63%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Live Feed Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Live Feed</CardTitle>
              </CardHeader>
              <CardContent>
                <VideoDisplay selectedBatch={selectedBatch} />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                  <Fan className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Optimize Ventilation
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Open ventilation for 15 minutes per hour during peak heat
                    (11 AM - 4 PM).
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center shrink-0">
                  <ArrowUpDown className="w-6 h-6 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Adjust Feed Spacing
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Increase feed spacing to reduce crowding and improve
                    distribution.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center shrink-0">
                  <CloudRain className="w-6 h-6 text-cyan-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Cooling System
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Introduce misting or cooling pads to stabilize climate
                    conditions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Prediction Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Prediction Analysis & Metrics</CardTitle>
              <div className="flex items-center space-x-4 mt-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Healthy (80%)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-sm">At Risk (13.3%)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm">Sick (6.7%)</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <ToggleGroup
                    type="single"
                    defaultValue="24h"
                    className="grid grid-cols-4"
                  >
                    <ToggleGroupItem value="1h">1h</ToggleGroupItem>
                    <ToggleGroupItem value="6h">6h</ToggleGroupItem>
                    <ToggleGroupItem value="12h">12h</ToggleGroupItem>
                    <ToggleGroupItem value="24h">24h</ToggleGroupItem>
                  </ToggleGroup>
                </div>

                <div className="h-64">
                  <ChartContainer config={chartConfig} className="h-full">
                    <div className="text-center text-gray-500 py-20">
                      <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p>Chart visualization would go here</p>
                    </div>
                  </ChartContainer>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Health Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span className="font-medium">Healthy</span>
                  </div>
                  <span className="text-2xl font-bold text-green-600">80%</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                    <span className="font-medium">At Risk</span>
                  </div>
                  <span className="text-2xl font-bold text-orange-600">
                    13.3%
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <span className="font-medium">Sick</span>
                  </div>
                  <span className="text-2xl font-bold text-red-600">6.7%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
