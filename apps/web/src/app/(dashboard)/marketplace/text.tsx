import React, { useState, useEffect, useRef } from "react";
import {
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  Search,
  Home,
  ShoppingBag,
  Compass,
  Users,
  Video,
  Upload,
  User,
  MoreHorizontal,
  Volume2,
  VolumeX,
} from "lucide-react";

const TikTokClone = () => {
  const [currentVideo, setCurrentVideo] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const videoRefs = useRef([]);

  const videos = [
    {
      id: 1,
      username: "little.benson.bros",
      description: "Do all Orange Drinks Taste the Same? 🤔 #challenge #game",
      likes: "8070",
      comments: "123",
      bookmarks: "679",
      shares: "140",
      videoUrl:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    },
    {
      id: 2,
      username: "cooking.master",
      description: "Easy 5-minute pasta recipe 🍝 #cooking #recipe #pasta",
      likes: "12.5K",
      comments: "234",
      bookmarks: "890",
      shares: "245",
      videoUrl:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    },
    {
      id: 3,
      username: "fitness.journey",
      description: "Morning workout routine 💪 #fitness #workout #motivation",
      likes: "9.8K",
      comments: "156",
      bookmarks: "432",
      shares: "178",
      videoUrl:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
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

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = (e) => {
      if (!isMobile) return;

      const scrollTop = e.target.scrollTop;
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
  }, [isMobile, currentVideo]);

  const scrollToVideo = (index) => {
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

  const VideoCard = ({ video, index, isActive }) => {
    const videoRef = useRef(null);

    useEffect(() => {
      if (videoRef.current) {
        if (isActive) {
          videoRef.current
            .play()
            .catch((err) => console.log("Play error:", err));
        } else {
          videoRef.current.pause();
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
    <div className="h-screen w-screen bg-white overflow-hidden flex">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-60 bg-white border-r border-gray-200 flex-col">
        {/* Logo */}
        <div className="p-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <Video size={20} className="text-white" />
            </div>
            <span className="text-black font-bold text-2xl">TikTok</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2">
          <button className="w-full flex items-center gap-4 px-4 py-3 text-black hover:bg-gray-100 rounded-lg mb-1 bg-gray-100">
            <Home size={24} />
            <span className="font-semibold">For You</span>
          </button>
          <button className="w-full flex items-center gap-4 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg mb-1">
            <Users size={24} />
            <span className="font-semibold">Following</span>
          </button>
          <button className="w-full flex items-center gap-4 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg mb-1">
            <Compass size={24} />
            <span className="font-semibold">Explore</span>
          </button>
          <button className="w-full flex items-center gap-4 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg mb-1">
            <Video size={24} />
            <span className="font-semibold">LIVE</span>
          </button>
          <button className="w-full flex items-center gap-4 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg mb-1">
            <User size={24} />
            <span className="font-semibold">Profile</span>
          </button>
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-200">
          <button className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg mb-3">
            Log in
          </button>
          <div className="text-gray-500 text-xs space-y-1">
            <div>Company</div>
            <div>Program</div>
            <div>Terms & Policies</div>
            <div className="mt-2">© 2025 TikTok</div>
          </div>
        </div>
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

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex items-center justify-around py-2">
          <button className="flex flex-col items-center gap-1 px-6 py-2">
            <Home size={28} className="text-black" />
            <span className="text-black text-xs font-semibold">Home</span>
          </button>
          <button className="flex flex-col items-center gap-1 px-6 py-2">
            <Search size={28} className="text-gray-600" />
            <span className="text-gray-600 text-xs">Discover</span>
          </button>
          <button className="relative -mt-4">
            <div className="w-12 h-10 bg-gradient-to-r from-cyan-400 via-pink-500 to-red-500 rounded-lg flex items-center justify-center">
              <div className="w-11 h-9 bg-white rounded-lg flex items-center justify-center">
                <div className="text-black font-bold text-2xl">+</div>
              </div>
            </div>
          </button>
          <button className="flex flex-col items-center gap-1 px-6 py-2">
            <MessageCircle size={28} className="text-gray-600" />
            <span className="text-gray-600 text-xs">Inbox</span>
          </button>
          <button className="flex flex-col items-center gap-1 px-6 py-2">
            <User size={28} className="text-gray-600" />
            <span className="text-gray-600 text-xs">Profile</span>
          </button>
        </div>
      </div>

      <style jsx>{`
        #video-container::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default TikTokClone;
