"use client";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (!error) router.push("/login");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      {/* Add your dashboard content here */}

      {/* Sign Out Button */}
      <Button
        className="w-full sm:w-auto cursor-pointer bg-green-600 hover:bg-green-700 
                 mt-3 sm:mt-4 md:mt-5 px-6 sm:px-8 py-2 sm:py-2.5 
                 text-sm sm:text-base font-medium rounded-lg sm:rounded-xl
                 transition-all duration-200"
        onClick={handleSignOut}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>Sign Out</>
        )}
      </Button>
    </div>
  );
}
