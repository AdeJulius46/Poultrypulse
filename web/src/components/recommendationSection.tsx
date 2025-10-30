"use client";
import React, { useState, useEffect } from "react";
import {
  BotIcon,
  AlertTriangle,
  Camera,
  Clock,
  TrendingUp,
  X,
} from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { fetchChickenMonitoring, ChickenMonitoring } from "../lib/supabase";

interface DetectionData {
  id: string;
  disease: string;
  confidence: number;
  image_url: string;
  timestamp: string;
  risk_level: string;
  temperature: number;
  humidity: number;
}

interface FlockSummary {
  totalHealthy: number;
  totalAtRisk: number;
  totalCritical: number;
  healthyPercentage: string;
  atRiskPercentage: string;
  criticalPercentage: string;
}

export const RecommendationsSection = () => {
  const [detectionImages, setDetectionImages] = useState<DetectionData[]>([]);
  const [selectedImage, setSelectedImage] = useState<DetectionData | null>(
    null
  );
  const [flockSummary, setFlockSummary] = useState<FlockSummary>({
    totalHealthy: 0,
    totalAtRisk: 0,
    totalCritical: 0,
    healthyPercentage: "0%",
    atRiskPercentage: "0%",
    criticalPercentage: "0%",
  });
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  useEffect(() => {
    const fetchMonitoringData = async () => {
      try {
        setLoading(true);

        const monitoringData = await fetchChickenMonitoring(50);

        const detectionsWithImages = monitoringData
          .filter(
            (record) =>
              record.image_url &&
              record.detected_disease &&
              (record.detected_disease === "crd" ||
                record.detected_disease === "coryza") &&
              record.confidence &&
              record.confidence > 0.5
          )
          .slice(0, 5)
          .map((record) => ({
            id: record.id,
            disease: record.detected_disease!,
            confidence: record.confidence!,
            image_url: record.image_url!,
            timestamp: record.timestamp,
            risk_level: record.risk_level,
            temperature: record.temperature,
            humidity: record.humidity,
          }));

        const recentData = monitoringData.slice(0, 20);
        let totalHealthy = 0;
        let totalAtRisk = 0;
        let totalCritical = 0;

        recentData.forEach((record) => {
          const normalCount = record.normal_detected || 0;
          const coryzeCount = record.coryza_detected || 0;
          const crdCount = record.crd_detected || 0;

          totalHealthy += normalCount;

          if (
            record.risk_level === "HIGH" ||
            record.risk_level === "CRITICAL"
          ) {
            totalCritical += coryzeCount + crdCount;
          } else if (record.risk_level === "MEDIUM") {
            totalAtRisk += coryzeCount + crdCount;
          } else {
            totalAtRisk += coryzeCount + crdCount;
          }
        });

        const total = totalHealthy + totalAtRisk + totalCritical;
        const summary: FlockSummary = {
          totalHealthy,
          totalAtRisk,
          totalCritical,
          healthyPercentage:
            total > 0 ? `${Math.round((totalHealthy / total) * 100)}%` : "0%",
          atRiskPercentage:
            total > 0 ? `${Math.round((totalAtRisk / total) * 100)}%` : "0%",
          criticalPercentage:
            total > 0 ? `${Math.round((totalCritical / total) * 100)}%` : "0%",
        };

        const generateRecommendations = () => {
          const recs = [];
          const hasCoryza = detectionsWithImages.some(
            (d) => d.disease === "coryza"
          );
          const hasCrd = detectionsWithImages.some((d) => d.disease === "crd");
          const avgTemp =
            recentData.reduce((acc, r) => acc + r.temperature, 0) /
            recentData.length;
          const avgHumidity =
            recentData.reduce((acc, r) => acc + r.humidity, 0) /
            recentData.length;

          if (hasCoryza) {
            recs.push(
              "Isolate affected birds and improve ventilation to prevent coryza spread."
            );
            recs.push(
              "Administer appropriate antibiotics as prescribed by veterinarian."
            );
          }

          if (hasCrd) {
            recs.push(
              "Implement strict biosecurity measures to contain respiratory disease."
            );
            recs.push(
              "Monitor air quality and reduce dust levels in poultry house."
            );
          }

          if (avgTemp > 30) {
            recs.push(
              "Increase airflow in the poultry house to reduce heat stress."
            );
          }

          if (avgHumidity > 70) {
            recs.push("Clean and dry litter to minimize moisture buildup.");
            recs.push("Improve drainage systems to control humidity levels.");
          }

          recs.push("Provide clean, fresh drinking water at all times.");
          recs.push("Disinfect water lines to prevent bacterial growth.");

          return recs;
        };

        setDetectionImages(detectionsWithImages);
        setFlockSummary(summary);
        setRecommendations(generateRecommendations());
      } catch (error) {
        console.error("Error fetching monitoring data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMonitoringData();
  }, []);

  const getDiseaseDisplayName = (disease: string) => {
    switch (disease.toLowerCase()) {
      case "crd":
        return "Chronic Respiratory Disease";
      case "coryza":
        return "Infectious Coryza";
      default:
        return disease.toUpperCase();
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const predictions = [
    {
      percentage: flockSummary.healthyPercentage,
      title: `${flockSummary.totalHealthy} Healthy Chickens`,
      description:
        "Flock condition is stable and safe, with chickens active and feeding normally",
      bgColor: "bg-[#e8f5e9]",
      textColor: "text-[#2e7d32]",
      titleColor: "text-[#18341a]",
      descriptionColor: "text-[#2e7d32]",
      icon: "/frame-224.svg",
    },
    {
      percentage: flockSummary.atRiskPercentage,
      title: `${flockSummary.totalAtRisk} Chickens at Risk`,
      description:
        "Potential stress factors detected; monitor flock closely to prevent issues.",
      bgColor: "bg-[#fff8e1]",
      textColor: "text-[#ffa500]",
      titleColor: "text-[#18341a]",
      descriptionColor: "text-[#e49300]",
      icon: "/frame-226.svg",
    },
    {
      percentage: flockSummary.criticalPercentage,
      title: `${flockSummary.totalCritical} Critical Cases`,
      description:
        "Immediate attention required; implement containment measures.",
      bgColor: "bg-[#ffebee]",
      textColor: "text-[#ff0000]",
      titleColor: "text-[#18341a]",
      descriptionColor: "text-[#ff4949]",
      icon: "/frame-229.svg",
    },
  ];

  if (loading) {
    return (
      <div className="w-full max-w-[420px] mx-auto px-3 sm:px-4 flex flex-col bg-[#ffffff] rounded-2xl sm:rounded-3xl overflow-hidden">
        <div className="p-4 sm:p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-4"></div>
            <div className="h-24 sm:h-32 bg-gray-200 rounded mb-2"></div>
            <div className="h-24 sm:h-32 bg-gray-200 rounded mb-2"></div>
            <div className="h-24 sm:h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[420px] mx-auto px-3 sm:px-4 flex flex-col bg-[#ffffff] rounded-2xl sm:rounded-3xl overflow-hidden">
      {/* Header */}
      <div className="mt-3 sm:mt-4 font-paragraph-large-regular font-[number:var(--paragraph-large-regular-font-weight)] text-[#102311] text-sm sm:text-base md:text-[length:var(--paragraph-large-regular-font-size)] tracking-[var(--paragraph-large-regular-letter-spacing)] leading-[var(--paragraph-large-regular-line-height)] [font-style:var(--paragraph-large-regular-font-style)]">
        AI Predictions from Live Feed
      </div>

      {/* Predictions Section */}
      <div className="flex w-full relative mt-2 sm:mt-3 flex-col items-start gap-2 sm:gap-[7px]">
        {predictions.map((prediction, index) => (
          <Card
            key={index}
            className={`w-full min-h-[100px] sm:min-h-[115px] md:h-[129px] ${prediction.bgColor} rounded-2xl sm:rounded-3xl border-none shadow-none overflow-hidden`}
          >
            <CardContent className="p-3 sm:p-4 h-full">
              <div className="flex items-center gap-3 sm:gap-4 md:gap-5 h-full">
                <img
                  className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-[98px] md:h-[98px] flex-shrink-0"
                  alt="Status Icon"
                  src={prediction.icon}
                />

                <div className="flex flex-col flex-1 items-start sm:items-center justify-center min-w-0">
                  <div
                    className={`${prediction.textColor} font-heading-h3-regular font-[number:var(--heading-h3-regular-font-weight)] text-2xl sm:text-3xl md:text-[length:var(--heading-h3-regular-font-size)] text-left sm:text-center tracking-[var(--heading-h3-regular-letter-spacing)] leading-[var(--heading-h3-regular-line-height)] [font-style:var(--heading-h3-regular-font-style)]`}
                  >
                    {prediction.percentage}
                  </div>

                  <div
                    className={`[font-family:'Gilroy-Medium-Medium',Helvetica] font-medium ${prediction.titleColor} text-xs sm:text-sm tracking-[-0.28px] leading-normal mt-0.5 sm:mt-1`}
                  >
                    {prediction.title}
                  </div>

                  <div
                    className={`[font-family:'Poppins',Helvetica] font-normal ${prediction.descriptionColor} text-[7px] sm:text-[8px] text-left sm:text-center tracking-[0] leading-tight sm:leading-normal mt-0.5 sm:mt-1 line-clamp-2`}
                  >
                    {prediction.description}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Latest Disease Detections Section */}
      {detectionImages.length > 0 && (
        <>
          <div className="inline-flex w-full h-6 relative mt-3 sm:mt-4 items-center gap-1 sm:gap-[3px]">
            <div className="relative w-fit [font-family:'Poppins',Helvetica] font-normal text-[#102311] text-sm sm:text-base tracking-[-0.48px] leading-normal">
              Latest Disease Detections
            </div>
            <Camera className="relative w-4 h-4 sm:w-5 sm:h-5 text-[#102311]" />
          </div>

          <div className="w-full relative mt-2 flex flex-col gap-2">
            {detectionImages.map((detection, index) => (
              <Card
                key={detection.id}
                className="w-full min-h-[90px] sm:h-[100px] bg-gradient-to-r from-red-50 to-orange-50 rounded-xl sm:rounded-2xl border border-red-100 shadow-sm overflow-hidden"
              >
                <CardContent className="p-2 sm:p-3 h-full">
                  <div className="flex items-center h-full gap-2 sm:gap-3">
                    <div
                      className="relative w-16 h-16 sm:w-[70px] sm:h-[70px] rounded-lg sm:rounded-xl overflow-hidden border-2 border-white shadow-sm flex-shrink-0 cursor-pointer"
                      onClick={() => setSelectedImage(detection)}
                    >
                      <img
                        src={detection.image_url}
                        alt={`${getDiseaseDisplayName(
                          detection.disease
                        )} Detection`}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "/placeholder-chicken.jpg";
                        }}
                      />
                      <div className="absolute bottom-0.5 right-0.5 sm:bottom-1 sm:right-1 bg-red-600 text-white text-[7px] sm:text-[8px] px-1 sm:px-1.5 py-0.5 rounded-full font-medium">
                        {Math.round(detection.confidence * 100)}%
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col gap-0.5 sm:gap-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="[font-family:'Gilroy-Medium-Medium',Helvetica] font-medium text-[#18341a] text-[10px] sm:text-xs tracking-[-0.2px] truncate">
                          {getDiseaseDisplayName(detection.disease)}
                        </h4>
                        <div
                          className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[7px] sm:text-[8px] font-medium whitespace-nowrap flex-shrink-0 ${
                            detection.risk_level === "CRITICAL"
                              ? "bg-red-100 text-red-800"
                              : detection.risk_level === "HIGH"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {detection.risk_level}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 sm:gap-2 text-[7px] sm:text-[8px] text-gray-600">
                        <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
                        <span className="truncate">
                          {formatTimestamp(detection.timestamp)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 sm:gap-3 text-[7px] sm:text-[8px] text-gray-500">
                        <div className="flex items-center gap-0.5 sm:gap-1">
                          <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
                          <span className="whitespace-nowrap">
                            {detection.temperature.toFixed(1)}°C
                          </span>
                        </div>
                        <div className="truncate">
                          <span>{detection.humidity.toFixed(1)}% Humidity</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Recommendations Section */}
      <div className="inline-flex w-full h-6 relative mt-3 sm:mt-4 items-center gap-1 sm:gap-[3px]">
        <div className="relative w-fit [font-family:'Poppins',Helvetica] font-normal text-[#102311] text-sm sm:text-base tracking-[-0.48px] leading-normal">
          Recommendations
        </div>
        <BotIcon className="relative w-5 h-5 sm:w-6 sm:h-6" />
      </div>

      <Card className="w-full min-h-[100px] sm:h-28 mt-2 sm:mt-2.5 mb-3 sm:mb-4 bg-[#e8f5e9] rounded-xl border-none shadow-none overflow-hidden">
        <CardContent className="p-3 sm:p-4 h-full">
          <div className="[font-family:'Poppins',Helvetica] font-normal text-[#18341a] text-[9px] sm:text-[10px] tracking-[-0.20px] leading-[16px] sm:leading-[19px]">
            <span className="font-light tracking-[-0.02px]">
              Increase airflow in the poultry house to reduce heat stress.
              <br />
              Add electrolytes or vitamins to water to support recovery.
              <br />
              Provide cool, clean drinking water to prevent dehydration.
              <br />
              Disinfect water lines to prevent bacterial growth.
              <br />
              Clean and dry litter to minimize moisture buildup.
            </span>
          </div>
        </CardContent>
      </Card>

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-800" />
            </button>

            {/* Image */}
            <div className="w-full max-h-[60vh] overflow-hidden bg-gray-100">
              <img
                src={selectedImage.image_url}
                alt={`${getDiseaseDisplayName(
                  selectedImage.disease
                )} Detection`}
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "/placeholder-chicken.jpg";
                }}
              />
            </div>

            {/* Details */}
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-gray-900">
                  {getDiseaseDisplayName(selectedImage.disease)}
                </h2>
                <div
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    selectedImage.risk_level === "CRITICAL"
                      ? "bg-red-100 text-red-800"
                      : selectedImage.risk_level === "HIGH"
                      ? "bg-orange-100 text-orange-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {selectedImage.risk_level}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Confidence:</span>
                  <span className="ml-2 font-semibold text-gray-900">
                    {Math.round(selectedImage.confidence * 100)}%
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Temperature:</span>
                  <span className="ml-2 font-semibold text-gray-900">
                    {selectedImage.temperature.toFixed(1)}°C
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Humidity:</span>
                  <span className="ml-2 font-semibold text-gray-900">
                    {selectedImage.humidity.toFixed(1)}%
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Detected:</span>
                  <span className="ml-2 font-semibold text-gray-900">
                    {formatTimestamp(selectedImage.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
