import { create } from "zustand";
import { User, signOut } from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";
import { useLast30DaysFocusDurationStore } from "../store/Last30DaysFocusDurationStore";
import { useAnalyticsStore } from "../store/analyticsStore";

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: async (user) => {
    set({ user });

    if (user) {
      const { uid, displayName, email, photoURL } = user;

      try {
        const userRef = doc(collection(db, "users"), uid);
        await setDoc(userRef, {
          displayName,
          email,
          photoURL,
        });

        const { analyticsList } = useAnalyticsStore.getState();
        const { setLast30DaysFocusDuration } =
          useLast30DaysFocusDurationStore.getState();
        setLast30DaysFocusDuration(analyticsList);
      } catch (error) {
        console.error("Error updating user data:", error);
      }
    }
  },
  logout: async () => {
    const { setLast30DaysFocusDuration } =
      useLast30DaysFocusDurationStore.getState();

    try {
      await signOut(auth);
      set({ user: null });
      setLast30DaysFocusDuration([]);
    } catch (error) {
      console.error("Logout error", error);
    }
  },
}));

export default useAuthStore;
