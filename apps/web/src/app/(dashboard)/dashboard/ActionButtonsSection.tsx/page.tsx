"use client"
import React, { useState, useEffect, useRef } from "react";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";

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
  className = ""
}) => {
  const defaultBatches: Batch[] = [
    {
      id: "A",
      label: "Batch A",
      isActive: true,
      icon: "/cbi-chicken.svg",
      streamUrl: "vid1.mp4", // Poultry farm video
      isLiveStream: false
    },
    {
      id: "B", 
      label: "Batch B",
      isActive: false,
      icon: "/cbi-chicken.svg",
      streamUrl: "http://172.20.10.10:8080/?action=stream", // Live stream
      isLiveStream: true
    },
    {
      id: "C",
      label: "Batch C", 
      isActive: false,
      icon: "/cbi-chicken.svg",
      streamUrl: "vid2.mp4", // Another poultry farm video
      isLiveStream: false
    },
  ];

  const [batches, setBatches] = useState<Batch[]>(initialBatches || defaultBatches);
  const [streamError, setStreamError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const activeBatch = batches.find(batch => batch.isActive) || batches[0];

  const handleBatchClick = (batchId: string) => {
    const updatedBatches = batches.map(batch => ({
      ...batch,
      isActive: batch.id === batchId
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

  // Auto-retry for live streams
  useEffect(() => {
    if (streamError && activeBatch.isLiveStream && imgRef.current) {
      const timer = setTimeout(() => {
        setIsLoading(true);
        setStreamError(false);
        const newUrl = `${activeBatch.streamUrl}${activeBatch.streamUrl.includes('?') ? '&' : '?'}t=${Date.now()}`;
        if (imgRef.current) {
          imgRef.current.src = newUrl;
        }
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [streamError, activeBatch]);

  return (
    <div className="w-[600px]">
      {/* Header with batch selection - Same width as token balance component */}
      <div className="bg-white border-2 border-green-400 rounded-2xl p-6 mb-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-center gap-4">
          {batches.map((batch) => (
            <Button
              key={batch.id}
              variant="ghost"
              size="sm"
              onClick={() => handleBatchClick(batch.id)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200
                min-w-[100px] h-auto text-sm font-medium
                ${getBatchClassName(batch)}
              `}
            >
              {batch.icon && (
                <img
                  className="w-5 h-5 flex-shrink-0"
                  alt="Batch icon"
                  src={batch.icon}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              )}
              <span className="whitespace-nowrap">
                {batch.label}
              </span>
            </Button>
          ))}

          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 px-6 py-2 bg-green-50 text-green-600 
                     hover:bg-green-100 rounded-xl border border-green-200 text-sm font-medium
                     transition-all duration-200"
          >
            <span>See more batches</span>
          </Button>
        </div>
      </div>

      {/* Video/Stream container - Same width as above component */}
      <div className="relative bg-gray-900 rounded-2xl overflow-hidden shadow-lg" style={{ aspectRatio: '16/9' }}>
        {/* Live badge - only show for live streams */}
        {activeBatch.isLiveStream && (
          <Badge className="absolute top-6 left-6 z-20 bg-red-500 hover:bg-red-500 text-white 
                           px-3 py-2 rounded-md border-0 shadow-lg">
            <div className="w-3 h-3 bg-white rounded-full mr-2 animate-pulse" />
            <span className="text-sm font-bold tracking-tight">LIVE</span>
          </Badge>
        )}

        {/* Batch indicator */}
        <div className="absolute top-6 right-6 z-20 bg-black/70 text-white px-3 py-2 rounded-md">
          <span className="text-sm font-medium">{activeBatch.label}</span>
        </div>

        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-gray-900 flex items-center justify-center z-10">
            <div className="text-white text-center">
              <div className="animate-spin w-12 h-12 border-3 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-lg">Loading {activeBatch.isLiveStream ? 'live stream' : 'video'}...</p>
            </div>
          </div>
        )}

        {/* Stream error overlay */}
        {streamError && !isLoading && (
          <div className="absolute inset-0 bg-gray-900 flex items-center justify-center z-10">
            <div className="text-white text-center max-w-md px-6">
              <div className="text-6xl mb-6">📹</div>
              <p className="text-xl font-semibold mb-3">
                {activeBatch.isLiveStream ? 'Live Stream Unavailable' : 'Video Unavailable'}
              </p>
              <p className="text-sm text-gray-400 mb-6 break-all">
                Cannot load: {activeBatch.streamUrl}
              </p>
              {activeBatch.isLiveStream && (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin w-5 h-5 border-2 border-green-400 border-t-transparent rounded-full"></div>
                  <span className="text-sm text-green-400">Retrying in 5s...</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Content based on stream type */}
        {activeBatch.isLiveStream ? (
          // Live stream (MJPEG)
          <img 
            ref={imgRef}
            src={activeBatch.streamUrl}
            alt={`Live stream from ${activeBatch.label}`}
            className="w-full h-full object-cover"
            onLoad={handleStreamLoad}
            onError={handleStreamError}
            style={{ 
              display: streamError ? 'none' : 'block'
            }}
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
          />
        ) : (
          // Video file
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
              display: streamError ? 'none' : 'block'
            }}
          >
            <source src={activeBatch.streamUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}

        {/* Stream info overlay */}
        <div className="absolute bottom-6 left-6 bg-black/70 text-white px-4 py-2 rounded-lg">
          <div className="text-sm font-medium">
            {activeBatch.isLiveStream ? 'Live Feed' : 'Recorded Video'} • {activeBatch.label}
          </div>
          <div className="text-xs opacity-75 mt-1">
            {activeBatch.isLiveStream 
              ? activeBatch.streamUrl.split('//')[1]?.split('/')[0] || 'Unknown'
              : 'Poultry Farm Recording'
            }
          </div>
        </div>
      </div>
    </div>
  );
};