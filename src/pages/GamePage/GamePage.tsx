import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Perf } from "r3f-perf";

const GamePage = () => {
  return (
    <Canvas camera={{ position: [5, 5, 10] }}>
      <Perf position="top-right" showGraph={false} />

      <ambientLight intensity={2} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[15, 10]} />
        <meshStandardMaterial color="aqua" />
      </mesh>
      <OrbitControls />
    </Canvas>
  );
};

export default GamePage;
