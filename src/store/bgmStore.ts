// bgmStore.ts
import { create } from "zustand";

interface BgmStore {
  isPlaying: boolean;
  bgmSource: string; // 添加 bgmSource 屬性
  toggleBgm: () => void;
  setBgmSource: (source: string) => void; // 添加 setBgmSource 方法
}

const useBgmStore = create<BgmStore>((set) => ({
  isPlaying: false,
  bgmSource: "", // 預設為空
  toggleBgm: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setBgmSource: (source) => set({ bgmSource: source }), // 更新 bgmSource
}));

export default useBgmStore;
