"use client";

import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import useAuthStore from "./store/authStore";
import { auth } from "./firebase/firebaseConfig";
import { useSettingStore } from "./store/settingStore";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const { user, setUser } = useAuthStore();
  const { loadUserSettings } = useSettingStore();

  useEffect(() => {
    const loadData = async () => {
      if (user) {
        await loadUserSettings(user.uid);
      }
    };

    loadData();
  }, [user, loadUserSettings]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, [setUser]);

  return null;
}
