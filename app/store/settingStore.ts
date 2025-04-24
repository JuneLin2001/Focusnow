import { create } from "zustand";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import useAuthStore from "./authStore";

interface SettingStore {
  isPlaying: boolean;
  bgmSource: string;
  themeMode: "light" | "dark";
  hasSeenTimerInstruction: boolean;
  toggleBgm: () => void;
  setBgmSource: (source: string) => void;
  setThemeMode: (mode: "light" | "dark") => void;
  setHasSeenTimerInstruction: (seen: boolean) => void;
  loadUserSettings: (userId: string) => Promise<void>;
  saveUserSettings: () => Promise<void>;
}

export const useSettingStore = create<SettingStore>((set) => ({
  isPlaying: false,
  bgmSource:
    "/yt5s.io - 大自然的白噪音 1小時｜森林鳥鳴聲，身心放鬆，平靜學習輔助 (320 kbps).mp3",
  themeMode: "light",
  hasSeenTimerInstruction: false,

  toggleBgm: () => set((state) => ({ isPlaying: !state.isPlaying })),

  setBgmSource: (source: string) => set({ bgmSource: source }),

  setThemeMode: (mode: "light" | "dark") => set({ themeMode: mode }),

  setHasSeenTimerInstruction: (seen: boolean) =>
    set({ hasSeenTimerInstruction: seen }),

  loadUserSettings: async (userId: string) => {
    const settingsRef = doc(db, "users", userId, "settings", "userSettings");
    const docSnap = await getDoc(settingsRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      set({
        isPlaying: data.isPlaying ? true : false,
        bgmSource: data.bgmSource ?? "/yt5s.io - 大自然的白噪音 (320 kbps).mp3",
        themeMode:
          data.themeMode === "light" || data.themeMode === "dark"
            ? data.themeMode
            : "light",
        hasSeenTimerInstruction: data.hasSeenTimerInstruction ?? false,
      });
    } else {
      const defaultSettings = {
        isPlaying: false,
        bgmSource:
          "/yt5s.io - 大自然的白噪音 1小時｜森林鳥鳴聲，身心放鬆，平靜學習輔助 (320 kbps).mp3",
        themeMode: "light" as "light" | "dark",
        hasSeenTimerInstruction: false,
      };

      await setDoc(settingsRef, defaultSettings);
      set(defaultSettings);
    }
  },

  saveUserSettings: async () => {
    const user = useAuthStore.getState().user;
    if (!user || !user.uid) {
      return;
    }

    const settingsRef = doc(db, "users", user.uid, "settings", "userSettings");
    const state = useSettingStore.getState();
    const settingsData = {
      isPlaying: state.isPlaying,
      bgmSource: state.bgmSource,
      themeMode: state.themeMode,
      hasSeenTimerInstruction: state.hasSeenTimerInstruction,
    };

    await setDoc(settingsRef, settingsData);
  },
}));
