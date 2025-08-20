import { create } from "zustand";
import type { Page } from "@/types/page";

interface PageState {
  page: Page;
  setPage: (page: Page) => void;
}

const usePageStore = create<PageState>((set) => ({
  page: null,
  setPage: (page) => set({ page }),
}));

export default usePageStore;
