import { create } from "zustand";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import useAuthStore from "./authStore";

interface SettingStore {
  isPlaying: boolean;
  bgmSource: string;
  themeMode: "light" | "dark";
  toggleBgm: () => void;
  setBgmSource: (source: string) => void;
  setThemeMode: (mode: "light" | "dark") => void;
  loadUserSettings: (userId: string) => Promise<void>;
  saveUserSettings: () => Promise<void>;
}

const useSettingStore = create<SettingStore>((set) => ({
  isPlaying: false,
  bgmSource:
    "/yt5s.io - 大自然的白噪音 1小時｜森林鳥鳴聲，身心放鬆，平靜學習輔助 (320 kbps).mp3",
  themeMode: "light",

  toggleBgm: () => set((state) => ({ isPlaying: !state.isPlaying })),

  setBgmSource: (source: string) => set({ bgmSource: source }),

  setThemeMode: (mode: "light" | "dark") => set({ themeMode: mode }),

  loadUserSettings: async (userId: string) => {
    const settingsRef = doc(db, "users", userId, "settings", "userSettings");
    const docSnap = await getDoc(settingsRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log("Document data:", data);

      set({
        isPlaying: data.isPlaying ? true : false,
        bgmSource: data.bgmSource ?? "/yt5s.io - 大自然的白噪音 (320 kbps).mp3",
        themeMode:
          data.themeMode === "light" || data.themeMode === "dark"
            ? data.themeMode
            : "light",
      });
    } else {
      console.log("Document does not exist");
      const defaultSettings = {
        isPlaying: false,
        bgmSource:
          "/yt5s.io - 大自然的白噪音 1小時｜森林鳥鳴聲，身心放鬆，平靜學習輔助 (320 kbps).mp3",
        themeMode: "light" as "light" | "dark",
      };

      await setDoc(settingsRef, defaultSettings);
      set(defaultSettings);
    }
  },

  saveUserSettings: async () => {
    const user = useAuthStore.getState().user;
    if (!user || !user.uid) {
      console.error("User is not logged in or user.uid is missing");
      return;
    }

    const settingsRef = doc(db, "users", user.uid, "settings", "userSettings");
    const state = useSettingStore.getState();
    const settingsData = {
      isPlaying: state.isPlaying,
      bgmSource: state.bgmSource,
      themeMode: state.themeMode,
    };

    await setDoc(settingsRef, settingsData);
  },
}));

export default useSettingStore;
