"use client";
import React, { useEffect, useState, ChangeEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { WalletOptions } from "./wallet";
import magic from "@/lib/magic";
import { getBlade } from "@/lib/blade";

export default function LoginStepper() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [selectedValues, setSelectedValues] = useState("");
  const [userType, setUserType] = useState<"Buyer" | "Farmer" | null>(null);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    farmName: "",
    batchName: "",
    deviceId: "",
    breedType: "",
    numberOfChickens: "",
    location: "",
  });
  const [showConnectButton, setShowConnectButton] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  const options = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ];

  const steps = [
    { id: 1, label: "Select User Type" },
    { id: 2, label: "Create Account" },
    { id: 3, label: "Verify your Email" },
    { id: 4, label: userType === "Farmer" ? "Register your Chicken" : "" },
  ];

  const nextStep = () => setStep((prev) => Math.min(prev + 1, steps.length));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  // handle Value change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.name, e.target.value);

    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Sign Up
  const handleSignUp = async () => {
    setLoading(true);
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: "http://localhost:3000/callback",
        },
      });
      if (signUpError) {
        alert(signUpError.message);
        setLoading(false);
        return;
      }

      const signUpUser = data?.user ?? null;
      if (!signUpUser) {
        setLoading(false);
        throw new Error(
          "Sign up completed but no user was returned by Supabase."
        );
      }

      const { error: profileError } = await supabase.from("profiles").insert({
        id: signUpUser.id,
        display_name: displayName,
        usertype: userType,
      });

      if (profileError) throw profileError;

      alert("Check your email for the confirmation link!");
      nextStep(); // Move to "Verify Email" step
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert(String(error));
      }
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Confirm Email
  const confirmEmail = () => {
    if (!displayName) {
      alert("Enter your full name");
      return;
    } else if (!email) {
      alert("Enter your email");
      return;
    } else if (!password) {
      alert("Enter your password");
      return;
    } else if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    handleSignUp(); // Trigger sign-up
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(user);
    try {
      setLoading(true);
      if (user?.id) {
        const { error: farmError } = await supabase
          .from("farms")
          .insert({
            id: user.id,
            farm_name: formData.farmName,
            batch_name: formData.batchName,
            deviceid: formData.deviceId,
            breed_type: formData.breedType,
            numberofchickens: formData.numberOfChickens,
            location: formData.location,
          })
          .select();

        router.push("/dashboard");
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert(String(error));
      }
    } finally {
      setLoading(false);
    }
  };
  // Handle auth state changes
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log(event, session);
        setUser(session?.user ?? null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Move to next step when user is authenticated
  useEffect(() => {
    if (user) {
      console.log(user);
      const fetchProfile = async () => {
        const { data } = await supabase.auth.getUser();
        const _authUser = data?.user ?? null;
        if (_authUser) {
          setAuthUser(_authUser);
          const { data: profileData, error } = await supabase
            .from("profiles")
            .select("usertype")
            .eq("id", _authUser.id)
            .single();

          if (error) {
            console.error(error);
          } else if (profileData) {
            if (profileData.usertype === "Buyer") {
              router.push("/dashboard");
            } else if (profileData.usertype === "Farmer") {
              setUserType("Farmer");
              setStep(4);
            }
            // setDisplayName(profileData.display_name);
          }
        }
      };
      fetchProfile();
      // setStep(4);
    }
  }, [user]);

  console.log("Display Name", displayName);

  const handleConnectWallet = async () => {
    try {
      setConnecting(true);
      setError(null);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        throw new Error("Please log in first");
      }

      // Initialize Blade
      const blade = await getBlade();

      if (!blade) {
        throw new Error("Failed to initialize Blade wallet");
      }

      const accountInfo = await blade.createHederaAccount();
    } catch (error) {}
  };

  const checkExistingWallet = async () => {
    try {
      setLoading(true);
      setError(null);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        setLoading(false);
        return;
      }

      // Check if wallet exists in database
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("hedera_wallet, hedera_account_id")
        .eq("id", session.user.id)
        .single();

      if (profileError && profileError.code !== "PGRST116") {
        // PGRST116 is "not found" error, which is okay
        throw profileError;
      }

      if (profile?.hedera_wallet) {
        // User already has a wallet saved
        setWalletAddress(profile.hedera_wallet);
        setAccountId(profile.hedera_account_id);
      } else {
        // No wallet found, show connect button
        setShowConnectButton(true);
      }
    } catch (err: any) {
      console.error("Error checking wallet:", err);
      setError("Failed to check wallet status");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkExistingWallet();
  }, []);

  const logOut = async () => {
    try {
      await magic.user.logout();
      console.log(await magic.user.isLoggedIn()); // => `false`
    } catch {
      // Handle errors if required!
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row w-full max-w-screen mx-auto gap-4 min-h-[calc(100vh-2rem)] bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Left Stepper - Hidden on mobile, shown on desktop */}
        <div className="hidden lg:block lg:w-[450px] lg:min-w-[400px] border-r bg-[#F2F2F2] p-8 rounded-l-md">
          <div className="mt-[70px] ml-8">
            <Image src={"/poultry.svg"} width={200} height={100} alt="Logo" />
          </div>

          <div className="relative ml-4 mt-[60px]">
            {steps.map((item, index) => (
              <div key={item.id} className="relative flex items-center gap-4">
                <div className="flex flex-col items-center">
                  <div>
                    <Image
                      src={
                        step >= item.id ? "/Ellipse 74.svg" : "/Ellipse2.svg"
                      }
                      alt="connector line"
                      className="m-2 mx-auto h-11"
                      width={100}
                      height={100}
                    />
                  </div>
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
                <span
                  className={`${
                    step >= item.id
                      ? "mt-[-30px] text-black-700 font-medium"
                      : "mt-[-30px] text-gray-500"
                  }`}
                >
                  <div className="flex flex-col">
                    <span>{`Step ${item.id}`}</span>
                    <span>{item.label}</span>
                  </div>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Step Indicator - Only visible on mobile */}
        <div className="lg:hidden bg-white px-4 pt-6 pb-2">
          <div className="flex items-center justify-center mb-4">
            <Image src={"/poultry.svg"} width={150} height={75} alt="Logo" />
          </div>
          <div className="flex items-center justify-center space-x-2 mb-4">
            {steps.map((item, index) => (
              <div key={item.id} className="flex items-center">
                <div
                  className={`h-2 w-2 rounded-full ${
                    step >= item.id ? "bg-green-600" : "bg-gray-300"
                  }`}
                />
                {index < steps.length - 1 && (
                  <div
                    className={`h-0.5 w-8 sm:w-12 ${
                      step > item.id ? "bg-green-600" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-gray-600">
            Step {step} of {steps.length}: {steps[step - 1].label}
          </p>
        </div>

        {/* Right Form */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
          {step === 1 && (
            <div className="space-y-6 w-full max-w-md mx-auto">
              <h2 className="text-xl sm:text-2xl text-center font-semibold">
                Welcome to Poultry Pulse
              </h2>
              <p className="text-center text-sm sm:text-base text-[#6E6E6E]">
                Let's get started! First, tell us who you are.
              </p>

              <div className="space-y-4">
                <button
                  onClick={() => {
                    setUserType("Farmer");
                    nextStep();
                  }}
                  className={`w-full p-6 rounded-xl border-2 cursor-pointer transition-all hover:border-green-500 hover:shadow-lg ${
                    userType === "Farmer"
                      ? "border-green-600 bg-green-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl">
                        🌾
                      </div>
                      <div className="text-left">
                        <h3 className="text-lg font-semibold text-gray-900">
                          I'm a Farmer
                        </h3>
                        <p className="text-sm text-gray-600">
                          Manage your poultry farm and track your chickens
                        </p>
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        userType === "Farmer"
                          ? "border-green-600 bg-green-600"
                          : "border-gray-300"
                      }`}
                    >
                      {userType === "Farmer" && (
                        <svg
                          className="w-3 h-3 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setUserType("Buyer");
                    nextStep();
                  }}
                  className={`w-full p-6 rounded-xl border-2 transition-all cursor-pointer hover:border-green-500 hover:shadow-lg ${
                    userType === "Buyer"
                      ? "border-green-600 bg-green-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                        🛒
                      </div>
                      <div className="text-left">
                        <h3 className="text-lg font-semibold text-gray-900">
                          I'm a Buyer
                        </h3>
                        <p className="text-sm text-gray-600">
                          Purchase healthy chickens from verified farms
                        </p>
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        userType === "Buyer"
                          ? "border-green-600 bg-green-600"
                          : "border-gray-300"
                      }`}
                    >
                      {userType === "Buyer" && (
                        <svg
                          className="w-3 h-3 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                </button>
              </div>

              <div className="w-full flex justify-center items-center pt-4">
                <p className="text-sm sm:text-base">
                  Have an account already?
                  <span
                    className="text-blue-700 ml-2 cursor-pointer hover:underline"
                    onClick={() => router.push("/login")}
                  >
                    Login
                  </span>
                </p>
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-4 w-full max-w-md mx-auto">
              <h2 className="text-xl sm:text-2xl text-center font-semibold">
                Create Your Account
              </h2>
              <p className="text-center text-sm sm:text-base text-[#6E6E6E]">
                Let's get you set up, your journey starts here.
              </p>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full rounded-md border px-3 py-2 focus:outline-green-600"
                onChange={(e) => setDisplayName(e.target.value)}
              />
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-md border px-3 py-2 focus:outline-green-600"
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full rounded-md border px-3 py-2 focus:outline-green-600"
                onChange={(e) => setPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="Repeat your password"
                className="w-full rounded-md border px-3 py-2 focus:outline-green-600"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                className="w-full rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 cursor-pointer flex items-center justify-center transition-colors"
                onClick={confirmEmail}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <> Create account </>
                )}
              </button>
              <div className="w-full flex justify-center items-center">
                <p className="text-sm sm:text-base">
                  Have an account already?
                  <span
                    className="text-blue-700 ml-2 cursor-pointer hover:underline"
                    onClick={() => router.push("/login")}
                  >
                    Login
                  </span>
                </p>
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-4 w-full max-w-md mx-auto flex flex-col items-center">
              <h2 className="text-xl sm:text-2xl text-center font-semibold">
                Verify your Email
              </h2>
              <p className="text-center text-sm sm:text-base text-[#6E6E6E] px-4">
                Account activation link has been sent to the e-mail address you
                provided
              </p>
              <div className="flex flex-col gap-6 items-center justify-center w-full px-4">
                <div className="relative w-full max-w-[400px] h-[200px] sm:h-[250px]">
                  <Image
                    src={"/frame3.png"}
                    fill
                    className="object-contain"
                    alt="email verification"
                  />
                </div>
                <p className="text-sm sm:text-base">
                  Didn't get the mail?{" "}
                  <span
                    className="text-blue-700 ml-2 cursor-pointer hover:underline"
                    onClick={prevStep}
                  >
                    Resend
                  </span>
                </p>
              </div>
            </div>
          )}
          {step === 4 && userType === "Farmer" && !showConnectButton ? (
            <div className="w-full flex flex-col">
              <form
                className="space-y-4 sm:space-y-6 w-full max-w-md mx-auto flex flex-col justify-center items-center"
                onSubmit={handleSubmit}
              >
                <h2 className="text-xl sm:text-2xl text-center font-semibold">
                  Register your Farm
                </h2>

                <div className="flex flex-col sm:flex-row w-full gap-4 font-normal text-[#404040]">
                  <div className="flex flex-col items-start w-full sm:w-[60%] space-y-2">
                    <label htmlFor="Farm_Name" className="text-sm sm:text-base">
                      Farm Name
                    </label>
                    <input
                      type="text"
                      name="farmName"
                      value={formData.farmName}
                      onChange={handleChange}
                      placeholder="Farm Name"
                      id="Farm_Name"
                      className="w-full rounded-lg border px-3 py-2 focus:outline-green-600"
                    />
                  </div>

                  <div className="flex flex-col items-start w-full sm:w-[40%] space-y-2">
                    <label
                      htmlFor="Batch_Name"
                      className="text-sm sm:text-base"
                    >
                      Batch Name
                    </label>
                    <input
                      type="text"
                      placeholder="Batch Name"
                      name="batchName"
                      value={formData.batchName}
                      onChange={handleChange}
                      id="Batch_Name"
                      className="w-full rounded-lg border px-3 py-2 focus:outline-green-600"
                    />
                  </div>
                </div>

                <div className="flex flex-col items-start w-full space-y-2 text-[#404040]">
                  <label htmlFor="deviceId" className="text-sm sm:text-base">
                    Device Id
                  </label>
                  <input
                    type="number"
                    name="deviceId"
                    onChange={handleChange}
                    value={formData.deviceId}
                    placeholder="Enter Device Id"
                    id="device_id"
                    className="w-full rounded-lg border px-3 py-2 focus:outline-green-600"
                  />
                </div>

                <div className="flex flex-col items-start w-full space-y-2 text-[#404040]">
                  <label htmlFor="Breed_Type" className="text-sm sm:text-base">
                    Breed Type
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Breed Type"
                    name="breedType"
                    onChange={handleChange}
                    value={formData.breedType}
                    id="Breed_Type"
                    className="w-full rounded-lg border px-3 py-2 focus:outline-green-600"
                  />
                </div>

                <input
                  type="number"
                  placeholder="Number of Chickens"
                  name="numberOfChickens"
                  onChange={handleChange}
                  value={formData.numberOfChickens}
                  className="w-full rounded-lg border px-3 py-2 focus:outline-green-600"
                />
                <input
                  type="text"
                  placeholder="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full rounded-lg border px-3 py-2 focus:outline-green-600"
                />

                <div className="flex w-full justify-between gap-2 sm:gap-4">
                  {/* <button
                  className="flex-1 sm:flex-none rounded-lg border px-4 py-2 hover:bg-gray-100 transition-colors"
                  onClick={prevStep}
                >
                  Back
                </button> */}
                  <button
                    className="w-full flex-1 sm:flex-none rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 transition-colors items-center justify-center cursor-pointer"
                    type="submit"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Register"
                    )}
                  </button>
                </div>

                <div className="w-full">{/* <WalletOptions /> */}</div>
              </form>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6 w-full max-w-md mx-auto flex flex-col justify-center items-cente">
              <button
                className="w-full flex flex-1 sm:flex-none rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 transition-colors items-center justify-center cursor-pointer"
                type="submit"
                onClick={handleConnectWallet}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Connect Wallet"
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
