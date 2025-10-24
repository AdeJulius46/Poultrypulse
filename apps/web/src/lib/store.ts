import { create } from "zustand";

interface StoreState {
  count: number;
  user: { name: string; email: string } | null;
  increase: () => void;
  decrease: () => void;
  setUser: (user: { name: string; email: string }) => void;
  clearUser: () => void;
}

export const useStore = create<StoreState>((set: any) => ({
  count: 0,
  user: null,
  increase: () =>
    set((state: { count: number }) => ({ count: state.count + 1 })),
  decrease: () =>
    set((state: { count: number }) => ({ count: state.count - 1 })),
  setUser: (user: any) => set({ user }),
  clearUser: () => set({ user: null }),
}));
