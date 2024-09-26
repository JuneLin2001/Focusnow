// Model.tsx
import React from "react";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { ModelProps } from "../../types/type";

const Sign: React.FC<ModelProps> = ({ children, onClick }) => {
  const gltf = useLoader(GLTFLoader, "sign.glb");
  return (
    <group onClick={onClick}>
      <primitive object={gltf.scene} />
      {children}
    </group>
  );
};

export default Sign;
