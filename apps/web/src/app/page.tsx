// Home.tsx
"use client";

import Header from "@/components/header";
import Hero from "@/components/hero";

export default function Home() {
  return (
    <div className="bg-white w-full min-h-screen flex flex-col items-center justify-center relative overflow-hidden p-8">
      <section
        className="w-full max-w-[1397px] h-[755px] mx-auto rounded-xl bg-cover bg-center relative "
        style={{ backgroundImage: "url('/rectangle-172.png')" }}
      >
        {/* Dark overlay */}
        <div className="bg-[#000000d9] absolute inset-0 rounded-xl" />

        {/* Content on top of overlay */}
        <div className="relative z-10 w-full h-full">
          <Header />
          <Hero />
        </div>
      </section>
    </div>
  );
}
