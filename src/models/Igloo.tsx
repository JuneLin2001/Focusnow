import React from "react";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { ModelProps } from "../types/type";

const Igloo: React.FC<ModelProps> = ({ children }) => {
  const gltf = useLoader(GLTFLoader, "igloo.glb");

  return (
    <group>
      <primitive object={gltf.scene} />
      {children}
    </group>
  );
};

export default Igloo;
