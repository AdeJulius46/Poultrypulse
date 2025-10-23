"use client";

import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
// import { useToast } from '@/components/ui/use-toast';

export default function LoginPage() {
  const router = useRouter();
  // const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = {
        ok: true,
        data: {
          message: "Login successful",
          error: null,
        },
      };
      const data = response.data;

      if (response.ok) {
        // Successful login
        router.push("/dashboard"); // or wherever you want to redirect
      } else {
        // Handle error
        // toast({
        //   variant: "destructive",
        //   title: "Error",
        //   description: data.error || "Login failed"
        // });
        console.error("Login failed:", data.error);
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-sm">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="LoopDeck" width={100} height={100} />

          <div className="ml-auto">
            <select className="bg-transparent text-sm font-medium">
              <option value="en">ENG</option>
              <option value="es">ESP</option>
            </select>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 text-blue-700 p-4 rounded-lg">
          <p>
            LoopDeck allows a business to expand its reach and enhance digital
            marketing solutions.{" "}
            <a href="#" className="underline">
              Read more
            </a>
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Email <span className="text-red-500">*</span>
            </label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#46237A] hover:bg-[#46237A]/90 text-white font-medium"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Log in"}
          </Button>
        </form>

        {/* Links */}
        <div className="text-center space-y-4">
          <p className="text-sm text-gray-600">
            No LoopDeck account?{" "}
            <a href="/register" className="text-[#46237A] font-medium">
              Create one
            </a>
          </p>
          <a href="#" className="text-sm text-[#46237A] font-medium block">
            Forgot your password?
          </a>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
