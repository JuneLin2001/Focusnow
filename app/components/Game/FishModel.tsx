import { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface FishModelProps {
  position: [number, number, number];
  onClick?: () => void;
}

const FishModel: React.FC<FishModelProps> = ({ position, onClick }) => {
  const { scene } = useGLTF("fish_low_poly.glb");
  const fishRef = useRef<THREE.Group>(null!);

  return (
    <primitive
      object={scene.clone()}
      position={position}
      scale={[10, 10, 10]}
      ref={fishRef}
      onClick={onClick}
    />
  );
};

export default FishModel;
