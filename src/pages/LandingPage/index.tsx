import { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Stats, ContactShadows, Environment } from "@react-three/drei";
import TimerPage from "../TimerPage/index";
import AnalyticsPage from "../AnalyticsPage";
import Mainland from "../../models/Mainland";
// import Header from "../../components/Header/index";
import GamePage from "../GamePage/index";
import Igloo from "../../models/Igloo";
import FloatingIce from "../../models/floatingIce";
import Analytics from "../../models/AnalyticsCube";
import OceanModel from "../../models/OceanModel";
import CameraController from "./CameraController";
import ResponsiveAppBar from "../../components/Header/ResponsiveAppBar";

const LandingPage = () => {
  const [targetPosition, setTargetPosition] = useState<
    [number, number, number]
  >([0, 30, 0]);
  const [page, setPage] = useState<"timer" | "analytics" | "game" | null>(null);

  const setPageWithDelay: (
    newPage: "timer" | "analytics" | "game" | null
  ) => void = (newPage) => {
    setTimeout(() => {
      setPage(newPage);
    }, 2000);
  };

  return (
    <>
      <ResponsiveAppBar
        pages={["Timer", "Game", "Analytics"]}
        setPage={setPage} // 傳遞原始 setPage
        setTargetPosition={setTargetPosition}
      />
      {page === null ? (
        <div className="fixed z-10"></div>
      ) : (
        <div className="fixed z-10 bg-gray-100 opacity-80">
          {page === "timer" && <TimerPage />}
          {page === "analytics" && <AnalyticsPage />}
        </div>
      )}
      <Canvas>
        <Stats className="mt-20 ml-20" />

        <Suspense fallback={null}>
          <Environment preset="warehouse" />
        </Suspense>
        <GamePage />
        <Mainland position={[-16, 2, 0]} />
        <Igloo
          position={[-114, 2, -16]}
          onClick={() => {
            setTargetPosition([52, 35, 0]);
            setPageWithDelay("timer");
          }}
        />
        <FloatingIce position={[0, 2, -30]} />
        <Analytics position={[0, 2, 0]} />
        <ContactShadows
          position={[0, -1.5, 0]}
          scale={10}
          blur={3}
          opacity={0.25}
          far={10}
        />
        <CameraController targetPosition={targetPosition} />
        <OceanModel position={[0, 0, 0]} />
      </Canvas>
    </>
  );
};

export default LandingPage;
