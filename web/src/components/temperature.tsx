import React from "react";
import { Thermometer, Droplets, AlertTriangle } from "lucide-react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";
import { Doughnut, Line } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler
);

interface TemperatureCardProps {
  temperature: number;
  status: "Normal" | "Warning" | "Critical";
  range: string;
  source: string;
}

interface HumidityCardProps {
  humidityData: number[];
  status: "Normal" | "Warning" | "Critical";
  range: string;
  source: string;
}

export const TemperatureCard: React.FC<TemperatureCardProps> = ({
  temperature,
  status,
  range,
  source,
}) => {
  // Calculate percentage for the gauge
  const [min, max] = range.split("-").map(Number);
  const percentage = ((temperature - min) / (max - min)) * 100;
  const clampedPercentage = Math.max(0, Math.min(100, percentage));

  // Determine colors based on status
  const getStatusColor = () => {
    if (status === "Critical") return "text-red-600";
    if (status === "Warning") return "text-orange-500";
    return "text-green-600";
  };

  // Chart.js doughnut configuration
  const data = {
    datasets: [
      {
        data: [clampedPercentage, 100 - clampedPercentage],
        backgroundColor: [
          clampedPercentage < 50
            ? "#22c55e"
            : clampedPercentage < 75
            ? "#f59e0b"
            : "#ef4444",
          "#e5e7eb",
        ],
        borderWidth: 0,
        cutout: "75%",
        circumference: 360,
        rotation: -90,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-lg w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">
            Poultry Temperature
          </h2>
          <Thermometer className="w-5 h-5 sm:w-6 sm:h-6 text-green-700" />
        </div>
        <button className="px-4 sm:px-6 py-1.5 sm:py-2 bg-white text-green-700 rounded-full font-semibold text-xs sm:text-sm hover:bg-green-50 transition-colors shadow-md whitespace-nowrap">
          Quick AI Analysis
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-6 sm:gap-8">
        {/* Circular Temperature Gauge using Chart.js */}
        <div className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 flex-shrink-0">
          <Doughnut data={data} options={options} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-800">
                {temperature}°C
              </div>
            </div>
          </div>
        </div>

        {/* Status Information */}
        <div className="flex flex-col gap-4 sm:gap-5 lg:gap-6 w-full lg:w-auto lg:ml-8">
          <div className="flex items-center gap-2 sm:gap-3 justify-center lg:justify-start">
            <span className="text-gray-700 font-semibold text-sm sm:text-base lg:text-lg">
              Status:
            </span>
            <span
              className={`${getStatusColor()} font-bold text-sm sm:text-base lg:text-lg flex items-center gap-2`}
            >
              {status}
              {status !== "Normal" && (
                <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 justify-center lg:justify-start">
            <span className="text-gray-700 font-semibold text-sm sm:text-base lg:text-lg">
              Range:
            </span>
            <span className="text-gray-900 font-bold text-sm sm:text-base lg:text-lg">
              {range}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 justify-center lg:justify-start">
            <span className="text-gray-700 font-semibold text-sm sm:text-base lg:text-lg">
              Source:
            </span>
            <span className="text-gray-900 font-bold text-sm sm:text-base lg:text-lg">
              {source}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const HumidityCard: React.FC<HumidityCardProps> = ({
  humidityData,
  status,
  range,
  source,
}) => {
  const getStatusColor = () => {
    if (status === "Critical") return "text-red-600";
    if (status === "Warning") return "text-orange-500";
    return "text-green-600";
  };

  // Chart.js line chart configuration
  const data = {
    labels: humidityData.map((_, index) => ""),
    datasets: [
      {
        data: humidityData,
        borderColor: "#22c55e",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 4,
        pointBackgroundColor: "#22c55e",
        pointBorderColor: "#22c55e",
        pointHoverRadius: 6,
        pointHoverBackgroundColor: "#22c55e",
        pointHoverBorderColor: "#fff",
        pointHoverBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: "#22c55e",
        padding: 12,
        displayColors: false,
        callbacks: {
          title: () => "",
          label: (context: any) => `${context.parsed.y}%`,
        },
      },
    },
    scales: {
      x: {
        display: false,
        grid: {
          display: false,
        },
      },
      y: {
        display: false,
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-lg w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">
            Poultry Humidity
          </h2>
          <Droplets className="w-5 h-5 sm:w-6 sm:h-6 text-green-700" />
        </div>
        <button className="px-4 sm:px-6 py-1.5 sm:py-2 bg-white text-green-700 rounded-full font-semibold text-xs sm:text-sm hover:bg-green-50 transition-colors shadow-md whitespace-nowrap">
          Quick AI Analysis
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-6 sm:gap-8">
        {/* Humidity Line Chart using Chart.js */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 shadow-inner w-full sm:w-80 md:w-96 lg:w-[28rem] h-32 sm:h-36 md:h-40 lg:h-44">
          <Line data={data} options={options} />
        </div>

        {/* Status Information */}
        <div className="flex flex-col gap-4 sm:gap-5 lg:gap-6 w-full lg:w-auto lg:ml-8">
          <div className="flex items-center gap-2 sm:gap-3 justify-center lg:justify-start">
            <span className="text-gray-700 font-semibold text-sm sm:text-base lg:text-lg">
              Status:
            </span>
            <span
              className={`${getStatusColor()} font-bold text-sm sm:text-base lg:text-lg flex items-center gap-2`}
            >
              {status}
              {status !== "Normal" && (
                <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 justify-center lg:justify-start">
            <span className="text-gray-700 font-semibold text-sm sm:text-base lg:text-lg">
              Range:
            </span>
            <span className="text-gray-900 font-bold text-sm sm:text-base lg:text-lg">
              {range}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 justify-center lg:justify-start">
            <span className="text-gray-700 font-semibold text-sm sm:text-base lg:text-lg">
              Source:
            </span>
            <span className="text-gray-900 font-bold text-sm sm:text-base lg:text-lg">
              {source}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
