import { useMemo } from "react";
import MovingModel from "./MovingModel";

import { useAnalyticsStore } from "../../store/analyticsStore";

const GamePage = () => {
  const position: [number, number, number] = useMemo(() => [80, 6, 0], []);

  const analyticsList = useAnalyticsStore((state) => state.analyticsList);

  const width = 100;
  const depth = 200;
  const speed = 1;

  const minX = position[0] - width / 2;
  const maxX = position[0] + width / 2;
  const minZ = position[2] - depth / 2;
  const maxZ = position[2] + depth / 2;

  const filteredAnalytics = useMemo(() => {
    return analyticsList.filter((analytics) => analytics.focusDuration > 15);
  }, [analyticsList]);

  const randomPositions: {
    position: [number, number, number];
    date: string;
    focusDuration: number; // 專注時間
    todoTitles: string[];
  }[] = useMemo(() => {
    return filteredAnalytics.map((analytics) => {
      const randomX = Math.random() * (maxX - minX) + minX;
      const randomZ = Math.random() * (maxZ - minZ) + minZ;

      const focusDate = new Date(
        analytics.startTime.seconds * 1000
      ).toLocaleDateString();

      const focusDuration = analytics.focusDuration;

      const todoTitles = Array.isArray(analytics.todos)
        ? analytics.todos
            .filter((todo) => todo.completed)
            .map((todo) => todo.title)
        : [];

      return {
        position: [randomX, position[1], randomZ] as [number, number, number],
        date: focusDate,
        focusDuration, // 專注時間
        todoTitles,
      };
    });
  }, [filteredAnalytics, minX, maxX, minZ, maxZ, position]);

  const handleModelClick = (id: number) => {
    console.log(`Model with id ${id} clicked`);
    // 可以添加更多的邏輯，例如取消跟隨或其他操作
  };

  return (
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
          focusDate={randomPosition.date} // 專注日期
          focusDuration={randomPosition.focusDuration} // 專注時間
          todoTitles={randomPosition.todoTitles} // 傳遞所有 Todo 標題的陣列
          onModelClick={handleModelClick} // 傳遞 onModelClick
        />
      ))}
    </group>
  );
};

export default GamePage;
