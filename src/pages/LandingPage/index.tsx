import { useState } from "react"; // 引入 Suspense
import { Canvas } from "@react-three/fiber";
import {
  Environment,
  GizmoHelper,
  GizmoViewport,
  Sky,
} from "@react-three/drei"; // 引入 Sky
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
import { useFishesCountStore } from "@/store/fishesCountStore";
import settingStore from "../../store/settingStore";
import Bubble from "./Bubble";
import { AlarmClock, ChartColumn } from "lucide-react";
import InitialInstructions from "./InitialInstructions";
import Snowflakes from "./Snowflakes";

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

  const fishesCount = useFishesCountStore((state) => state.FishesCount);
  const updateFishesCount = useFishesCountStore(
    (state) => state.updateFishesCount
  );

  const handleDropFish = () => {
    if (fishesCount > 0) {
      updateFishesCount(-1);
    } else {
      alert("沒有魚可以放置了，每專注1分鐘可以獲得1條魚！");
    }
  };

  const [showInstructions, setShowInstructions] = useState(true); // 預設為顯示操作說明
  const [isCameraMoveEnabled, setIsCameraMoveEnabled] = useState(false); // 控制鏡頭移動的狀態

  const handleCloseInstructions = () => {
    setShowInstructions(false); // 隱藏操作說明
    setIsCameraMoveEnabled(true); // 啟用鏡頭移動
  };

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
          {page === "timer" && <TimerPage />}
          {page === "analytics" && <AnalyticsPage />}
        </div>
      )}
      <div className="fixed top-28 left-4 p-4 bg-white opacity-80 z-10">
        <p className="w-32 bg-white">fishesCount: {fishesCount}</p>
        <button className="w-32 bg-white" onClick={handleDropFish}>
          放下魚
        </button>
      </div>
      <Canvas>
        <Environment preset={themeMode === "light" ? "warehouse" : "night"} />
        {themeMode === "dark" && <Sky sunPosition={[0, 0, 0]} />}
        <Mainland />
        <Igloo />
        <FloatingIce />
        <OceanModel />
        <Analytics />
        <Snowflakes />
        <GamePage
          fishesCount={fishesCount}
          setFishesCount={updateFishesCount}
          handleDropFish={handleDropFish}
        />
        {page === null && (
          <Bubble
            Icon={AlarmClock}
            position={[-20, 40, -100]}
            onClick={() => {
              setTargetPosition([-50, 12, -150]);
              setLookAtPosition([0, 0, 0]);
              setPage("timer");
            }}
          />
        )}
        {page === null && (
          <Bubble
            Icon={ChartColumn}
            position={[-70, 40, 110]}
            onClick={() => {
              setPage("analytics");
              setTargetPosition([-105, 25, 100]);
              setLookAtPosition([250, 0, 0]);
            }}
          />
        )}
        <CameraController
          targetPosition={targetPosition}
          lookAtPosition={lookAtPosition}
          isCameraMoveEnabled={isCameraMoveEnabled} // 將鏡頭移動的狀態傳入
        />
        <GizmoHelper alignment="bottom-right" margin={[100, 100]}>
          <GizmoViewport labelColor="white" axisHeadScale={1} />
        </GizmoHelper>
      </Canvas>
      <TimerDisplay />
      <InitialInstructions
        showInstructions={showInstructions}
        handleCloseInstructions={handleCloseInstructions}
      />
    </>
  );
};

export default LandingPage;
