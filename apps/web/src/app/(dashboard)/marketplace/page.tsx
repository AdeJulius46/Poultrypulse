import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {HeartIcon } from "lucide-react";


export default function ContentPage() {



  const poultryProducts = [
  {
    id: 1,
    image: "/Rectangle 95.png",
    title: "Premium Broiler",
    farm: "from Jireh Farms",
    description: "Healthy, free-range chickens with complete health monitoring",
    price: "$10",
    unit: "per bird",
    healthScore: 90,
    feedQuality: "Organic Premium",
    age: "16 Weeks",
    weight: "2.3kg",
    showDetails: true,
  },
  {
    id: 2,
    image: "/Rectangle 100.png",
    title: "Premium Layers",
    farm: "from Jireh Farms",
    description: "Healthy, free-range chickens with complete health monitoring",
    price: "$10",
    unit: "per bird",
    showDetails: false,
  },
  {
    id: 3,
    image: "/Rectangle 100.png",
    title: "Premium Neulers",
    farm: "from Garone Farms",
    description: "Healthy, free-range chickens with complete health monitoring",
    price: "$10",
    unit: "per bird",
    showDetails: false,
  },
  {
    id: 4,
    image: "/Rectangle 95.png",
    title: "Premium Neulers",
    farm: "from Garone Farms",
    description: "Healthy, free-range chickens with complete health monitoring",
    price: "$10",
    unit: "per bird",
    showDetails: false,
  },

];

const farms = [
  {
    id: 1,
    name: "Jireh Farms",
    location: "Ogbomoso, Nigeria",
    rating: 3.5,
    image: "/chick.png",
  },
  {
    id: 2,
    name: "Garone Farms",
    location: "Osogbo, Nigeria",
    rating: 3.5,
    image: "/chick.png",
  },
  {
    id: 3,
    name: "Tonifer Farms",
    location: "Ogbomoso, Nigeria",
    rating: 3.5,
    image: "/chick.png",
  },
  {
    id: 4,
    name: "Tonifer Farms",
    location: "Ogbomoso, Nigeria",
    rating: 3.5,
    image: "/chick.png",
  },

];

    return (
      <div className="container py-6">
        {/* <h1 className="text-2xl font-bold">Contents</h1> */}
        
         <main className="flex-1 p-6 overflow-auto  ">
        <header className="flex items-center justify-between mb-8">
          <h1 className="font-heading-h2-medium text-[#000000] text-[24px] tracking-[var(--heading-h2-medium-letter-spacing)] font-[500] leading-[var(--heading-h2-medium-line-height)] [font-style:var(--heading-h2-medium-font-style)]">
            Marketplace
          </h1>

          <div className="flex items-center gap-[26px]">
            <div className="flex items-center gap-1">
              <Button className="h-auto bg-[linear-gradient(264deg,rgba(54,146,59,1)_0%,rgba(39,174,46,1)_100%)] px-8 py-3.5 rounded-[50px] [font-family:'Afacad',Helvetica] font-bold text-[#ffffff] text-lg">
                + Add New Batch
              </Button>
              <Button
                variant="outline"
                className="h-auto bg-[#f2f2f2] px-8 py-3.5 rounded-[50px] border-[#3ea843] [font-family:'Afacad',Helvetica] font-bold text-[#2e7d32] text-lg"
              >
                <img
                  className="w-6 h-6 mr-2"
                  alt="Token branded"
                  src="/token-branded-metamask.svg"
                />
                Connect Wallet
              </Button>
            </div>

            <div className="flex items-center gap-1.5">
              <Avatar className="w-10 h-10 border-[1.6px] border-[#7dcf81]">
                <AvatarImage src="/ellipse-75-1.png" alt="John Ayodeji" />
                <AvatarFallback>JA</AvatarFallback>
              </Avatar>

              <div className="relative">
                <div className="w-6 h-[27px]">
                  <img
                    className="absolute w-6 h-[19px] top-1 left-0"
                    alt="Vector"
                    src="/vector-2.svg"
                  />
                  <img
                    className="absolute w-1.5 h-1.5 top-0 left-[9px]"
                    alt="Vector"
                    src="/vector.svg"
                  />
                  <img
                    className="absolute w-[9px] h-1.5 top-[21px] left-2"
                    alt="Vector"
                    src="/vector-1.svg"
                  />
                </div>
                <Badge className="absolute -top-1 -right-1 w-4 h-4 p-0 flex items-center justify-center bg-[#ff0000] text-[#ffffff] text-[10.8px] [font-family:'Aeonik-Medium',Helvetica] font-medium rounded-full">
                  3
                </Badge>
              </div>
            </div>
          </div>
        </header> 

      <div className="flex gap-5 mb-8">
          <div className="flex-1 bg-[#7dcf81] rounded-3xl overflow-hidden flex items-center justify-center h-[150px]">
            <img
              className="w-[171px] h-[38px]"
              alt="Untitled design"
              src="/game.png"
            />
          </div>
          <div className="flex-1 bg-[#7dcf81] rounded-3xl overflow-hidden flex items-center justify-center h-[150px]">
            <img
              className="w-[171px] h-[38px]"
              alt="Untitled design"
              src="/game.png"
            />
          </div>
        </div> 

        <section className="mb-12">
          <h2 className="font-heading-h3-medium text-[#000000] text-[24px] tracking-[var(--heading-h2-medium-letter-spacing)] font-[500]   tracking-[var(--heading-h3-medium-letter-spacing)] leading-[var(--heading-h3-medium-line-height)] [font-style:var(--heading-h3-medium-font-style)] mb-6">
            Fast Selling Poultry
          </h2>

          <div className="flex gap-5 overflow-x-auto pb-4">
            {poultryProducts.map((product) => (
              <Card
                key={product.id}
                className="min-w-[225px] bg-[#ffffff] rounded-2xl border-[#f0f0f0] shadow-[0px_2px_4px_#0000000d] overflow-hidden"
              >
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      className="w-full h-[123px] object-cover"
                      alt={product.title}
                      src={product.image}
                    />
                    <button className="absolute top-2 right-2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                      <HeartIcon className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>

                  <div className="flex flex-col gap-4 p-3">
                    <div className="flex flex-col gap-1.5">
                      <div className="[font-family:'Inter',Helvetica] font-normal text-[#1d2128] text-sm">
                        {product.title}
                      </div>
                      <div className="[font-family:'Inter',Helvetica] font-bold text-[#3ea843] text-[10px]">
                        {product.farm}
                      </div>
                      <div className="[font-family:'Inter',Helvetica] font-normal text-[#1d2128] text-[8px]">
                        {product.description}
                      </div>
                    </div>

                    <div className="flex items-start gap-1">
                      <div className="[font-family:'Inter',Helvetica] font-bold text-[#1d2128] text-sm">
                        {product.price}
                      </div>
                      <div className="opacity-50 [font-family:'Inter',Helvetica] font-normal text-[#1d2128] text-[8px]">
                        {product.unit}
                      </div>
                    </div>

                    {product.showDetails && (
                      <div className="bg-[#e8f5e9] rounded-xl p-2">
                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between items-center">
                            <span className="[font-family:'Inter',Helvetica] text-[#1d2128] text-[8px]">
                              Health Score:
                            </span>
                            <span className="[font-family:'Inter',Helvetica] font-bold text-[#3ea843] text-[8px]">
                              {product.healthScore}%
                            </span>
                          </div>
                          <Progress
                            value={product.healthScore}
                            className="h-1 bg-[#d9d9d9]"
                          />
                          <div className="flex justify-between items-center">
                            <span className="[font-family:'Inter',Helvetica] text-[#1d2128] text-[8px]">
                              Feed Quality:
                            </span>
                            <span className="[font-family:'Inter',Helvetica] font-bold text-[#3ea843] text-[8px]">
                              {product.feedQuality}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <div className="flex gap-1">
                              <span className="[font-family:'Inter',Helvetica] text-[#1d2128] text-[8px]">
                                Age:
                              </span>
                              <span className="[font-family:'Inter',Helvetica] text-[#1d2128] text-[8px]">
                                {product.age}
                              </span>
                            </div>
                            <div className="flex gap-1">
                              <span className="[font-family:'Inter',Helvetica] text-[#1d2128] text-[8px]">
                                Weight:
                              </span>
                              <span className="[font-family:'Inter',Helvetica] text-[#1d2128] text-[8px]">
                                {product.weight}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button className="flex-1 h-auto bg-[#3ea843] px-[13px] py-1.5 rounded-[15px] [font-family:'Inter',Helvetica] font-normal text-[#ffffff] text-[11px] hover:bg-[#2e7d32]">
                        + Add to Cart
                      </Button>
                      <Button
                        variant="outline"
                        className="h-auto border-[#3ea843] px-[13px] py-1.5 rounded-[15px] [font-family:'Inter',Helvetica] font-normal text-[#3ea843] text-[11px]"
                      >
                        Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-heading-h3 text-[#000000] text-[24px] tracking-[var(--heading-h2-medium-letter-spacing)] font-[500]   tracking-[var(--heading-h3-medium-letter-spacing)] leading-[var(--heading-h3-medium-line-height)] [font-style:var(--heading-h3-medium-font-style)] mb-6">
            Most Visited Farms
          </h2>

          <div className="flex gap-5 overflow-x-auto pb-4">
            {farms.map((farm) => (
              <Card
                key={farm.id}
                className="min-w-[225px] bg-[#ffffff] rounded-2xl border-[#f0f0f0] overflow-hidden"
              >
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      className="w-full h-[123px] object-cover"
                      alt={farm.name}
                      src={farm.image}
                    />
                    <button className="absolute top-2 right-2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                      {/* <HeartIcon className="w-4 h-4 text-gray-600" /> */}
                    </button>
                  </div>

                  <div className="flex flex-col gap-4 p-3">
                    <div className="flex flex-col gap-1.5">
                      <div className="[font-family:'Inter',Helvetica] font-normal text-[#1d2128] text-sm">
                        {farm.name}
                      </div>
                      <div className="[font-family:'Inter',Helvetica] font-normal text-[#1d2128] text-[10px]">
                        {farm.location}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <img className="w-4 h-4" alt="Frame" src="/frame.svg" />
                      <div className="[font-family:'Inter',Helvetica] font-normal text-[#1d2128] text-[10px]">
                        {farm.rating}
                      </div>
                    </div>

                    <Button className="w-full h-auto bg-[#3ea843] px-[13px] py-1.5 rounded-[15px] [font-family:'Inter',Helvetica] font-normal text-[#ffffff] text-[11px] hover:bg-[#2e7d32]">
                      Visit Farm
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
      </div>
    );
  }
  