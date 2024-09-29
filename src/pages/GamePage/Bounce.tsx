import { Canvas } from "@react-three/fiber";
import {
  PresentationControls,
  Environment,
  ContactShadows,
  Html,
} from "@react-three/drei";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { useLoader } from "@react-three/fiber";
import { ModelProps } from "../../types/type"; // 確保這個路徑是正確的

export default function Bounce() {
  return (
    <Canvas shadows camera={{ position: [0, 5, 10], fov: 25 }}>
      <ambientLight intensity={0.5} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        shadow-mapSize={2048}
        castShadow
      />
      <PresentationControls
        global
        config={{ mass: 2, tension: 500 }}
        snap={{ mass: 4, tension: 1500 }}
        rotation={[0, 1, 0]}
        polar={[-Math.PI / 3, Math.PI / 3]}
        azimuth={[-Math.PI / 1.4, Math.PI / 2]}
      >
        <BounceModel position={[0, 0.25, 0]} />
      </PresentationControls>
      <ContactShadows
        position={[0, -1.4, 0]}
        opacity={0.75}
        scale={10}
        blur={3}
        far={4}
      />
      <ambientLight intensity={0.5} />

      <Environment preset="city" />
    </Canvas>
  );
}

const BounceModel: React.FC<ModelProps> = ({ onClick, ...props }) => {
  const gltf = useLoader(GLTFLoader, "BBpenguinCenter.glb"); // 使用 GLTFLoader 加載模型

  return (
    <group {...props} onClick={onClick} dispose={null}>
      <primitive object={gltf.scene} />
      {/* 你可以在這裡添加更多的細節，比如其他的mesh或Html */}
      {/* 例如：添加註釋 */}
      <Html
        scale={100}
        rotation={[0, -0.5, 0]}
        position={[300, -130, -100]} // 調整位置
        transform
        occlude
      >
        <div className="annotation">123</div>
      </Html>
    </group>
  );
};

// 確保路徑正確
// 這裡的 ModelProps 定義應包含 position, rotation, scale 等屬性
