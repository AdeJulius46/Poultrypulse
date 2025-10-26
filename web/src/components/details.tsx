"use client";

import {
  ChevronRightIcon,
  ChevronDownIcon,
  EyeOffIcon,
  LayersIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import {
  ppContract,
  pptcontractAbi,
  tokenAbi,
  tokenContract,
} from "../contract";
import { useEffect, useState } from "react";

export const Details = () => {
  const { writeContract } = useWriteContract();
  const { address } = useAccount();
  const [localRewardPoints, setLocalRewardPoints] = useState(0);
  const [isRewardActive, setIsRewardActive] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    data: balance,
    isLoading: isBalanceLoading,
    error: balanceError,
  } = useReadContract({
    abi: tokenAbi,
    address: tokenContract,
    functionName: "balanceOf",
    args: [address],
  });

  useEffect(() => {
    if (!isRewardActive || !address) return;
    const interval = setInterval(() => {
      setLocalRewardPoints((prev) => prev + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, [isRewardActive, address]);

  const addPoints = () => {
    try {
      const pointsToConvert = localRewardPoints || 0;
      if (pointsToConvert <= 0) {
        alert("No reward points available to convert");
        return;
      }
      writeContract({
        abi: pptcontractAbi,
        address: ppContract,
        functionName: "addPoints",
        args: [address, localRewardPoints],
      });
      setTimeout(() => {
        convertToPoints();
      }, 4000);
    } catch (error) {
      alert(error);
    }
  };

  const convertToPoints = () => {
    try {
      const pointsToConvert = localRewardPoints || 0;
      if (pointsToConvert <= 0) {
        alert("No reward points available to convert");
        return;
      }
      writeContract({
        abi: pptcontractAbi,
        address: ppContract,
        functionName: "convertPointsToTokens",
        args: [localRewardPoints],
      });
      setLocalRewardPoints(0);
    } catch (error) {
      alert(error);
    }
  };

  const withdrawTokens = () => {
    try {
      const tokenBalance = balance || 0;
      if (tokenBalance != 0) {
        alert("No tokens available to withdraw");
        return;
      }
      writeContract({
        abi: pptcontractAbi,
        address: ppContract,
        functionName: "withdraw",
        args: [tokenBalance],
      });
    } catch (error) {
      alert("Withdrawal failed: " + error);
    }
  };

  const handleButtonClick = (buttonLabel: string) => {
    switch (buttonLabel) {
      case "Convert":
        addPoints();
        break;
      case "Withdraw":
        withdrawTokens();
        break;
      default:
        console.log(`${buttonLabel} button clicked`);
    }
  };

  const actionButtons = [
    {
      label: "Add",
      variant: "default" as const,
      className: "bg-[#3ea843] hover:bg-[#3ea843]/90 text-white border-0",
    },
    {
      label: "Withdraw",
      variant: "outline" as const,
      className: "border-[#3ea843] text-green hover:bg-[#3ea843]/10",
    },
    {
      label: "Convert",
      variant: "outline" as const,
      className: "border-[#3ea843] text-green hover:bg-[#3ea843]/10",
    },
  ];

  const formatNumber = (value: any) => {
    if (!value) return "0.00 PUL";
    const num = Number(value.toString());
    let formatted = "";
    if (num >= 1e18) formatted = (num / 1e18).toFixed(2) + "";
    else if (num >= 1e15) formatted = (num / 1e15).toFixed(2) + "";
    else if (num >= 1e12) formatted = (num / 1e12).toFixed(2) + "";
    else if (num >= 1e9) formatted = (num / 1e9).toFixed(2) + "";
    else if (num >= 1e6) formatted = (num / 1e6).toFixed(2) + "";
    else if (num >= 1e3) formatted = (num / 1e3).toFixed(2) + "";
    else
      formatted = num.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    return `${formatted} PUL`;
  };

  const formatPoints = (value: any) => {
    if (!value) return "0";
    const num = Number(value.toString());
    if (num >= 1e18) return (num / 1e18).toFixed(1) + "E";
    else if (num >= 1e15) return (num / 1e15).toFixed(1) + "P";
    else if (num >= 1e12) return (num / 1e12).toFixed(1) + "T";
    else if (num >= 1e9) return (num / 1e9).toFixed(1) + "B";
    else if (num >= 1e6) return (num / 1e6).toFixed(1) + "M";
    else if (num >= 1e3) return (num / 1e3).toFixed(1) + "K";
    return num.toLocaleString("en-US");
  };

  return (
    <Card className="w-full bg-white rounded-2xl sm:rounded-3xl border-0 shadow-none">
      <CardContent className="p-3 sm:p-4 md:p-6 w-full relative">
        {/* Clickable Header */}
        <header
          className="flex items-center justify-between gap-2 sm:gap-3 cursor-pointer select-none"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <span className="text-[#8c8c8c] text-xs sm:text-sm md:text-base font-medium truncate">
              Token Balance
            </span>
            <ChevronDownIcon
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-[#8c8c8c] transition-transform duration-200 flex-shrink-0 ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </div>
          <Badge className="bg-[#E0F8E1] text-[#2E7D32] hover:bg-[#E0F8E1] border-0 rounded-xl sm:rounded-[15px] px-1.5 sm:px-2 md:px-2.5 py-1 sm:py-1.5 md:py-2 h-auto gap-1 sm:gap-1.5 flex-shrink-0">
            <span className="text-[10px] sm:text-xs whitespace-nowrap">
              Transaction History
            </span>
            <ChevronRightIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
          </Badge>
        </header>

        {/* Collapsible Content */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isExpanded
              ? "max-h-[600px] opacity-100 mt-3 sm:mt-4"
              : "max-h-0 opacity-0"
          }`}
        >
          {/* Token Balance Display */}
          <div className="flex items-start sm:items-center justify-between gap-3 mb-4 sm:mb-5 flex-col sm:flex-row">
            <div className="flex items-center gap-2 sm:gap-2.5">
              <img
                className="w-7 h-7 sm:w-9 sm:h-9 md:w-[45px] md:h-[45px] flex-shrink-0"
                alt="Coin"
                src="/coin.svg"
              />
              <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-normal text-black break-all">
                {isBalanceLoading
                  ? "Loading..."
                  : balanceError
                  ? "0.00 PUL"
                  : formatNumber(balance)}
              </span>
            </div>

            {/* Reward Points */}
            <div className="flex items-center gap-1.5 sm:gap-2 self-start sm:self-auto">
              <span className="text-[#8c8c8c] text-[11px] sm:text-xs md:text-sm whitespace-nowrap">
                Reward Points:
              </span>
              <span className="text-[#3ea843] text-base sm:text-lg md:text-xl lg:text-2xl font-normal">
                {formatPoints(localRewardPoints)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch gap-2 sm:gap-2 md:gap-[7px] w-full">
            {actionButtons.map((button) => (
              <Button
                key={button.label}
                variant={button.variant}
                className={`w-full sm:flex-1 h-auto gap-1.5 sm:gap-2 p-2 sm:p-2.5 rounded-xl sm:rounded-[15px] text-xs sm:text-sm font-medium ${button.className}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleButtonClick(button.label);
                }}
                disabled={
                  (button.label === "Convert" &&
                    (!localRewardPoints || localRewardPoints <= 0)) ||
                  (button.label === "Withdraw" &&
                    (isBalanceLoading || !balance || Number(balance) <= 0))
                }
              >
                <LayersIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                <span className="whitespace-nowrap">{button.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
