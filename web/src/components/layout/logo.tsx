"use client";

import Image from "next/image";

interface LogoProps {
  className?: string;
  showText?: boolean;
  textClassName?: string;
}

export function Logo({ 
  className = "", 
  showText = true, 
  textClassName = "" 
}: LogoProps) {
  return (
    <div className={`inline-flex items-center gap-[4.82px] ${className}`}>
      <Image
        className="relative w-[45px] h-[44.13px]"
        alt="Poultry Pulse Logo"
        src="/untitled-design--98--1-1.png"
        width={45}
        height={44}
      />

      {showText && (
        <div className={`relative w-fit mt-[-1.61px] font-['Playfair_Display',Helvetica] font-normal text-transparent text-[33.8px] text-center leading-[33.8px] ${textClassName}`}>
          <span className="font-semibold text-white tracking-[-0.57px] leading-[45px]">
            Poultry
          </span>

          <span className="font-semibold text-white tracking-[0] leading-[0.1px]">
            &nbsp;
          </span>

          <span className="italic text-white tracking-[-0.46px] leading-[45px]">
            Pulse
          </span>
        </div>
      )}
    </div>
  );
}
