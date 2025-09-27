"use client";

import { ChevronRightIcon, EyeOffIcon, LayersIcon } from "lucide-react";
// import { Badge } from "../../../../components/ui/badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
// import { Card, CardContent } from "../../../../components/ui/card";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import {
  ppContract,
  pptcontractAbi,
  tokenAbi,
  tokenContract,
} from "../../../../contract";
import { log } from "console";
import { useEffect, useState } from "react";

export const Details = () => {
  const { writeContract } = useWriteContract();
  const { address } = useAccount();

  // Local state for reward points that increments every second
  const [localRewardPoints, setLocalRewardPoints] = useState(0);
  const [isRewardActive, setIsRewardActive] = useState(true);

  // Get token balance
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

  // Get reward points balance from contract (initial value)
  // const {
  //   data: contractRewardPoints,
  //   isLoading: isRewardsLoading,
  //   error: rewardsError,
  //   refetch: refetchRewards,
  // } = useReadContract({
  //   abi: pptcontractAbi,
  //   address: ppContract,
  //   functionName: "getPoints", // Replace with your actual function name for getting points
  //   args: [address],
  // });

  // Initialize local reward points and start the timer
  // useEffect(() => {
  //   if (contractRewardPoints !== undefined && !isRewardActive) {
  //     setLocalRewardPoints(Number(contractRewardPoints.toString()));
  //     setIsRewardActive(true);
  //   }
  // }, [contractRewardPoints, isRewardActive]);

  // Increment reward points every 30 seconds (1 point per 30 seconds)
  useEffect(() => {
    if (!isRewardActive || !address) return;

    const interval = setInterval(() => {
      setLocalRewardPoints((prev) => prev + 1);
    }, 5000); // 30 seconds = 30,000 milliseconds

    return () => clearInterval(interval);
  }, [isRewardActive, localRewardPoints]);

  console.log("Balance error:", balanceError);
  console.log(address);
  


  const addPoints = () => {
    try {
      console.log("Adding points...");
      
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
        convertToPoints()
      }, 4000);
    } catch (error) {
      alert(error);
    }
  };


  const convertToPoints = () => {
    try {
      // Convert reward points to tokens
      const pointsToConvert = localRewardPoints || 0;
      if (pointsToConvert <= 0) {
        alert("No reward points available to convert");
        return;
      }

      writeContract({
        abi: pptcontractAbi,
        address: ppContract,
        functionName: "convertPointsToTokens",
        args: [localRewardPoints], // Convert all available reward points
      });

      // Reset local reward points after conversion
      setLocalRewardPoints(0);

      console.log("Converting reward points to tokens");
    } catch (error) {
      alert(error);
    }
  };

  const withdrawTokens = () => {
    try {
      const tokenBalance = balance || 0;
      if (tokenBalance <= 0) {
        alert("No tokens available to withdraw");
        return;
      }

      writeContract({
        abi: pptcontractAbi,
        address: ppContract,
        functionName: "withdraw",
        args: [tokenBalance], // Withdraw all available tokens
      });
    } catch (error) {
      alert("Withdrawal failed: " + error);
    }
  };

  const addTokens = () => {
    // Add logic for adding tokens/points
    console.log("Add tokens functionality");
    // You might want to open a modal or navigate to an add tokens page
  };

  const handleButtonClick = (buttonLabel: string) => {
    switch (buttonLabel) {
      case "Convert":
        addPoints();
        break;
      case "Withdraw":
        withdrawTokens();
        break;
      case "Add":
        addTokens();
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

  // Format numbers for display with truncation for large numbers and PUL token name
  const formatNumber = (value: any) => {
    if (!value) return "0.00 PUL";
    const num = Number(value.toString());

    let formatted = "";
    // Handle very large numbers with abbreviations
    if (num >= 1e18) {
      formatted = (num / 1e18).toFixed(2) + ""; // Quintillion -> E
    } else if (num >= 1e15) {
      formatted = (num / 1e15).toFixed(2) + ""; // Quadrillion -> P
    } else if (num >= 1e12) {
      formatted = (num / 1e12).toFixed(2) + ""; // Trillion -> T
    } else if (num >= 1e9) {
      formatted = (num / 1e9).toFixed(2) + ""; // Billion -> B
    } else if (num >= 1e6) {
      formatted = (num / 1e6).toFixed(2) + ""; // Million -> M
    } else if (num >= 1e3) {
      formatted = (num / 1e3).toFixed(2) + ""; // Thousand -> K
    } else {
      formatted = num.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }

    return `${formatted} PUL`;
  };

  const formatPoints = (value: any) => {
    if (!value) return "0";
    const num = Number(value.toString());

    // Handle large numbers with abbreviations for points (no token name)
    if (num >= 1e18) {
      return (num / 1e18).toFixed(1) + "E";
    } else if (num >= 1e15) {
      return (num / 1e15).toFixed(1) + "P";
    } else if (num >= 1e12) {
      return (num / 1e12).toFixed(1) + "T";
    } else if (num >= 1e9) {
      return (num / 1e9).toFixed(1) + "B";
    } else if (num >= 1e6) {
      return (num / 1e6).toFixed(1) + "M";
    } else if (num >= 1e3) {
      return (num / 1e3).toFixed(1) + "K";
    }

    return num.toLocaleString("en-US");
  };

  return (
    <Card className="w-[600px] bg-white rounded-3xl border-0 shadow-none">
      <CardContent className="p-6 relative h-[280px]">
        {" "}
        {/* Increased height for reward points */}
        <header className="flex items-end justify-between mb-6">
          <div className="flex items-end gap-5">
            <span className="font-paragraph-small-medium font-[number:var(--paragraph-small-medium-font-weight)] text-[#8c8c8c] text-[length:var(--paragraph-small-medium-font-size)] tracking-[var(--paragraph-small-medium-letter-spacing)] leading-[var(--paragraph-small-medium-line-height)] [font-style:var(--paragraph-small-medium-font-style)]">
              Token Balance
            </span>
            <EyeOffIcon className="w-5 h-5 text-[#8c8c8c]" />
          </div>

          <Badge className="bg-[#dff7e0] text-green hover:bg-[#dff7e0] border-0 rounded-[15px] px-2.5 py-2 h-[33px] gap-2.5">
            <span className="font-paragraph-small-regular font-[number:var(--paragraph-small-regular-font-weight)] text-[length:var(--paragraph-small-regular-font-size)] tracking-[var(--paragraph-small-regular-letter-spacing)] leading-[var(--paragraph-small-regular-line-height)] [font-style:var(--paragraph-small-regular-font-style)]">
              Transaction History
            </span>
            <ChevronRightIcon className="w-3 h-3" />
          </Badge>
        </header>
        {/* Token Balance Display */}
        <div className="flex items-center gap-2.5 mb-6">
          <img className="w-[45px] h-[45px]" alt="Coin" src="/coin.svg" />
          <span className="[font-family:'Aeonik-Regular',Helvetica] font-normal text-black text-3xl tracking-[-0.96px] leading-[52px]">
            {isBalanceLoading
              ? "Loading..."
              : balanceError
              ? "0.00"
              : formatNumber(balance)}
          </span>
        </div>
        {/* Reward Points Display */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <span className="font-paragraph-small-medium font-[number:var(--paragraph-small-medium-font-weight)] text-[#8c8c8c] text-[length:var(--paragraph-small-medium-font-size)] tracking-[var(--paragraph-small-medium-letter-spacing)] leading-[var(--paragraph-small-medium-line-height)] [font-style:var(--paragraph-small-medium-font-style)]">
              Reward Points:
            </span>
            <span className="[font-family:'Aeonik-Regular',Helvetica] font-normal text-[#3ea843] text-2xl tracking-[-0.48px] leading-[26px]">
              {formatPoints(localRewardPoints)}
            </span>
          </div>
          <div className="text-xs text-[#8c8c8c]">
            Click "Convert" to convert points to tokens
          </div>
        </div>
        <div className="flex items-center gap-[7px] absolute bottom-6 left-1/2 transform -translate-x-1/2">
          {actionButtons.map((button, index) => (
            <Button
              key={button.label}
              variant={button.variant}
              className={`w-[180px] h-auto gap-2.5 p-2.5 rounded-[15px] ${button.className}`}
              onClick={() => handleButtonClick(button.label)}
              disabled={
                (button.label === "Convert" &&
                  (
                    !localRewardPoints ||
                    localRewardPoints <= 0)) ||
                (button.label === "Withdraw" &&
                  (isBalanceLoading || !balance || Number(balance) <= 0))
              }
            >
              <LayersIcon className="w-5 h-5" />
              <span className="font-paragraph-medium-regular font-[number:var(--paragraph-medium-regular-font-weight)] text-[length:var(--paragraph-medium-regular-font-size)] tracking-[var(--paragraph-medium-regular-letter-spacing)] leading-[var(--paragraph-medium-regular-line-height)] [font-style:var(--paragraph-medium-regular-font-style)]">
                {button.label}
              </span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
