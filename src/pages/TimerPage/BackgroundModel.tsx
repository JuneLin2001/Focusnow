import { useGLTF } from "@react-three/drei";

const BackgroundModel = () => {
  const { scene } = useGLTF("ice_environment.glb");

  const scale = [0.004, 0.004, 0.004];
  const position = [-0.6, -0.6, -0.2];
  const rotation = [0, Math.PI, 0];

  return (
    <primitive
      object={scene}
      scale={scale}
      position={position}
      rotation={rotation}
    />
  );
};

export default BackgroundModel;
