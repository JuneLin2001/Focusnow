import MovingModel from "./MovingModel";
import { useLast30DaysFocusDurationStore } from "../../store/Last30DaysFocusDurationStore";

const GamePage = () => {
  const position: [number, number, number] = [80, 5, 0];

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

  console.log(`${minX}, ${maxX}, ${minZ}, ${maxZ}, ${position[1]}`);

  console.log(last30DaysFocusDuration);

  const numModels = Math.floor(last30DaysFocusDuration / 30);

  const randomPositions: [number, number, number][] = Array.from(
    { length: numModels },
    () => [
      Math.random() * (maxX - minX) + minX,
      position[1],
      Math.random() * (maxZ - minZ) + minZ,
    ]
  );

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={position}>
        <boxGeometry args={[width, depth, 5]} />
        {<meshStandardMaterial color="aqua" wireframe />}
      </mesh>

      {randomPositions.map((randomPositions, index: number) => (
        <MovingModel
          key={index}
          id={index}
          position={randomPositions}
          minX={minX}
          maxX={maxX}
          minZ={minZ}
          maxZ={maxZ}
          speed={speed}
        />
      ))}
    </group>
  );
};

export default GamePage;
