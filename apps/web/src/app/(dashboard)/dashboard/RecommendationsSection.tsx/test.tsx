"use client"

import { BotIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Card, CardContent } from "../../../../components/ui/card";
import { 
  ChickenMonitoring, 
  fetchChickenMonitoring,
  subscribeToChickenMonitoring
} from "../../../../lib/supabase";

interface PredictionData {
  percentage: string;
  title: string;
  description: string;
  bgColor: string;
  textColor: string;
  titleColor: string;
  descriptionColor: string;
  icon: string;
}

export const RecommendationsSection = () => {
  const [latestData, setLatestData] = useState<ChickenMonitoring | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch latest monitoring data
  const fetchLatestData = async () => {
    try {
      setLoading(true);
      
      // Get the most recent monitoring record
      const monitoringData = await fetchChickenMonitoring(1);
      
      if (monitoringData && monitoringData.length > 0) {
        setLatestData(monitoringData[0]);
      } else {
        setLatestData(null);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch monitoring data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestData();

    // Set up real-time subscription
    const subscription = subscribeToChickenMonitoring((payload) => {
      console.log('Real-time update:', payload);
      if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
        setLatestData(payload.new as ChickenMonitoring);
      }
    });

    return () => {
      if (subscription && subscription.unsubscribe) {
        subscription.unsubscribe();
      }
    };
  }, []);

  // Generate predictions based on real data
  const generatePredictions = (): PredictionData[] => {
    if (!latestData) {
      return [
        {
          percentage: "0%",
          title: "No Data Available",
          description: "Waiting for monitoring data...",
          bgColor: "bg-gray-100",
          textColor: "text-gray-500",
          titleColor: "text-gray-700",
          descriptionColor: "text-gray-500",
          icon: "/frame-224.svg",
        }
      ];
    }

    const total = latestData.normal_detected + latestData.coryza_detected + latestData.crd_detected;
    const predictions: PredictionData[] = [];

    // Healthy chickens
    if (latestData.normal_detected > 0) {
      const percentage = total > 0 ? ((latestData.normal_detected / total) * 100).toFixed(1) : "0";
      predictions.push({
        percentage: `${percentage}%`,
        title: `${latestData.normal_detected} Healthy Chickens`,
        description: "Flock condition is stable and safe, with chickens active and feeding normally",
        bgColor: "bg-[#e8f5e9]",
        textColor: "text-[#2e7d32]",
        titleColor: "text-[#18341a]",
        descriptionColor: "text-[#2e7d32]",
        icon: "/frame-224.svg",
      });
    }

    // Coryza detected (medium risk)
    if (latestData.coryza_detected > 0) {
      const percentage = total > 0 ? ((latestData.coryza_detected / total) * 100).toFixed(1) : "0";
      predictions.push({
        percentage: `${percentage}%`,
        title: `${latestData.coryza_detected} Chickens with Coryza`,
        description: "Infectious coryza detected; isolate affected birds and provide treatment.",
        bgColor: "bg-[#fff8e1]",
        textColor: "text-[#ffa500]",
        titleColor: "text-[#18341a]",
        descriptionColor: "text-[#e49300]",
        icon: "/frame-226.svg",
      });
    }

    // CRD detected (high risk)
    if (latestData.crd_detected > 0) {
      const percentage = total > 0 ? ((latestData.crd_detected / total) * 100).toFixed(1) : "0";
      predictions.push({
        percentage: `${percentage}%`,
        title: `${latestData.crd_detected} Chickens with CRD`,
        description: "Chronic Respiratory Disease detected; immediate veterinary attention required.",
        bgColor: "bg-[#ffebee]",
        textColor: "text-[#ff0000]",
        titleColor: "text-[#18341a]",
        descriptionColor: "text-[#ff4949]",
        icon: "/frame-229.svg",
      });
    }

    return predictions.length > 0 ? predictions : [{
      percentage: "0%",
      title: "No Detections",
      description: "No chickens detected in current monitoring session.",
      bgColor: "bg-gray-100",
      textColor: "text-gray-500",
      titleColor: "text-gray-700",
      descriptionColor: "text-gray-500",
      icon: "/frame-224.svg",
    }];
  };

  // Generate recommendations based on data
  const generateRecommendations = (): string => {
    if (!latestData) return "No data available for recommendations.";

    const recommendations: string[] = [];
    
    // Environmental recommendations
    if (latestData.temperature > 32) {
      recommendations.push("Reduce temperature - install ventilation or cooling systems.");
    } else if (latestData.temperature < 18) {
      recommendations.push("Increase temperature - provide heating to prevent cold stress.");
    }

    if (latestData.humidity > 80) {
      recommendations.push("Reduce humidity - improve ventilation and remove wet litter.");
    } else if (latestData.humidity < 50) {
      recommendations.push("Increase humidity - add moisture to prevent respiratory issues.");
    }

    // Disease-specific recommendations
    if (latestData.coryza_detected > 0) {
      recommendations.push("Treat coryza - isolate affected birds and administer antibiotics.");
      recommendations.push("Disinfect water lines to prevent bacterial spread.");
    }

    if (latestData.crd_detected > 0) {
      recommendations.push("CRD treatment - contact veterinarian immediately.");
      recommendations.push("Improve air quality and reduce dust in the environment.");
    }

    // Risk-based recommendations
    if (latestData.outbreak_risk > 0.7) {
      recommendations.push("High risk alert - implement biosecurity measures immediately.");
      recommendations.push("Monitor flock closely and separate any sick birds.");
    }

    // Alert message from database
    if (latestData.alert_message) {
      recommendations.push(`System Alert: ${latestData.alert_message}`);
    }

    // Default recommendations if no specific issues
    if (recommendations.length === 0) {
      recommendations.push(
        "Maintain current care routine - flock appears healthy.",
        "Continue regular monitoring and maintain clean environment.",
        "Ensure fresh water and proper nutrition are available."
      );
    }

    return recommendations.join("\n");
  };

  const predictions = generatePredictions();
  const recommendations = generateRecommendations();

  if (loading) {
    return (
      <div className="w-full max-w-[420px] flex flex-col bg-[#ffffff] rounded-3xl overflow-hidden p-6">
        <div className="text-center text-gray-500">Loading monitoring data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-[420px] flex flex-col bg-[#ffffff] rounded-3xl overflow-hidden p-6">
        <div className="text-center text-red-500">Error: {error}</div>
        <button 
          onClick={fetchLatestData}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[420px] flex flex-col bg-[#ffffff] rounded-3xl overflow-hidden">
      <div className="ml-[21px] w-[255px] h-[27px] mt-[13px] font-paragraph-large-regular font-[number:var(--paragraph-large-regular-font-weight)] text-[#102311] text-[length:var(--paragraph-large-regular-font-size)] tracking-[var(--paragraph-large-regular-letter-spacing)] leading-[var(--paragraph-large-regular-line-height)] [font-style:var(--paragraph-large-regular-font-style)]">
        AI Predictions from Live Feed
      </div>

      {/* Environmental Data Display */}
      {latestData && (
        <div className="ml-[21px] mr-[21px] mt-2 p-3 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-600 grid grid-cols-2 gap-2">
            <div>Temperature: {latestData.temperature.toFixed(1)}°C</div>
            <div>Humidity: {latestData.humidity.toFixed(1)}%</div>
            <div>Risk Level: {latestData.risk_level}</div>
            <div>Outbreak Risk: {(latestData.outbreak_risk * 100).toFixed(1)}%</div>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Last updated: {new Date(latestData.timestamp).toLocaleString()}
          </div>
          <div className="text-xs text-blue-600 mt-1">
            Session ID: {latestData.detection_id || 'N/A'} | Confidence: {latestData.confidence ? `${(latestData.confidence * 100).toFixed(1)}%` : 'N/A'}
          </div>
        </div>
      )}

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
                  alt="Frame"
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

      <div className="inline-flex ml-[21px] w-[174px] h-6 relative mt-[11px] items-center gap-[3px]">
        <div className="relative w-fit mt-[-1.00px] [font-family:'Poppins',Helvetica] font-normal text-[#102311] text-base tracking-[-0.48px] leading-[normal]">
          Recommendations
        </div>

        <BotIcon className="relative w-6 h-6" />
      </div>

      <Card className="ml-[21px] w-[377px] h-auto min-h-28 mt-2.5 mb-4 bg-[#e8f5e9] rounded-xl border-none shadow-none overflow-hidden">
        <CardContent className="p-0 h-full">
          <div className="mt-[9px] w-[350px] ml-1.5 mb-3 [font-family:'Poppins',Helvetica] font-normal text-[#18341a] text-[10px] tracking-[-0.20px] leading-[19px]">
            <span className="font-light tracking-[-0.02px] whitespace-pre-line">
              {recommendations}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};