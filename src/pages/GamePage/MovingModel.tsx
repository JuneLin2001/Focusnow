import { useState, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import ModelInstructions from "./ModelInstructions";

interface MovingModelProps {
  id: number;
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  focusDate: string;
  focusDuration: number;
  todoTitles: string[];
  fishPosition: THREE.Vector3 | null; // 新增 fishPosition 屬性
  setFishPosition: (position: THREE.Vector3 | null) => void; // 接收設置魚位置的函數
}

const MovingModel: React.FC<MovingModelProps> = ({
  id,
  minX,
  maxX,
  minZ,
  maxZ,
  focusDate,
  focusDuration,
  todoTitles,
  fishPosition,
  setFishPosition,
}) => {
  const { scene } = useGLTF("BBpenguinCenter.glb");
  const modelRef = useRef<THREE.Group>(null!);

  const { camera } = useThree();
  const [isFollowing, setIsFollowing] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<THREE.Vector3>(
    new THREE.Vector3(
      Math.random() * (maxX - minX) + minX,
      6,
      Math.random() * (maxZ - minZ) + minZ
    )
  );

  const speed = 1;

  const targetPosition = useRef<THREE.Vector3>(
    new THREE.Vector3(
      Math.random() * (maxX - minX) + minX,
      currentPosition.y,
      Math.random() * (maxZ - minZ) + minZ
    )
  );

  useFrame(() => {
    if (modelRef.current) {
      const direction = targetPosition.current.clone().sub(currentPosition);
      const distance = direction.length();

      // 如果有魚的位置，就移動到魚的位置
      if (fishPosition) {
        const fishDirection = fishPosition.clone().sub(currentPosition);
        const fishDistance = fishDirection.length();

        if (fishDistance > 0.5) {
          // 當企鵝距離魚還有0.5的距離時，繼續向魚的位置移動
          fishDirection.normalize().multiplyScalar(speed * 0.3);
          setCurrentPosition((prev) => prev.clone().add(fishDirection));
        } else {
          // 當企鵝到達魚的旁邊時，停止移動
          targetPosition.current.set(
            Math.random() * (maxX - minX) + minX,
            currentPosition.y,
            Math.random() * (maxZ - minZ) + minZ
          );
          setFishPosition(null);
        }
      } else {
        // 如果沒有魚的位置，則保持原有的隨機移動邏輯
        if (distance > 0.1) {
          direction.normalize().multiplyScalar(speed * 0.1);
          setCurrentPosition((prev) => prev.clone().add(direction));

          const targetRotation = new THREE.Vector3(
            targetPosition.current.x,
            currentPosition.y,
            targetPosition.current.z
          );
          const lookAtDirection = targetRotation
            .sub(currentPosition)
            .normalize();
          const angle = Math.atan2(lookAtDirection.x, lookAtDirection.z);
          modelRef.current.rotation.y = THREE.MathUtils.lerp(
            modelRef.current.rotation.y,
            angle,
            0.1
          );
        } else {
          targetPosition.current.set(
            Math.random() * (maxX - minX) + minX,
            currentPosition.y,
            Math.random() * (maxZ - minZ) + minZ
          );
        }
      }

      // 更新模型的位置
      modelRef.current.position.copy(currentPosition);

      if (isFollowing) {
        camera.position.lerp(
          new THREE.Vector3(
            currentPosition.x + 10,
            currentPosition.y + 15,
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
    setIsFollowing((prev) => !prev);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setIsFollowing(false);
  };

  return (
    <>
      <primitive
        object={scene.clone()}
        position={currentPosition} // 使用 currentPosition
        scale={[5, 5, 5]}
        rotation={[0, Math.PI / 2, 0]}
        ref={modelRef}
        onClick={handleClick}
      />
      {modelRef.current && (
        <ModelInstructions
          date={focusDate}
          todoTitles={todoTitles}
          onClose={handleCloseDialog}
          position={[
            currentPosition.x,
            currentPosition.y + 2,
            currentPosition.z,
          ]}
          focusDuration={focusDuration}
          open={openDialog}
        />
      )}
    </>
  );
};

export default MovingModel;
