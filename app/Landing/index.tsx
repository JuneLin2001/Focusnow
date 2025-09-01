"use client";

import { useEffect } from "react";
// import { useFishesCountStore } from "@/store/fishesCountStore";
// import InitialInstructions from "./Instructions/InitialInstructions";
import useAuthStore from "@/store/authStore";
// import * as THREE from "three";
import { useSettingStore } from "@/store/settingStore";
// import usePageNavigation from "@/hooks/usePageNavigation";
import usePageStore from "@/store/usePageStore";

const LandingPage = () => {
  // const {
  //   handleTimerPageClick,
  //   handleAnalyticsClick,
  // } = usePageNavigation();
  const { page } = usePageStore();

  // const { themeMode } = useSettingStore();
  // const [fishPosition, setFishPosition] = useState<THREE.Vector3 | null>(null);
  const { user } = useAuthStore();
  const { loadUserSettings } = useSettingStore();
  // const { fishesCount,updateFishesCount } = useFishesCountStore();
  // const [isCompleted, setIsCompleted] = useState(false);
  // const [showInstructions, setShowInstructions] = useState(true);

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

  useEffect(() => {
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

  return (
    <>
      {/* {page !== null && (
        <div className="fixed z-10 size-full">
          {page === "timer" && <Timer />}
          {page === "analytics" && <AnalyticsPage />}
        </div>
      )} */}
      {/* <InitialInstructions
        showInstructions={showInstructions}
        handleCloseInstructions={handleCloseInstructions}
        setTargetPosition={setTargetPosition}
        handleComplete={handleComplete}
      /> */}
    </>
  );
};

export default LandingPage;
