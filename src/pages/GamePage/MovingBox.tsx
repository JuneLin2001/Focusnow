import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";

interface MovingBoxProps {
  position: [number, number, number];
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  speed: number;
}

const MovingBox = ({
  position,
  minX,
  maxX,
  minZ,
  maxZ,
  speed,
}: MovingBoxProps) => {
  const { scene } = useGLTF("/low_poly_rockhopper_penguin.glb");

  const modelRef = useRef<THREE.Mesh | null>(null);

  console.log(`${minX}, ${maxX}, ${minZ}, ${maxZ}, ${position[1]}`);
  // 使用 `useRef` 初始化 `targetPosition`
  const targetPosition = useRef<THREE.Vector3>(
    new THREE.Vector3(
      Math.random() * (maxX - minX) + minX,
      position[1],
      Math.random() * (maxZ - minZ) + minZ
    )
  );

  useFrame(() => {
    if (modelRef.current) {
      const currentPosition = modelRef.current.position;
      const direction = targetPosition.current.clone().sub(currentPosition);
      const distance = direction.length();

      if (distance > 0.1) {
        direction.normalize().multiplyScalar(speed * 0.1);
        currentPosition.add(direction);
      } else {
        // 當模型到達目標位置時，生成新的隨機目標位置
        targetPosition.current.set(
          Math.random() * (maxX - minX) + minX,
          position[1],
          Math.random() * (maxZ - minZ) + minZ
        );
      }
    }
  });

  const handleClick = () => {
    console.log("Box been clicked!");
  };

  return (
    <primitive
      object={scene}
      ref={modelRef}
      position={position}
      onClick={handleClick}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[5, 5, 5]} />
      <meshStandardMaterial color="red" />
    </primitive>
  );
};

export default MovingBox;
