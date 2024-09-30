import { Suspense, useMemo } from "react";
import MovingModel from "./MovingModel";
import { useAnalyticsStore } from "../../store/analyticsStore";
import AnalyticsFetcher from "../../components/AnalyticsFetcher";
import { useState } from "react";
import * as THREE from "three";
import FishModel from "./FishModel"; // 導入 FishModel
import { Html } from "@react-three/drei";

const GamePage = () => {
  const position: [number, number, number] = useMemo(() => [80, 6, -30], []);
  const { analyticsList, setAnalyticsList } = useAnalyticsStore();
  const [fishPosition, setFishPosition] = useState<THREE.Vector3 | null>(null);

  const width = 190;
  const depth = 240;
  const speed = 1;

  const minX = position[0] - width / 2;
  const maxX = position[0] + width / 2;
  const minZ = position[2] - depth / 2;
  const maxZ = position[2] + depth / 2;

  // 使用 useMemo 過濾數據
  const filteredAnalytics = useMemo(() => {
    return analyticsList.filter((analytics) => analytics.focusDuration > 15);
  }, [analyticsList]);

  // 隨機位置
  const randomPositions = useMemo(() => {
    return filteredAnalytics.map((analytics) => {
      const randomX = Math.random() * (maxX - minX) + minX;
      const randomZ = Math.random() * (maxZ - minZ) + minZ;
      return {
        position: [randomX, 6, randomZ] as [number, number, number],
        date: new Date(analytics.startTime.seconds * 1000).toLocaleDateString(),
        focusDuration: analytics.focusDuration,
        todoTitles: analytics.todos
          .filter((todo) => todo.completed)
          .map((todo) => todo.title),
      };
    });
  }, [filteredAnalytics, minX, maxX, minZ, maxZ]);

  // 隨機放置魚的邏輯
  const handleDropFish = () => {
    const randomX = Math.random() * (maxX - minX) + minX;
    const randomZ = Math.random() * (maxZ - minZ) + minZ;
    setFishPosition(new THREE.Vector3(randomX, 10, randomZ)); // 設定魚的高度
  };

  const handleClearFish = () => {
    setFishPosition(null); // 清除魚的位置
  };

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <AnalyticsFetcher onDataFetched={setAnalyticsList} />
      </Suspense>

      <group>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={position}>
          <boxGeometry args={[width, depth, 5]} />
          <meshStandardMaterial transparent wireframe />
        </mesh>

        {randomPositions.map((randomPosition, index: number) => (
          <MovingModel
            key={index}
            id={index}
            position={randomPosition.position}
            minX={minX}
            maxX={maxX}
            minZ={minZ}
            maxZ={maxZ}
            speed={speed}
            focusDate={randomPosition.date}
            focusDuration={randomPosition.focusDuration}
            todoTitles={randomPosition.todoTitles}
            fishPosition={fishPosition} // 傳遞魚的位置
            setFishPosition={setFishPosition} // 傳遞設置魚的位置的函數
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

        {/* 如果魚的位置存在，就顯示魚模型 */}
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
