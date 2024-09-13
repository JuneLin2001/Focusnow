import React, { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Stats from "stats.js";

const GamePage: React.FC = () => {
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

  function Box() {
    const ref = useRef<THREE.Mesh>(null!);
    useFrame(() => {
      ref.current.rotation.x += 0.01;
      ref.current.rotation.y += 0.01;
    });

    return (
      <mesh ref={ref} position={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="orange" />
      </mesh>
    );
  }

  return (
    <>
      <Canvas>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Box />
      </Canvas>
    </>
  );
};

export default GamePage;
