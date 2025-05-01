"use client";

import { useState, useEffect } from "react";
import Timer from "@/components/Timer/index";
import AnalyticsPage from "@/components/Analytics";
import { DashboardHeader } from "@/components/Header";
import TimerDisplayInSide from "@/components/Timer/TimerDisplayInSide";
import { useFishesCountStore } from "@/store/fishesCountStore";
import InitialInstructions from "./Instructions/InitialInstructions";
import useAuthStore from "@/store/authStore";
import * as THREE from "three";
import { useSettingStore } from "@/store/settingStore";
import { toast } from "react-toastify";
import useFetchAnalytics from "@/hooks/useFetchAnalytics";
import Canvas3D from "./Canvas3D";

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

  const [isCompleted, setIsCompleted] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

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
    };

    loadData();
  }, [user, loadUserSettings]);

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
      <Canvas3D />
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
