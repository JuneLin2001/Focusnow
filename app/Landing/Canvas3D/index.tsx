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
import * as THREE from "three";
import { useSettingStore } from "@/store/settingStore";
import { toast } from "react-toastify";
import { Card } from "@/components/ui/card";
import useFetchAnalytics from "@/hooks/useFetchAnalytics";
import useDropFish from "@/hooks/useDropFish";
import useAnalyticsPageClick from "@/hooks/useAnalyticsPageClick";

const Canvas3D = () => {
  const { handleDropFish } = useDropFish();
  const { handleAnalyticsClick } = useAnalyticsPageClick();

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
  const { fishesCount } = useFishesCountStore();
  const updateFishesCount = useFishesCountStore(
    (state) => state.updateFishesCount,
  );

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

    const loadData = async () => {
      if (user) {
        await loadUserSettings(user.uid);
      }
    };

    loadData();
  }, [user, loadUserSettings]);

  const handleComplete = () => {
    setIsCompleted(true);
  };

  const handleShowInitialInstructions = () => {
    setShowInstructions(true);
  };

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

  return (
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
  );
};

export default Canvas3D;
