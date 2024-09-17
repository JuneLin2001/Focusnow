import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import GamePage from "./pages/GamePage/GamePage";
import AanalyticsPage from "./pages/AnalyticsPage/AnalyticsPage";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

const App: React.FC = () => {
  return (
    <>
      <Header />
      <Sidebar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/analytics" element={<AanalyticsPage />} />
      </Routes>
    </>
  );
};

export default App;