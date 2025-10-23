// Home.tsx
"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { ProblemsSection } from "@/components/sections/problems-section";
import { FeaturesSection } from "@/components/sections/features-section";
import { DetailedFeaturesSection } from "@/components/sections/detailed-features-section";
import { PricingSection } from "@/components/sections/pricing-section";
import { CTASection } from "@/components/sections/cta-section";
import { Footer } from "@/components/sections/footer";

import Header from "@/components/header";
import Hero from "@/components/hero";

export default function Home() {
  return (
    <div className="min-h-screen relative">
      <Navbar />
      <main className="bg-black w-full min-w-[1440px] min-h-[1024px] relative">
      <img
        className="object-cover absolute top-[calc(50.00%_-_492px)] left-[calc(50.00%_-_698px)] w-[1397px] h-[984px] rounded-xl"
        alt="Rectangle"
        src="/rectangle-172.png"
      />

      <div className="bg-[#000000d9] absolute top-[calc(50.00%_-_492px)] left-[calc(50.00%_-_698px)] w-[1397px] h-[984px] rounded-xl" />


      <div className="inline-flex items-center gap-[4.82px] absolute top-[243px] left-[82px]">
        <div className="bg-green-900 px-8 py-2.5 rounded-2xl">
          <span className="text-white font-medium text-lg">
            Web3 Powered Poultry Management
          </span>
        </div>
      </div>


      <section className="absolute top-[349px] left-[81px] w-[455px]">
        <h1 className="[font-family:'Gilroy-SemiBold-SemiBold',Helvetica] font-semibold text-white text-[38px] tracking-[-0.76px] leading-[39px]">
          Predict. Prevent.
          <br />
          Prosper.
        </h1>
      </section>

      <section className="absolute top-[458px] left-[82px] w-[435px]">
        <p className="font-paragraph-large-regular font-[number:var(--paragraph-large-regular-font-weight)] text-[#ededed] text-[length:var(--paragraph-large-regular-font-size)] tracking-[var(--paragraph-large-regular-letter-spacing)] leading-[var(--paragraph-large-regular-line-height)] [font-style:var(--paragraph-large-regular-font-style)]">
          PoultryPulse revolutionizes poultry farming with cutting-edge AI
          analytics and blockchain transparency. Monitor health, optimize feed,
          track production, and ensure supply chain integrity—all in one
          intelligent platform.
        </p>
      </section>

      <div className="absolute top-[580px] left-[82px] h-[72px] w-[500px] flex gap-4">
        <Button 
          className="px-10 py-6 rounded-xl bg-[linear-gradient(180deg,rgba(54,146,59,1)_0%,rgba(39,174,46,1)_100%)] hover:bg-[linear-gradient(180deg,rgba(54,146,59,0.9)_0%,rgba(39,174,46,0.9)_100%)] border-0 text-lg font-medium"   
          onClick={() => router.push("/register")}
        >
          Create Account
        </Button>

        <Button 
          className="px-10 py-6 rounded-xl bg-white text-green-600 hover:bg-gray-100 transition-colors duration-200 text-lg font-medium"   
          onClick={() => router.push("/login")}
        >
          Login
        </Button>
      </div>

      <img
        className="top-[calc(50.00%_-_287px)] left-[582px] absolute w-[752px] h-[535px] rounded-xl object-cover"
        alt="Group"
        src="/group-150-2.png"
      />
      </main>
      
      {/* Problems Section */}
      <ProblemsSection />
      
      {/* Features Section */}
      <FeaturesSection />
      
      {/* Detailed Features Section */}
      <DetailedFeaturesSection />
      
      {/* Pricing Section */}
      <PricingSection />
      
      {/* CTA Section */}
      <CTASection />
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
