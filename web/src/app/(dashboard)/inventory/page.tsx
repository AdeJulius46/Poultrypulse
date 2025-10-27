"use client";
import React, { useCallback, useState } from "react";
import { Plus, Wallet, User, Bell, Check, X, Loader2 } from "lucide-react";
import DashboardHeader from "@/components/layout/dashboardHeader";
import { supabase } from "@/lib/supabase";
import { ContractFunctionParameters } from "@hashgraph/sdk";
import { HederaWalletService } from "@/lib/hedera-wallet";
import { useStore } from "@/lib/store";
import { market_id } from "@/contract";

type LivestockType = "chicken" | "turkey" | null;
type HealthStatus = "healthy" | "vaccinated" | "organic";

interface RecentUpload {
  id: string;
  breed: string;
  lastChecked: string;
}

const FarmersInventory = () => {
  const [selectedLivestock, setSelectedLivestock] =
    useState<LivestockType>(null);
  const [breedType, setBreedType] = useState("");
  const [ageCategory, setAgeCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [weight, setWeight] = useState("");
  const [price, setPrice] = useState("");
  const [healthStatuses, setHealthStatuses] = useState<HealthStatus[]>([]);
  const [description, setDescription] = useState("");
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const profile = useStore((state) => state.profile);

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setMediaFiles((prev) => [...prev, ...filesArray]);
    }
  };

  const removeMediaFile = (index: number) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const getFileType = (file: File): "image" | "video" => {
    return file.type.startsWith("image/") ? "image" : "video";
  };

  const BreedOption = [
    { id: "1", breed: "Broilers" },
    { id: "2", breed: "Turkeys" },
    { id: "3", breed: "Layers" },
    { id: "4", breed: "Eggs" },
  ];

  const recentUploads: RecentUpload[] = [
    { id: "1", breed: "Broilers", lastChecked: "" },
    { id: "2", breed: "Rhode Island", lastChecked: "" },
  ];

  const toggleHealthStatus = (status: HealthStatus) => {
    setHealthStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const handleSaveDraft = () => {
    console.log("Saving draft...");
  };

  const handleCancel = () => {
    setSelectedLivestock(null);
    setBreedType("");
    setAgeCategory("");
    setQuantity("");
    setWeight("");
    setPrice("");
    setHealthStatuses([]);
    setDescription("");
  };

  const handleAddToInventory = async () => {
    if (!selectedLivestock || !breedType || !quantity) {
      alert("Please fill required fields");
      return;
    }

    setUploading(true);

    try {
      // 1. Upload media files
      const mediaUrls: string[] = [];
      for (const file of mediaFiles) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random()
          .toString(36)
          .substring(2)}.${fileExt}`;
        const filePath = `${
          (await supabase.auth.getUser()).data.user?.id
        }/${fileName};`;

        const { error: uploadError } = await supabase.storage
          .from("inventory-media")
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        const { data: urlData } = supabase.storage
          .from("inventory-media")
          .getPublicUrl(filePath);

        console.log(urlData);
        mediaUrls.push(urlData.publicUrl);
      }

      // 2. Save inventory to DB
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userError || !userData.user) throw userError;

      const { error: dbError } = await supabase.from("inventory").insert({
        farmer_id: userData.user.id,
        livestock_type: selectedLivestock,
        breed_type: breedType,
        age_category: ageCategory,
        quantity: parseInt(quantity),
        weight_kg: weight ? parseFloat(weight) : null,
        price_per_bird: price ? parseFloat(price) : null,
        health_status: healthStatuses,
        description: description || null,
        media_urls: mediaUrls,
        status: "published",
        product_contract_id: "1",
      });

      if (dbError) throw dbError;

      addToContract(mediaUrls[0]);
      alert("Inventory added successfully!");
      handleCancel(); // reset form
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error);
        alert(error.message);
      } else {
        console.log(error);
        alert("Failed to add inventory");
      }
    } finally {
      setUploading(false);
    }
  };

  const addToContract = useCallback(
    async (images: string) => {
      try {
        const walletService = new HederaWalletService("testnet");
        const index = BreedOption.find((obj) => obj.breed == breedType);
        const _breedType = Number(index?.id);

        // Convert image URL string to bytes32 hash
        // Option 1: Use a simple hash of the URL
        const hashBuffer = new TextEncoder().encode(images);
        const hashArray = new Uint8Array(32); // bytes32 needs exactly 32 bytes
        hashArray.set(hashBuffer.slice(0, 32)); // Take first 32 bytes or pad with zeros

        // Option 2: If you have ethers.js available, use keccak256
        // import { ethers } from 'ethers';
        // const healthCertHash = ethers.utils.id(images); // Creates keccak256 hash
        // const healthCertBytes = ethers.utils.arrayify(healthCertHash);

        const contractParams = new ContractFunctionParameters()
          .addUint8(_breedType) // ✅ productType (1-4)
          .addUint256(Number(quantity)) // ✅ quantity
          .addUint256(Number(price)) // ✅ pricePerUnit
          .addUint256(2) // ✅ minimumOrder
          .addBytes32(hashArray) // ✅ healthCertHash
          .addBytes32(hashArray) // ✅ iotDataHash
          .addString("Location") // ✅ farmLocation
          .addUint256(20); // ✅ durationDays

        const params = profile[0];

        // Validate required fields
        if (!params?.hedera_wallet) {
          alert("Hedera wallet address not found");
          return;
        }
        if (!params?.hedera_account_id) {
          alert("Hedera account ID not found");
          return;
        }
        if (!params?.hedera_private_key_encrypted) {
          alert("Hedera private key not found");
          return;
        }

        const receipt = await walletService.executeContract(
          params.hedera_account_id,
          params.hedera_private_key_encrypted,
          market_id,
          "createListing",
          contractParams,
          700000
        );

        console.log("Listing successful Receipt", receipt);
        alert("Listing successful");
      } catch (error) {
        if (error instanceof Error) {
          alert(error.message);
          console.log(error.message);
        }
      }
    },
    [breedType, quantity, price, profile]
  );

  return (
    <div className="min-h-screen max-w-7xl mx-auto lg:px-6 px-2 bg-gray-50">
      <DashboardHeader text={"Inventory"} />

      <main className=" py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Add New inventory
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <button
                onClick={() => setSelectedLivestock("chicken")}
                className={`p-4 border-2 rounded-xl flex items-center gap-3 transition-colors ${
                  selectedLivestock === "chicken"
                    ? "border-green-600 bg-green-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    selectedLivestock === "chicken"
                      ? "bg-green-600"
                      : "bg-gray-100"
                  }`}
                >
                  <Check
                    size={20}
                    className={
                      selectedLivestock === "chicken"
                        ? "text-white"
                        : "text-gray-400"
                    }
                  />
                </div>
                <span className="font-medium text-gray-900">Chicken</span>
              </button>

              <button
                onClick={() => setSelectedLivestock("turkey")}
                className={`p-4 border-2 rounded-xl flex items-center gap-3 transition-colors ${
                  selectedLivestock === "turkey"
                    ? "border-green-600 bg-green-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    selectedLivestock === "turkey"
                      ? "bg-green-600"
                      : "bg-gray-100"
                  }`}
                >
                  <Check
                    size={20}
                    className={
                      selectedLivestock === "turkey"
                        ? "text-white"
                        : "text-gray-400"
                    }
                  />
                </div>
                <span className="font-medium text-gray-900">Turkey</span>
              </button>
            </div>

            <div className="mb-8">
              <h3 className="text-base font-semibold text-gray-900 mb-4">
                Breed Information
              </h3>
              <div className="grid grid-cols-2 gap-4 ">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Breed Type
                  </label>
                  <select
                    value={breedType}
                    onChange={(e) => setBreedType(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent sm:text-sm"
                  >
                    {/* <option value="">Select Breed Type</option>
                    <option value="broiler">Broiler</option>
                    <option value="rhode-island">Rhode Island</option>
                    <option value="turkey">Turkey</option> */}
                    {BreedOption.map((breed) => {
                      return (
                        <option value={breed.breed} id={breed.id}>
                          {breed.breed}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age Category
                  </label>
                  <select
                    value={ageCategory}
                    onChange={(e) => setAgeCategory(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent sm:text-sm"
                  >
                    <option value="">Select Age Category</option>
                    <option value="chick">Chick (0-8 weeks)</option>
                    <option value="pullet">Pullet (8-20 weeks)</option>
                    <option value="adult">Adult (20+ weeks)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mb-8 lg:text-sm text-[10px]">
              <h3 className="text-base font-semibold text-gray-900 mb-4">
                Quantity & Details
              </h3>
              <div className="grid grid-cols-3 gap-4 ">
                <div>
                  <label className="block font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                    placeholder=""
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-2">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                    placeholder=""
                  />
                </div>
                <div>
                  <label className="block  font-medium text-gray-700 mb-2">
                    Price per bird (#)
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                    placeholder=""
                  />
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-base font-semibold text-gray-900 mb-4">
                Media Upload
              </h3>

              {/* ---- upload box ---- */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-600 transition-colors">
                <input
                  type="file"
                  id="media-upload"
                  multiple
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={handleMediaUpload}
                />
                <label htmlFor="media-upload" className="cursor-pointer">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    Click to upload images or videos
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, MP4, MOV up to 50MB
                  </p>
                </label>
              </div>

              {/* ---- preview grid ---- */}
              {mediaFiles.length > 0 && (
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {mediaFiles.map((file, idx) => {
                    const url = URL.createObjectURL(file);
                    const type = getFileType(file);

                    return (
                      <div
                        key={idx}
                        className="relative group rounded-lg overflow-hidden bg-gray-100"
                      >
                        {type === "image" ? (
                          <img
                            src={url}
                            alt={file.name}
                            className="w-full h-40 object-cover"
                          />
                        ) : (
                          <video
                            src={url}
                            className="w-full h-40 object-cover"
                            controls
                            muted
                            loop
                          />
                        )}

                        {/* remove button */}
                        <button
                          onClick={() => removeMediaFile(idx)}
                          className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Remove"
                        >
                          <X size={16} className="cursor-pointer" />
                        </button>

                        {/* file name (optional) */}
                        <p className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs truncate p-1">
                          {file.name}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="mt-4 text-xs text-gray-500">
                <p>• High-quality images help buyers make informed decisions</p>
                <p>• Videos showcasing livestock behavior are recommended</p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-base font-semibold text-gray-900 mb-4">
                Breed Information
              </h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Health Status
                </label>
                <div className="flex gap-4">
                  {(["healthy", "vaccinated", "organic"] as HealthStatus[]).map(
                    (status) => (
                      <label
                        key={status}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={healthStatuses.includes(status)}
                          onChange={() => toggleHealthStatus(status)}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-600"
                        />
                        <span className="text-sm text-gray-700 capitalize">
                          {status === "organic" ? "Organic Certified" : status}
                        </span>
                      </label>
                    )
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent resize-none"
                  placeholder=""
                />
              </div>
            </div>

            <div className="flex gap-4 flex-col-reverse lg:flex-col">
              <button
                onClick={handleSaveDraft}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
              >
                Save as Draft
              </button>
              <button
                onClick={handleCancel}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddToInventory}
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 flex items-center justify-center cursor-pointer gap-2 lg:ml-auto"
              >
                {uploading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Check size={20} />
                    Add to Inventory
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Upload Tips
              </h2>
              <ul className="space-y-3 text-sm text-gray-600">
                <li>Ensure all livestock are healthy before adding</li>
                <li>Double-check breed information for accuracy</li>
                <li>Set competitive pricing for better sales</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Recent Uploads
              </h2>
              <div className="space-y-3">
                {recentUploads.map((upload) => (
                  <div key={upload.id} className="p-4 bg-purple-100 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-bold">🐔</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900">
                          {upload.breed}
                        </h3>
                        <p className="text-sm text-gray-600">Last checked:</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FarmersInventory;
