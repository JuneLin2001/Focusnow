// Model.tsx
import React from "react";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { ModelProps } from "../../types/type";

const AnalyticsCube: React.FC<ModelProps> = ({ children, onClick }) => {
  const gltf = useLoader(GLTFLoader, "cube.glb");

  return (
    <group onClick={onClick}>
      <primitive object={gltf.scene} />
      {children}
    </group>
  );
};

export default AnalyticsCube;
