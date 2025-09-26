"use client"

import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  return (
    <div className="min-h-screen  relative ">
      <div className="bg-white shadow-lg">
      <Header />
      </div>
      <div className="flex">
      <div className="absolute top-0 left-0 z-30 h-screen  ">
        <div className={`${sidebarOpen? "h-screen bg-white shadow-lg  fixed":""}`}
        
        >
          <Sidebar   isOpen={sidebarOpen} onToggle={toggleSidebar} />
        </div>
        </div>
        <main   className={`flex-1 p-6 transition-all duration-300  overflow-y h-screen ${
            sidebarOpen ? "ml-0 lg:ml-[220px]" : "ml-0 lg:ml-[24px]"
          }`}>
          {children}
        </main>
      </div>
    </div>
  );
}
