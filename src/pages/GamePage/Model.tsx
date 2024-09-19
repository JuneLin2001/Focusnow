import { useGLTF } from "@react-three/drei";

interface ModelProps {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

const Model = ({ minX, minZ }: ModelProps) => {
  const { scene } = useGLTF("BBpenguinCenter.glb");

  return (
    <primitive
      object={scene}
      position={[minX, 50, minZ]}
      rotation={[0, 0, 0]}
      scale={[5, 5, 5]}
    />
  );
};

export default Model;
