"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const navItems = [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Our Solution", href: "#solution" },
  ];
  return (
    <header className="flex justify-between w-full p-16 z-10 h-[65px] items-center">
      <div className="flex gap-4">
        <img
          className="relative w-[45px] h-[44.13px] "
          alt="Untitled design"
          src="/untitled-design--98--1-1.png"
        />

        <div className="relative w-fit mt-[-1.61px] [font-family:'Playfair_Display',Helvetica] font-normal text-transparent text-[33.8px] text-center leading-[33.8px]">
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
      </div>

      <div className="flex gap-16 items-center">
        <ul className="hidden md:flex outline-none  gap-8">
          {navItems.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className="text-white hover:text-green-400 transition-colors duration-200 font-medium"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-8">
          <p className="text-[#3EA843] font-semibold cursor-pointer">Login</p>

          <Button
            className="w-[190px] h-[52px] px-8 py-3.5 rounded-xl bg-[linear-gradient(180deg,rgba(54,146,59,1)_0%,rgba(39,174,46,1)_100%)] hover:bg-[linear-gradient(180deg,rgba(54,146,59,0.9)_0%,rgba(39,174,46,0.9)_100%)] border-0 h-auto cursor-pointer"
            onClick={() => router.push("/register")}
          >
            <span className="font-paragraph-medium-medium font-[number:var(--paragraph-medium-medium-font-weight)] text-white text-[length:var(--paragraph-medium-medium-font-size)] tracking-[var(--paragraph-medium-medium-letter-spacing)] leading-[var(--paragraph-medium-medium-line-height)] [font-style:var(--paragraph-medium-medium-font-style)]">
              Get Started
            </span>
          </Button>
        </div>
      </div>
    </header>
  );
}
