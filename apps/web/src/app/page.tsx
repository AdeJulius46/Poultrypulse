"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex mt-2px border-4 border-indigo-500  border-black  min-h-screen overflow-hidden">
      {/* Left Section */}
      <div className="w-full lg:w-4/10 flex flex-col  border-4 border-indigo-500  justify-center p-6 lg:p-12 xl:p-16">
        <div className="max-w-[400px] mx-auto lg:mx-0">
          {/* Logo */}
          {/* <div className="mb-12">
            <Image
              src="/logo.png"
              alt="Logo"
              width={140}
              height={37}
              className="dark:invert"
            />
          </div> */}

          {/* Content */}
          <h1 className="flex">
            <span>
            <Image 
            src="/logo1.svg"
              alt="Dashboard"
              width={500}
              height={500}
              className="rounded-lg shadow-2xl w-full h-auto"
              priority
            
            />
            </span>
            <span>Poultry Pulse</span>
          </h1>
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">Protect Your Flock with Confidence</h1>
          <p className="text-muted-foreground mb-8">
            We&apos;ll check if you have an account, and help create one if you
            don&apos;t.
          </p>

          {/* Form */}
          <div className="space-y-4">
            <Input
              type="email"
              placeholder="Email Address"
              className="w-full"
            />
            <Button
              onClick={() => router.push("/login")}
              className="w-full bg-royal-blue hover:bg-primary-blue-hover text-white font-medium"
            >
              Continue →
            </Button>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="hidden lg:block w-6/10 relative bg-[#1C2128] overflow-hidden">
        {/* Yellow curved background */}
        <div className="absolute w-[100%] h-full bg-primary-blue rounded-l-[100px]">
          {/* Dashboard Screenshot */}
          <div className="absolute top-1/10 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] ">
            <Image
              src="/dashboard.png"
              alt="Dashboard"
              width={500}
              height={500}
              className="rounded-lg shadow-2xl w-full h-auto"
              priority
            />
          </div>

          {/* Floating Elements */}
          {/* <div className="absolute top-[15%] left-[15%]">
            <Image
              src="/avatar1.png"
              alt="User Avatar"
              width={64}
              height={64}
              className="rounded-full ring-4 ring-white shadow-lg"
            />
          </div>
          <div className="absolute bottom-[20%] right-[15%]">
            <Image
              src="/avatar2.png"
              alt="User Avatar"
              width={64}
              height={64}
              className="rounded-full ring-4 ring-white shadow-lg"
            />
          </div> */}

          {/* Testimonial */}
          {/* <div className="absolute bottom-[2%] left-[2%] bg-white p-6 rounded-xl shadow-xl max-w-[320px]">
            <p className="text-lg font-medium mb-4">
              &ldquo;SocialBee provides such a wonderful service! I&apos;m with
              them for life now.&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <Image
                src="/testimonial-avatar.png"
                alt="Testimonial"
                width={48}
                height={48}
                className="rounded-full ring-2 ring-primary-blue"
              />
              <div>
                <p className="font-semibold">Kathy Goughenour</p>
                <p className="text-sm text-muted-foreground">
                  Founder at Virtual Expert Training
                </p>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
