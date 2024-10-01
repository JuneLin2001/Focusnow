import { create } from "zustand";
import { doc, updateDoc, increment } from "firebase/firestore"; // 引入 Firestore 函數
import { db } from "../firebase/firebaseConfig"; // 確保你引入了 Firebase 配置
import useAuthStore from "./authStore"; // 引入用戶認證 store

export interface FishesCount {
  FishesCount: number;
}

interface FishesCountStore {
  FishesCount: number;
  setFishesCount: (count: number) => void;
  updateFishesCount: (incrementValue: number) => Promise<void>; // 新增方法
}

export const useFishesCountStore = create<FishesCountStore>((set) => ({
  FishesCount: 0,
  setFishesCount: (count: number) =>
    set((state) => ({ ...state, FishesCount: count })),

  updateFishesCount: async (incrementValue: number) => {
    const { user } = useAuthStore.getState(); // 獲取當前用戶

    if (user) {
      try {
        const fishesCountDocRef = doc(
          db,
          "users",
          user.uid,
          "fishesCount",
          "fishesCount"
        );

        await updateDoc(fishesCountDocRef, {
          FishesCount: increment(incrementValue), // 使用 Firestore 的 increment 函數
        });

        set((state) => ({
          ...state,
          FishesCount: state.FishesCount + incrementValue, // 更新 Zustand store 的 FishesCount
        }));

        console.log("FishesCount updated successfully");
      } catch (error) {
        console.error("Error updating Firestore fishes count:", error);
      }
    } else {
      console.log(
        "User is not logged in, cannot update FishesCount in Firestore."
      );
    }
  },
}));
