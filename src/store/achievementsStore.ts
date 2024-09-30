// achievementsStore.ts
import { create } from "zustand";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig"; // 根據你的路徑修改
import useAuthStore from "./authStore"; // 根據你的路徑修改
import { Timestamp } from "firebase/firestore";

export interface Achievement {
  id: string; // 成就的唯一識別符
  completed: boolean; // 成就是否已完成
  dateAchieved: Timestamp | null; // 完成日期，若未完成可設為 null
}

interface AchievementsState {
  achievements: Achievement[]; // 儲存成就的數組
  setAchievements: (achievements: Achievement[]) => void; // 設置成就的函數
  fetchAchievements: () => Promise<void>; // 從 Firestore 獲取成就的函數
}

const useAchievementsStore = create<AchievementsState>((set) => ({
  achievements: [], // 初始狀態
  setAchievements: (achievements) => set({ achievements }), // 更新成就
  fetchAchievements: async () => {
    const { user } = useAuthStore.getState(); // 獲取當前用戶
    if (!user) return; // 如果沒有用戶，直接返回

    try {
      const achievementsCollectionRef = collection(
        db,
        "users",
        user.uid,
        "achievements"
      );
      const achievementsSnapshot = await getDocs(achievementsCollectionRef);
      const achievements = achievementsSnapshot.docs.map((doc) => ({
        id: doc.id, // 使用文檔的 ID 作為成就的 ID
        completed: doc.data().completed || false, // 確保有完成狀態
        dateAchieved: doc.data().dateAchieved || null, // 取得完成日期，若不存在則設為 null
      })) as Achievement[]; // 將獲取的數據轉換為 Achievement 類型

      set({ achievements }); // 更新狀態

      console.log("Achievements fetched successfully:", achievements);
    } catch (error) {
      console.error("Error fetching achievements from Firestore", error);
    }
  },
}));

export default useAchievementsStore;
