import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Html,
  // GizmoHelper,
  // GizmoViewport,
} from "@react-three/drei";
import TimerPage from "../TimerPage/index";
import AnalyticsPage from "../AnalyticsPage";
import GamePage from "../GamePage/index";
import CameraController from "./CameraController";
import { DashboardHeader } from "@/components/Header/DashboardHeader";
import TimerDisplay from "../TimerPage/TimerDisplay";
import { useFishesCountStore } from "@/store/fishesCountStore";
import settingStore from "../../store/settingStore";
import Bubble from "./Bubble";
import { AlarmClock, ChartColumn } from "lucide-react";
import InitialInstructions from "./InitialInstructions";
import useAuthStore from "../../store/authStore";
import * as THREE from "three";
// import DropFish from "./DropFish";
import ToggleBgm from "@/components/ToggleBgm";
import { Progress } from "@/components/ui/progress";
import usesettingStore from "@/store/settingStore";
import { toast } from "react-toastify";
import { Card } from "@/components/ui/card";
import AsyncModels from "./AsyncModels";

const LandingPage = () => {
  const [targetPosition, setTargetPosition] = useState<
    [number, number, number]
  >([-250, 60, 10]);
  const [lookAtPosition, setLookAtPosition] = useState<
    [number, number, number]
  >([0, 0, 0]);
  const [page, setPage] = useState<
    "timer" | "analytics" | "game" | "Setting" | null
  >(null);
  const { themeMode } = settingStore();
  const [fishPosition, setFishPosition] = useState<THREE.Vector3 | null>(null);
  const { user } = useAuthStore();
  const loadUserSettings = usesettingStore((state) => state.loadUserSettings);

  const fishesCount = useFishesCountStore((state) => state.FishesCount);
  const updateFishesCount = useFishesCountStore(
    (state) => state.updateFishesCount
  );

  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [instructionHovered, setInstructionHovered] = useState(false);
  const [isFishLoading, setIsFishLoading] = useState(false);

  useEffect(() => {
    const hasSeenInitialInstructions = localStorage.getItem(
      "hasSeenInitialInstructions"
    );

    if (hasSeenInitialInstructions === "true") {
      setShowInstructions(false);
    } else {
      setShowInstructions(true);
    }
  }, []);

  const handleCloseInstructions = () => {
    setShowInstructions(false);
    localStorage.setItem("hasSeenInitialInstructions", "true");
    setPage(null);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress < 100) {
          return prevProgress + 10;
        } else {
          clearInterval(interval);
          return 100;
        }
      });
    }, 300);

    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  const handleDropFish = async () => {
    if (user) {
      if (fishesCount > 0) {
        const randomX = Math.random() * (175 - -15) + -15;
        const randomZ = Math.random() * (90 - -150) + -150;
        setFishPosition(new THREE.Vector3(randomX, -5.5, randomZ));

        setIsFishLoading(true);
        await updateFishesCount(-1);
        setIsFishLoading(false);
      } else {
        toast.warning("沒有魚可以放置了，每專注1分鐘可以獲得1條魚！");
      }
    } else {
      toast.error("尚未登入");
    }
  };

  const handleAnalyticsClick = () => {
    if (user) {
      setPage("analytics");
      setTargetPosition([-105, 25, 100]);
      setLookAtPosition([250, 0, 0]);
    } else {
      toast.error("尚未登入");
    }
  };

  useEffect(() => {
    if (user) {
      loadUserSettings(user.uid);
    }
  }, [user, loadUserSettings]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center h-screen z-50 bg-black bg-opacity-75">
        <div className="w-full max-w-lg px-4">
          <p className="text-center text-white mb-4">Loading... {progress}%</p>
          <Progress value={progress} />
        </div>
      </div>
    );
  }

  const handleComplete = () => {
    setIsCompleted(true);
  };

  const handleShowInitialInstructions = () => {
    setShowInstructions(true);
  };

  return (
    <>
      <DashboardHeader
        pages={["Timer", "Analytics"]}
        setPage={setPage}
        setTargetPosition={setTargetPosition}
        setLookAtPosition={setLookAtPosition}
        handleAnalyticsClick={handleAnalyticsClick}
      />
      {page === null ? (
        ""
      ) : (
        <div className="fixed z-10 w-full h-full">
          {page === "timer" && (
            <TimerPage
              page={"Timer"}
              setPage={setPage}
              setTargetPosition={setTargetPosition}
              setLookAtPosition={setLookAtPosition}
            />
          )}
          {page === "analytics" && <AnalyticsPage />}
        </div>
      )}

      <Canvas className="z-0">
        <AsyncModels
          page={page}
          instructionHovered={instructionHovered}
          handleShowInitialInstructions={handleShowInitialInstructions}
          setInstructionHovered={setInstructionHovered}
          themeMode={themeMode}
          isFishLoading={isFishLoading}
          handleDropFish={handleDropFish}
          fishPosition={fishPosition}
          fishesCount={fishesCount}
        />
        <GamePage
          fishesCount={fishesCount}
          setFishesCount={updateFishesCount}
          handleDropFish={handleDropFish}
          fishPosition={fishPosition}
          setFishPosition={setFishPosition}
          pages={["Timer", "Game", "Analytics", "Setting"]}
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
            onClick={handleAnalyticsClick}
          />
        )}
        <CameraController
          targetPosition={targetPosition}
          lookAtPosition={lookAtPosition}
          isCompleted={isCompleted}
        />
        {/* <GizmoHelper alignment="bottom-right" margin={[100, 100]}>
          <GizmoViewport labelColor="white" axisHeadScale={1} />
        </GizmoHelper> */}

        {instructionHovered && (
          <Html position={[115, 70, 145]} center>
            <Card className="w-36 h-10 flex justify-center items-center p-2">
              重新觀看說明
            </Card>
          </Html>
        )}
      </Canvas>
      {page === null && <TimerDisplay page={"Timer"} />}
      <ToggleBgm />
      <InitialInstructions
        showInstructions={showInstructions}
        handleCloseInstructions={handleCloseInstructions}
        setTargetPosition={setTargetPosition}
        handleComplete={handleComplete}
      />
    </>
  );
};

export default LandingPage;
