import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import TimerPage from "../TimerPage/index";
import AnalyticsPage from "../AnalyticsPage";
import Mainland from "../../models/Mainland";
import GamePage from "../GamePage/index";
import Igloo from "../../models/Igloo";
import FloatingIce from "../../models/floatingIce";
import Analytics from "../../models/AnalyticsCube";
import OceanModel from "../../models/OceanModel";
import CameraController from "./CameraController";
import ResponsiveAppBar from "../../components/Header/ResponsiveAppBar";
import { useAnalyticsStore } from "../../store/analyticsStore";
import { useLast30DaysFocusDurationStore } from "../../store/last30DaysFocusDurationStore";
import TimerDisplay from "../TimerPage/TimerDisplay";

const LandingPage = () => {
  const [targetPosition, setTargetPosition] = useState<
    [number, number, number]
  >([0, 30, 0]); // 相機目標位置
  const [lookAtPosition, setLookAtPosition] = useState<
    [number, number, number]
  >([0, 30, 0]); // 相機朝向目標
  const [page, setPage] = useState<"timer" | "analytics" | "game" | null>(null);

  const { analyticsList } = useAnalyticsStore();
  const { setLast30DaysFocusDuration } = useLast30DaysFocusDurationStore();

  useEffect(() => {
    if (analyticsList.length > 0) {
      setLast30DaysFocusDuration(analyticsList);
    }
  }, [analyticsList, setLast30DaysFocusDuration]);

  return (
    <>
      <ResponsiveAppBar
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
        <Environment preset="warehouse" />
        <GamePage />
        <Mainland position={[-16, 2, 0]} />
        <Igloo
          position={[-114, 2, -16]}
          onClick={() => {
            setTargetPosition([-40, 12, -50]);
            setLookAtPosition([-4, 2, -16]);
            setPage("timer");
          }}
        />
        <FloatingIce position={[0, 2, -30]} />
        <Analytics position={[0, 2, 0]} />
        <CameraController
          targetPosition={targetPosition}
          lookAtPosition={lookAtPosition}
        />
        <OceanModel position={[0, 0, 0]} />
      </Canvas>

      <TimerDisplay />
    </>
  );
};

export default LandingPage;
