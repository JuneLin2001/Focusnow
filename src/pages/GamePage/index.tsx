import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Perf } from "r3f-perf";
import MovingBox from "./MovingBox";
import { useControls } from "leva";
import Model from "./Model";
import MovingModel from "./MovingModel";

const GamePage = () => {
  const position: [number, number, number] = [0, 0, 0];

  const { width, depth, speed } = useControls({
    width: {
      value: 15,
      min: 1,
      max: 30,
      step: 0.1,
    },
    depth: {
      value: 10,
      min: 1,
      max: 20,
      step: 0.1,
    },
    speed: {
      value: 0.2,
      min: 0.1,
      max: 1,
      step: 0.1,
    },
  });

  const minX = -width / 2;
  const maxX = width / 2;
  const minZ = -depth / 2;
  const maxZ = depth / 2;

  return (
    <Canvas camera={{ position: [5, 5, 10] }}>
      <Perf position="top-right" showGraph={false} />

      <ambientLight intensity={2} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <boxGeometry args={[width, depth, 1]} />
        <meshStandardMaterial color="aqua" />
      </mesh>

      <MovingBox
        position={position}
        minX={minX}
        maxX={maxX}
        minZ={minZ}
        maxZ={maxZ}
        speed={speed}
      />

      <Model minX={minX} maxX={maxX} minZ={minZ} maxZ={maxZ} />

      <MovingModel
        position={position}
        minX={minX}
        maxX={maxX}
        minZ={minZ}
        maxZ={maxZ}
        speed={speed}
      />
      <OrbitControls />
    </Canvas>
  );
};

export default GamePage;
