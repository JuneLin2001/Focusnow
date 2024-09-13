import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { User } from "firebase/auth";

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
}

const useAuthStore = create<AuthState>()(
  devtools((set) => ({
    user: null,
    setUser: (user) => set({ user }),
  }))
);

export default useAuthStore;
