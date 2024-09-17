import { useGLTF } from "@react-three/drei";

const Model = () => {
  const { scene } = useGLTF("BBpenguinCenter.glb"); // 加載 GLB 檔案
  return <primitive object={scene} />;
};

export default Model;
