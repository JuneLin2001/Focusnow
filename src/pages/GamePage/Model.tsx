import { useGLTF } from "@react-three/drei";
import { useControls } from "leva"; // 引入 useControls

const Model = () => {
  const { scene } = useGLTF("BBpenguinCenter.glb");

  // 使用 useControls 創建一個控制面板來調整位置
  const { x, y, z } = useControls("Position", {
    x: { value: 0, min: -10, max: 10, step: 0.1 },
    y: { value: -0.5, min: -10, max: 10, step: 0.1 },
    z: { value: 0, min: -10, max: 10, step: 0.1 },
  });

  return (
    <primitive
      object={scene}
      position={[x, y, z]} // 使用 useControls 的值來控制位置
      scale={[0.5, 0.5, 0.5]}
    />
  );
};

export default Model;
