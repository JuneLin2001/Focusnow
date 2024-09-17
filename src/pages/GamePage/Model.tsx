import { useGLTF } from "@react-three/drei";
import { useControls } from "leva";

interface ModelProps {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

const Model = ({ minX, maxX, minZ, maxZ }: ModelProps) => {
  const { scene } = useGLTF("BBpenguinCenter.glb");

  const { x, z, rotationY } = useControls("Transform", {
    x: { value: 0, min: minX, max: maxX, step: 0.1 },
    z: { value: 0, min: minZ, max: maxZ, step: 0.1 },
    rotationY: { value: 0, min: 0, max: Math.PI * 2, step: 0.1 },
  });

  return (
    <primitive
      object={scene}
      position={[x, -0.5, z]}
      rotation={[0, rotationY, 0]}
      scale={[0.5, 0.5, 0.5]}
    />
  );
};

export default Model;
