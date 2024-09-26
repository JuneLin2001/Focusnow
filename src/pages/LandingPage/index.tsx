import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment } from "@react-three/drei";
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

// 引入 zustand store
import { useAnalyticsStore } from "../../store/analyticsStore"; // 假設儲存路徑
import { useLast30DaysFocusDurationStore } from "../../store/Last30DaysFocusDurationStore"; // 假設儲存路徑

import TimerDisplay from "../TimerPage/TimerDisplay";

const LandingPage = () => {
  const [targetPosition, setTargetPosition] = useState<
    [number, number, number]
  >([0, 30, 0]);
  const [page, setPage] = useState<"timer" | "analytics" | "game" | null>(null);

  // 從 store 中取得 analyticsList 和 last 30 天的專注時長
  const { analyticsList } = useAnalyticsStore();
  const { setLast30DaysFocusDuration } = useLast30DaysFocusDurationStore();

  // 當 LandingPage 載入或 analyticsList 改變時，更新 last 30 天的專注時長
  useEffect(() => {
    if (analyticsList.length > 0) {
      setLast30DaysFocusDuration(analyticsList); // 設置過去30天的專注時間
    }
  }, [analyticsList, setLast30DaysFocusDuration]); // 每當 analyticsList 改變時觸發

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
        <div className="fixed z-10 bg-gray-100 opacity-80 w-full h-full">
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
            setTargetPosition([52, 35, 0]);
            setPage("timer");
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

      <div className="fixed bottom-0 right-0 p-4 bg-white opacity-80 z-10">
        <TimerDisplay />{" "}
      </div>
    </>
  );
};

export default LandingPage;
