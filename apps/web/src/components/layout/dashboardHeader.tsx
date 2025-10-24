import { PredictionsSection } from "@/app/(dashboard)/dashboard/PredictionsSection .tsx/page";
import React from "react";

interface Headerprops {
  text: String;
}

const DashboardHeader: React.FC<Headerprops> = ({ text }) => {
  return (
    <div className="flex items-center justify-between px-8 mt-4 mb-4 mx-auto w-full ">
      <h2 className="text-2xl">{text}</h2>
      <PredictionsSection />
    </div>
  );
};

export default DashboardHeader;
