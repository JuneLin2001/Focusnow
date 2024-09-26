import { useState, useMemo } from "react";
import MovingModel from "./MovingModel";
import { useLast30DaysFocusDurationStore } from "../../store/last30DaysFocusDurationStore";
import Sign from "./Sign";
import SignInstructions from "./SignInstructions";

const GamePage = () => {
  const position: [number, number, number] = useMemo(() => [80, 6, 0], []);

  const last30DaysFocusDuration = useLast30DaysFocusDurationStore(
    (state) => state.last30DaysFocusDuration
  );

  const width = 100;
  const depth = 200;
  const speed = 1;

  const minX = position[0] - width / 2;
  const maxX = position[0] + width / 2;
  const minZ = position[2] - depth / 2;
  const maxZ = position[2] + depth / 2;

  // 使用 useMemo 計算 randomPositions
  const numModels = Math.floor(last30DaysFocusDuration / 30);
  const randomPositions: [number, number, number][] = useMemo(() => {
    return Array.from({ length: numModels }, () => [
      Math.random() * (maxX - minX) + minX,
      position[1],
      Math.random() * (maxZ - minZ) + minZ,
    ]);
  }, [numModels, minX, maxX, minZ, maxZ, position]);

  const [showInstructions, setShowInstructions] = useState(false);

  const handleCloseInstructions = () => {
    setShowInstructions(false);
  };

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={position}>
        <boxGeometry args={[width, depth, 5]} />
        <meshStandardMaterial transparent wireframe />
      </mesh>

      <Sign
        position={position}
        onClick={() => {
          setShowInstructions(true);
        }}
      />

      {randomPositions.map((randomPosition, index: number) => (
        <MovingModel
          key={index}
          id={index}
          position={randomPosition}
          minX={minX}
          maxX={maxX}
          minZ={minZ}
          maxZ={maxZ}
          speed={speed}
        />
      ))}

      <SignInstructions
        showInstructions={showInstructions}
        last30DaysFocusDuration={last30DaysFocusDuration}
        onClose={handleCloseInstructions}
      />
    </group>
  );
};

export default GamePage;
