import { BellIcon } from "lucide-react";
import React from "react";
import { Avatar, AvatarImage } from "../../../../components/ui/avatar";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";

export const PredictionsSection = () => {
  return (
    <div className="w-full flex items-center justify-center bg-white rounded-[50px] overflow-hidden p-1.5">
      <div className="flex h-[42px] w-full max-w-[448px] items-center justify-between gap-[26px]">
        <div className="flex items-center gap-1">
          <Button className="h-[42px] w-[158px] px-8 py-3.5 rounded-[50px] bg-gradient-to-r from-[#36923b] to-[#27ae2e] hover:from-[#2e7d32] hover:to-[#1b5e20] text-white font-bold text-lg [font-family:'Afacad',Helvetica] leading-6">
            + Add New Batch
          </Button>

          <Button
            variant="outline"
            className="h-[42px] w-[184px] px-8 py-3.5 bg-[#f2f2f2] rounded-[50px] border border-[#3ea843] hover:bg-[#e8f5e8] text-[#2e7d32] font-bold text-lg [font-family:'Afacad',Helvetica] leading-6 gap-3"
          >
            <img
              className="w-6 h-6"
              alt="Token branded"
              src="/token-branded-metamask.svg"
            />
            Connect Wallet
          </Button>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-[9.6px]">
            <Avatar className="w-10 h-10 border-[1.6px] border-[#7dcf81]">
              <AvatarImage
                src="/ellipse-75-1.png"
                alt="User avatar"
                className="object-cover"
              />
            </Avatar>
          </div>

          <div className="relative w-[30px] h-[30px]">
            <BellIcon className="w-[22.5px] h-[17.5px] absolute top-[5.38px] left-[2.88px] text-gray-600" />

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

            <div className="absolute top-px left-[15px] w-[15px] h-[13px]">
              <Badge className="absolute w-[86.30%] h-[96.92%] top-[3.08%] left-0 bg-[#ff0000] hover:bg-[#ff0000] rounded-[6.3px] p-0 min-w-0 h-auto flex items-center justify-center">
                <span className="text-white text-[10.8px] font-medium [font-family:'Aeonik-Medium',Helvetica] leading-normal">
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
