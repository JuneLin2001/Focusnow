import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface MovingModelProps {
  position: [number, number, number];
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  speed: number;
  scale: number;
  rotation: [number, number, number];
}

const MovingModel = ({
  position,
  minX,
  maxX,
  minZ,
  maxZ,
  speed,
  scale,
  rotation,
}: MovingModelProps) => {
  const { scene } = useGLTF("/low_poly_rockhopper_penguin.glb");
  const modelRef = useRef<THREE.Group>(null!);

  const targetPosition = useRef<THREE.Vector3>(
    new THREE.Vector3(
      Math.random() * (maxX - minX) + minX,
      -0.5,
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
        targetPosition.current.set(
          Math.random() * (maxX - minX) + minX,
          -0.5,
          Math.random() * (maxZ - minZ) + minZ
        );
      }
    }
  });

  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.scale.set(scale, scale, scale);
      modelRef.current.rotation.set(rotation[0], rotation[1], rotation[2]);
    }
  });

  const handleClick = () => {
    console.log("Model clicked!");
  };

  return (
    <primitive
      object={scene}
      position={position}
      ref={modelRef}
      onClick={handleClick}
      castShadow
      receiveShadow
    />
  );
};

export default MovingModel;
