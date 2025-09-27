"use client";

import Link from "next/link";
import { usePathname } from "next/navigation"; // ✅ Use this instead
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";
import {
  LayoutGrid,
  FolderOpen,
  Instagram,
  Calendar,
  Clock,
  BarChart,
  Cloud,
  MessageSquare,
  Settings,
  HelpCircle,
} from "lucide-react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onToggle: () => void;
}

const sidebarItems = [
  { icon: LayoutGrid, href: "/dashboard", label: "Dashboard" },
  { icon: FolderOpen, href: "/insights", label: "Insights" },
  // { icon: Instagram, href: "/profiles", label: "Profiles" },
  { icon: Calendar, href: "/wallet", label: "Wallet" },
  { icon: Clock, href: "/subscription", label: "Subscription" },
  { icon: BarChart, href: "/settings", label: "Settings" },

];

// const bottomItems = [
//   { icon: Settings, href: "/settings", label: "Settings" },
//   { icon: HelpCircle, href: "/signout", label: "Sign Out" },
// ];

export function Sidebar({ className, isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname(); // ✅ Current path

  return (
    <>
    <div className=" h-[700px] shadow-2xl  rounded-lg  ">

      <button onClick={onToggle} className="pt-4 text-sm text-gray-600 bg-none">
        {isOpen ? <div className="flex items-center mt-[30px]  px-5 ">
           <Image src={"/poultry.svg"}   width={150} height={150} alt=""/> 
          </div>:  <div className=" ">   <Image src={"/logo1.svg"}    width={50}  height={50}  alt=""/> </div>}
      </button>

      {isOpen && (
        <div className=" w-full  py-4   lg:w-[260px] ">
          <div className={cn("w-full  lg:w-[260px]   border-r", className)}>
            <div className="space-y-2 py-4">
              <div className="px-6 py-2">
                <div className="space-y-1">
                  <div></div>
                  {sidebarItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center py-4   px-4 w-[180px] text-sm font-medium rounded-[15.29px]  transition-colors",
                          isActive
                            ? "bg-[#2E7D32] text-[#FFFFFF]"
                            : "text-[#737791]  bg-[#FFFFFF] hover:text-gray-900 hover:bg-gray-50"
                        )}
                      >
                        <item.icon
                          className={cn(
                            "h-5 w-5 mr-3 flex-shrink-0",
                            isActive ? "text-[#FFFFFF]" : ""
                          )}
                        />
                        <span className="lg:block">{item.label}</span>
                      </Link>
                    );
                  })}
                  
                

                </div>

              </div>
            </div>
          </div>

          <div className="flex items-center justify-center py-[190px]">
         
            <Image 
            src={"/Group 144.svg"}
            width={120}
            height={100}
            alt="image"
            />
          </div>
        </div>
      )}
 </div>
    </>
  );
}
