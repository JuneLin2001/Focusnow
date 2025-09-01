"use client";

import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import GamePage from "@/components/Game/index";
import CameraController from "./CameraController";
import { useFishesCountStore } from "@/store/fishesCountStore";
import { AsyncModels, Bubble } from "./Models";
import { AlarmClock, ChartColumn } from "lucide-react";
import useAuthStore from "@/store/authStore";
import { useSettingStore } from "@/store/settingStore";
import { Card } from "@/components/ui/card";
import useDropFish from "@/hooks/useDropFish";
import usePageNavigation from "@/hooks/usePageNavigation";
import usePageStore from "@/store/usePageStore";

const Canvas3D = () => {
  const { handleDropFish, fishPosition, setFishPosition } = useDropFish();
  const { handleTimerPageClick, handleAnalyticsClick } = usePageNavigation();
  const { page } = usePageStore();
  const { themeMode } = useSettingStore();
  const { user } = useAuthStore();
  const loadUserSettings = useSettingStore((state) => state.loadUserSettings);
  const { fishesCount, updateFishesCount } = useFishesCountStore();
  const [instructionHovered, setInstructionHovered] = useState(false);

  useEffect(() => {
    // const hasSeenInitialInstructions = localStorage.getItem(
    //   "hasSeenInitialInstructions",
    // );
    // setShowInstructions(hasSeenInitialInstructions !== "true");

    const loadData = async () => {
      if (user) {
        await loadUserSettings(user.uid);
      }
    };

    loadData();
  }, [user, loadUserSettings]);

  // const handleComplete = () => {
  //   setIsCompleted(true);
  // };

  const handleShowInitialInstructions = () => {
    return;
    // setShowInstructions(true);
  };

  // useEffect(() => {
  //   const hasSeenInitialInstructions = localStorage.getItem(
  //     "hasSeenInitialInstructions",
  //   );
  //   setShowInstructions(hasSeenInitialInstructions !== "true");
  // }, []);

  // const handleCloseInstructions = () => {
  //   setShowInstructions(false);
  //   localStorage.setItem("hasSeenInitialInstructions", "true");
  //   setPage(null);
  // };

  return (
    <Canvas className="z-0">
      <AsyncModels
        instructionHovered={instructionHovered}
        handleShowInitialInstructions={handleShowInitialInstructions}
        setInstructionHovered={setInstructionHovered}
        themeMode={themeMode}
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
      />
      {page === null && (
        <Bubble
          Icon={AlarmClock}
          content="Timer"
          position={[-20, 40, -100]}
          onClick={handleTimerPageClick}
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
      <CameraController />
      {instructionHovered && (
        <Html position={[115, 70, 145]} center>
          <Card className="flex h-10 w-36 items-center justify-center p-2">
            觀看場景說明
          </Card>
        </Html>
      )}
    </Canvas>
  );
};

export default Canvas3D;
