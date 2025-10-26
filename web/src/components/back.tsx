import React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

function Back() {
  const router = useRouter();
  return (
    <div
      className="flex text-green-600 cursor-pointer"
      onClick={() => router.back()}
    >
      <ChevronLeft className="mb-2" /> Back
    </div>
  );
}

export default Back;
