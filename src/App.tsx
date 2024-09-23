import React from "react";
import { Routes, Route } from "react-router-dom";
import TimerPage from "./pages/TimerPage";
// import GamePage from "./pages/GamePage";
import AanalyticsPage from "./pages/AnalyticsPage";
// import Header from "./components/Header";
// import Sidebar from "./components/Sidebar";
import CameraMovement from "./pages/LandingPage";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import useAuthStore from "./store/authStore";
import { auth } from "./firebase/firebaseConfig";

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
      {/* <Header /> */}
      {/* <Sidebar /> */}
      <Routes>
        <Route path="/" element={<CameraMovement />} />
        {/* <Route path="/game" element={<GamePage />} /> */}
        <Route path="/analytics" element={<AanalyticsPage />} />
        <Route path="/timer" element={<TimerPage />} />
      </Routes>
    </>
  );
};

export default App;
