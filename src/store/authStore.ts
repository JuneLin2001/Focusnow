import { create } from "zustand";
import { User, signOut } from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";
import { useLast30DaysFocusDurationStore } from "../store/Last30DaysFocusDurationStore"; // 假設這是你存放 Last30DaysFocusDuration 的 store
import { useAnalyticsStore } from "../store/analyticsStore"; // 假設這是你的 analytics store

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: async (user) => {
    set({ user });

    // 如果是登入的話，則更新 Firestore 並觸發 Last 30 Days Focus Duration 的更新
    if (user) {
      const { uid, displayName, email, photoURL } = user;

      try {
        const userRef = doc(collection(db, "users"), uid);
        await setDoc(userRef, {
          displayName,
          email,
          photoURL,
        });

        // 更新 Last 30 Days Focus Duration
        const { analyticsList } = useAnalyticsStore.getState(); // 獲取 analyticsList
        const { setLast30DaysFocusDuration } =
          useLast30DaysFocusDurationStore.getState();
        setLast30DaysFocusDuration(analyticsList); // 根據當前用戶的數據計算 Last 30 Days Focus Duration
      } catch (error) {
        console.error("Error updating user data:", error);
      }
    }
  },
  logout: async () => {
    const { setLast30DaysFocusDuration } =
      useLast30DaysFocusDurationStore.getState(); // 獲取 store 方法

    try {
      await signOut(auth);
      set({ user: null });
      setLast30DaysFocusDuration([]); // 登出時清空 Last 30 Days Focus Duration
    } catch (error) {
      console.error("Logout error", error);
    }
  },
}));

export default useAuthStore;
