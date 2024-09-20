import React, { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface MovingModelProps {
  id: number;
  position: [number, number, number];
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  speed: number;
}

const MovingModel: React.FC<MovingModelProps> = ({
  id,
  position,
  minX,
  maxX,
  minZ,
  maxZ,
  speed,
}) => {
  const { scene } = useGLTF("BBpenguinCenter.glb");
  const modelRef = useRef<THREE.Group>(null!);
  const [isLoaded, setIsLoaded] = useState(false);

  const targetPosition = useRef<THREE.Vector3>(
    new THREE.Vector3(
      Math.random() * (maxX - minX) + minX,
      position[1],
      Math.random() * (maxZ - minZ) + minZ
    )
  );

  useEffect(() => {
    if (scene) {
      setIsLoaded(true);
    }
  }, [scene]);

  useFrame(() => {
    if (modelRef.current && isLoaded) {
      const currentPosition = modelRef.current.position;
      const direction = targetPosition.current.clone().sub(currentPosition);
      const distance = direction.length();

      if (distance > 0.1) {
        direction.normalize().multiplyScalar(speed * 0.1);
        currentPosition.add(direction);
      } else {
        targetPosition.current.set(
          Math.random() * (maxX - minX) + minX,
          position[1],
          Math.random() * (maxZ - minZ) + minZ
        );
      }
    }
  });

  const handleClick = () => {
    console.log(`number ${id} Model clicked!`);
  };

  if (!isLoaded) {
    return null; // 或者返回一個加載指示器
  }

  return (
    <primitive
      object={scene.clone()} // 使用 clone() 來避免共享同一個場景
      position={position}
      scale={[2, 2, 2]}
      rotation={[0, Math.PI / 2, 0]}
      ref={modelRef}
      onClick={handleClick}
    />
  );
};

export default MovingModel;
