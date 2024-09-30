// FishesCountFetcher.tsx
import { useEffect, useCallback } from "react";
import { doc, getDoc } from "firebase/firestore"; // 用 doc 和 getDoc 來讀取單個文檔
import { db } from "../firebase/firebaseConfig";
import useAuthStore from "../store/authStore";
import { useAchievementsStore } from "../store/achievementsStore"; // 假設你有一個用來管理 FishesCount 的 Zustand store

const FishesCountFetcher: React.FC = () => {
  const { user } = useAuthStore(); // 獲取用戶
  const { setFishesCount } = useAchievementsStore(); // 獲取 setFishesCount 方法

  const fetchFishesCount = useCallback(async () => {
    if (user) {
      try {
        // 指向特定用戶下的 FishesCount 文檔
        const fishesCountDocRef = doc(
          db,
          "users",
          user.uid,
          "fishesCount",
          "fishesCount"
        );
        const fishesCountDoc = await getDoc(fishesCountDocRef);

        if (fishesCountDoc.exists()) {
          const fishesCountData = fishesCountDoc.data();
          const fishesCount = fishesCountData?.FishesCount; // 提取 FishesCount 欄位值
          if (fishesCount !== undefined) {
            setFishesCount(fishesCount); // 更新 Zustand store
            console.log("FishesCount:", fishesCount);
          } else {
            console.error("FishesCount field is missing in the document");
          }
        } else {
          console.error("FishesCount document does not exist");
        }
      } catch (error) {
        console.error("Error fetching user fishes count", error);
      }
    }
  }, [user, setFishesCount]);

  useEffect(() => {
    fetchFishesCount();
  }, [fetchFishesCount]);

  return null;
};

export default FishesCountFetcher;
