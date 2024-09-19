import React from "react";
import { Routes, Route } from "react-router-dom";
import TimerPage from "./pages/TimerPage";
// import GamePage from "./pages/GamePage";
import AanalyticsPage from "./pages/AnalyticsPage/AnalyticsPage";
// import Header from "./components/Header";
// import Sidebar from "./components/Sidebar";
import CameraMovement from "./pages/LandingPage";

const App: React.FC = () => {
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
