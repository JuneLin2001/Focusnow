import React from "react";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { ModelProps } from "@/types/type";

interface ModelPropsWithName extends ModelProps {
  modelPath: string;
}

const StaticModels: React.FC<ModelPropsWithName> = ({
  modelPath,
  children,
  onClick,
}) => {
  const gltf = useLoader(GLTFLoader, modelPath);

  return (
    <group onClick={onClick}>
      <primitive object={gltf.scene} />
      {children}
    </group>
  );
};

export const AnalyticsCube = (props: ModelProps) => (
  <StaticModels modelPath="TreasureBox.glb" {...props} />
);

export const Igloo = (props: ModelProps) => (
  <StaticModels modelPath="igloo.glb" {...props} />
);

export const FloatingIce = (props: ModelProps) => (
  <StaticModels modelPath="floatingIce.glb" {...props} />
);

export const Mainland = (props: ModelProps) => (
  <StaticModels modelPath="mainlandNew.glb" {...props} />
);

export const OceanModel = (props: ModelProps) => (
  <StaticModels modelPath="OceanModel.glb" {...props} />
);

export default StaticModels;
