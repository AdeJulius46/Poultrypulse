"use client";
import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import {
  HederaWalletService,
  TREASURY_ID,
  TREASURY_KEY,
} from "@/lib/hedera-wallet";
import { useStore } from "@/lib/store";
import { ContractFunctionParameters } from "@hashgraph/sdk";
import { market_id } from "@/contract";

// Types
type UserType = "Buyer" | "Farmer";

interface FormData {
  farmName: string;
  batchName: string;
  deviceId: string;
  breedType: string;
  numberOfChickens: string;
  location: string;
}

interface StepConfig {
  id: number;
  label: string;
}

export default function LoginStepper() {
  const router = useRouter();

  // Store
  const userType = useStore((state) => state.userType);
  const setUserType = useStore((state) => state.setUserType);
  const profile = useStore((state) => state.profile);
  const setProfile = useStore((state) => state.setProfile);

  // State
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    farmName: "",
    batchName: "",
    deviceId: "",
    breedType: "",
    numberOfChickens: "",
    location: "",
  });

  // Computed values
  const showWalletCreation =
    step === 4 && (userType === "Buyer" || !walletAddress);
  const showFarmRegistration =
    step === 4 && userType === "Farmer" && walletAddress;

  const steps: StepConfig[] = [
    { id: 1, label: "Select User Type" },
    { id: 2, label: "Create Account" },
    { id: 3, label: "Verify your Email" },
    {
      id: 4,
      label: userType === "Farmer" ? "Register your Farm" : "Create Wallet",
    },
  ];

  // Navigation
  const nextStep = useCallback(() => {
    setStep((prev) => Math.min(prev + 1, steps.length));
  }, [steps.length]);

  const prevStep = useCallback(() => {
    setStep((prev) => Math.max(prev - 1, 1));
  }, []);

  // Form handlers
  const handleFormChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  // Validation
  const validateSignupForm = useCallback((): string | null => {
    if (!displayName.trim()) return "Please enter your full name";
    if (!email.trim()) return "Please enter your email";
    if (!password) return "Please enter your password";
    if (password.length < 6) return "Password must be at least 6 characters";
    if (password !== confirmPassword) return "Passwords do not match";
    return null;
  }, [displayName, email, password, confirmPassword]);

  const validateFarmForm = useCallback((): string | null => {
    if (!formData.farmName.trim()) return "Farm name is required";
    if (!formData.batchName.trim()) return "Batch name is required";
    if (!formData.deviceId.trim()) return "Device ID is required";
    if (!formData.breedType.trim()) return "Breed type is required";
    if (
      !formData.numberOfChickens ||
      parseInt(formData.numberOfChickens) <= 0
    ) {
      return "Please enter a valid number of chickens";
    }
    if (!formData.location.trim()) return "Location is required";
    return null;
  }, [formData]);

  // Sign Up
  const handleSignUp = useCallback(async () => {
    const validationError = validateSignupForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // emailRedirectTo: `${window.location.origin}/callback`,
          emailRedirectTo: "http://localhost:3000/callback",
        },
      });

      if (signUpError) throw signUpError;

      const signUpUser = data?.user;
      if (!signUpUser) {
        throw new Error("Sign up completed but no user was returned");
      }

      // Create profile
      const { error: profileError } = await supabase.from("profiles").insert({
        id: signUpUser.id,
        display_name: displayName,
        usertype: userType,
      });

      if (profileError) throw profileError;

      setError(null);
      nextStep(); // Move to "Verify Email" step
    } catch (err: any) {
      setError(err.message || "Failed to create account");
      console.error("Signup error:", err);
    } finally {
      setLoading(false);
    }
  }, [email, password, displayName, userType, nextStep, validateSignupForm]);

  // Farm Registration
  const handleFarmSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const validationError = validateFarmForm();
      if (validationError) {
        setError(validationError);
        return;
      }

      if (!user?.id) {
        setError("User not authenticated");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const { error: farmError } = await supabase.from("farms").insert({
          id: user.id,
          farm_name: formData.farmName,
          batch_name: formData.batchName,
          deviceid: formData.deviceId,
          breed_type: formData.breedType,
          numberofchickens: parseInt(formData.numberOfChickens),
          location: formData.location,
        });

        if (farmError) throw farmError;

        router.push("/dashboard");
      } catch (err: any) {
        setError(err.message || "Failed to register farm");
        console.error("Farm registration error:", err);
      } finally {
        setLoading(false);
      }
    },
    [formData, user, router, validateFarmForm]
  );

  // Wallet Creation
  const handleCreateWallet = useCallback(async () => {
    setConnecting(true);
    setError(null);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        throw new Error("Please log in first");
      }

      // Create Hedera wallet
      const walletService = new HederaWalletService("testnet");
      const wallet = await walletService.createAccount(1);

      // Update profile with wallet info
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          hedera_wallet: wallet.evmAddress,
          hedera_account_id: wallet.accountId,
          hedera_public_key: wallet.publicKey,
          hedera_private_key_encrypted: wallet.privateKey,
          updated_at: new Date().toISOString(),
        })
        .eq("id", session.user.id);

      if (updateError) throw updateError;

      // Update state
      setWalletAddress(wallet.evmAddress);
      setAccountId(wallet.accountId);

      const contractPrarams = new ContractFunctionParameters().addAddress(
        `0x${wallet.evmAddress}`
      );

      const receipt = await walletService.executeContract(
        TREASURY_ID,
        TREASURY_KEY,
        market_id,
        "verifyFarmer",
        contractPrarams,
        200000
      );

      console.log("Farmer verified onchai:", receipt);
      alert("Farmer Registered Onchain");
      // Navigate based on user type
      if (userType === "Buyer") {
        router.push("/marketplace");
      } else if (userType === "Farmer") {
        // router.push("/dashboard");
        // Stay on step 4 to show farm registration
        // Wallet is created, now show farm form
      }
    } catch (err: any) {
      console.error("Wallet creation error:", err);

      if (err.message?.includes("treasury")) {
        setError("Treasury account not configured. Please contact support.");
      } else {
        setError(err.message || "Failed to create wallet. Please try again.");
      }
    } finally {
      setConnecting(false);
    }
  }, [userType, router]);

  // Check existing wallet
  const checkExistingWallet = useCallback(async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) return;

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("hedera_wallet, hedera_account_id")
        .eq("id", session.user.id)
        .single();

      if (profileError && profileError.code !== "PGRST116") {
        throw profileError;
      }

      if (profile?.hedera_wallet) {
        setWalletAddress(profile.hedera_wallet);
        setAccountId(profile.hedera_account_id);
      }
    } catch (err: any) {
      console.error("Error checking wallet:", err);
    }
  }, []);

  // Fetch user profile and determine step
  const fetchUserProfile = useCallback(
    async (currentUser: User) => {
      try {
        const { data: profileData, error } = await supabase
          .from("profiles")
          .select("*");

        if (error) throw error;

        if (profileData[0]?.usertype) {
          setProfile(profileData as any);
          setUserType(profileData[0]?.usertype as UserType);
          setStep(4);
          await checkExistingWallet();
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    },
    [setUserType, checkExistingWallet]
  );

  // Auth state listener
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser && event === "SIGNED_IN") {
          await fetchUserProfile(currentUser);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [fetchUserProfile]);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        await fetchUserProfile(session.user);
      }
    };

    checkSession();
  }, [fetchUserProfile]);

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row w-full max-w-screen mx-auto gap-4 min-h-[calc(100vh-2rem)] bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Desktop Stepper */}
        <div className="hidden lg:block lg:w-[450px] lg:min-w-[400px] border-r bg-[#F2F2F2] p-8 rounded-l-md">
          <div className="mt-[70px] ml-8">
            <Image src="/poultry.svg" width={200} height={100} alt="Logo" />
          </div>

          <div className="relative ml-4 mt-[60px]">
            {steps.map((item, index) => (
              <div key={item.id} className="relative flex items-center gap-4">
                <div className="flex flex-col items-center">
                  <Image
                    src={step >= item.id ? "/Ellipse 74.svg" : "/Ellipse2.svg"}
                    alt="step indicator"
                    className="m-2 mx-auto h-11"
                    width={100}
                    height={100}
                  />
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
                    <span>Step {item.id}</span>
                    <span>{item.label}</span>
                  </div>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Step Indicator */}
        <div className="lg:hidden bg-white px-4 pt-6 pb-2">
          <div className="flex items-center justify-center mb-4">
            <Image src="/poultry.svg" width={150} height={75} alt="Logo" />
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

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
          {/* Error Display */}
          {error && (
            <div className="absolute top-4 right-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg max-w-md">
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Step 1: User Type Selection */}
          {step === 1 && (
            <div className="space-y-6 w-full max-w-md mx-auto">
              <h2 className="text-xl sm:text-2xl text-center font-semibold">
                Welcome to Poultry Pulse
              </h2>
              <p className="text-center text-sm sm:text-base text-[#6E6E6E]">
                Let's get started! First, tell us who you are.
              </p>

              <div className="space-y-4">
                <UserTypeCard
                  type="Farmer"
                  emoji="🌾"
                  title="I'm a Farmer"
                  description="Manage your poultry farm and track your chickens"
                  selected={userType === "Farmer"}
                  onClick={() => {
                    setUserType("Farmer");
                    nextStep();
                  }}
                />

                <UserTypeCard
                  type="Buyer"
                  emoji="🛒"
                  title="I'm a Buyer"
                  description="Purchase healthy chickens from verified farms"
                  selected={userType === "Buyer"}
                  onClick={() => {
                    setUserType("Buyer");
                    nextStep();
                  }}
                  bgColor="bg-blue-100"
                />
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

          {/* Step 2: Create Account */}
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
                value={displayName}
                className="w-full rounded-md border px-3 py-2 focus:outline-green-600"
                onChange={(e) => setDisplayName(e.target.value)}
              />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                className="w-full rounded-md border px-3 py-2 focus:outline-green-600"
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                className="w-full rounded-md border px-3 py-2 focus:outline-green-600"
                onChange={(e) => setPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="Repeat your password"
                value={confirmPassword}
                className="w-full rounded-md border px-3 py-2 focus:outline-green-600"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <button
                className="w-full rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 cursor-pointer flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSignUp}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Create account"
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

          {/* Step 3: Verify Email */}
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
                    src="/frame3.png"
                    fill
                    className="object-contain"
                    alt="email verification"
                  />
                </div>
                <p className="text-sm sm:text-base">
                  Didn't get the mail?{" "}
                  <span
                    className="text-blue-700 ml-2 cursor-pointer hover:underline"
                    onClick={() => {
                      prevStep();
                      setError("Please try signing up again");
                    }}
                  >
                    Resend
                  </span>
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Wallet Creation / Farm Registration */}
          {step === 4 && (
            <>
              {showWalletCreation && (
                <div className="space-y-4 sm:space-y-6 w-full max-w-md mx-auto flex flex-col justify-center items-center">
                  <h2 className="text-xl sm:text-2xl text-center font-semibold">
                    Create Your Wallet
                  </h2>
                  <p className="text-center text-sm sm:text-base text-[#6E6E6E]">
                    Connect your Hedera wallet to get started
                  </p>

                  <button
                    className="w-full rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 transition-colors items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex"
                    onClick={handleCreateWallet}
                    disabled={connecting}
                  >
                    {connecting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Create Wallet"
                    )}
                  </button>
                </div>
              )}

              {showFarmRegistration && (
                <form
                  className="space-y-4 sm:space-y-6 w-full max-w-md mx-auto"
                  onSubmit={handleFarmSubmit}
                >
                  <h2 className="text-xl sm:text-2xl text-center font-semibold">
                    Register your Farm
                  </h2>

                  <div className="flex flex-col sm:flex-row w-full gap-4">
                    <div className="flex flex-col w-full sm:w-[60%] space-y-2">
                      <label htmlFor="farmName" className="text-sm font-medium">
                        Farm Name
                      </label>
                      <input
                        type="text"
                        name="farmName"
                        id="farmName"
                        value={formData.farmName}
                        onChange={handleFormChange}
                        placeholder="Enter farm name"
                        className="w-full rounded-lg border px-3 py-2 focus:outline-green-600"
                        required
                      />
                    </div>

                    <div className="flex flex-col w-full sm:w-[40%] space-y-2">
                      <label
                        htmlFor="batchName"
                        className="text-sm font-medium"
                      >
                        Batch Name
                      </label>
                      <input
                        type="text"
                        name="batchName"
                        id="batchName"
                        value={formData.batchName}
                        onChange={handleFormChange}
                        placeholder="Enter batch name"
                        className="w-full rounded-lg border px-3 py-2 focus:outline-green-600"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <label htmlFor="deviceId" className="text-sm font-medium">
                      Device ID
                    </label>
                    <input
                      type="text"
                      name="deviceId"
                      id="deviceId"
                      value={formData.deviceId}
                      onChange={handleFormChange}
                      placeholder="Enter device ID"
                      className="w-full rounded-lg border px-3 py-2 focus:outline-green-600"
                      required
                    />
                  </div>

                  <div className="flex flex-col space-y-2">
                    <label htmlFor="breedType" className="text-sm font-medium">
                      Breed Type
                    </label>
                    <input
                      type="text"
                      name="breedType"
                      id="breedType"
                      value={formData.breedType}
                      onChange={handleFormChange}
                      placeholder="Enter breed type"
                      className="w-full rounded-lg border px-3 py-2 focus:outline-green-600"
                      required
                    />
                  </div>

                  <input
                    type="number"
                    name="numberOfChickens"
                    value={formData.numberOfChickens}
                    onChange={handleFormChange}
                    placeholder="Number of Chickens"
                    className="w-full rounded-lg border px-3 py-2 focus:outline-green-600"
                    min="1"
                    required
                  />

                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleFormChange}
                    placeholder="Location"
                    className="w-full rounded-lg border px-3 py-2 focus:outline-green-600"
                    required
                  />

                  <button
                    type="submit"
                    className="w-full rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Register Farm"
                    )}
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper Component for User Type Selection
interface UserTypeCardProps {
  type: UserType;
  emoji: string;
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
  bgColor?: string;
}

function UserTypeCard({
  type,
  emoji,
  title,
  description,
  selected,
  onClick,
  bgColor = "bg-green-100",
}: UserTypeCardProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full p-6 rounded-xl border-2 cursor-pointer transition-all hover:border-green-500 hover:shadow-lg ${
        selected ? "border-green-600 bg-green-50" : "border-gray-200 bg-white"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div
            className={`w-12 h-12 ${bgColor} rounded-full flex items-center justify-center text-2xl`}
          >
            {emoji}
          </div>
          <div className="text-left">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
            selected ? "border-green-600 bg-green-600" : "border-gray-300"
          }`}
        >
          {selected && (
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
  );
}
