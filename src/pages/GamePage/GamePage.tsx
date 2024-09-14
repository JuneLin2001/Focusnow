// GamePage.tsx
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Perf } from "r3f-perf";
import MovingBox from "./MovingBox";

const NUM_BOXES = 3; // 修改為顯示的模型數量為 3

const GamePage = () => {
  // 生成每個模型的隨機初始位置
  const positions: [number, number, number][] = Array.from(
    { length: NUM_BOXES },
    () => [
      Math.random() * 7.5 - 7.5, // X 位置在平面寬度內
      1, // Y 位置（固定在平面上方）
      Math.random() * 5 - 5, // Z 位置在平面深度內
    ]
  );

  return (
    <Canvas camera={{ position: [5, 5, 10] }}>
      <Perf position="top-right" showGraph={false} />

      <ambientLight intensity={2} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <boxGeometry args={[15, 10, 2]} />
        <meshStandardMaterial color="aqua" />
      </mesh>

      {positions.map((position, index) => (
        <MovingBox key={index} position={position} />
      ))}

      <OrbitControls />
    </Canvas>
  );
};

export default GamePage;
