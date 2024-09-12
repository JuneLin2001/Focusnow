import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage";
import GamePage from "./GamePage ";
import AnalysisPage from "./AnalysisPage ";

const App: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/analysis" element={<AnalysisPage />} />
      </Routes>
    </>
  );
};

export default App;
