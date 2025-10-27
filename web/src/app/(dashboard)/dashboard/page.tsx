"use client";

import { ActionButtonsSection } from "@/components/ActionButtonSection";
import DashboardHeader from "@/components/layout/dashboardHeader";
import { Details } from "@/components/details";
import { RecommendationsSection } from "@/components/recommendationSection";

export default function DashboardPage() {
  return (
    <div className="bg-[#f2f2f2] max-w-7xl mx-auto p-6  lg:p-0 pt-3 w-full sm:p-4 md:p-6">
      {/* Mobile: Stack vertically, Tablet: 2 columns, Desktop: Side by side */}
      <DashboardHeader text={"Dashboard"} />
      <div className="flex flex-col lg:flex-row w-full mx-auto">
        {/* Left Column - Token Balance & Video Feed */}

        <div className="flex flex-col sm:gap-6 gap-6 w-full lg:px-3 lg:w-[60%] ">
          {/* <Details /> */}
          <ActionButtonsSection />
        </div>

        {/* Right Column - Predictions & Recommendations */}
        <div className="flex flex-col gap-4 sm:gap-6 mt-4  w-full lg:w-[40%] ">
          <RecommendationsSection />
        </div>
      </div>
    </div>
  );
}
