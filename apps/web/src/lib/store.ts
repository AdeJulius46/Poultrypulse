import { create } from "zustand";

export interface Product {
  id: string;
  livestock_type: string;
  breed_type: string;
  quantity: number;
  price_per_bird: number | null;
  media_urls: string[];
  farmer_name: string;
  created_at: string;
  description: string;
  farmer_id: string;
}

interface StoreState {
  count: number;
  user: { name: string; email: string } | null;
  sidebarOpen: boolean;
  userType: string;
  farmProducts: Product[];
  setFarmProducts: (farmProducts: []) => void;
  setUserType: (userType: string) => void; // Added parameter
  setSidebarOpen: (isOpen: boolean) => void; // Added parameter
  toggleSidebar: () => void; // Added toggle function (common pattern)
  increase: () => void;
  decrease: () => void;
  setUser: (user: { name: string; email: string }) => void;
  clearUser: () => void;
}

export const useStore = create<StoreState>((set) => ({
  count: 0,
  user: null,
  sidebarOpen: true,
  userType: "",
  farmProducts: [],
  increase: () => set((state) => ({ count: state.count + 1 })),
  decrease: () => set((state) => ({ count: state.count - 1 })),
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
  setSidebarOpen: (isOpen) => set({ sidebarOpen: isOpen }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setUserType: (userType) => set({ userType }),
  setFarmProducts: (farmProducts) => set({ farmProducts }),
}));
