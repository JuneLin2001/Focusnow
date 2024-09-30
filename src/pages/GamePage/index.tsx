import { Suspense, useMemo, useState, useEffect } from "react";
import MovingModel from "./MovingModel";
import { useAnalyticsStore } from "../../store/analyticsStore";
import AnalyticsFetcher from "../../components/AnalyticsFetcher";
import * as THREE from "three";
import FishModel from "./FishModel";
import { Html } from "@react-three/drei";
import Sign from "./Sign";
import SignInstructions from "./SignInstructions";
import Snowflakes from "./Snowflakes";
import FishesCountFetcher from "../../components/AchievementsFetcher";

const GamePage = () => {
  const position: [number, number, number] = useMemo(() => [80, 6, -30], []);
  const { analyticsList, setAnalyticsList } = useAnalyticsStore();
  const [fishPosition, setFishPosition] = useState<THREE.Vector3 | null>(null);
  const [last30DaysFocusDuration, setLast30DaysFocusDuration] =
    useState<number>(0);
  const [showInstructions, setShowInstructions] = useState(false);

  const width = 190;
  const depth = 240;

  const minX = position[0] - width / 2;
  const maxX = position[0] + width / 2;
  const minZ = position[2] - depth / 2;
  const maxZ = position[2] + depth / 2;

  // 使用 useMemo 過濾數據
  const filteredAnalytics = useMemo(() => {
    return analyticsList.filter((analytics) => analytics.focusDuration > 15);
  }, [analyticsList]);

  // 隨機位置
  const penguinDatas = useMemo(() => {
    return filteredAnalytics.map((analytics) => {
      return {
        date: new Date(analytics.startTime.seconds * 1000).toLocaleDateString(),
        focusDuration: analytics.focusDuration,
        todoTitles: analytics.todos
          .filter((todo) => todo.completed)
          .map((todo) => todo.title),
      };
    });
  }, [filteredAnalytics]);

  const handleDropFish = () => {
    const randomX = Math.random() * (maxX - minX) + minX;
    const randomZ = Math.random() * (maxZ - minZ) + minZ;
    setFishPosition(new THREE.Vector3(randomX, 10, randomZ));
  };

  const handleClearFish = () => {
    setFishPosition(null);
  };

  useEffect(() => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const duration = analyticsList.reduce((total, analytics) => {
      const analyticsDate = new Date(analytics.startTime.seconds * 1000);
      if (analyticsDate >= thirtyDaysAgo) {
        return total + analytics.focusDuration;
      }
      return total;
    }, 0);

    setLast30DaysFocusDuration(duration);
  }, [analyticsList]);

  const handleOpen = () => {
    setShowInstructions(true);
  };

  const handleClose = () => {
    setShowInstructions(false);
  };

  return (
    <>
      <FishesCountFetcher />
      <Suspense fallback={<div>Loading...</div>}>
        <AnalyticsFetcher onDataFetched={setAnalyticsList} />
        <Snowflakes />
      </Suspense>

      <group>
        <mesh position={position}>
          <boxGeometry args={[width, 5, depth]} />
          <meshStandardMaterial transparent wireframe />
        </mesh>

        <Sign position={[0, 20, 0]} onClick={handleOpen} />

        <SignInstructions
          showInstructions={showInstructions}
          last30DaysFocusDuration={last30DaysFocusDuration}
          onClose={handleClose}
        />

        {penguinDatas.map((penguinData, index: number) => (
          <MovingModel
            key={index}
            id={index}
            minX={minX}
            maxX={maxX}
            minZ={minZ}
            maxZ={maxZ}
            focusDate={penguinData.date}
            focusDuration={penguinData.focusDuration}
            todoTitles={penguinData.todoTitles}
            fishPosition={fishPosition}
            setFishPosition={setFishPosition}
          />
        ))}

        <Html>
          <div className="flex">
            <button className="mr-4" onClick={handleDropFish}>
              放下魚
            </button>
            <button onClick={handleClearFish}>清除魚</button>
          </div>
        </Html>

        {fishPosition && (
          <FishModel
            position={[fishPosition.x, fishPosition.y, fishPosition.z]}
            onClick={() => console.log("Fish clicked!")}
          />
        )}
      </group>
    </>
  );
};

export default GamePage;
