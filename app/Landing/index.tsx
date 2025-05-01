import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import Timer from "@/components/Timer/index";
import AnalyticsPage from "@/components/Analytics";
import GamePage from "@/components/Game/index";
import CameraController from "./CameraController";
import { DashboardHeader } from "@/components/Header";
import TimerDisplayInSide from "@/components/Timer/TimerDisplayInSide";
import { useFishesCountStore } from "@/store/fishesCountStore";
import { AsyncModels, Bubble } from "./Models";
import { AlarmClock, ChartColumn } from "lucide-react";
import InitialInstructions from "./Instructions/InitialInstructions";
import useAuthStore from "@/store/authStore";
import * as THREE from "three";
import { useSettingStore } from "@/store/settingStore";
import { toast } from "react-toastify";
import { Card } from "@/components/ui/card";
import useFetchAnalytics from "@/hooks/useFetchAnalytics";
import Loader from "../components/Loader";

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
  const { themeMode } = useSettingStore();
  const [fishPosition, setFishPosition] = useState<THREE.Vector3 | null>(null);
  const { user } = useAuthStore();
  const loadUserSettings = useSettingStore((state) => state.loadUserSettings);
  const fishesCount = useFishesCountStore((state) => state.FishesCount);
  const updateFishesCount = useFishesCountStore(
    (state) => state.updateFishesCount,
  );

  const [loading, setLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [instructionHovered, setInstructionHovered] = useState(false);
  const [isFishLoading, setIsFishLoading] = useState(false);

  useFetchAnalytics();

  useEffect(() => {
    const hasSeenInitialInstructions = localStorage.getItem(
      "hasSeenInitialInstructions",
    );
    setShowInstructions(hasSeenInitialInstructions !== "true");
  }, []);

  const handleCloseInstructions = () => {
    setShowInstructions(false);
    localStorage.setItem("hasSeenInitialInstructions", "true");
    setPage(null);
  };

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
    const hasSeenInitialInstructions = localStorage.getItem(
      "hasSeenInitialInstructions",
    );
    setShowInstructions(hasSeenInitialInstructions !== "true");

    const loadData = async () => {
      if (user) {
        await loadUserSettings(user.uid);
      }
      setLoading(false);
    };

    loadData();
  }, [user, loadUserSettings]);

  const handleComplete = () => {
    setIsCompleted(true);
  };

  const handleShowInitialInstructions = () => {
    setShowInstructions(true);
  };

  if (loading) {
    return <Loader />;
  }
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
        <div className="fixed z-10 size-full">
          {page === "timer" && (
            <Timer
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
        {instructionHovered && (
          <Html position={[115, 70, 145]} center>
            <Card className="flex h-10 w-36 items-center justify-center p-2">
              觀看場景說明
            </Card>
          </Html>
        )}
      </Canvas>
      <TimerDisplayInSide
        page={page}
        setPage={setPage}
        setTargetPosition={setTargetPosition}
      />
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
