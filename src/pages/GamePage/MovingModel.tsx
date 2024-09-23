import React, { useRef, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
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
  const { camera } = useThree(); // 獲取相機
  const [isFollowing, setIsFollowing] = useState(false); // 跟隨狀態

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

        const targetRotation = new THREE.Vector3(
          targetPosition.current.x,
          position[1],
          targetPosition.current.z
        );
        const lookAtDirection = targetRotation.sub(currentPosition).normalize();
        const angle = Math.atan2(lookAtDirection.x, lookAtDirection.z);
        modelRef.current.rotation.y = THREE.MathUtils.lerp(
          modelRef.current.rotation.y,
          angle,
          0.1
        );
      } else {
        targetPosition.current.set(
          Math.random() * (maxX - minX) + minX,
          position[1],
          Math.random() * (maxZ - minZ) + minZ
        );
      }

      // 上下搖擺
      modelRef.current.position.y =
        position[1] + Math.sin(Date.now() * 0.001 * speed) * 0.1;

      // 跟隨鏡頭
      if (isFollowing) {
        camera.position.lerp(
          new THREE.Vector3(
            currentPosition.x,
            currentPosition.y + 10,
            currentPosition.z + 3
          ),
          0.1
        );
        camera.lookAt(currentPosition);
      }
    }
  });

  const handleClick = () => {
    console.log(`number ${id} Model clicked!`);
    setIsFollowing((prev) => !prev); // 切換跟隨狀態
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <primitive
      object={scene.clone()}
      position={position}
      scale={[2, 2, 2]}
      rotation={[0, Math.PI / 2, 0]}
      ref={modelRef}
      onClick={handleClick}
    />
  );
};

export default MovingModel;
