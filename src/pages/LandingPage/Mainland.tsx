// Model.tsx
import React from "react";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { ModelProps } from "../../types/type";

const Mainland: React.FC<ModelProps> = ({ children }) => {
  const gltf = useLoader(GLTFLoader, "mainlandNew.glb");

  return (
    <group>
      <primitive object={gltf.scene} />
      {children}
    </group>
  );
};

export default Mainland;
