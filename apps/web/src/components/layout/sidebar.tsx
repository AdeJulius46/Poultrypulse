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
  { icon: FolderOpen, href: "/contents", label: "Contents" },
  // { icon: Instagram, href: "/profiles", label: "Profiles" },
  { icon: Calendar, href: "/scheduler", label: "Scheduler" },
  { icon: Clock, href: "/history", label: "History" },
  { icon: BarChart, href: "/analytics", label: "Analytics" },
  { icon: Cloud, href: "/model", label: "Model" },
  // { icon: MessageSquare, href: "/comments", label: "Comments" },
  { icon: Settings, href: "/settings", label: "Settings" },
  { icon: HelpCircle, href: "/signout", label: "Sign Out" },
];

// const bottomItems = [
//   { icon: Settings, href: "/settings", label: "Settings" },
//   { icon: HelpCircle, href: "/signout", label: "Sign Out" },
// ];

export function Sidebar({ className, isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname(); // ✅ Current path

  return (
    <>
      <button onClick={onToggle} className="pt-4 text-sm text-gray-600 bg-none">
        {isOpen ? <div className="flex items-center  px-5 gap-2">
           <Image src={"/dummylogo.svg"}   width={50} height={50} alt=""/>    <span>Loopdeck</span> 
          </div>:  <div className=" ">   <Image src={"/dummylogo.svg"}    width={50}  height={50}  alt=""/> </div>}
      </button>

      {isOpen && (
        <div className=" w-full  mt-1 lg:w-[220px] ">
          <div className={cn("w-full  lg:w-[220px]   border-r", className)}>
            <div className="space-y-2 py-4">
              <div className="px-6 py-4">
                <div className="space-y-1">
                  <div></div>
                  {sidebarItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center py-4  px-4 w-[160px] text-sm font-medium rounded-[15.29px]  transition-colors",
                          isActive
                            ? "bg-[#5D5FEF] text-[#FFFFFF]"
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

                {/* 


          <div className="space-y-1 mt-60">
            {bottomItems.map((item) => {
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center py-4 px-3 text-sm font-medium rounded-lg group transition-colors",
                    isActive
                    ? "bg-[#5D5FEF] text-[#FFFFFF]"
                    : "text-[#737791]  bg-[#FFFFFF] hover:text-gray-900 hover:bg-gray-50"
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5 mr-3 flex-shrink-0",
                      isActive ? "text-[#FFFFFF]" : ""
                    )}
                  />
                  <span className="hidden lg:block">{item.label}</span>
                </Link>
              );
            })}
          </div> */}
              </div>
            </div>
          </div>
        </div>
      )}


    </>
  );
}
