// Model.tsx
import React from "react";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { Float } from "@react-three/drei";

interface ModelProps {
  position: [number, number, number];
  children?: React.ReactNode; // 允許傳入子組件
  onClick: () => void;
}

const Iceberg: React.FC<ModelProps> = ({ position, children, onClick }) => {
  const gltf = useLoader(GLTFLoader, "iceberg.glb"); // 替換為你的模型路徑

  return (
    <Float
      position={position}
      speed={2}
      rotationIntensity={2}
      floatIntensity={2}
    >
      <group onClick={onClick}>
        <primitive object={gltf.scene} />
        {children}
      </group>
    </Float>
  );
};

export default Iceberg;
