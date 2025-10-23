// "use client";

// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";

// export default function Home() {
//   const router = useRouter();

//   return (
//     <div className="flex mt-2px  border-black  min-h-screen overflow-hidden">
//       {/* Left Section */}
//       <div className="w-full lg:w-4/10 flex flex-col  bg-white  justify-center p-6 lg:p-12 xl:p-16">
//         <div className="max-w-[400px] mx-auto lg:mx-0">
//           {/* Logo */}
//           {/* <div className="mb-12">
//             <Image
//               src="/logo.png"
//               alt="Logo"
//               width={140}
//               height={37}
//               className="dark:invert"
//             />
//           </div> */}

//           {/* Content */}
//           <h1 className="flex">
//             <span>
//             <Image 
//             src="/poultry.svg"
//               alt="Dashboard"
//               width={500}
//               height={500}
//               className="rounded-lg  mb-4 w-full h-auto"
//               priority
            
//             />
//             </span>
//             {/* <span>Poultry Pulse</span> */}
//           </h1>
//           <h1 className="text-3xl lg:text-4xl font-bold mb-4">Protect Your Flock with Confidence</h1>
//           <p className="text-muted-foreground mb-8">
//             We&apos;ll check if you have an account, and help create one if you
//             don&apos;t.
//           </p>

//           {/* Form */}
//           <div className="space-y-4">
//             {/* <Input
//               type="email"
//               placeholder="Email Address"
//               className="w-full"
//             /> */}
//             <Button
//               onClick={() => router.push("/register")}
//               className="w-full bg-[#3EA843]  hover:bg-primary-blue-hover text-white font-medium"
//             >
//               Continue →
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* Right Section */}
//       <div className="hidden lg:block w-6/10 relative bg-[#1C2128] overflow-hidden">
//         {/* Yellow curved background */}
//         <div className="absolute w-[100%] h-full bg-primary-blue rounded-l-[100px]">
//           {/* Dashboard Screenshot */}
//           <div className="absolute top-4/10 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] ">
//             <Image
//               src="/logo2.png"
//               alt="Dashboard"
//               width={500}
//               height={500}
//               className="rounded-lg shadow-2xl w-full h-auto"
//               priority
//             />
//           </div>

//           {/* Floating Elements */}
//           {/* <div className="absolute top-[15%] left-[15%]">
//             <Image
//               src="/avatar1.png"
//               alt="User Avatar"
//               width={64}
//               height={64}
//               className="rounded-full ring-4 ring-white shadow-lg"
//             />
//           </div>
//           <div className="absolute bottom-[20%] right-[15%]">
//             <Image
//               src="/avatar2.png"
//               alt="User Avatar"
//               width={64}
//               height={64}
//               className="rounded-full ring-4 ring-white shadow-lg"
//             />
//           </div> */}

//           {/* Testimonial */}
//           {/* <div className="absolute bottom-[2%] left-[2%] bg-white p-6 rounded-xl shadow-xl max-w-[320px]">
//             <p className="text-lg font-medium mb-4">
//               &ldquo;SocialBee provides such a wonderful service! I&apos;m with
//               them for life now.&rdquo;
//             </p>
//             <div className="flex items-center gap-3">
//               <Image
//                 src="/testimonial-avatar.png"
//                 alt="Testimonial"
//                 width={48}
//                 height={48}
//                 className="rounded-full ring-2 ring-primary-blue"
//               />
//               <div>
//                 <p className="font-semibold">Kathy Goughenour</p>
//                 <p className="text-sm text-muted-foreground">
//                   Founder at Virtual Expert Training
//                 </p>
//               </div>
//             </div>
//           </div> */}
//         </div>
//       </div>
//     </div>
//   );
// }



















"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { ProblemsSection } from "@/components/sections/problems-section";
import { FeaturesSection } from "@/components/sections/features-section";
import { DetailedFeaturesSection } from "@/components/sections/detailed-features-section";
import { PricingSection } from "@/components/sections/pricing-section";
import { CTASection } from "@/components/sections/cta-section";
import { Footer } from "@/components/sections/footer";


export default function Home() {
  const router = useRouter();
  return (
    <div className="min-h-screen relative">
      <Navbar />
      <main className="bg-black w-full min-w-[1440px] min-h-[1024px] relative">
      <img
        className="object-cover absolute top-[calc(50.00%_-_492px)] left-[calc(50.00%_-_698px)] w-[1397px] h-[984px] rounded-xl"
        alt="Rectangle"
        src="/rectangle-172.png"
      />

      <div className="bg-[#000000d9] absolute top-[calc(50.00%_-_492px)] left-[calc(50.00%_-_698px)] w-[1397px] h-[984px] rounded-xl" />


      <div className="inline-flex items-center gap-[4.82px] absolute top-[243px] left-[82px]">
        <div className="bg-green-900 px-8 py-2.5 rounded-2xl">
          <span className="text-white font-medium text-lg">
            Web3 Powered Poultry Management
          </span>
        </div>
      </div>


      <section className="absolute top-[349px] left-[81px] w-[455px]">
        <h1 className="[font-family:'Gilroy-SemiBold-SemiBold',Helvetica] font-semibold text-white text-[38px] tracking-[-0.76px] leading-[39px]">
          Predict. Prevent.
          <br />
          Prosper.
        </h1>
      </section>

      <section className="absolute top-[458px] left-[82px] w-[435px]">
        <p className="font-paragraph-large-regular font-[number:var(--paragraph-large-regular-font-weight)] text-[#ededed] text-[length:var(--paragraph-large-regular-font-size)] tracking-[var(--paragraph-large-regular-letter-spacing)] leading-[var(--paragraph-large-regular-line-height)] [font-style:var(--paragraph-large-regular-font-style)]">
          PoultryPulse revolutionizes poultry farming with cutting-edge AI
          analytics and blockchain transparency. Monitor health, optimize feed,
          track production, and ensure supply chain integrity—all in one
          intelligent platform.
        </p>
      </section>

      <div className="absolute top-[580px] left-[82px] h-[72px] w-[500px] flex gap-4">
        <Button 
          className="px-10 py-6 rounded-xl bg-[linear-gradient(180deg,rgba(54,146,59,1)_0%,rgba(39,174,46,1)_100%)] hover:bg-[linear-gradient(180deg,rgba(54,146,59,0.9)_0%,rgba(39,174,46,0.9)_100%)] border-0 text-lg font-medium"   
          onClick={() => router.push("/register")}
        >
          Create Account
        </Button>

        <Button 
          className="px-10 py-6 rounded-xl bg-white text-green-600 hover:bg-gray-100 transition-colors duration-200 text-lg font-medium"   
          onClick={() => router.push("/login")}
        >
          Login
        </Button>
      </div>

      <img
        className="top-[calc(50.00%_-_287px)] left-[582px] absolute w-[752px] h-[535px] rounded-xl object-cover"
        alt="Group"
        src="/group-150-2.png"
      />
      </main>
      
      {/* Problems Section */}
      <ProblemsSection />
      
      {/* Features Section */}
      <FeaturesSection />
      
      {/* Detailed Features Section */}
      <DetailedFeaturesSection />
      
      {/* Pricing Section */}
      <PricingSection />
      
      {/* CTA Section */}
      <CTASection />
      
      {/* Footer */}
      <Footer />
    </div>
  );
};
