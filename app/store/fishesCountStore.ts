import { create } from "zustand";
import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import useAuthStore from "./authStore";
export interface fishesCount {
  fishesCount: number;
}

interface FishesCountStore {
  fishesCount: number;
  setFishesCount: (count: number) => void;
  updateFishesCount: (incrementValue: number) => Promise<void>;
}

export const useFishesCountStore = create<FishesCountStore>((set) => ({
  fishesCount: 0,
  setFishesCount: (count: number) =>
    set((state) => ({ ...state, fishesCount: count })),

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
          fishesCount: increment(incrementValue),
        });

        set((state) => ({
          ...state,
          fishesCount: state.fishesCount + incrementValue,
        }));
      } catch (error) {
        console.error("Error updating Firestore fishes count:", error);
      }
    }
  },
}));
