import { create } from "zustand";

export interface FishesCount {
  FishesCount: number;
}

interface FishesCountStore {
  FishesCount: number;
  setFishesCount: (count: number) => void;
}

export const useFishesCountStore = create<FishesCountStore>((set) => ({
  FishesCount: 0,
  setFishesCount: (count: number) =>
    set((state) => ({ ...state, FishesCount: count })),
}));
