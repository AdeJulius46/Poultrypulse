"use client"

// import { Header } from "@/components/layout/header";
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
      {/* <Header /> */}
      </div>
      <div className="flex ">
      <div className=" rounded-lg shadow-xl  absolute  top-0 left-4  mt-4   ">
        <div className={`${sidebarOpen? "  fixed":""}`}
        
        >
          <Sidebar   isOpen={sidebarOpen} onToggle={toggleSidebar} />
        </div>
        </div>
        <main   className={`flex-1 p-6 transition-all duration-300  overflow-y h-screen ${
            sidebarOpen ? "ml-0 lg:ml-[290px] " : "ml-0 lg:ml-[64px]"
          }`}>
          {children}
        </main>
      </div>
    </div>
  );
}
