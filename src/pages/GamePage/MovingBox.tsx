import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

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
  const meshRef = useRef<THREE.Mesh | null>(null);

  console.log(`${minX}, ${maxX}, ${minZ}, ${maxZ}, ${position[1]}`);
  // 使用 `useRef` 初始化 `targetPosition`
  const targetPosition = useRef<THREE.Vector3>(
    new THREE.Vector3(
      Math.random() * (maxX - minX) + minX,
      position[1],
      Math.random() * (maxZ - minZ) + minZ
    )
  );

  const scaleRef = useRef<number>(1);
  const scaleSpeed = 0.05;

  useFrame(() => {
    if (meshRef.current) {
      const currentPosition = meshRef.current.position;
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

      // 縮放動畫
      if (scaleRef.current > 0.5) {
        // 確保不會縮小到 0 或更小
        scaleRef.current -= scaleSpeed;
        meshRef.current.scale.set(
          scaleRef.current,
          scaleRef.current,
          scaleRef.current
        );
      }
    }
  });

  const handleClick = () => {
    console.log("Box been clicked!");
  };

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={handleClick}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[5, 5, 5]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
};

export default MovingBox;
