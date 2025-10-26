import React from "react";
import {
  ShoppingCart,
  Bell,
  User,
  Star,
  Plus,
  ArrowRight,
  Utensils,
  Shield,
  Menu,
} from "lucide-react";
import { useStore } from "@/lib/store";

interface Headerprops {
  text: String;
}

const DashboardHeader: React.FC<Headerprops> = ({ text }) => {
  const toggleSidebar = useStore((state) => state.toggleSidebar);
  return (
    <div className=" px-4 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{text}</h1>
        <div className="flex items-center gap-3 lg:mr-6">
          <button className="hidden bg-green-600 hover:bg-green-700 text-white w-10 h-10 rounded-full lg:flex items-center justify-center transition-colors">
            <Plus size={20} />
          </button>
          <button className="hidden bg-white border-2 border-gray-200 hover:border-gray-300 px-6 py-2 rounded-full font-medium transition-colors lg:flex items-center gap-2">
            <ShoppingCart size={18} className="text-orange-500" />
            <span className="text-sm">Connect Wallet</span>
          </button>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-pink-400 flex items-center justify-center">
            <User size={20} className="text-white" />
          </div>
          <div className="relative">
            <Bell size={24} className="text-gray-700" />
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
              3
            </div>
          </div>

          <Menu
            className="lg:hidden  cursor-pointer"
            onClick={() => toggleSidebar()}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
