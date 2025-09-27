import { BotIcon } from "lucide-react";

import { Card, CardContent } from "../../../../components/ui/card";

export const RecommendationsSection = () => {
  const predictions = [
    {
      percentage: "80%",
      title: "24 Healthy Chickens",
      description:
        "Flock condition is stable and safe, with chickens active and feeding normally",
      bgColor: "bg-[#e8f5e9]",
      textColor: "text-[#2e7d32]",
      titleColor: "text-[#18341a]",
      descriptionColor: "text-[#2e7d32]",
      icon: "/frame-224.svg",
    },
    {
      percentage: "13.3%",
      title: "4 Chickens at Risk",
      description:
        "Potential stress factors detected; monitor flock closely to prevent issues.",
      bgColor: "bg-[#fff8e1]",
      textColor: "text-[#ffa500]",
      titleColor: "text-[#18341a]",
      descriptionColor: "text-[#e49300]",
      icon: "/frame-226.svg",
    },
    {
      percentage: "6.7%",
      title: "2 Chickens at Risk",
      description:
        "Potential stress factors detected; monitor flock closely to prevent issues.",
      bgColor: "bg-[#ffebee]",
      textColor: "text-[#ff0000]",
      titleColor: "text-[#18341a]",
      descriptionColor: "text-[#ff4949]",
      icon: "/frame-229.svg",
    },
  ];

  return (
    <div className="w-full max-w-[420px] flex flex-col bg-[#ffffff] rounded-3xl overflow-hidden">
      <div className="ml-[21px] w-[255px] h-[27px] mt-[13px] font-paragraph-large-regular font-[number:var(--paragraph-large-regular-font-weight)] text-[#102311] text-[length:var(--paragraph-large-regular-font-size)] tracking-[var(--paragraph-large-regular-letter-spacing)] leading-[var(--paragraph-large-regular-line-height)] [font-style:var(--paragraph-large-regular-font-style)]">
        AI Predictions from Live Feed
      </div>

      <div className="flex ml-[21px] w-[377px] relative mt-1.5 flex-col items-start gap-[7px]">
        {predictions.map((prediction, index) => (
          <Card
            key={index}
            className={`w-full h-[129px] ${prediction.bgColor} rounded-3xl border-none shadow-none overflow-hidden`}
          >
            <CardContent className="p-0 h-full">
              <div className="inline-flex items-center gap-5 relative top-[calc(50.00%_-_48px)] left-[calc(50.00%_-_168px)]">
                <img
                  className="relative w-[98px] h-[98px]"
                  alt="Frame"
                  src={prediction.icon}
                />

                <div className="flex flex-col w-[219px] items-center relative">
                  <div
                    className={`${prediction.textColor} relative self-stretch mt-[-1.00px] font-heading-h3-regular font-[number:var(--heading-h3-regular-font-weight)] text-[length:var(--heading-h3-regular-font-size)] text-center tracking-[var(--heading-h3-regular-letter-spacing)] leading-[var(--heading-h3-regular-line-height)] [font-style:var(--heading-h3-regular-font-style)]`}
                  >
                    {prediction.percentage}
                  </div>

                  <div
                    className={`relative w-fit [font-family:'Gilroy-Medium-Medium',Helvetica] font-medium ${prediction.titleColor} text-sm tracking-[-0.28px] leading-[normal]`}
                  >
                    {prediction.title}
                  </div>

                  <div
                    className={`relative w-[206px] [font-family:'Poppins',Helvetica] font-normal ${prediction.descriptionColor} text-[8px] text-center tracking-[0] leading-[normal]`}
                  >
                    {prediction.description}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="inline-flex ml-[21px] w-[174px] h-6 relative mt-[11px] items-center gap-[3px]">
        <div className="relative w-fit mt-[-1.00px] [font-family:'Poppins',Helvetica] font-normal text-[#102311] text-base tracking-[-0.48px] leading-[normal]">
          Recommendations
        </div>

        <BotIcon className="relative w-6 h-6" />
      </div>

      <Card className="ml-[21px] w-[377px] h-28 mt-2.5 bg-[#e8f5e9] rounded-xl border-none shadow-none overflow-hidden m-4 px-2">
        <CardContent className="p-0 h-full">
          <div className="mt-[9px] w-[292px] h-[95px] ml-1.5 x-2 [font-family:'Poppins',Helvetica] font-normal text-[#18341a] text-[10px] tracking-[-0.20px] leading-[19px]">
            <span className="font-light tracking-[-0.02px] ">
              Increase airflow in the poultry house to reduce heat stress.
              <br />
              Add electrolytes or vitamins to water to support recovery.
              <br />
              Provide cool, clean drinking water to prevent dehydration.
              <br />
              Disinfect water lines to prevent bacterial growth.
              <br />
              Clean and dry litter to minimize moisture buildup.
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
