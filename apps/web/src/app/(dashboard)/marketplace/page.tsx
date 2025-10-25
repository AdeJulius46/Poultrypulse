"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  Search,
  Upload,
  Volume2,
  VolumeX,
  ShoppingBag,
  ShoppingCart,
  Star,
} from "lucide-react";
import DashboardHeader from "@/components/layout/dashboardHeader";
import { useRouter } from "next/navigation";

// Mock DashboardHeader component

export default function MarketplacePage() {
  const router = useRouter();
  const [currentVideo, setCurrentVideo] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const videos = [
    {
      id: 1,
      username: "Baker Farms",
      description:
        "Healthy, free-range chickens with complete health monitoring",
      ratings: "4.8",
      comments: "123",
      bookmarks: "679",
      shares: "140",
      videoUrl: "vid1.mp4",
    },
    {
      id: 2,
      username: "Moyin-oluwa Farms",
      description: "Big Turkeys",
      ratings: "12.5K",
      comments: "234",
      bookmarks: "890",
      shares: "245",
      videoUrl:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    },
    {
      id: 3,
      username: "Maxwell Eggs",
      description: "Morning workout routine 💪 #fitness #workout #motivation",
      ratings: "9.8K",
      comments: "156",
      bookmarks: "432",
      shares: "178",
      videoUrl:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    },
    {
      id: 4,
      username: "Big Chicken Farms",
      description: "Hidden gem in Bali 🌴 #travel #bali #paradise",
      ratings: "15.2K",
      comments: "289",
      bookmarks: "1.2K",
      shares: "456",
      videoUrl:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    },
    {
      id: 5,
      username: "pet.lovers",
      description: "Cutest puppy ever! 🐶 #puppy #cute #dogs",
      ratings: "22.1K",
      comments: "567",
      bookmarks: "2.3K",
      shares: "789",
      videoUrl:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    },
  ];

  const popularFarms = [
    {
      id: 1,
      name: "Jireh Farms",
      ratings: "4.5",
    },
    {
      id: 2,
      name: "Garon Farms",
      ratings: "4.5",
    },
    {
      id: 3,
      name: "Maxwell Farms",
      ratings: "4.5",
    },
    {
      id: 4,
      name: "Victor Farms",
      ratings: "4.5",
    },
  ];

  type Video = {
    id: number;
    username: string;
    description: string;
    ratings: string;
    comments: string;
    bookmarks: string;
    shares: string;
    videoUrl: string;
  };

  type VideoCardProps = {
    video: Video;
    index?: number;
    isActive?: boolean;
  };

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Handle scroll for mobile
  useEffect(() => {
    const handleScroll = (e: Event) => {
      if (!isMobile) return;

      const target = e.target as HTMLElement;
      const scrollTop = target.scrollTop;
      const videoHeight = window.innerHeight;
      const newIndex = Math.round(scrollTop / videoHeight);

      if (newIndex !== currentVideo && newIndex < videos.length) {
        setCurrentVideo(newIndex);
      }
    };

    const container = document.getElementById("video-container");
    if (container && isMobile) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [isMobile, currentVideo, videos.length]);

  const scrollToVideo = (index: number) => {
    if (isMobile) {
      const container = document.getElementById("video-container");
      container?.scrollTo({
        top: index * window.innerHeight,
        behavior: "smooth",
      });
    } else {
      setCurrentVideo(index);
    }
  };

  const VideoCard: React.FC<VideoCardProps> = ({ video, isActive }) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const el = videoRef.current;
      if (el && isActive && !hasError) {
        const playPromise = el.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log("Video playing successfully");
            })
            .catch((err) => {
              console.log("Play error:", err);
              setTimeout(() => {
                el.play().catch((e) => console.log("Retry failed:", e));
              }, 500);
            });
        }
      } else if (el && !isActive) {
        el.pause();
      }
    }, [isActive, hasError]);

    return (
      <div
        className={`relative ${
          isMobile
            ? "h-screen w-full flex-shrink-0 snap-start"
            : "h-full w-full"
        } bg-white flex items-center justify-center`}
      >
        {isLoading && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
            <div className="text-black text-lg">Loading video...</div>
          </div>
        )}

        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
            <div className="text-white text-center">
              <p className="text-lg mb-2">Failed to load video</p>
              <p className="text-sm text-gray-400">{video.videoUrl}</p>
            </div>
          </div>
        )}

        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <video
            ref={videoRef}
            src={video.videoUrl}
            className="w-full h-full object-cover"
            controls
            autoPlay
            muted
            loop
            onLoadedData={() => {
              console.log("Video loaded:", video.videoUrl);
              setIsLoading(false);
              setHasError(false);
            }}
            onError={(e) => {
              console.error("Video error:", e);
              console.log("Failed to load:", video.videoUrl);
              setHasError(true);
              setIsLoading(false);
            }}
            onCanPlay={() => {
              console.log("Video can play:", video.videoUrl);
              setIsLoading(false);
            }}
          >
            <source type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        <div className="absolute bottom-0 left-0 right-0 px-4 md:p-6 z-10">
          <div className="flex items-end justify-between">
            <div className="flex-1 text-white mb-10 md:mb-0">
              <div className="font-semibold text-base md:text-lg mb-2 drop-shadow-lg">
                @{video.username}
              </div>
              <div className="text-sm md:text-base mb-3 pr-12 drop-shadow-lg flex flex-col space-y-4">
                <p>{video.description}</p>
                <p className="relative font-bold text-xl">
                  #3000
                  <span className="absolute -top-2 font-normal text-sm">
                    Per bird
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm w-full">
                <div className="bg-[#3EA843] text-white bg-opacity-30 backdrop-blur-sm px-3 py-2 cursor-pointer rounded-full">
                  + Add to Cart
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-6 mb-10 md:mb-0">
              <div className="relative">
                <div className="w-10 h-10 overflow-hidden cursor-pointer">
                  <ShoppingCart className="text-white " size={32} />
                </div>
                <div className="absolute -top-2 left-[70%] transform -translate-x-1/2 w-6 h-6 bg-red-500 rounded-full flex items-center cursor-pointer justify-center text-white text-xs font-bold">
                  +
                </div>
              </div>

              <div className="flex flex-col items-center">
                <button className="w-12 h-12 flex items-center justify-center hover:scale-110 transition-transform">
                  <Star
                    size={32}
                    className="text-white fill-white drop-shadow-lg"
                  />
                </button>
                <span className="text-white text-xs font-semibold mt-1 drop-shadow-lg">
                  {video.ratings}
                </span>
              </div>

              <div
                className="bg-white text-[#3EA843] border-2 border-[#3EA843] bg-opacity-30 backdrop-blur-sm px-3 py-1 cursor-pointer rounded-full"
                onClick={() => router.push("/details")}
              >
                Details
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen max-w-7xl mx-auto ">
      <div className="">
        <DashboardHeader text={"Marketplace"} />
      </div>

      {/* Main Content Area - Side by Side Layout for Desktop */}
      <div className="flex flex-1 overflow-hidden">
        {/* Popular Farms Sidebar - Desktop Only */}
        <div className="hidden lg:flex flex-col w-64 border-r-2 shadow-lg p-4 overflow-y-auto">
          <div className="bg-[#3EA843] text-white p-2 rounded-full text-sm text-center mb-6">
            Fast Selling Poultry
          </div>

          <div className="space-y-4">
            {popularFarms.map((farm) => (
              <div
                className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                key={farm.id}
                onClick={() => router.push("/about")}
              >
                <div className="h-12 w-12 border-2 border-green-500 rounded-full bg-red-600 shadow-lg overflow-hidden flex-shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=100&h=100&fit=crop"
                    alt={farm.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col flex-1">
                  <p className="text-sm font-medium">{farm.name}</p>
                  <div className="flex items-center text-xs">
                    <Star
                      size={14}
                      className="text-yellow-400 fill-yellow-400"
                    />
                    <span className="ml-1">{farm.ratings}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Video Container */}
        <div
          id="video-container"
          className={`flex-1 ${
            isMobile
              ? "overflow-y-scroll snap-y snap-mandatory"
              : "overflow-hidden"
          } `}
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {isMobile ? (
            videos.map((video, index) => (
              <VideoCard
                key={video.id}
                video={video}
                index={index}
                isActive={index === currentVideo}
              />
            ))
          ) : (
            <div className="h-full w-full flex items-center justify-center relative">
              <div className="h-full w-[600px]">
                <VideoCard
                  video={videos[currentVideo]}
                  index={currentVideo}
                  isActive={true}
                />
              </div>

              {currentVideo > 0 && (
                <button
                  onClick={() => scrollToVideo(currentVideo - 1)}
                  className="absolute top-1/2 left-4 transform -translate-y-1/2 w-14 h-14 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full flex items-center justify-center text-black z-20 text-2xl font-bold shadow-lg transition-all"
                >
                  ↑
                </button>
              )}
              {currentVideo < videos.length - 1 && (
                <button
                  onClick={() => scrollToVideo(currentVideo + 1)}
                  className="absolute top-1/2 right-4 transform -translate-y-1/2 w-14 h-14 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full flex items-center justify-center text-black z-20 text-2xl font-bold shadow-lg transition-all"
                >
                  ↓
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        #video-container::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
