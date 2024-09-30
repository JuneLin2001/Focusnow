import { useMemo } from "react";
import MovingModel from "./MovingModel";
import { useAnalyticsStore } from "../../store/analyticsStore";
import AnalyticsFetcher from "../../components/AnalyticsFetcher";

const GamePage = () => {
  const position: [number, number, number] = useMemo(() => [80, 6, 0], []);
  const { analyticsList, setAnalyticsList } = useAnalyticsStore();

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

  return (
    <>
      <AnalyticsFetcher onDataFetched={setAnalyticsList} />

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
          />
        ))}
      </group>
    </>
  );
};

export default GamePage;
