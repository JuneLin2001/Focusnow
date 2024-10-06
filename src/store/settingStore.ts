import { create } from "zustand";

interface settingStore {
  isPlaying: boolean;
  bgmSource: string;
  toggleBgm: () => void;
  setBgmSource: (source: string) => void;
  themeMode: "light" | "dark";
  setThemeMode: (mode: "light" | "dark") => void;
}

const usesettingStore = create<settingStore>((set) => ({
  isPlaying: false,
  bgmSource:
    "/yt5s.io - 大自然的白噪音 1小時｜森林鳥鳴聲，身心放鬆，平靜學習輔助 (320 kbps).mp3",
  toggleBgm: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setBgmSource: (source) => set({ bgmSource: source }),
  themeMode: "light",
  setThemeMode: (mode) => set({ themeMode: mode }),
}));

export default usesettingStore;
