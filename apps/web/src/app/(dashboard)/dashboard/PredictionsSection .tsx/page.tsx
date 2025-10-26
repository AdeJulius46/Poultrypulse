"use client";
import { BellIcon } from "lucide-react";
import React from "react";
import { Avatar, AvatarImage } from "../../../../components/ui/avatar";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from "wagmi";
import { useRouter } from "next/navigation";

export const PredictionsSection = () => {
  const { address } = useAccount();
  const router = useRouter();
  const truncateAddress = (_address_: any, startLength = 6, endLength = 4) => {
    if (!address) return "";
    if (address.length <= startLength + endLength) return address;

    return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
  };

  return (
    <div className="flex items-center justify-center bg-white rounded-3xl sm:rounded-[50px] overflow-hidden p-2 sm:p-2.5 md:p-3 lg:p-1.5 lg:mr-8">
      <div className="flex flex-col sm:flex-row h-auto sm:h-[42px] w-full  items-center justify-between gap-3 sm:gap-4 md:gap-[26px] ">
        {/* Left section - Buttons */}
        <div className="hidden cursor-pointer sm:flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-2 w-full sm:w-auto">
          <Button className="h-10 sm:h-[42px] w-full sm:w-auto sm:min-w-[140px] md:min-w-[158px] px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-3.5 rounded-3xl sm:rounded-[50px] bg-gradient-to-r from-[#36923b] to-[#27ae2e] hover:from-[#2e7d32] hover:to-[#1b5e20] text-white font-bold text-base sm:text-lg [font-family:'Afacad',Helvetica] leading-5 sm:leading-6 whitespace-nowrap cursor-pointer">
            + Add New Batch
          </Button>

          {address ? (
            <div className="flex items-center justify-center h-10 sm:h-[42px] px-4 py-2.5 bg-[#f2f2f2] rounded-3xl sm:rounded-[50px] border border-[#3ea843] text-[#2e7d32] font-bold text-sm sm:text-base md:text-lg [font-family:'Afacad',Helvetica] leading-5 sm:leading-6">
              {truncateAddress(address)}
            </div>
          ) : (
            <Button
              variant="outline"
              className="h-10 sm:h-[42px] w-full cursor-pointer sm:w-auto sm:min-w-[160px] md:min-w-[184px] px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-3.5 bg-[#f2f2f2] rounded-3xl sm:rounded-[50px] border border-[#3ea843] hover:bg-[#e8f5e8] text-[#2e7d32] font-bold text-base sm:text-lg [font-family:'Afacad',Helvetica] leading-5 sm:leading-6 gap-2 sm:gap-3"
            >
              <img
                className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0"
                alt="Token branded"
                src="/token-branded-metamask.svg"
              />
              <span>Connect</span>
            </Button>
          )}
        </div>

        {/* Right section - Avatar and Notification */}
        <div className="flex items-center gap-2 sm:gap-2.5 md:gap-1.5">
          <div className="flex items-center gap-[9.6px]">
            <Avatar
              className="w-9 h-9 sm:w-10 sm:h-10 border-[1.6px] cursor-pointer border-[#7dcf81]"
              onClick={() => router.push("/settings")}
            >
              <AvatarImage
                src="/ellipse-75-1.png"
                alt="User avatar"
                className="object-cover"
              />
            </Avatar>
          </div>

          <div className="relative w-[28px] h-[28px] sm:w-[30px] sm:h-[30px] flex-shrink-0 cursor-pointer">
            <BellIcon className="w-5 h-4 sm:w-[22.5px] sm:h-[17.5px] absolute top-[5px] sm:top-[5.38px] left-[3px] sm:left-[2.88px] text-gray-600" />

            <img
              className="absolute w-[12.50%] h-[12.50%] top-[5.42%] left-[40.83%]"
              alt="Vector"
              src="/vector-3.svg"
            />

            <img
              className="absolute w-[25.00%] h-[12.50%] top-[76.25%] left-[34.58%]"
              alt="Vector"
              src="/vector-2.svg"
            />

            <div className="absolute top-0 sm:top-px left-[14px] sm:left-[15px] w-[14px] h-[12px] sm:w-[15px] sm:h-[13px]">
              <Badge className="absolute w-[86.30%] h-[96.92%] top-[3.08%] left-0 bg-[#ff0000] hover:bg-[#ff0000] rounded-[6.3px] p-0 min-w-0 h-auto flex items-center justify-center">
                <span className="text-white text-[9px] sm:text-[10.8px] font-medium [font-family:'Aeonik-Medium',Helvetica] leading-normal">
                  3
                </span>
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
