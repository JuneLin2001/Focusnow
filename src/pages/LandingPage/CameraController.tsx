import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import gsap from "gsap";
import { OrbitControls } from "@react-three/drei";

interface CameraControllerProps {
  targetPosition: [number, number, number];
  lookAtPosition?: [number, number, number];
  initialPosition?: [number, number, number];
  minPolarAngle?: number;
  maxPolarAngle?: number;
  minDistance?: number;
  maxDistance?: number;
}

const CameraController: React.FC<CameraControllerProps> = ({
  targetPosition,
  lookAtPosition = targetPosition,
  initialPosition = [-1500, 60, 500],
  minPolarAngle = Math.PI / 4,
  maxPolarAngle = Math.PI / 2,
  minDistance = 2,
  maxDistance = 600,
}) => {
  const { camera } = useThree();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      camera.position.set(...initialPosition);
      camera.lookAt(...lookAtPosition);
      isFirstRender.current = false;
    } else {
      gsap.to(camera.position, {
        x: targetPosition[0] + 2,
        y: targetPosition[1] + 2,
        z: targetPosition[2] + 4,
        duration: 10,
        ease: "power2.out",
        onUpdate: () => {
          camera.lookAt(...lookAtPosition);
        },
      });
    }
  }, [targetPosition, lookAtPosition, camera, initialPosition]);

  return (
    <>
      <OrbitControls
        target={lookAtPosition}
        minPolarAngle={minPolarAngle}
        maxPolarAngle={maxPolarAngle}
        minDistance={minDistance}
        maxDistance={maxDistance}
        enableZoom={true}
        enablePan={false}
        makeDefault
      />
    </>
  );
};

export default CameraController;
