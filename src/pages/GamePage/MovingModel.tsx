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
  fishPosition: THREE.Vector3 | null;
  setFishPosition: (position: THREE.Vector3 | null) => void;
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
  const modelPaths = [
    "BBpenguinCenter.glb",
    // , "fish_low_poly.glb"
  ];

  const [modelPath] = useState(
    modelPaths[Math.floor(Math.random() * modelPaths.length)]
  );

  const { scene } = useGLTF(modelPath);
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

      if (fishPosition) {
        const fishDirection = fishPosition.clone().sub(currentPosition);
        const fishDistance = fishDirection.length();

        if (fishDistance > 0.5) {
          fishDirection.normalize().multiplyScalar(speed * 0.3);
          setCurrentPosition((prev) => prev.clone().add(fishDirection));

          const angle =
            Math.atan2(fishDirection.x, fishDirection.z) + Math.PI / 2;
          modelRef.current.rotation.y = angle;
        } else {
          targetPosition.current.set(
            Math.random() * (maxX - minX) + minX,
            currentPosition.y,
            Math.random() * (maxZ - minZ) + minZ
          );
          setFishPosition(null);
        }
      } else {
        if (distance > 0.1) {
          direction.normalize().multiplyScalar(speed * 0.1);
          setCurrentPosition((prev) => prev.clone().add(direction));

          const targetRotation = targetPosition.current.clone();
          const lookAtDirection = targetRotation
            .sub(currentPosition)
            .normalize();
          const angle =
            Math.atan2(lookAtDirection.x, lookAtDirection.z) + Math.PI / 2;
          modelRef.current.rotation.y = angle;
        } else {
          targetPosition.current.set(
            Math.random() * (maxX - minX) + minX,
            currentPosition.y,
            Math.random() * (maxZ - minZ) + minZ
          );
        }
      }

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

  const handlePointerDown = () => {
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
        position={currentPosition}
        scale={[5, 5, 5]}
        ref={modelRef}
        onPointerDown={handlePointerDown}
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
