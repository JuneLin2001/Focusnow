import React from "react";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { ModelProps } from "../types/type";

const Igloo: React.FC<ModelProps> = ({ children, onClick }) => {
  const gltf = useLoader(GLTFLoader, "igloo.glb");

  return (
    <group onClick={onClick}>
      <primitive object={gltf.scene} />
      {children}
    </group>
  );
};

export default Igloo;
