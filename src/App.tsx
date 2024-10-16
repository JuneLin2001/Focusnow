import React from "react";
import { Routes, Route } from "react-router-dom";
// import TimerPage from "./pages/TimerPage";
// import GamePage from "./pages/GamePage";
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
              {/* <GamePage /> */}
              <Environment preset="sunset" />
              <Mainland position={[-16, 2, 0]} />
              <OrbitControls />
            </Canvas>
          }
        />
        <Route path="/analytics" element={<AanalyticsPage />} />
        {/* <Route path="/timer" element={<TimerPage />} /> */}
        <Route
          path="/*"
          element={
            <>
              <Bounce />
              <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-9xl">
                error❌
              </div>
            </>
          }
        />
      </Routes>
      {/* </ThemeProvider> */}
    </>
  );
};

export default App;
