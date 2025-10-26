"use client";

import Link from "next/link";
import { Logo } from "@/components/layout/logo";

export function Footer() {
  const productLinks = [
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "Our Solution", href: "#solution" },
    { name: "FAQs", href: "#faqs" }
  ];

  const supportLinks = [
    { name: "Documentation", href: "#docs" },
    { name: "Support", href: "#support" },
    { name: "Contact", href: "#contact" },
    { name: "Status", href: "#status" }
  ];

  return (
    <footer className="bg-green-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Logo textClassName="text-white text-2xl font-serif" />
            <p className="text-gray-300 leading-relaxed">
              PoultryPulse revolutionizes poultry farming with cutting-edge AI analytics 
              and blockchain transparency. Monitor health, optimize feed, track production, 
              and ensure supply chain integrity—all in one intelligent platform.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Product</h3>
            <ul className="space-y-3">
              {productLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-3">
              {supportLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-400 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-200 text-sm">
              © 2025. PoultryPulse. All Rights Reserved.
            </p>
            <div className="flex items-center space-x-2 mt-4 md:mt-0">
              <span className="text-gray-200 text-sm">
                BlockDAG Powered by BlockDAG Ecosystem
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
