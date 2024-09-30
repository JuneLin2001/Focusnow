import { create } from "zustand";

export interface Achievement {
  FishesCount: number;
}

interface AchievementsStore {
  FishesCount: number;
  setFishesCount: (count: number) => void;
}

export const useAchievementsStore = create<AchievementsStore>((set) => ({
  FishesCount: 0,
  setFishesCount: (count: number) =>
    set((state) => ({ ...state, FishesCount: count })),
}));
