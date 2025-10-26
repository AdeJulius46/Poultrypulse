"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Bell, ShoppingCart } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface HeaderProps {
  userFullName?: string;
  workspace?: string;
  trialDays?: number;
}

export function Header({
  userFullName = "Fodilu Akorede",
  workspace = "My Workspace",
  trialDays = 7,
}: HeaderProps) {
  return (
    <header className=" ">
      <div className="flex  h-20 items-center px-6 justify-between">
        {/* Left Section - Logo */}
        <div className="flex-shrink-0">
          {/* <Image src="/logo.png" alt="LoopDeck" width={100} height={100} /> */}
        </div>

        {/* Center Section - Add Post Button */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <Button className="bg-royal-blue hover:bg-royal-blue/90 text-black font-medium">
            <span className="flex items-center gap-2">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 5V19M5 12H19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Add Post
            </span>
          </Button>
        </div>

        {/* Right Section - Actions & Profile */}
        <div className="flex items-center gap-6">
          {/* Cart & Notifications */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
            </Button>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-3 border-l pl-6">
            <Avatar>
              <AvatarImage src="/avatar.png" />
              <AvatarFallback>FA</AvatarFallback>
            </Avatar>
            <div className="hidden lg:block">
              <p className="text-sm font-medium leading-none">{userFullName}</p>
              <p className="text-xs text-muted-foreground">{workspace}</p>
            </div>
          </div>
        </div>
      </div>
      {/* Trial Notice */}
      <div className="hidden lg:block  border-l pl-6">
        <div className="text-xs text-center">
          <span className="text-muted-foreground">Trial expiring in </span>
          <span className="font-medium">{trialDays} days </span>
          <span className="text-xs h-auto p-0 text-royal-blue font-medium">Upgrade Now!</span>
        </div>
      </div>
    </header>
  );
}
