import React from "react";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";

export const ActionButtonsSection = ()=> {
  const batches = [
    {
      id: "A",
      label: "Batch A",
      isActive: true,
      className:
        "bg-[linear-gradient(180deg,rgba(54,146,59,1)_0%,rgba(39,174,46,1)_100%)] text-white",
    },
    {
      id: "B",
      label: "Batch B",
      isActive: false,
      className: "bg-[#e0f8e1] text-green",
    },
    {
      id: "C",
      label: "Batch C",
      isActive: false,
      className: "bg-[#e0f8e1] text-green",
    },
  ];

  return (
    <section className="relative w-[580px] h-[379px] rounded-3xl overflow-hidden">
      <header className="relative top-[-30px] -left-4 w-[624px] h-[98px] flex justify-center bg-[#ffffff] border-[3px] border-solid border-[#57c15d]">
        <nav className="inline-flex mt-[49px] w-[452.82px] h-[31.68px] ml-[0.8px] items-center gap-[27.92px]">
          {batches.map((batch) => (
            <Button
              key={batch.id}
              variant="ghost"
              size="sm"
              className={`flex w-[82.08px] h-auto items-center justify-center gap-[7.2px] p-[7.2px] rounded-[11.18px] ${batch.className}`}
            >
              <img
                className="relative w-[17.28px] h-[17.28px]"
                alt="Cbi chicken"
                src="/cbi-chicken.svg"
              />
              <span className="relative w-fit mt-[-0.58px] [font-family:'Poppins',Helvetica] font-normal text-[11.5px] tracking-[0] leading-[normal]">
                {batch.label}
              </span>
            </Button>
          ))}

          <Button
            variant="ghost"
            size="sm"
            className="flex w-[122.83px] h-auto items-center justify-center gap-[7.2px] p-[7.2px] bg-[#e0f8e1] rounded-[11.18px]"
          >
            <span className="relative w-fit mt-[-0.72px] [font-family:'Poppins',Helvetica] font-normal text-green text-[11.5px] tracking-[0] leading-[normal]">
              See more batches
            </span>
          </Button>
        </nav>
      </header>

      <div className="absolute top-[68px] left-0 w-[602px] h-[311px] bg-[#7dcf81] rounded-[0px_0px_24px_24px] opacity-[0.21]" />

      <Badge className="flex w-[55px] h-auto items-center justify-center gap-[6.54px] p-[6.54px] absolute top-[87px] left-[22px] bg-[#ff0000] rounded-[1.69px] overflow-hidden border-0">
        <div className="relative w-[16.92px] h-[16.92px] ml-[-1.27px] bg-white rounded-[8.46px]" />
        <span className="relative w-fit mt-[-0.19px] mr-[-1.27px] [font-family:'Poppins',Helvetica] font-semibold text-white text-[10.5px] tracking-[-0.21px] leading-[normal]">
          LIVE
        </span>
      </Badge>
    </section>
  );
};
