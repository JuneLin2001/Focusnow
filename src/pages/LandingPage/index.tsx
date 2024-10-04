import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, GizmoHelper, GizmoViewport } from "@react-three/drei";
import TimerPage from "../TimerPage/index";
import AnalyticsPage from "../AnalyticsPage";
import Mainland from "../../models/Mainland";
import GamePage from "../GamePage/index";
import Igloo from "../../models/Igloo";
import FloatingIce from "../../models/floatingIce";
import Analytics from "../../models/AnalyticsCube";
import OceanModel from "../../models/OceanModel";
import CameraController from "./CameraController";
import { DashboardHeader } from "@/components/Header/DashboardHeader";
import TimerDisplay from "../TimerPage/TimerDisplay";

import settingStore from "../../store/settingStore";

const LandingPage = () => {
  const [targetPosition, setTargetPosition] = useState<
    [number, number, number]
  >([-50, 12, -150]);
  const [lookAtPosition, setLookAtPosition] = useState<
    [number, number, number]
  >([0, 0, 0]);
  const [page, setPage] = useState<
    "timer" | "analytics" | "game" | "SignInstructions" | null
  >(null);

  const { themeMode } = settingStore();

  return (
    <>
      <DashboardHeader
        pages={["Timer", "Game", "Analytics"]}
        setPage={setPage}
        setTargetPosition={setTargetPosition}
        setLookAtPosition={setLookAtPosition}
      />
      {page === null ? (
        <div className="fixed z-10"></div>
      ) : (
        <div className="fixed z-10 w-full h-full">
          {/* //TODO:頁面的透明度  */}
          {page === "timer" && <TimerPage />}
          {page === "analytics" && <AnalyticsPage />}
        </div>
      )}
      <Canvas>
        <Environment preset={themeMode === "light" ? "warehouse" : "night"} />
        <GamePage />
        <Mainland position={[-16, 2, 0]} />

        <Igloo
          position={[-114, 2, -16]}
          onClick={() => {
            setTargetPosition([-50, 12, -150]);
            setLookAtPosition([0, 0, 0]);
            setPage("timer");
          }}
        />
        <FloatingIce position={[0, 2, -30]} />
        <Analytics
          position={[0, 2, 0]}
          onClick={() => {
            setPage("analytics");
            setTargetPosition([-105, 25, 100]);
            setLookAtPosition([250, 0, 0]);
          }}
        />

        <CameraController
          targetPosition={targetPosition}
          lookAtPosition={lookAtPosition}
        />
        <OceanModel position={[0, 0, 0]} />

        <GizmoHelper alignment="bottom-right" margin={[100, 100]}>
          <GizmoViewport labelColor="white" axisHeadScale={1} />
        </GizmoHelper>
      </Canvas>
      <TimerDisplay />
    </>
  );
};

export default LandingPage;
