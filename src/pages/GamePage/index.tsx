import { Suspense, useMemo, useState, useEffect } from "react";
import MovingModel from "./MovingModel";
import { useAnalyticsStore } from "../../store/analyticsStore";
import AnalyticsFetcher from "../../utils/AnalyticsFetcher";
import * as THREE from "three";
import FishModel from "./FishModel";
import Sign from "./Sign";
import SignInstructions from "./SignInstructions";
import FishesCountFetcher from "../../utils/FishesCountFetcher";

interface GamePageProps {
  fishesCount: number;
  setFishesCount: (count: number) => void;
  handleDropFish: () => void;
  fishPosition: THREE.Vector3 | null;
  setFishPosition: (position: THREE.Vector3 | null) => void;
  pages: string[];
  setPage: (newPage: "Setting" | null) => void;
}

const GamePage: React.FC<GamePageProps> = ({
  fishPosition,
  setFishPosition,
  pages,
  setPage,
}) => {
  const position: [number, number, number] = useMemo(() => [80, 6, -30], []);
  const { analyticsList, setAnalyticsList } = useAnalyticsStore();
  const [last30DaysFocusDuration, setLast30DaysFocusDuration] =
    useState<number>(0);
  const [showInstructions, setShowInstructions] = useState(false);

  const width = 190;
  const depth = 240;

  const minX = position[0] - width / 2;
  const maxX = position[0] + width / 2;
  const minZ = position[2] - depth / 2;
  const maxZ = position[2] + depth / 2;

  const filteredAnalytics = useMemo(() => {
    return analyticsList.filter(
      (analytics) =>
        analytics.focusDuration >= 15 && analytics.pomodoroCompleted
    );
  }, [analyticsList]);

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

  useEffect(() => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const duration = analyticsList.reduce((total, analytics) => {
      const analyticsDate = new Date(analytics.startTime.seconds * 1000);
      if (analyticsDate >= thirtyDaysAgo && analytics.pomodoroCompleted) {
        return total + analytics.focusDuration;
      }
      return total;
    }, 0);

    setLast30DaysFocusDuration(duration);
  }, [analyticsList]);

  const handleOpen = () => {
    setShowInstructions(true);
    setPage("Setting");
    console.log(pages);
  };

  const handleClose = () => {
    setShowInstructions(false);
    setPage(null);
  };

  return (
    <>
      <FishesCountFetcher />
      <Suspense fallback={<div>Loading...</div>}>
        <AnalyticsFetcher onDataFetched={setAnalyticsList} />
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
        <FishModel position={[0, -10, 0]} />
        {fishPosition && (
          <FishModel
            position={[fishPosition.x, fishPosition.y, fishPosition.z]}
          />
        )}
      </group>
    </>
  );
};

export default GamePage;
