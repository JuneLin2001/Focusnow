import { create } from "zustand";
import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useAuthStore } from "./authStore";
export interface FishesCount {
  FishesCount: number;
}

interface FishesCountStore {
  FishesCount: number;
  setFishesCount: (count: number) => void;
  updateFishesCount: (incrementValue: number) => Promise<void>;
}

export const useFishesCountStore = create<FishesCountStore>((set) => ({
  FishesCount: 0,
  setFishesCount: (count: number) =>
    set((state) => ({ ...state, FishesCount: count })),

  updateFishesCount: async (incrementValue: number) => {
    const { user } = useAuthStore.getState();

    if (user) {
      try {
        const fishesCountDocRef = doc(
          db,
          "users",
          user.uid,
          "fishesCount",
          "fishesCount",
        );

        await updateDoc(fishesCountDocRef, {
          FishesCount: increment(incrementValue),
        });

        set((state) => ({
          ...state,
          FishesCount: state.FishesCount + incrementValue,
        }));
      } catch (error) {
        console.error("Error updating Firestore fishes count:", error);
      }
    }
  },
}));
