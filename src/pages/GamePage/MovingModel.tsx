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
  focusDate: string;
  focusDuration: number;
  todoTitles: string[];
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
}) => {
  const { scene } = useGLTF("BBpenguinCenter.glb");
  const modelRef = useRef<THREE.Group>(null!);
  const targetPosition = useRef<THREE.Vector3>(
    new THREE.Vector3(
      Math.random() * (maxX - minX) + minX,
      position[1],
      Math.random() * (maxZ - minZ) + minZ
    )
  );

  const { camera } = useThree();
  const [isFollowing, setIsFollowing] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

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
        position={position}
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
            modelRef.current.position.x,
            modelRef.current.position.y + 2,
            modelRef.current.position.z,
          ]}
          focusDuration={focusDuration}
          open={openDialog}
        />
      )}
    </>
  );
};

export default MovingModel;
