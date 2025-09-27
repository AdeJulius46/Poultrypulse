import { Details } from "./details/page";

export default function DashboardPage() 

{

  return (
   <div className="bg-[#f2f2f2] p-6">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-3 flex flex-col">
          {/* <DashboardHeaderSection /> */}
          {/* <TokenBalanceSection /> */}
        </div>

        <div className="col-span-5 flex flex-col gap-6">
          {/* <PoultryMetricsSection /> */}
          <Details />
          {/* <ActionButtonsSection /> */}
        </div>

        <div className="col-span-4 flex flex-col gap-6">
          {/* <PredictionsSection /> */}
          {/* <RecommendationsSection /> */}
        </div>

        <div className="col-span-9 col-start-4">
          {/* <LiveFeedSection /> */}
        </div>
      </div>
    </div>
  );
}
