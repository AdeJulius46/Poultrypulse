import { ChevronRightIcon, EyeOffIcon, LayersIcon } from "lucide-react";
// import { Badge } from "../../../../components/ui/badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
// import { Card, CardContent } from "../../../../components/ui/card";

export const Details = () => {
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

  return (
    <Card className="w-[700px ] bg-white rounded-3xl border-0 shadow-none">
      <CardContent className="p-6 relative h-[218px]">
        <header className="flex items-end justify-between mb-8">
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

        <div className="flex items-center gap-2.5 mb-12">
          <img className="w-[45px] h-[45px]" alt="Coin" src="/coin.svg" />
          <span className="[font-family:'Aeonik-Regular',Helvetica] font-normal text-black text-5xl tracking-[-0.96px] leading-[52px]">
            2540.67
          </span>
        </div>

        <div className="flex items-center gap-[7px] absolute bottom-6 left-1/2 transform -translate-x-1/2">
          {actionButtons.map((button, index) => (
            <Button
              key={button.label}
              variant={button.variant}
              className={`w-[180px] h-auto gap-2.5 p-2.5 rounded-[15px] ${button.className}`}
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
