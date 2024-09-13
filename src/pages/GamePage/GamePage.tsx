import * as THREE from "three";
import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, ThreeElements } from "@react-three/fiber";
import Stats from "stats.js";
import { PerspectiveCamera } from "@react-three/drei";

const GamePage = () => {
  // 使用 useEffect 來初始化 Stats
  useEffect(() => {
    const stats = new Stats();
    stats.showPanel(0); // 0: fps, 1: ms/frame, 2: memory usage
    document.body.appendChild(stats.dom);

    // 調整 Stats 面板的樣式
    stats.dom.style.transform = "scale(2)"; // 放大 2 倍
    stats.dom.style.transformOrigin = "top left"; // 固定放大位置
    stats.dom.style.left = "0px"; // 確保位置對齊
    stats.dom.style.top = "0px";

    // 在每幀更新時更新 stats
    const animateStats = () => {
      stats.begin();
      stats.end();
      requestAnimationFrame(animateStats);
    };

    requestAnimationFrame(animateStats);

    return () => {
      // 清理 stats
      document.body.removeChild(stats.dom);
    };
  }, []);

  function Box(props: ThreeElements["mesh"]) {
    const meshRef = useRef<THREE.Mesh>(null!);
    const [hovered, setHover] = useState(false);
    const [active, setActive] = useState(false);
    useFrame((_state, delta) => (meshRef.current.rotation.x += delta));

    return (
      <mesh
        {...props}
        ref={meshRef}
        scale={active ? 1.5 : 1}
        onClick={(_event) => setActive(!active)}
        onPointerOver={(_event) => setHover(true)}
        onPointerOut={(_event) => setHover(false)}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={hovered ? "hotpink" : "#2f74c0"} />
      </mesh>
    );
  }

  return (
    <>
      <Canvas>
        <PerspectiveCamera makeDefault fov={75} position={[0, 0, 5]} />
        <ambientLight intensity={Math.PI / 2} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          decay={0}
          intensity={Math.PI}
        />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        <Box position={[-1.2, 0, 0]} />
        <Box position={[1.2, 0, 0]} />
      </Canvas>
    </>
  );
};

export default GamePage;
