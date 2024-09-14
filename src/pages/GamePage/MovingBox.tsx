// MovingBox.tsx
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface MovingBoxProps {
  position: [number, number, number];
}

const MovingBox = ({ position }: MovingBoxProps) => {
  const meshRef = useRef<THREE.Mesh>(null!); // 使用 Mesh 來取代 Group

  // 設定初始目標位置和速度
  const targetPosition = useRef<THREE.Vector3>(
    new THREE.Vector3(
      Math.random() * 7.5 - 7.5, // X 位置在平面範圍內
      0, // Y 位置（固定在平面上方）
      Math.random() * 5 - 5 // Z 位置在平面深度內
    )
  );
  const speed = 2; // 移動速度

  // 設定初始縮放狀態
  const scaleRef = useRef<number>(1);
  const scaleSpeed = 0.05; // 縮放速度

  useFrame(() => {
    if (meshRef.current) {
      // 取得模型的當前位置
      const currentPosition = meshRef.current.position;
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
          0,
          Math.random() * 5 - 5
        );
      }

      // 進行縮放效果
      if (scaleRef.current > 1) {
        scaleRef.current -= scaleSpeed;
        meshRef.current.scale.set(
          scaleRef.current,
          scaleRef.current,
          scaleRef.current
        );
      }
    }
  });

  // 點擊事件處理
  const handleClick = () => {
    console.log("Box been click!");
  };

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={handleClick} // 添加點擊事件處理
      castShadow
      receiveShadow
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
};

export default MovingBox;
