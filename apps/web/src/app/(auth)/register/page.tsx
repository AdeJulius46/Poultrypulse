"use client"
import { useState } from "react";

export default function LoginStepper() {
  const [step, setStep] = useState(1);

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 border-4 border-indigo-500  ">
      <div className="grid w-full h-screen  grid-cols-1 border-4 border-indigo-500  gap-6 rounded-2xl bg-white p-8 shadow-lg md:grid-cols-2">
        {/* Left Stepper */}
        <div className="  w-[400px]  space-y-6 border-r p-8 rounded-md   bg-[#F2F2F2]">
          <h1 className="text-2xl font-semibold text-green-700  mt-[30px]">Poultry Pulse</h1>
          <div className="relative ml-4">
            {[
              "Create Account",
              "Verify your Email",
              "Login your account",
              "Register your Chicken",
            ].map((label, index) => {
              const current = index + 1;
              return (
                <div key={label} className="relative flex items-center gap-4">
                  {/* Circle */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                        step >= current
                          ? "border-green-600 bg-green-600 text-white"
                          : "border-gray-300 text-gray-500"
                      }`}
                    >
                      {current}
                    </div>
                    {/* Connector line */}
                    {current < 4 && (
                      <div
                        className={`h-12 w-0.5 ${
                          step > current ? "bg-green-600" : "bg-gray-300"
                        }`}
                      ></div>
                    )}
                  </div>
                  <span
                    className={`${
                      step >= current ? "text-green-700 font-medium" : "text-gray-500"
                    }`}
                  >
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Form */}
        <div className="rounded-lg p-6 shadow-inner border-4 border-indigo-500 ">
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Create Account</h2>
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
              <button
                className="w-full rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                onClick={nextStep}
              >
                Continue
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Verify your Email</h2>
              <input
                type="text"
                placeholder="Enter verification code"
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
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Login into your Account</h2>
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
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="h-4 w-4" /> Remember me
                </label>
                <a href="#" className="text-green-600">
                  Forgotten Password?
                </a>
              </div>
              <button
                className="w-full rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                onClick={nextStep}
              >
                Login
              </button>
              <div className="relative my-4 text-center text-sm text-gray-500">
                <span className="bg-white px-2">or continue with</span>
              </div>
              <div className="grid gap-2">
                <button className="rounded-md border px-4 py-2 hover:bg-gray-100">
                  Sign in with Metamask
                </button>
                <button className="rounded-md border px-4 py-2 hover:bg-gray-100">
                  Sign in with Google
                </button>
              </div>
              <p className="text-center text-sm">
                Don’t have an account? <a href="#" className="text-green-600">Create an account</a>
              </p>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Register your Chicken</h2>
              <input
                type="text"
                placeholder="Enter Chicken ID"
                className="w-full rounded-md border px-3 py-2 focus:outline-green-600"
              />
              <input
                type="text"
                placeholder="Enter Location"
                className="w-full rounded-md border px-3 py-2 focus:outline-green-600"
              />
              <div className="flex justify-between gap-2">
                <button
                  className="rounded-md border px-4 py-2 hover:bg-gray-100"
                  onClick={prevStep}
                >
                  Back
                </button>
                <button className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700">
                  Register
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}