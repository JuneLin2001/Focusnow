// settingStore.ts
import { create } from "zustand";

interface settingStore {
  isPlaying: boolean;
  bgmSource: string; // 添加 bgmSource 屬性
  toggleBgm: () => void;
  setBgmSource: (source: string) => void; // 添加 setBgmSource 方法
  themeMode: "light" | "dark"; // 當前主題模式
  setThemeMode: (mode: "light" | "dark") => void;
}

const usesettingStore = create<settingStore>((set) => ({
  isPlaying: false,
  bgmSource: "", // 預設為空
  toggleBgm: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setBgmSource: (source) => set({ bgmSource: source }), // 更新 bgmSource
  themeMode: "light",
  setThemeMode: (mode) => set({ themeMode: mode }),
}));

export default usesettingStore;
