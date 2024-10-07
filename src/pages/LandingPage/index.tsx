import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Environment,
  GizmoHelper,
  GizmoViewport,
  Sky,
} from "@react-three/drei";
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
import useAuthStore from "../../store/authStore";
import * as THREE from "three";
import DropFish from "./DropFish";
import ToggleBgm from "@/components/ToggleBgm";

const LandingPage = () => {
  const [targetPosition, setTargetPosition] = useState<
    [number, number, number]
  >([-50, 12, -150]);
  const [lookAtPosition, setLookAtPosition] = useState<
    [number, number, number]
  >([0, 0, 0]);
  const [page, setPage] = useState<
    "timer" | "analytics" | "game" | "Setting" | null
  >("Setting");
  const { themeMode } = settingStore();
  const [fishPosition, setFishPosition] = useState<THREE.Vector3 | null>(null);
  const { user } = useAuthStore();

  const fishesCount = useFishesCountStore((state) => state.FishesCount);
  const updateFishesCount = useFishesCountStore(
    (state) => state.updateFishesCount
  );

  const handleDropFish = async () => {
    if (user) {
      if (fishesCount > 0) {
        const randomX = Math.random() * (175 - -15) + -15;
        const randomZ = Math.random() * (90 - -150) + -150;
        setFishPosition(new THREE.Vector3(randomX, 10, randomZ));

        await updateFishesCount(-1);
      } else {
        alert("沒有魚可以放置了，每專注1分鐘可以獲得1條魚！");
      }
    } else {
      alert("尚未登入！");
    }
  };

  const [showInstructions, setShowInstructions] = useState(true);
  const handleCloseInstructions = () => {
    setShowInstructions(false);
    setPage(null);
  };

  const [displayedPage, setDisplayedPage] = useState<string | null>(null);

  useEffect(() => {
    setDisplayedPage(null);

    if (page === null) {
      return;
    }

    const timer = setTimeout(() => {
      setDisplayedPage(page);
    }, 2000);

    return () => clearTimeout(timer);
  }, [page]);

  return (
    <>
      <DashboardHeader
        pages={["Timer", "Game", "Analytics"]}
        setPage={setPage}
        setTargetPosition={setTargetPosition}
        setLookAtPosition={setLookAtPosition}
      />
      {displayedPage === null ? (
        ""
      ) : (
        <div className="fixed z-10 w-full h-full">
          {displayedPage === "timer" && <TimerPage />}
          {displayedPage === "analytics" && <AnalyticsPage />}
        </div>
      )}

      <Canvas>
        <Environment preset={themeMode === "light" ? "warehouse" : "night"} />
        {themeMode === "dark" && (
          <Sky sunPosition={[0, -1, 0]} distance={100000} />
        )}
        <Mainland />
        {page === null && (
          <DropFish
            position={[100, 80, 0]}
            fishesCount={fishesCount}
            handleDropFish={handleDropFish}
          />
        )}
        <Igloo />
        <FloatingIce />
        <OceanModel />
        <Analytics />
        <Snowflakes />
        <GamePage
          fishesCount={fishesCount}
          setFishesCount={updateFishesCount}
          handleDropFish={handleDropFish}
          fishPosition={fishPosition}
          setFishPosition={setFishPosition}
          setPage={setPage}
        />
        {page === null && (
          <Bubble
            Icon={AlarmClock}
            content="Timer"
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
            content="Analytics"
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
        />
        <GizmoHelper alignment="bottom-right" margin={[100, 100]}>
          <GizmoViewport labelColor="white" axisHeadScale={1} />
        </GizmoHelper>
      </Canvas>
      <TimerDisplay />
      <ToggleBgm />
      <InitialInstructions
        showInstructions={showInstructions}
        handleCloseInstructions={handleCloseInstructions}
      />
    </>
  );
};

export default LandingPage;
