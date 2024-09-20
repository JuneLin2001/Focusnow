// import MovingBox from "./MovingBox";
// import Model from "./Model";
import MovingModel from "./MovingModel";
import { useAnalyticsStore } from "../../store/analyticsStore";

const GamePage = () => {
  const position: [number, number, number] = [50, 20, 0];

  const { totalFocusDuration } = useAnalyticsStore();

  // 手動設置 width、depth、speed 的默認值
  const width = 100;
  const depth = 200;
  const speed = 2;

  const minX = position[0] - width / 2;
  const maxX = position[0] + width / 2;
  const minZ = position[2] - depth / 2;
  const maxZ = position[2] + depth / 2;
  // const minX = -width / 2;
  // const maxX = width / 2;
  // const minZ = -depth / 2;
  // const maxZ = depth / 2;

  console.log(`${minX}, ${maxX}, ${minZ}, ${maxZ}, ${position[1]}`);

  console.log(totalFocusDuration);

  // 根據 totalFocusDuration 計算要渲染的 MovingModel 數量
  const numModels = Math.floor(totalFocusDuration / 30);

  const randomPositions: [number, number, number][] = Array.from(
    { length: numModels },
    () => [
      Math.random() * (maxX - minX) + minX,
      30,
      Math.random() * (maxZ - minZ) + minZ,
    ]
  );

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={position}>
        <boxGeometry args={[width, depth, 5]} />
        {<meshStandardMaterial color="aqua" wireframe />}
      </mesh>

      {/* <Model minX={minX} maxX={maxX} minZ={minZ} maxZ={maxZ} /> */}

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
