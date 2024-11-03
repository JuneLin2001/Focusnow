import React from "react";
import { Routes, Route } from "react-router-dom";
import AanalyticsPage from "./components/Analytics";
import LandingPage from "./components/LandingPage";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import useAuthStore from "./store/authStore";
import { auth } from "./firebase/firebaseConfig";
import Bounce from "./components/Game/BounceModel";
import { ToastContainer } from "react-toastify";
import settingStore from "./store/settingStore";
import "react-toastify/dist/ReactToastify.css";

const App: React.FC = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const { themeMode } = settingStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, [setUser]);

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        closeOnClick
        draggable
        theme={themeMode === "light" ? "light" : "dark"}
      />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/analytics" element={<AanalyticsPage />} />
        <Route
          path="/*"
          element={
            <>
              <Bounce />
              <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform text-9xl">
                error❌
              </div>
            </>
          }
        />
      </Routes>
    </>
  );
};

export default App;
