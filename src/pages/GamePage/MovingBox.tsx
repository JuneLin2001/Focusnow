// MovingBox.tsx
import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface MovingBoxProps {
  position: [number, number, number];
}

const MovingBox = ({ position }: MovingBoxProps) => {
  const { scene } = useGLTF("BBpenguinCenter.glb"); // 載入 GLB 模型
  const modelRef = useRef<THREE.Group>(null!);

  // 設定初始目標位置和速度
  const targetPosition = React.useRef<THREE.Vector3>(
    new THREE.Vector3(
      Math.random() * 7.5 - 7.5, // X 位置在平面範圍內
      1, // Y 位置（固定在平面上方）
      Math.random() * 5 - 5 // Z 位置在平面深度內
    )
  );
  const speed = 2; // 移動速度

  useFrame(() => {
    if (modelRef.current) {
      // 取得模型的當前位置
      const currentPosition = modelRef.current.position;
      const direction = targetPosition.current.clone().sub(currentPosition); // 計算方向向量
      const distance = direction.length(); // 計算距離

      if (distance > 0.1) {
        // 計算移動向量
        direction.normalize().multiplyScalar(speed * 0.01);
        currentPosition.add(direction); // 將模型移向目標位置
      } else {
        // 當模型到達目標位置時，設定新的目標位置
        targetPosition.current.set(
          Math.random() * 7.5 - 7.5,
          1,
          Math.random() * 5 - 5
        );
      }
    }
  });

  return (
    <group ref={modelRef} position={position}>
      <primitive object={scene} />
    </group>
  );
};

export default MovingBox;
