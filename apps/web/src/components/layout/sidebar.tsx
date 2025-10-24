"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";
import {
  LayoutGrid,
  FolderOpen,
  Calendar,
  Clock,
  BarChart,
  X,
  ShoppingBasket,
} from "lucide-react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onToggle: () => void;
}

const sidebarItems = [
  { icon: LayoutGrid, href: "/dashboard", label: "Dashboard" },
  { icon: FolderOpen, href: "/insights", label: "Insights" },
  { icon: Calendar, href: "/wallet", label: "Wallet" },
  { icon: Clock, href: "/subscription", label: "Subscription" },
  { icon: BarChart, href: "/settings", label: "Settings" },
  { icon: ShoppingBasket, href: "/marketplace", label: "Marketplace" },
];

export function Sidebar({ className, isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-0 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-100 flex flex-col bg-white shadow-2xl rounded-lg transition-all duration-300 ease-in-out",
          isOpen
            ? "w-[260px] translate-x-0"
            : "w-[80px] -translate-x-full lg:translate-x-0",
          "lg:h-[700px] h-screen",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b lg:border-none">
          <button
            onClick={onToggle}
            className="flex items-center justify-center w-full"
          >
            {isOpen ? (
              <div className="flex items-center justify-between w-full">
                <Image
                  src="/poultry.svg"
                  width={150}
                  height={150}
                  alt="Logo"
                  className="object-contain"
                />
                <X className="h-6 w-6 text-gray-600 lg:hidden" />
              </div>
            ) : (
              <Image
                src="/logo1.svg"
                width={50}
                height={50}
                alt="Logo Icon"
                className="object-contain"
              />
            )}
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto py-4">
          <div className={cn("space-y-1", isOpen ? "px-4" : "px-2")}>
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    // Close mobile sidebar on navigation
                    if (window.innerWidth < 1024) {
                      onToggle();
                    }
                  }}
                  className={cn(
                    "flex items-center py-4 px-4 text-sm font-medium rounded-[15.29px] transition-colors",
                    isActive
                      ? "bg-[#2E7D32] text-white"
                      : "text-[#737791] bg-white hover:text-gray-900 hover:bg-gray-50",
                    !isOpen && "justify-center"
                  )}
                  title={!isOpen ? item.label : undefined}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5 flex-shrink-0",
                      isActive ? "text-white" : "text-[#737791]",
                      isOpen && "mr-3"
                    )}
                  />
                  {isOpen && <span>{item.label}</span>}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom Image - Only show when open */}
        {isOpen && (
          <div className="flex items-center justify-center p-6 border-t">
            <Image
              src="/Group 144.svg"
              width={120}
              height={100}
              alt="Bottom decoration"
              className="object-contain"
            />
          </div>
        )}
      </div>
    </>
  );
}
