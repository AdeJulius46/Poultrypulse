// Hero.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();

  return (
    <div className="relative w-full h-full px-16 pt-10 flex">
      <div className="flex w-full gap-8 ">
        {/* Left content */}
        <div className="flex flex-col w-full max-w-[500px] z-20">
          <div className="bg-[#57C15D66] h-[24px] w-fit px-4 items-center rounded-sm text-white flex justify-center mb-4 text-sm">
            Web3 Powered Poultry Management
          </div>

          <div className="text-white font-bold text-[48px] leading-[52px] tracking-[-0.02em]">
            <h1>Predict. Prevent</h1>
            <h1>Prosper.</h1>
          </div>

          <p className="pt-8 text-white font-normal text-[18px] leading-[28px] tracking-[-0.02em]">
            PoultryPulse revolutionizes poultry farming with cutting-edge AI
            analytics and blockchain transparency. Monitor health, optimize
            feed, track production, and ensure supply chain integrity—all in one
            intelligent platform.
          </p>

          <div className="flex gap-6 mt-8">
            <Button
              className="bg-[#27AE2E] w-[180px] h-[52px] cursor-pointer hover:bg-[#219C2E]"
              onClick={() => router.push("/register")}
            >
              Create Account
            </Button>
            <Button className="w-[180px] h-[52px] cursor-pointer bg-white text-[#27AE2E] hover:bg-[#E6F4EA]">
              Login
            </Button>
          </div>
        </div>

        {/* Right image */}
        <div className="flex-1 flex justify-end">
          <img
            className="w-full max-w-[752px] h-[535px] rounded-xl object-cover"
            alt="Group"
            src="/group-150-2.png"
          />
        </div>
      </div>
    </div>
  );
}
