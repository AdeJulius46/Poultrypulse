"use client";

import DashboardHeader from "@/components/layout/dashboardHeader";
import React, { useState, useEffect, useRef } from "react";
import {
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  Search,
  Home,
  Compass,
  Users,
  Video,
  Upload,
  User,
  Volume2,
  VolumeX,
} from "lucide-react";

export default function MarketplacePage() {
  const [currentVideo, setCurrentVideo] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [streamError, setStreamError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const videos = [
    {
      id: 1,
      username: "little.benson.bros",
      description: "Do all Orange Drinks Taste the Same? 🤔 #challenge #game",
      likes: "8070",
      comments: "123",
      bookmarks: "679",
      shares: "140",
      videoUrl: "vid1.mp4",
    },
    {
      id: 2,
      username: "cooking.master",
      description: "Easy 5-minute pasta recipe 🍝 #cooking #recipe #pasta",
      likes: "12.5K",
      comments: "234",
      bookmarks: "890",
      shares: "245",
      videoUrl: "vid2.mp4",
    },
    {
      id: 3,
      username: "fitness.journey",
      description: "Morning workout routine 💪 #fitness #workout #motivation",
      likes: "9.8K",
      comments: "156",
      bookmarks: "432",
      shares: "178",
      videoUrl: "vid1.mp4",
    },
    {
      id: 4,
      username: "travel.vibes",
      description: "Hidden gem in Bali 🌴 #travel #bali #paradise",
      likes: "15.2K",
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
      likes: "22.1K",
      comments: "567",
      bookmarks: "2.3K",
      shares: "789",
      videoUrl:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    },
  ];

  type Video = {
    id: number;
    username: string;
    description: string;
    likes: string;
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
      setIsMobile(window.innerWidth < 768);
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

  const handleVideoLoad = () => {
    setIsLoading(false);
    setStreamError(false);
  };

  const handleVideoError = () => {
    setIsLoading(false);
    setStreamError(true);
  };

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

  const VideoCard: React.FC<VideoCardProps> = ({ video, index, isActive }) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
      const el = videoRef.current;
      if (el) {
        if (isActive) {
          el.play().catch((err) => console.log("Play error:", err));
        } else {
          el.pause();
        }
      }
    }, [isActive]);

    return (
      <div
        className={`relative ${
          isMobile
            ? "h-screen w-full flex-shrink-0 snap-start"
            : "h-full w-full"
        } bg-white flex items-center justify-center`}
      >
        {/* Video Background */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <video
            ref={videoRef}
            src={video.videoUrl}
            className="w-full h-full object-cover"
            loop
            playsInline
            muted={isMuted}
          />
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        </div>

        {/* Mute Button - Top Left on Mobile */}
        {isMobile && (
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="absolute top-4 right-4 z-20 bg-white bg-opacity-80 p-2 rounded-full"
          >
            {isMuted ? (
              <VolumeX size={20} className="text-black" />
            ) : (
              <Volume2 size={20} className="text-black" />
            )}
          </button>
        )}

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 z-10">
          <div className="flex items-end justify-between">
            {/* Left Side - User Info */}
            <div className="flex-1 text-black mb-20 md:mb-0">
              <div className="font-semibold text-base md:text-lg mb-2">
                @{video.username}
              </div>
              <div className="text-sm md:text-base mb-3 pr-12">
                {video.description}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="bg-black bg-opacity-20 px-3 py-1 rounded">
                  Original Audio
                </div>
              </div>
            </div>

            {/* Right Side - Action Buttons */}
            <div className="flex flex-col items-center gap-6 mb-20 md:mb-0">
              {/* Profile Picture */}
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gray-600 border-2 border-white overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-pink-500 to-purple-500"></div>
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  +
                </div>
              </div>

              {/* Like */}
              <div className="flex flex-col items-center">
                <button className="w-12 h-12 flex items-center justify-center hover:scale-110 transition-transform">
                  <Heart size={32} className="text-black fill-black" />
                </button>
                <span className="text-black text-xs font-semibold mt-1">
                  {video.likes}
                </span>
              </div>

              {/* Comment */}
              <div className="flex flex-col items-center">
                <button className="w-12 h-12 flex items-center justify-center hover:scale-110 transition-transform">
                  <MessageCircle size={32} className="text-black" />
                </button>
                <span className="text-black text-xs font-semibold mt-1">
                  {video.comments}
                </span>
              </div>

              {/* Bookmark */}
              <div className="flex flex-col items-center">
                <button className="w-12 h-12 flex items-center justify-center hover:scale-110 transition-transform">
                  <Bookmark size={28} className="text-black" />
                </button>
                <span className="text-black text-xs font-semibold mt-1">
                  {video.bookmarks}
                </span>
              </div>

              {/* Share */}
              <div className="flex flex-col items-center">
                <button className="w-12 h-12 flex items-center justify-center hover:scale-110 transition-transform">
                  <Share2 size={28} className="text-black" />
                </button>
                <span className="text-black text-xs font-semibold mt-1">
                  {video.shares}
                </span>
              </div>

              {/* Spinning Record */}
              <div
                className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-pink-500 animate-spin"
                style={{ animationDuration: "3s" }}
              >
                <div className="w-full h-full rounded-full border-2 border-black flex items-center justify-center">
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#f2f2f2] min-h-screen">
      <div className="p-3 lg:p-0 pt-3 w-full sm:p-4 md:p-6">
        <DashboardHeader text={"Marketplace"} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Desktop Top Bar */}
        <div className="hidden md:flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-white">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search"
                className="w-full bg-gray-100 text-black pl-10 pr-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-gray-600 hover:text-black">
              <Upload size={24} />
            </button>
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="text-gray-600 hover:text-black"
            >
              {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
            </button>
            <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded font-semibold">
              Log in
            </button>
          </div>
        </div>

        {/* Video Display Area */}
        <div
          id="video-container"
          className={`flex-1 ${
            isMobile
              ? "overflow-y-scroll snap-y snap-mandatory"
              : "overflow-hidden"
          } bg-white`}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {isMobile ? (
            // Mobile: Vertical scroll
            videos.map((video, index) => (
              <VideoCard
                key={video.id}
                video={video}
                index={index}
                isActive={index === currentVideo}
              />
            ))
          ) : (
            // Desktop: Single video with navigation
            <div className="h-full flex items-center justify-center relative">
              <VideoCard
                video={videos[currentVideo]}
                index={currentVideo}
                isActive={true}
              />

              {/* Navigation Arrows */}
              {currentVideo > 0 && (
                <button
                  onClick={() => scrollToVideo(currentVideo - 1)}
                  className="absolute top-1/2 left-4 transform -translate-y-1/2 w-12 h-12 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full flex items-center justify-center text-black z-20"
                >
                  ↑
                </button>
              )}
              {currentVideo < videos.length - 1 && (
                <button
                  onClick={() => scrollToVideo(currentVideo + 1)}
                  className="absolute top-1/2 right-4 transform -translate-y-1/2 w-12 h-12 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full flex items-center justify-center text-black z-20"
                >
                  ↓
                </button>
              )}

              {/* Video Counter */}
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-80 px-4 py-2 rounded-full text-black text-sm z-20">
                {currentVideo + 1} / {videos.length}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
