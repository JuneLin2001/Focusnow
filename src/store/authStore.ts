import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { User, signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>()(
  devtools((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    logout: async () => {
      try {
        await signOut(auth);
        set({ user: null });
      } catch (error) {
        console.error("Logout error", error);
      }
    },
  }))
);

export default useAuthStore;
