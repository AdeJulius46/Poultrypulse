import { Details } from "./details/page";
import { ActionButtonsSection } from "./ActionButtonsSection.tsx/page";
import { PredictionsSection } from "./PredictionsSection .tsx/page";
import { RecommendationsSection } from "./RecommendationsSection.tsx/page";

export default function DashboardPage() {
  return (
    <div className="bg-[#f2f2f2] p-6">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-4 flex flex-col gap-6">
          <Details />
          <ActionButtonsSection />
        </div>

        <div className="w-[430px] ml-[290px] flex flex-col gap-6">
          <PredictionsSection />
          <RecommendationsSection />
        </div>

        <div className="col-span-9">
          {/* <LiveFeedSection /> */}
        </div>
      </div>
    </div>
  );
}
