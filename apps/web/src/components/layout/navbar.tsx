"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Logo } from "./logo";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 text-white backdrop-blur-sm bg-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <Logo />

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="#features" 
              className="text-gray-300 hover:text-white transition-colors duration-200 font-sans"
            >
              Features
            </Link>
            <Link 
              href="#pricing" 
              className="text-gray-300 hover:text-white transition-colors duration-200 font-sans"
            >
              Pricing
            </Link>
            <Link 
              href="#solution" 
              className="text-gray-300 hover:text-white transition-colors duration-200 font-sans"
            >
              Our Solution
            </Link>
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              href="/login" 
              className="text-poultry-green-400 hover:text-poultry-green-300 transition-colors duration-200 font-sans"
            >
              Login
            </Link>
            <Button 
              asChild
              className="bg-poultry-green-500 hover:bg-poultry-green-600 text-white font-medium px-6 py-2 rounded-lg transition-colors duration-200"
            >
              <Link href="/signup">Create Account</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-300 hover:text-white focus:outline-none focus:text-white"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-black/80 backdrop-blur-sm rounded-lg mt-2">
              <Link
                href="#features"
                className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="#pricing"
                className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                href="#solution"
                className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Our Solution
              </Link>
              <div className="border-t border-gray-600 pt-4">
                <Link
                  href="/login"
                  className="text-poultry-green-400 hover:text-poultry-green-300 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Button 
                  asChild
                  className="w-full mt-2 bg-poultry-green-500 hover:bg-poultry-green-600 text-white font-medium px-6 py-2 rounded-lg"
                >
                  <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                    Create Account
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
