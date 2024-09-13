import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

// 定義 Store 的狀態接口
interface SidebarState {
  isOpen: boolean;
  toggleSidebar: () => void;
}

// 創建 Zustand store
const useSidebarStore = create<SidebarState>()(
  devtools(
    persist(
      (set) => ({
        isOpen: true, // 初始狀態
        toggleSidebar: () => set((state) => ({ isOpen: !state.isOpen })),
      }),
      {
        name: "sidebar-storage", // 用於存儲到本地存儲的 key
      }
    )
  )
);

export default useSidebarStore;
