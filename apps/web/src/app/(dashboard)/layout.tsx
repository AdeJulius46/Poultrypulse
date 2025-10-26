"use client";

// import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { useStore } from "@/lib/store";
import { useEffect, useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarOpen = useStore((state) => state.sidebarOpen);
  const setSidebarOpen = useStore((state) => state.sidebarOpen);
  const toggleSidebar = useStore((state) => state.toggleSidebar);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (sidebarOpen && window.innerWidth < 1024) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);
  return (
    <div className="min-h-screen bg-[#f2f2f2] ]  relative ">
      <div className="shadow-lg">{/* <Header /> */}</div>
      <div className="flex ">
        <div className=" rounded-lg shadow-xl  absolute  top-0 left-4  mt-4 z-9999   ">
          <div className={`${sidebarOpen ? "  fixed" : ""}`}>
            <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
          </div>
        </div>
        <main
          className={`flex-1  transition-all duration-300  overflow-y h-screen ${
            sidebarOpen ? "ml-0 lg:ml-[290px] " : "ml-0 lg:ml-[64px]"
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
