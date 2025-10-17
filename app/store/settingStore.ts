import { create } from "zustand";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import useAuthStore from "./authStore";

interface SettingStore {
  themeMode: "light" | "dark";
  hasSeenTimerInstruction: boolean;
  setThemeMode: (mode: "light" | "dark") => void;
  setHasSeenTimerInstruction: (seen: boolean) => void;
  loadUserSettings: (userId: string) => Promise<void>;
  saveUserSettings: () => Promise<void>;
}

export const useSettingStore = create<SettingStore>((set) => ({
  themeMode: "light",
  hasSeenTimerInstruction: false,
  setThemeMode: (mode: "light" | "dark") => set({ themeMode: mode }),
  setHasSeenTimerInstruction: (seen: boolean) =>
    set({ hasSeenTimerInstruction: seen }),
  loadUserSettings: async (userId: string) => {
    const settingsRef = doc(db, "users", userId, "settings", "userSettings");
    const docSnap = await getDoc(settingsRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      set({
        themeMode:
          data.themeMode === "light" || data.themeMode === "dark"
            ? data.themeMode
            : "light",
        hasSeenTimerInstruction: data.hasSeenTimerInstruction ?? false,
      });
    } else {
      const defaultSettings = {
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
      themeMode: state.themeMode,
      hasSeenTimerInstruction: state.hasSeenTimerInstruction,
    };

    await setDoc(settingsRef, settingsData);
  },
}));
