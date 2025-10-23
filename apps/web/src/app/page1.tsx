"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <main className=" bg-[#fff] w-full min-w-[1440px] min-h-[1024px] relative">
      <img
        className="object-cover absolute top-[calc(50.00%_-_492px)] left-[calc(50.00%_-_698px)] w-[1397px] h-[984px] rounded-xl"
        alt="Rectangle"
        src="/rectangle-172.png"
      />

      <div className="bg-[#000000d9] absolute top-[calc(50.00%_-_492px)] left-[calc(50.00%_-_698px)] w-[1397px] h-[984px] rounded-xl" />

      <header className="inline-flex items-center gap-[4.82px] absolute top-[243px] left-[calc(50.00%_-_638px)]">
        <img
          className="relative w-[45px] h-[44.13px]"
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
      </header>

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

      <div className="absolute top-[654px] left-[calc(50.00%_-_639px)] h-[52px] justify-end w-[190px] flex">
        <Button
          className="w-[190px] h-[52px] px-8 py-3.5 rounded-xl bg-[linear-gradient(180deg,rgba(54,146,59,1)_0%,rgba(39,174,46,1)_100%)] hover:bg-[linear-gradient(180deg,rgba(54,146,59,0.9)_0%,rgba(39,174,46,0.9)_100%)] border-0 h-auto"
          onClick={() => router.push("/register")}
        >
          <span className="font-paragraph-medium-medium font-[number:var(--paragraph-medium-medium-font-weight)] text-white text-[length:var(--paragraph-medium-medium-font-size)] tracking-[var(--paragraph-medium-medium-letter-spacing)] leading-[var(--paragraph-medium-medium-line-height)] [font-style:var(--paragraph-medium-medium-font-style)]">
            Get Started
          </span>
        </Button>
      </div>

      <img
        className="top-[calc(50.00%_-_287px)] left-[582px] absolute w-[752px] h-[535px] rounded-xl object-cover"
        alt="Group"
        src="/group-150-2.png"
      />
    </main>
  );
}
