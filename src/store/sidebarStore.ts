import { create } from "zustand";
import { persist } from "zustand/middleware";

// 定義狀態接口
interface SidebarState {
  isOpen: boolean;
  toggleSidebar: () => void;
}

// 創建持久化的 store
const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      isOpen: true, // 初始狀態
      toggleSidebar: () => set((state) => ({ isOpen: !state.isOpen })),
    }),
    {
      name: "sidebar-storage", // 本地存儲的 key
    }
  )
);

export default useSidebarStore;
