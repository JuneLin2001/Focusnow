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
import Bounce from "./pages/GamePage/Bounce";
import Mainland from "./models/Mainland";
import { Environment } from "@react-three/drei";
// import { ThemeProvider } from "@/components/theme-provider";
// import { ModeToggle } from "./components/mode-toggle";

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
      {/* <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <ModeToggle /> */}
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route
          path="/game"
          element={
            <Canvas>
              <GamePage />
              <Environment preset="sunset" />
              <Mainland position={[-16, 2, 0]} />
              <OrbitControls />
            </Canvas>
          }
        />
        <Route path="/analytics" element={<AanalyticsPage />} />
        <Route path="/timer" element={<TimerPage />} />
        <Route path="/*" element={<Bounce />} />
      </Routes>
      {/* </ThemeProvider> */}
    </>
  );
};

export default App;
