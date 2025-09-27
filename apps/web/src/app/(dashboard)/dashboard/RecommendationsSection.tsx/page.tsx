"use client"
import React, { useState, useEffect } from "react";
import { BotIcon, AlertTriangle, Camera, Clock, TrendingUp } from "lucide-react";
import { Card, CardContent } from "../../../../components/ui/card";
import { fetchChickenMonitoring, ChickenMonitoring } from "../../../../lib/supabase";

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
  const [flockSummary, setFlockSummary] = useState<FlockSummary>({
    totalHealthy: 0,
    totalAtRisk: 0,
    totalCritical: 0,
    healthyPercentage: "0%",
    atRiskPercentage: "0%",
    criticalPercentage: "0%"
  });
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  useEffect(() => {
    const fetchMonitoringData = async () => {
      try {
        setLoading(true);
        
        // Fetch latest 50 records to get a good sample
        const monitoringData = await fetchChickenMonitoring(50);
        
        // Filter for records with actual disease detections and images (first 5 for demo)
        const detectionsWithImages = monitoringData
          .filter(record => 
            record.image_url && 
            record.detected_disease && 
            (record.detected_disease === 'crd' || record.detected_disease === 'coryza') &&
            record.confidence && 
            record.confidence > 0.5 // Only show confident detections
          )
          .slice(0, 5)
          .map(record => ({
            id: record.id,
            disease: record.detected_disease!,
            confidence: record.confidence!,
            image_url: record.image_url!,
            timestamp: record.timestamp,
            risk_level: record.risk_level,
            temperature: record.temperature,
            humidity: record.humidity
          }));

        // Calculate flock summary from recent data (last 20 records)
        const recentData = monitoringData.slice(0, 20);
        let totalHealthy = 0;
        let totalAtRisk = 0;
        let totalCritical = 0;

        recentData.forEach(record => {
          const normalCount = record.normal_detected || 0;
          const coryzeCount = record.coryza_detected || 0;
          const crdCount = record.crd_detected || 0;
          
          totalHealthy += normalCount;
          
          if (record.risk_level === 'HIGH' || record.risk_level === 'CRITICAL') {
            totalCritical += (coryzeCount + crdCount);
          } else if (record.risk_level === 'MEDIUM') {
            totalAtRisk += (coryzeCount + crdCount);
          } else {
            totalAtRisk += (coryzeCount + crdCount);
          }
        });

        const total = totalHealthy + totalAtRisk + totalCritical;
        const summary: FlockSummary = {
          totalHealthy,
          totalAtRisk,
          totalCritical,
          healthyPercentage: total > 0 ? `${Math.round((totalHealthy / total) * 100)}%` : "0%",
          atRiskPercentage: total > 0 ? `${Math.round((totalAtRisk / total) * 100)}%` : "0%",
          criticalPercentage: total > 0 ? `${Math.round((totalCritical / total) * 100)}%` : "0%"
        };

        // Generate recommendations based on detections
        const generateRecommendations = () => {
          const recs = [];
          const hasCoryza = detectionsWithImages.some(d => d.disease === 'coryza');
          const hasCrd = detectionsWithImages.some(d => d.disease === 'crd');
          const avgTemp = recentData.reduce((acc, r) => acc + r.temperature, 0) / recentData.length;
          const avgHumidity = recentData.reduce((acc, r) => acc + r.humidity, 0) / recentData.length;

          if (hasCoryza) {
            recs.push("Isolate affected birds and improve ventilation to prevent coryza spread.");
            recs.push("Administer appropriate antibiotics as prescribed by veterinarian.");
          }
          
          if (hasCrd) {
            recs.push("Implement strict biosecurity measures to contain respiratory disease.");
            recs.push("Monitor air quality and reduce dust levels in poultry house.");
          }

          if (avgTemp > 30) {
            recs.push("Increase airflow in the poultry house to reduce heat stress.");
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
        console.error('Error fetching monitoring data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMonitoringData();
  }, []);

  const getDiseaseDisplayName = (disease: string) => {
    switch (disease.toLowerCase()) {
      case 'crd':
        return 'Chronic Respiratory Disease';
      case 'coryza':
        return 'Infectious Coryza';
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
      description: "Flock condition is stable and safe, with chickens active and feeding normally",
      bgColor: "bg-[#e8f5e9]",
      textColor: "text-[#2e7d32]",
      titleColor: "text-[#18341a]",
      descriptionColor: "text-[#2e7d32]",
      icon: "/frame-224.svg",
    },
    {
      percentage: flockSummary.atRiskPercentage,
      title: `${flockSummary.totalAtRisk} Chickens at Risk`,
      description: "Potential stress factors detected; monitor flock closely to prevent issues.",
      bgColor: "bg-[#fff8e1]",
      textColor: "text-[#ffa500]",
      titleColor: "text-[#18341a]",
      descriptionColor: "text-[#e49300]",
      icon: "/frame-226.svg",
    },
    {
      percentage: flockSummary.criticalPercentage,
      title: `${flockSummary.totalCritical} Critical Cases`,
      description: "Immediate attention required; implement containment measures.",
      bgColor: "bg-[#ffebee]",
      textColor: "text-[#ff0000]",
      titleColor: "text-[#18341a]",
      descriptionColor: "text-[#ff4949]",
      icon: "/frame-229.svg",
    },
  ];

  if (loading) {
    return (
      <div className="w-full max-w-[420px] flex flex-col bg-[#ffffff] rounded-3xl overflow-hidden">
        <div className="ml-[21px] mt-[13px] p-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-4"></div>
            <div className="h-32 bg-gray-200 rounded mb-2"></div>
            <div className="h-32 bg-gray-200 rounded mb-2"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[420px] flex flex-col bg-[#ffffff] rounded-3xl overflow-hidden">
      <div className="ml-[21px] w-[255px] h-[27px] mt-[13px] font-paragraph-large-regular font-[number:var(--paragraph-large-regular-font-weight)] text-[#102311] text-[length:var(--paragraph-large-regular-font-size)] tracking-[var(--paragraph-large-regular-letter-spacing)] leading-[var(--paragraph-large-regular-line-height)] [font-style:var(--paragraph-large-regular-font-style)]">
        AI Predictions from Live Feed
      </div>

      {/* Predictions Section */}
      <div className="flex ml-[21px] w-[377px] relative mt-1.5 flex-col items-start gap-[7px]">
        {predictions.map((prediction, index) => (
          <Card
            key={index}
            className={`w-full h-[129px] ${prediction.bgColor} rounded-3xl border-none shadow-none overflow-hidden`}
          >
            <CardContent className="p-0 h-full">
              <div className="inline-flex items-center gap-5 relative top-[calc(50.00%_-_48px)] left-[calc(50.00%_-_168px)]">
                <img
                  className="relative w-[98px] h-[98px]"
                  alt="Status Icon"
                  src={prediction.icon}
                />

                <div className="flex flex-col w-[219px] items-center relative">
                  <div
                    className={`${prediction.textColor} relative self-stretch mt-[-1.00px] font-heading-h3-regular font-[number:var(--heading-h3-regular-font-weight)] text-[length:var(--heading-h3-regular-font-size)] text-center tracking-[var(--heading-h3-regular-letter-spacing)] leading-[var(--heading-h3-regular-line-height)] [font-style:var(--heading-h3-regular-font-style)]`}
                  >
                    {prediction.percentage}
                  </div>

                  <div
                    className={`relative w-fit [font-family:'Gilroy-Medium-Medium',Helvetica] font-medium ${prediction.titleColor} text-sm tracking-[-0.28px] leading-[normal]`}
                  >
                    {prediction.title}
                  </div>

                  <div
                    className={`relative w-[206px] [font-family:'Poppins',Helvetica] font-normal ${prediction.descriptionColor} text-[8px] text-center tracking-[0] leading-[normal]`}
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
          <div className="inline-flex ml-[21px] w-[300px] h-6 relative mt-[15px] items-center gap-[3px]">
            <div className="relative w-fit mt-[-1.00px] [font-family:'Poppins',Helvetica] font-normal text-[#102311] text-base tracking-[-0.48px] leading-[normal]">
              Latest Disease Detections
            </div>
            <Camera className="relative w-5 h-5 text-[#102311]" />
          </div>

          <div className="ml-[21px] w-[377px] relative mt-2 flex flex-col gap-2">
            {detectionImages.map((detection, index) => (
              <Card 
                key={detection.id} 
                className="w-full h-[100px] bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl border border-red-100 shadow-sm overflow-hidden"
              >
                <CardContent className="p-0 h-full">
                  <div className="flex items-center h-full px-3 gap-3">
                    <div className="relative w-[70px] h-[70px] rounded-xl overflow-hidden border-2 border-white shadow-sm">
                      <img
                        src={detection.image_url}
                        alt={`${getDiseaseDisplayName(detection.disease)} Detection`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder-chicken.jpg';
                        }}
                      />
                      <div className="absolute bottom-1 right-1 bg-red-600 text-white text-[8px] px-1.5 py-0.5 rounded-full font-medium">
                        {Math.round(detection.confidence * 100)}%
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <h4 className="[font-family:'Gilroy-Medium-Medium',Helvetica] font-medium text-[#18341a] text-xs tracking-[-0.2px]">
                          {getDiseaseDisplayName(detection.disease)}
                        </h4>
                        <div className={`px-2 py-1 rounded-full text-[8px] font-medium ${
                          detection.risk_level === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                          detection.risk_level === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {detection.risk_level}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-[8px] text-gray-600">
                        <Clock className="w-3 h-3" />
                        <span>{formatTimestamp(detection.timestamp)}</span>
                      </div>
                      
                      <div className="flex items-center gap-3 text-[8px] text-gray-500">
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          <span>{detection.temperature.toFixed(1)}°C</span>
                        </div>
                        <div>
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
      <div className="inline-flex ml-[21px] w-[174px] h-6 relative mt-[15px] items-center gap-[3px]">
        <div className="relative w-fit mt-[-1.00px] [font-family:'Poppins',Helvetica] font-normal text-[#102311] text-base tracking-[-0.48px] leading-[normal]">
          Recommendations
        </div>
        <BotIcon className="relative w-6 h-6" />
      </div>

      <Card className="ml-[21px] w-[377px] min-h-28 mt-2.5 bg-[#e8f5e9] rounded-xl border-none shadow-none overflow-hidden mb-4">
        <CardContent className="p-0 h-full">
          <div className="mt-[9px] w-[350px] ml-3 [font-family:'Poppins',Helvetica] font-normal text-[#18341a] text-[10px] tracking-[-0.20px] leading-[19px]">
            <span className="font-light tracking-[-0.02px]">
              {recommendations.slice(0, 6).map((rec, index) => (
                <React.Fragment key={index}>
                  {rec}
                  {index < recommendations.slice(0, 6).length - 1 && <br />}
                </React.Fragment>
              ))}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};