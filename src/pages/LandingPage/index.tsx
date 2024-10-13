import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Environment,
  Sky,
  GizmoHelper,
  GizmoViewport,
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
import { Progress } from "@/components/ui/progress";
import usesettingStore from "@/store/settingStore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SnowPenguin from "../GamePage/snowPenguin";
import ShowInstructions from "./ShowInstructions";

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
        setFishPosition(new THREE.Vector3(randomX, 6, randomZ));

        await updateFishesCount(-1);
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
          <p className="text-center text-white mb-4">Loading...</p>
          <Progress value={progress} />
        </div>
      </div>
    );
  }

  const handleComplete = () => {
    setIsCompleted(true);
  };

  const handleShowInnitialInstructions = () => {
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
          {page === "timer" && <TimerPage />}
          {page === "analytics" && <AnalyticsPage />}
        </div>
      )}
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={themeMode === "light" ? "light" : "dark"}
      />

      <Canvas className="z-0">
        <Environment preset={themeMode === "light" ? "warehouse" : "night"} />
        {themeMode === "dark" && (
          <Sky sunPosition={[0, -1, 0]} distance={100000} />
        )}
        <Mainland />
        {page === null && (
          <DropFish
            position={[100, 80, 0]}
            fishesCount={fishesCount}
            fishPosition={fishPosition}
            handleDropFish={handleDropFish}
          />
        )}
        <Igloo />
        <FloatingIce />
        <OceanModel />
        <Analytics />
        <Snowflakes />
        {page === null && <ShowInstructions position={[114, 45, 143]} />}
        <SnowPenguin onClick={handleShowInnitialInstructions} />
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
        <GizmoHelper alignment="bottom-right" margin={[100, 100]}>
          <GizmoViewport labelColor="white" axisHeadScale={1} />
        </GizmoHelper>
      </Canvas>
      {page === null && <TimerDisplay page={page} />}
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
