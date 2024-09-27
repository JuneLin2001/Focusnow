import React from "react";
import { Routes, Route } from "react-router-dom";
import TimerPage from "./pages/TimerPage";
import GamePage from "./pages/GamePage";
import AanalyticsPage from "./pages/AnalyticsPage";
// import Sidebar from "./components/Sidebar";
import LandingPage from "./pages/LandingPage";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import useAuthStore from "./store/authStore";
import { auth } from "./firebase/firebaseConfig";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Watch from "./pages/GamePage/watch";

const App: React.FC = () => {
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, [setUser]);

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route
          path="/game"
          element={
            <Canvas>
              <GamePage />
              <OrbitControls />
            </Canvas>
          }
        />
        <Route path="/analytics" element={<AanalyticsPage />} />
        <Route path="/timer" element={<TimerPage />} />
        <Route path="/bounce" element={<Watch />} />
      </Routes>
    </>
  );
};

export default App;
