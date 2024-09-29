import { useState, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import ModelInstructions from "./ModelInstructions";

interface MovingModelProps {
  id: number;
  position: [number, number, number];
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  speed: number;
  focusDate: string; // 專注日期
  focusDuration: number; // 專注時間
  hasTodo: boolean; // 是否有Todo
  todoTitles: string[]; // Todo標題
  onModelClick: (id: number) => void; // 新增 onModelClick 屬性
}

const MovingModel: React.FC<MovingModelProps> = ({
  id,
  position,
  minX,
  maxX,
  minZ,
  maxZ,
  speed,
  focusDate,
  focusDuration,
  todoTitles,
  onModelClick,
}) => {
  const { scene } = useGLTF("BBpenguinCenter.glb"); // 載入企鵝模型
  const modelRef = useRef<THREE.Group>(null!);
  const targetPosition = useRef<THREE.Vector3>(
    new THREE.Vector3(
      Math.random() * (maxX - minX) + minX,
      position[1],
      Math.random() * (maxZ - minZ) + minZ
    )
  );

  const { camera } = useThree(); // 獲取相機
  const [isFollowing, setIsFollowing] = useState(false); // 跟隨狀態
  const [openDialog, setOpenDialog] = useState(false); // 控制 Dialog 開啟狀態

  useFrame(() => {
    if (modelRef.current) {
      const currentPosition = modelRef.current.position;
      const direction = targetPosition.current.clone().sub(currentPosition);
      const distance = direction.length();

      if (distance > 0.1) {
        direction.normalize().multiplyScalar(speed * 0.1);
        currentPosition.add(direction);

        const targetRotation = new THREE.Vector3(
          targetPosition.current.x,
          position[1],
          targetPosition.current.z
        );
        const lookAtDirection = targetRotation.sub(currentPosition).normalize();
        const angle = Math.atan2(lookAtDirection.x, lookAtDirection.z);
        modelRef.current.rotation.y = THREE.MathUtils.lerp(
          modelRef.current.rotation.y,
          angle,
          0.1
        );
      } else {
        targetPosition.current.set(
          Math.random() * (maxX - minX) + minX,
          position[1],
          Math.random() * (maxZ - minZ) + minZ
        );
      }

      // 如果需要鏡頭跟隨
      if (isFollowing) {
        camera.position.lerp(
          new THREE.Vector3(
            currentPosition.x,
            currentPosition.y + 10,
            currentPosition.z + 3
          ),
          0.1
        );
        camera.lookAt(currentPosition);
      }
    }
  });

  const handleClick = () => {
    console.log(`Model with id ${id} clicked!`);
    setIsFollowing((prev) => !prev); // 切換跟隨狀態
    setOpenDialog(true); // 打開 Dialog
    onModelClick(id); // 調用 onModelClick 並傳遞 id
  };

  const handleCloseDialog = () => {
    setOpenDialog(false); // 關閉 Dialog
    setIsFollowing(false); // 取消跟隨
  };

  return (
    <>
      <primitive
        object={scene.clone()}
        position={position}
        scale={[5, 5, 5]}
        rotation={[0, Math.PI / 2, 0]}
        ref={modelRef}
        onClick={handleClick}
      />
      <ModelInstructions
        date={focusDate}
        todoTitles={todoTitles}
        onClose={handleCloseDialog}
        position={[
          modelRef.current.position.x,
          modelRef.current.position.y + 2,
          modelRef.current.position.z,
        ]}
        focusDuration={focusDuration} // 傳遞專注時間
        open={openDialog} // 傳遞 open 狀態
      />
    </>
  );
};

export default MovingModel;
