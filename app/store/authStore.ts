import { create } from "zustand";
import { User, signOut, onAuthStateChanged } from "firebase/auth";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";

const defaultPhotoURL =
  "data:image/svg+xml;base64," +
  btoa(`
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-smile"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/></svg>`);

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  updateUserProfile: (displayName: string) => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: async (user) => {
    if (user) {
      const { uid } = user;

      try {
        const userRef = doc(collection(db, "users"), uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          set({
            user: {
              ...user,
              displayName: userData.displayName || "",
              photoURL: userData.photoURL || defaultPhotoURL,
            },
          });
        } else {
          await setDoc(userRef, {
            displayName: user.displayName || "",
            email: user.email,
            photoURL: user.photoURL || defaultPhotoURL,
          });
          set({
            user: {
              ...user,
              photoURL: user.photoURL || defaultPhotoURL,
            },
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    } else {
      set({ user: null });
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
  updateUserProfile: async (displayName: string) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      try {
        const userRef = doc(collection(db, "users"), currentUser.uid);
        await setDoc(userRef, { displayName }, { merge: true });
        set({ user: { ...currentUser, displayName } });
      } catch (error) {
        console.error("Error updating user profile:", error);
      }
    }
  },
}));

onAuthStateChanged(auth, (user) => {
  useAuthStore.getState().setUser(user);
});

export default useAuthStore;
