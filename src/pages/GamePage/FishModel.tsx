import { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface FishModelProps {
  position: [number, number, number];
  onClick: () => void;
}

const FishModel: React.FC<FishModelProps> = ({ position, onClick }) => {
  const { scene } = useGLTF("fish_low_poly.glb"); // 請替換成您的魚模型路徑
  const fishRef = useRef<THREE.Group>(null!);

  return (
    <primitive
      object={scene.clone()}
      position={position}
      scale={[10, 10, 10]} // 可根據需要調整魚模型的大小
      ref={fishRef}
      onClick={onClick}
    />
  );
};

export default FishModel;
