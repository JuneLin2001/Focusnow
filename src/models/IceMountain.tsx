import React from "react";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

interface ModelProps {
  position: [number, number, number];
  children?: React.ReactNode;
  onClick: () => void;
}

const IceMountain: React.FC<ModelProps> = ({ children, onClick }) => {
  const gltf = useLoader(GLTFLoader, "moreIceMountain.glb");

  return (
    <group onClick={onClick}>
      <primitive object={gltf.scene} />
      {children}
    </group>
  );
};

export default IceMountain;
