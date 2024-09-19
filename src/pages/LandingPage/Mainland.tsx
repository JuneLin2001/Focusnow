// Model.tsx
import React from "react";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

interface ModelProps {
  position: [number, number, number];
  children?: React.ReactNode; // 允許傳入子組件
  onClick: () => void;
}

const Mainland: React.FC<ModelProps> = ({ children, onClick }) => {
  const gltf = useLoader(GLTFLoader, "mainlandNew.glb"); // 替換為你的模型路徑

  return (
    <group onClick={onClick}>
      <primitive object={gltf.scene} />
      {children}
    </group>
  );
};

export default Mainland;
