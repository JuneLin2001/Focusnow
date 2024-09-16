import { create } from "zustand";
import { User, signOut } from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";

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
      try {
        const { uid, displayName, email, photoURL } = user;
        const userRef = doc(collection(db, "users"), uid);
        await setDoc(userRef, {
          displayName,
          email,
          photoURL,
        });
      } catch (error) {
        console.error("Error saving user to Firestore", error);
      }
    }
  },
  logout: async () => {
    try {
      await signOut(auth);
      set({ user: null });
    } catch (error) {
      console.error("Logout error", error);
    }
  },
}));

export default useAuthStore;
