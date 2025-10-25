"use client";
import React, { useState, useEffect, useRef } from "react";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { supabase } from "@/lib/supabase";
import Error from "next/error";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface Batch {
  id: string;
  label: string;
  isActive: boolean;
  icon?: string;
  streamUrl: string;
  isLiveStream: boolean;
}

interface ActionButtonsSectionProps {
  batches?: Batch[];
  onBatchSelect?: (batchId: string) => void;
  className?: string;
}

export const ActionButtonsSection: React.FC<ActionButtonsSectionProps> = ({
  batches: initialBatches,
  onBatchSelect,
  className = "",
}) => {
  const defaultBatches: Batch[] = [
    {
      id: "A",
      label: "Batch A",
      isActive: true,
      icon: "/cbi-chicken.svg",
      streamUrl: "vid1.mp4",
      isLiveStream: false,
    },
    {
      id: "B",
      label: "Batch B",
      isActive: false,
      icon: "/cbi-chicken.svg",
      streamUrl: "http://172.20.10.10:8080/?action=stream",
      isLiveStream: true,
    },
    {
      id: "C",
      label: "Batch C",
      isActive: false,
      icon: "/cbi-chicken.svg",
      streamUrl: "vid2.mp4",
      isLiveStream: false,
    },
  ];

  const [batches, setBatches] = useState<Batch[]>(
    initialBatches || defaultBatches
  );
  const [streamError, setStreamError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const router = useRouter();

  const activeBatch = batches.find((batch) => batch.isActive) || batches[0];

  const handleBatchClick = (batchId: string) => {
    const updatedBatches = batches.map((batch) => ({
      ...batch,
      isActive: batch.id === batchId,
    }));
    setBatches(updatedBatches);
    setIsLoading(true);
    setStreamError(false);
    onBatchSelect?.(batchId);
  };

  const getBatchClassName = (batch: Batch) => {
    if (batch.isActive) {
      return "bg-gradient-to-b from-green-600 to-green-500 text-white shadow-lg";
    }
    return "bg-green-50 text-green-600 hover:bg-green-100 border border-green-200";
  };

  const handleStreamLoad = () => {
    setIsLoading(false);
    setStreamError(false);
  };

  const handleStreamError = () => {
    setIsLoading(false);
    setStreamError(true);
  };

  const handleVideoLoad = () => {
    setIsLoading(false);
    setStreamError(false);
  };

  const handleVideoError = () => {
    setIsLoading(false);
    setStreamError(true);
  };

  useEffect(() => {
    if (streamError && activeBatch.isLiveStream && imgRef.current) {
      const timer = setTimeout(() => {
        setIsLoading(true);
        setStreamError(false);
        const newUrl = `${activeBatch.streamUrl}${
          activeBatch.streamUrl.includes("?") ? "&" : "?"
        }t=${Date.now()}`;
        if (imgRef.current) {
          imgRef.current.src = newUrl;
        }
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [streamError, activeBatch]);

  return (
    <div className={`w-full max-w-screen mx-auto  ${className}`}>
      {/* Header with batch selection */}
      <div className="bg-white border-2 border-green-400 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 md:gap-4">
          {batches.map((batch) => (
            <Button
              key={batch.id}
              variant="ghost"
              size="sm"
              onClick={() => handleBatchClick(batch.id)}
              className={`
                flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 
                rounded-lg sm:rounded-xl transition-all duration-200
                min-w-[80px] sm:min-w-[90px] md:min-w-[100px] h-auto 
                text-xs sm:text-sm font-medium
                ${getBatchClassName(batch)}
              `}
            >
              {batch.icon && (
                <img
                  className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                  alt="Batch icon"
                  src={batch.icon}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
              )}
              <span className="whitespace-nowrap">{batch.label}</span>
            </Button>
          ))}

          {/* <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 
                     bg-green-50 text-green-600 hover:bg-green-100 
                     rounded-lg sm:rounded-xl border border-green-200 
                     text-xs sm:text-sm font-medium transition-all duration-200"
          >
            <span className="whitespace-nowrap">See more batches</span>
          </Button> */}
        </div>
      </div>

      {/* Video/Stream container */}
      <div
        className="relative bg-gray-900 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg"
        style={{ aspectRatio: "16/9" }}
      >
        {/* Live badge */}
        {activeBatch.isLiveStream && (
          <Badge
            className="absolute top-3 left-3 sm:top-4 sm:left-4 md:top-6 md:left-6 z-20 
                     bg-red-500 hover:bg-red-500 text-white 
                     px-2 py-1 sm:px-2.5 sm:py-1.5 md:px-3 md:py-2 
                     rounded-md border-0 shadow-lg"
          >
            <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 bg-white rounded-full mr-1.5 sm:mr-2 animate-pulse" />
            <span className="text-[10px] sm:text-xs md:text-sm font-bold tracking-tight">
              LIVE
            </span>
          </Badge>
        )}

        {/* Batch indicator */}
        <div
          className="absolute top-3 right-3 sm:top-4 sm:right-4 md:top-6 md:right-6 z-20 
                      bg-black/70 text-white px-2 py-1 sm:px-2.5 sm:py-1.5 md:px-3 md:py-2 
                      rounded-md"
        >
          <span className="text-[10px] sm:text-xs md:text-sm font-medium">
            {activeBatch.label}
          </span>
        </div>

        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-gray-900 flex items-center justify-center z-10">
            <div className="text-white text-center px-4">
              <div
                className="animate-spin w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 
                            border-2 sm:border-3 border-white border-t-transparent 
                            rounded-full mx-auto mb-3 sm:mb-4"
              ></div>
              <p className="text-sm sm:text-base md:text-lg">
                Loading {activeBatch.isLiveStream ? "live stream" : "video"}...
              </p>
            </div>
          </div>
        )}

        {/* Stream error overlay */}
        {streamError && !isLoading && (
          <div className="absolute inset-0 bg-gray-900 flex items-center justify-center z-10">
            <div className="text-white text-center max-w-[90%] sm:max-w-md px-4 sm:px-6">
              <div className="text-4xl sm:text-5xl md:text-6xl mb-4 sm:mb-6">
                📹
              </div>
              <p className="text-base sm:text-lg md:text-xl font-semibold mb-2 sm:mb-3">
                {activeBatch.isLiveStream
                  ? "Live Stream Unavailable"
                  : "Video Unavailable"}
              </p>
              <p className="text-xs sm:text-sm text-gray-400 mb-4 sm:mb-6 break-all">
                Cannot load: {activeBatch.streamUrl}
              </p>
              {activeBatch.isLiveStream && (
                <div className="flex items-center justify-center gap-2">
                  <div
                    className="animate-spin w-4 h-4 sm:w-5 sm:h-5 
                                border-2 border-green-400 border-t-transparent rounded-full"
                  ></div>
                  <span className="text-xs sm:text-sm text-green-400">
                    Retrying in 5s...
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Content based on stream type */}
        {activeBatch.isLiveStream ? (
          <img
            ref={imgRef}
            src={activeBatch.streamUrl}
            alt={`Live stream from ${activeBatch.label}`}
            className="w-full h-full object-cover"
            onLoad={handleStreamLoad}
            onError={handleStreamError}
            style={{
              display: streamError ? "none" : "block",
            }}
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
          />
        ) : (
          <video
            ref={videoRef}
            src={activeBatch.streamUrl}
            className="w-full h-full object-cover"
            controls
            autoPlay
            muted
            loop
            onLoadedData={handleVideoLoad}
            onError={handleVideoError}
            style={{
              display: streamError ? "none" : "block",
            }}
          >
            <source src={activeBatch.streamUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}

        {/* Stream info overlay */}
        <div
          className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 md:bottom-6 md:left-6 
                      bg-black/70 text-white px-2.5 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2 
                      rounded-md sm:rounded-lg max-w-[calc(100%-24px)] sm:max-w-[calc(100%-32px)] md:max-w-none"
        >
          <div className="text-[10px] sm:text-xs md:text-sm font-medium truncate">
            {activeBatch.isLiveStream ? "Live Feed" : "Recorded Video"} •{" "}
            {activeBatch.label}
          </div>
          <div className="text-[9px] sm:text-[10px] md:text-xs opacity-75 mt-0.5 sm:mt-1 truncate">
            {activeBatch.isLiveStream
              ? activeBatch.streamUrl.split("//")[1]?.split("/")[0] || "Unknown"
              : "Poultry Farm Recording"}
          </div>
        </div>
      </div>
    </div>
  );
};
