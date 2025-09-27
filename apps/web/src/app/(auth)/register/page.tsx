"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Connector, useConnect } from "wagmi";
import { WalletOptions } from "./wallet";


export default function LoginStepper() {
    const router = useRouter();
  const [step, setStep] = useState(1);

  const steps = [
    { id: 1, label: "Create Account" },
    { id: 2, label: "Verify your Email" },
    { id: 3, label: "Register your Chicken" },
  ];

  const nextStep = () => setStep((prev) => Math.min(prev + 1, steps.length));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 border-4 border-indigo-500">
      <div className="flex  w-full gap-4 h-screen grid-cols-1 rounded-2xl bg-white p-4 shadow-lg md:grid-cols-2">
        {/* Left Stepper */}
        <div className="w-[450px] space-y-6 border-r p-8 rounded-md bg-[#F2F2F2]">
          <div className="mt-[70px] ml-8">
            <Image src={"/poultry.svg"} width={200} height={100} alt="Logo" />
          </div>

          <div className="relative ml-4 mt-[60px]">
            {steps.map((item, index) => (
              <div key={item.id} className="relative flex items-center gap-4">
                {/* Step circle + connector */}
                <div className="flex flex-col items-center">
                  <div>    
                    <Image
                      src={step >= item.id ? "/Ellipse 74.svg" : "/Ellipse2.svg"}
                      alt="connector line"
                      className="m-2 mx-auto h-11"
                      width={100}
                      height={100}
                    />
              
                  </div>
                  {/* Connector image (only if not last) */}
                  {index < steps.length - 1 && (
                    <Image
                      src={step > item.id ? "/Vector 1.svg" : "/Vector 2.svg"}
                      alt="connector line"
                      className="m-2 mx-auto h-11"
                      width={19}
                      height={10}
                    />
                  )}
                </div>

                {/* Label */}
                <span
                  className={`${
                    step >= item.id
                      ? "mt-[-30px] text-black-700 font-medium"
                      : "mt-[-30px] text-gray-500"
                  }`}
                >
                  <div className="flex flex-col ">
                    <span >
                    {`Step ${item.id}`}
                    </span>
                    <span>
                  {item.label}
                    </span>
                  </div>
                  
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Form */}
        <div className=" w-full  flex items-center rounded-lg p-6  ">
          {step === 1 && (
            <div className="space-y-4 mx-auto">
              <h2 className="text-2xl  items-center  ml-[35%] font-semibold">Create Your  Account</h2>
              <p className=" text-center " >
                Let’s get you set up, your journey starts here.
              </p>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-2xl  ml-[10%]   rounded-md border px-3 py-2 focus:outline-green-600"
              />
              <input
                type="email"
                placeholder="Enter your email"
                className="w-2xl ml-[10%]  rounded-md border px-3 py-2 focus:outline-green-600"
              />
              <input
                type="password"
                placeholder="Enter your password"
                className="w-2xl  ml-[10%]  rounded-md border px-3 py-2 focus:outline-green-600"
              />
              <input
                type="password"
                placeholder="repeat your password"
                className="w-2xl ml-[10%]  rounded-md border px-3 py-2 focus:outline-green-600"
              />
              <button
                className="w-2xl ml-[10%]  rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                onClick={nextStep}
              >
              
                  <WalletOptions />
              </button>
             
              <button
                className="w-2xl ml-[10%]   rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                onClick={nextStep}
              >
                  Create account 
              </button>
              <p className=" flex text-center ml-[10%]   mx-auto">
                Have an account already? 
                <span>
                    Login
                </span>
              </p>
            </div>
          )}

          {step === 2 && (

<>
<div className="space-y-4 mx-auto">
              <h2 className="text-2xl  items-center  ml-[35%] font-semibold">Create Your  Account</h2>
              <p className=" text-center " >
                Let’s get you set up, your journey starts here.
              </p>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full rounded-md border px-3 py-2 focus:outline-green-600"
              />
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-md border px-3 py-2 focus:outline-green-600"
              />
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full rounded-md border px-3 py-2 focus:outline-green-600"
              />
              <input
                type="repeat password"
                placeholder="Enter your password"
                className="w-full rounded-md border px-3 py-2 focus:outline-green-600"
              />

              <div className="flex justify-between gap-2">
                <button
                  className="rounded-md border px-4 py-2 hover:bg-gray-100"
                  onClick={prevStep}
                >
                  Back
                </button>
                <button
                  className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                  onClick={nextStep}
                >
                  Verify
                </button>
              </div>

              <button
                className="w-full rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                onClick={nextStep}
              >
                Continue
              </button>
            </div>


  


</>

          )}

          {step === 3 && (
            <div className="space-y-4 mx-auto">
              <h2 className="text-2xl  items-center  ml-[35%] font-semibold">Create Your  Account</h2>
              <p className=" text-center " >
                Let’s get you set up, your journey starts here.
              </p>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-2xl  ml-[10%]   rounded-md border px-3 py-2 focus:outline-green-600"
              />
              <input
                type="email"
                placeholder="Enter your email"
                className="w-2xl ml-[10%]  rounded-md border px-3 py-2 focus:outline-green-600"
              />
              <input
                type="password"
                placeholder="Enter your password"
                className="w-2xl  ml-[10%]  rounded-md border px-3 py-2 focus:outline-green-600"
              />
              <input
                type="password"
                placeholder="repeat your password"
                className="w-2xl ml-[10%]  rounded-md border px-3 py-2 focus:outline-green-600"
              />



                <div className="flex w-2xl  ml-[100px] justify-between gap-2">
                <button
                  className="rounded-md border   px-4 py-2 hover:bg-gray-100"
                  onClick={prevStep}
                >
                  Back
                </button>
                <button
                  className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                onClick={() => router.push("/dashboard")}
                >
                  Verify
                </button>
              </div>

             
            </div>          )}
        </div>
      </div>
    </div>
  );
}
